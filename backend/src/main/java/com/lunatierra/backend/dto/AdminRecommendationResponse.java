package com.lunatierra.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Vista administrativa de una regla de recomendación.")
public class AdminRecommendationResponse {

    @Schema(description = "Identificador de la regla.", example = "51")
    private final Long id;
    @Schema(description = "Identificador del cultivo asociado.", example = "1")
    private final Long cropId;
    @Schema(description = "Nombre visible del cultivo.", example = "Maíz")
    private final String cropName;
    @Schema(description = "Identificador de la etapa asociada.", example = "3")
    private final Long stageId;
    @Schema(description = "Nombre visible de la etapa.", example = "Germinación")
    private final String stageName;
    @Schema(description = "Condición disparadora.", example = "RAIN_HIGH")
    private final String condition;
    @Schema(description = "Tipo de salida.", example = "WARNING")
    private final String type;
    @Schema(description = "Mensaje que verá el usuario.", example = "Evita aplicar pesticidas hoy.")
    private final String message;
    @Schema(description = "Prioridad de la regla.", example = "20")
    private final Integer priority;
    @Schema(description = "Versión de la regla.", example = "1")
    private final Integer version;
    @Schema(description = "Indica si la regla está activa.", example = "true")
    private final Boolean active;
    @Schema(description = "Identificador de la región si aplica.", example = "2")
    private final Long regionId;
    @Schema(description = "Nombre de la región si aplica.", example = "Guerrero Costa")
    private final String regionName;

    public AdminRecommendationResponse(Long id, Long cropId, String cropName, Long stageId, String stageName,
                                       String condition, String type, String message, Integer priority,
                                       Integer version, Boolean active, Long regionId, String regionName) {
        this.id = id;
        this.cropId = cropId;
        this.cropName = cropName;
        this.stageId = stageId;
        this.stageName = stageName;
        this.condition = condition;
        this.type = type;
        this.message = message;
        this.priority = priority;
        this.version = version;
        this.active = active;
        this.regionId = regionId;
        this.regionName = regionName;
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

    public Long getStageId() {
        return stageId;
    }

    public String getStageName() {
        return stageName;
    }

    public String getCondition() {
        return condition;
    }

    public String getType() {
        return type;
    }

    public String getMessage() {
        return message;
    }

    public Integer getPriority() {
        return priority;
    }

    public Integer getVersion() {
        return version;
    }

    public Boolean getActive() {
        return active;
    }

    public Long getRegionId() {
        return regionId;
    }

    public String getRegionName() {
        return regionName;
    }
}
