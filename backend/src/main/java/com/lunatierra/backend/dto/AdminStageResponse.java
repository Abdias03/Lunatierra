package com.lunatierra.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Vista administrativa de una etapa de crecimiento.")
public class AdminStageResponse {

    @Schema(description = "Identificador de la etapa.", example = "3")
    private final Long id;
    @Schema(description = "Identificador del cultivo.", example = "1")
    private final Long cropId;
    @Schema(description = "Nombre visible del cultivo.", example = "Maíz")
    private final String cropName;
    @Schema(description = "Nombre visible de la etapa.", example = "Germinación")
    private final String stageName;
    @Schema(description = "Día mínimo de la etapa.", example = "0")
    private final int minDay;
    @Schema(description = "Día máximo de la etapa.", example = "15")
    private final int maxDay;
    @Schema(description = "Descripción breve de la etapa.", example = "La semilla brota y necesita humedad constante.")
    private final String description;

    public AdminStageResponse(Long id, Long cropId, String cropName, String stageName,
                              int minDay, int maxDay, String description) {
        this.id = id;
        this.cropId = cropId;
        this.cropName = cropName;
        this.stageName = stageName;
        this.minDay = minDay;
        this.maxDay = maxDay;
        this.description = description;
    }

    public Long getId() {
        return id;
    }

    public Long getCropId() {
        return cropId;
    }

    public String getCropName() {
        return cropName;
    }

    public String getStageName() {
        return stageName;
    }

    public int getMinDay() {
        return minDay;
    }

    public int getMaxDay() {
        return maxDay;
    }

    public String getDescription() {
        return description;
    }
}
