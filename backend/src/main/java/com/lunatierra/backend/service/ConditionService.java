package com.lunatierra.backend.service;

import com.lunatierra.backend.dto.WeatherSummary;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ConditionService {

    public String determineWeatherCondition(WeatherSummary weather) {
        return determineWeatherConditions(weather).get(0);
    }

    public List<String> determineWeatherConditions(WeatherSummary weather) {
        List<String> conditions = new ArrayList<>();

        if (weather.getRainChance() > 70) {
            conditions.add("RAIN_HIGH");
        } else if (weather.getRainChance() < 30) {
            conditions.add("RAIN_LOW");
        }

        if (weather.getHumidity() > 80) {
            conditions.add("HUMID");
        } else if (weather.getHumidity() < 40) {
            conditions.add("DRY");
        }

        if (weather.getMaxTemperature() > 32) {
            conditions.add("HEAT_HIGH");
        }

        if (conditions.isEmpty()) {
            conditions.add("NORMAL");
        } else if (!conditions.contains("NORMAL")) {
            conditions.add("NORMAL");
        }

        return conditions;
    }
}
