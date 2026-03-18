package com.lunatierra.backend.service;

import com.lunatierra.backend.dto.WeatherSummary;
import java.time.LocalDate;
import java.util.Locale;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Service;

@Service
public class WeatherService {

    private final MessageSource messageSource;

    public WeatherService(MessageSource messageSource) {
        this.messageSource = messageSource;
    }

    public WeatherSummary getTodayForecast(Locale locale) {
        int daySeed = LocalDate.now().getDayOfMonth();
        int rainChance = Math.min(90, 25 + (daySeed * 7 % 65));
        int humidity = Math.min(95, 45 + (daySeed * 5 % 45));
        int temperature = 21 + (daySeed % 10);
        String conditionKey = rainChance > 70 ? "weather.condition.rain_likely"
                : rainChance > 45 ? "weather.condition.cloudy" : "weather.condition.dry_warm";
        String condition = messageSource.getMessage(conditionKey, null, locale);
        return new WeatherSummary(condition, temperature, rainChance, humidity);
    }
}
