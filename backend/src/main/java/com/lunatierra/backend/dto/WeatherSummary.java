package com.lunatierra.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Resumen simple del clima del día.")
public class WeatherSummary {

    @Schema(description = "Condición climática simplificada.", example = "rain")
    private final String condition;
    @Schema(description = "Temperatura máxima estimada en grados Celsius.", example = "24")
    private final int maxTemperature;
    @Schema(description = "Probabilidad o intensidad simplificada de lluvia en porcentaje.", example = "70")
    private final int rainChance;
    @Schema(description = "Humedad relativa estimada en porcentaje.", example = "68")
    private final int humidity;

    public WeatherSummary(String condition, int maxTemperature, int rainChance, int humidity) {
        this.condition = condition;
        this.maxTemperature = maxTemperature;
        this.rainChance = rainChance;
        this.humidity = humidity;
    }

    public String getCondition() {
        return condition;
    }

    public int getMaxTemperature() {
        return maxTemperature;
    }

    public int getRainChance() {
        return rainChance;
    }

    public int getHumidity() {
        return humidity;
    }
}
