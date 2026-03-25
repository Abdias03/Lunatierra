package com.lunatierra.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lunatierra.backend.dto.WeatherSummary;
import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.LocalDate;
import java.util.Locale;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Service;

@Service
public class WeatherService {

    private static final Logger logger = LoggerFactory.getLogger(WeatherService.class);

    private final MessageSource messageSource;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;
    private final String openMeteoBaseUrl;
    private final int timeoutMs;
    private final boolean openMeteoEnabled;

    public WeatherService(MessageSource messageSource,
                          @Value("${weather.open-meteo.base-url:https://api.open-meteo.com}") String openMeteoBaseUrl,
                          @Value("${weather.open-meteo.timeout-ms:2500}") int timeoutMs,
                          @Value("${weather.open-meteo.enabled:true}") boolean openMeteoEnabled) {
        this.messageSource = messageSource;
        this.objectMapper = new ObjectMapper();
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofMillis(timeoutMs))
                .build();
        this.openMeteoBaseUrl = openMeteoBaseUrl;
        this.timeoutMs = timeoutMs;
        this.openMeteoEnabled = openMeteoEnabled;
    }

    public WeatherSummary getTodayForecast(Locale locale) {
        return getWeather(19.4326, -99.1332, locale);
    }

    public WeatherSummary getWeather(double latitude, double longitude, Locale locale) {
        if (openMeteoEnabled) {
            try {
                return fetchFromOpenMeteo(latitude, longitude, locale);
            } catch (Exception exception) {
                logger.warn("Open-Meteo weather lookup failed for lat={}, lon={}. Falling back to local mock. Cause: {}",
                        latitude, longitude, exception.getMessage());
            }
        }

        return buildFallbackWeather(latitude, longitude, locale);
    }

    private WeatherSummary fetchFromOpenMeteo(double latitude, double longitude, Locale locale)
            throws IOException, InterruptedException {
        String url = openMeteoBaseUrl + "/v1/forecast"
                + "?latitude=" + encode(latitude)
                + "&longitude=" + encode(longitude)
                + "&current_weather=true"
                + "&hourly=precipitation,temperature_2m,relativehumidity_2m"
                + "&timezone=auto";

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .timeout(Duration.ofMillis(timeoutMs))
                .header("Accept", "application/json")
                .GET()
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() < 200 || response.statusCode() >= 300) {
            throw new IOException("Unexpected weather status: " + response.statusCode());
        }

        JsonNode root = objectMapper.readTree(response.body());
        JsonNode currentWeather = root.path("current_weather");

        if (currentWeather.isMissingNode() || currentWeather.isNull()) {
            throw new IOException("Missing current_weather in Open-Meteo response");
        }

        String currentTime = currentWeather.path("time").asText("");
        int weatherCode = currentWeather.path("weathercode").asInt(-1);
        int temperature = roundToInt(currentWeather.path("temperature").asDouble(Double.NaN));
        if (temperature == Integer.MIN_VALUE) {
            temperature = roundToInt(findHourlyValue(root.path("hourly"), currentTime, "temperature_2m"));
        }

        int humidity = roundToInt(findHourlyValue(root.path("hourly"), currentTime, "relativehumidity_2m"));
        if (humidity == Integer.MIN_VALUE) {
            humidity = buildFallbackWeather(latitude, longitude, locale).getHumidity();
        }

        double precipitation = findHourlyValue(root.path("hourly"), currentTime, "precipitation");
        int rainChance = mapRainProbability(precipitation, weatherCode);
        String condition = localizeCondition(mapConditionKey(weatherCode), locale);

        return new WeatherSummary(condition, temperature, rainChance, humidity);
    }

    private WeatherSummary buildFallbackWeather(double latitude, double longitude, Locale locale) {
        int daySeed = LocalDate.now().getDayOfMonth();
        int rainChance = Math.min(90, 25 + (daySeed * 7 % 65));
        int humidity = Math.min(95, 45 + (daySeed * 5 % 45));
        int locationSeed = (int) Math.round(Math.abs(latitude) + Math.abs(longitude));
        int temperature = 21 + ((daySeed + locationSeed) % 10);
        String conditionKey = rainChance > 70 ? "weather.condition.rain_likely"
                : rainChance > 45 ? "weather.condition.cloudy" : "weather.condition.dry_warm";
        String condition = localizeCondition(conditionKey, locale);
        return new WeatherSummary(condition, temperature, rainChance, humidity);
    }

    private double findHourlyValue(JsonNode hourly, String targetTime, String fieldName) {
        JsonNode times = hourly.path("time");
        JsonNode values = hourly.path(fieldName);

        if (times.isMissingNode() || values.isMissingNode() || !times.isArray() || !values.isArray()) {
            return Double.NaN;
        }

        for (int index = 0; index < times.size() && index < values.size(); index++) {
            if (targetTime.equals(times.path(index).asText())) {
                return values.path(index).asDouble(Double.NaN);
            }
        }

        return values.size() > 0 ? values.path(0).asDouble(Double.NaN) : Double.NaN;
    }

    private int mapRainProbability(double precipitation, int weatherCode) {
        if (isRainCode(weatherCode)) {
            return 85;
        }
        if (Double.isNaN(precipitation)) {
            return isCloudyCode(weatherCode) ? 45 : 10;
        }
        if (precipitation >= 2.0) {
            return 90;
        }
        if (precipitation >= 0.5) {
            return 70;
        }
        if (precipitation > 0.0) {
            return 40;
        }
        return isCloudyCode(weatherCode) ? 30 : 10;
    }

    private String mapConditionKey(int weatherCode) {
        if (isRainCode(weatherCode)) {
            return "weather.condition.rain_likely";
        }
        if (isCloudyCode(weatherCode)) {
            return "weather.condition.cloudy";
        }
        return "weather.condition.dry_warm";
    }

    private boolean isRainCode(int weatherCode) {
        return (weatherCode >= 51 && weatherCode <= 67)
                || (weatherCode >= 80 && weatherCode <= 99);
    }

    private boolean isCloudyCode(int weatherCode) {
        return weatherCode == 2
                || weatherCode == 3
                || weatherCode == 45
                || weatherCode == 48
                || (weatherCode >= 71 && weatherCode <= 77);
    }

    private String localizeCondition(String conditionKey, Locale locale) {
        return messageSource.getMessage(conditionKey, null, locale);
    }

    private String encode(double value) {
        return URLEncoder.encode(String.valueOf(value), StandardCharsets.UTF_8);
    }

    private int roundToInt(double value) {
        if (Double.isNaN(value)) {
            return Integer.MIN_VALUE;
        }
        return (int) Math.round(value);
    }
}
