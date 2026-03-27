package com.lunatierra.backend.dto;

import java.time.LocalDate;

public class UserCropResponse {

    private Long id;
    private String cropName;
    private String cropDisplayName;
    private LocalDate plantingDate;
    private boolean waterAvailable;
    private long daysSincePlanting;
    private String growthStage;
    private String growthStageIcon;
    private String expectedBehavior;
    private int stageMinDay;
    private int stageMaxDay;

    public UserCropResponse(Long id, String cropName, String cropDisplayName, LocalDate plantingDate, boolean waterAvailable,
                            long daysSincePlanting, String growthStage, String growthStageIcon, String expectedBehavior,
                            int stageMinDay, int stageMaxDay) {
        this.id = id;
        this.cropName = cropName;
        this.cropDisplayName = cropDisplayName;
        this.plantingDate = plantingDate;
        this.waterAvailable = waterAvailable;
        this.daysSincePlanting = daysSincePlanting;
        this.growthStage = growthStage;
        this.growthStageIcon = growthStageIcon;
        this.expectedBehavior = expectedBehavior;
        this.stageMinDay = stageMinDay;
        this.stageMaxDay = stageMaxDay;
    }

    public Long getId() {
        return id;
    }

    public String getCropName() {
        return cropName;
    }

    public String getCropDisplayName() {
        return cropDisplayName;
    }

    public LocalDate getPlantingDate() {
        return plantingDate;
    }

    public boolean isWaterAvailable() {
        return waterAvailable;
    }

    public long getDaysSincePlanting() {
        return daysSincePlanting;
    }

    public String getGrowthStage() {
        return growthStage;
    }

    public String getGrowthStageIcon() {
        return growthStageIcon;
    }

    public String getExpectedBehavior() {
        return expectedBehavior;
    }

    public int getStageMinDay() {
        return stageMinDay;
    }

    public int getStageMaxDay() {
        return stageMaxDay;
    }
}
