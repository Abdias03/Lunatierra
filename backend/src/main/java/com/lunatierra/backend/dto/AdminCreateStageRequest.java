package com.lunatierra.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Schema(description = "Solicitud para crear una etapa de crecimiento.")
public class AdminCreateStageRequest {

    @NotNull
    @Schema(description = "Identificador del cultivo asociado.", example = "1")
    private Long cropId;

    @NotBlank
    @Schema(description = "Nombre visible de la etapa.", example = "Floración")
    private String name;

    @NotNull
    @Schema(description = "Día mínimo de la etapa.", example = "21")
    private Integer minDay;

    @NotNull
    @Schema(description = "Día máximo de la etapa.", example = "40")
    private Integer maxDay;

    @Schema(description = "Descripción breve de la etapa.", example = "La planta se fortalece y forma flores.")
    private String description;

    public Long getCropId() {
        return cropId;
    }

    public void setCropId(Long cropId) {
        this.cropId = cropId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getMinDay() {
        return minDay;
    }

    public void setMinDay(Integer minDay) {
        this.minDay = minDay;
    }

    public Integer getMaxDay() {
        return maxDay;
    }

    public void setMaxDay(Integer maxDay) {
        this.maxDay = maxDay;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
