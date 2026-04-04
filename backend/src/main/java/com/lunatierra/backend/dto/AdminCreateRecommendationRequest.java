package com.lunatierra.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "Solicitud para crear una recomendación dinámica.")
public class AdminCreateRecommendationRequest {

    @Schema(description = "Identificador del cultivo. Puede ser null para reglas generales.", example = "1")
    private Long cropId;
    @Schema(description = "Identificador de la etapa. Puede ser null para reglas generales.", example = "3")
    private Long stageId;

    @NotBlank
    @Schema(description = "Condición disparadora de la recomendación.", example = "RAIN_HIGH")
    private String condition;

    @NotBlank
    @Schema(description = "Tipo de recomendación.", example = "ACTION")
    private String type;

    @NotBlank
    @Schema(description = "Mensaje que verá el usuario.", example = "Hoy evita regar, la lluvia hará el trabajo.")
    private String message;

    @Schema(description = "Prioridad de la regla, menor valor significa mayor prioridad.", example = "10")
    private Integer priority;
    @Schema(description = "Versión de la regla.", example = "1")
    private Integer version;
    @Schema(description = "Indica si la regla está activa.", example = "true")
    private Boolean active;
    @Schema(description = "Región opcional para personalizar la recomendación.", example = "2")
    private Long regionId;

    public Long getCropId() {
        return cropId;
    }

    public void setCropId(Long cropId) {
        this.cropId = cropId;
    }

    public Long getStageId() {
        return stageId;
    }

    public void setStageId(Long stageId) {
        this.stageId = stageId;
    }

    public String getCondition() {
        return condition;
    }

    public void setCondition(String condition) {
        this.condition = condition;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Integer getPriority() {
        return priority;
    }

    public void setPriority(Integer priority) {
        this.priority = priority;
    }

    public Integer getVersion() {
        return version;
    }

    public void setVersion(Integer version) {
        this.version = version;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public Long getRegionId() {
        return regionId;
    }

    public void setRegionId(Long regionId) {
        this.regionId = regionId;
    }
}
