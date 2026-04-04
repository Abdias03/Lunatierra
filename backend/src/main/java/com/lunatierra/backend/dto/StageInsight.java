package com.lunatierra.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Información detallada de la etapa actual del cultivo.")
public class StageInsight {

    @Schema(description = "Identificador de la etapa.", example = "3")
    private final Long id;
    @Schema(description = "Clave estable de la etapa.", example = "GERMINATION")
    private final String key;
    @Schema(description = "Nombre visible de la etapa.", example = "Germinación")
    private final String name;
    @Schema(description = "Descripción simple de la etapa.", example = "La planta comienza a brotar y establecer sus primeras hojas.")
    private final String description;
    @Schema(description = "Días desde la siembra al momento de consultar.", example = "8")
    private final long daysSincePlanting;
    @Schema(description = "Día mínimo de esta etapa.", example = "0")
    private final int minDay;
    @Schema(description = "Día máximo de esta etapa.", example = "15")
    private final int maxDay;

    public StageInsight(Long id, String key, String name, String description, long daysSincePlanting, int minDay, int maxDay) {
        this.id = id;
        this.key = key;
        this.name = name;
        this.description = description;
        this.daysSincePlanting = daysSincePlanting;
        this.minDay = minDay;
        this.maxDay = maxDay;
    }

    public Long getId() {
        return id;
    }

    public String getKey() {
        return key;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public long getDaysSincePlanting() {
        return daysSincePlanting;
    }

    public int getMinDay() {
        return minDay;
    }

    public int getMaxDay() {
        return maxDay;
    }
}
