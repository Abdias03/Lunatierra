package com.lunatierra.backend.dto;

public class AdminRecommendationResponse {

    private final Long id;
    private final Long cropId;
    private final String cropName;
    private final Long stageId;
    private final String stageName;
    private final String condition;
    private final String type;
    private final String message;
    private final Integer priority;
    private final Integer version;
    private final Boolean active;
    private final Long regionId;
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
