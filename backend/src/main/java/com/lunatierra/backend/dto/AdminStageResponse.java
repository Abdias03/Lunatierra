package com.lunatierra.backend.dto;

public class AdminStageResponse {

    private final Long id;
    private final Long cropId;
    private final String cropName;
    private final String stageName;
    private final int minDay;
    private final int maxDay;
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
