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
    private String expectedBehavior;

    public UserCropResponse(Long id, String cropName, String cropDisplayName, LocalDate plantingDate, boolean waterAvailable,
                            long daysSincePlanting, String growthStage, String expectedBehavior) {
        this.id = id;
        this.cropName = cropName;
        this.cropDisplayName = cropDisplayName;
        this.plantingDate = plantingDate;
        this.waterAvailable = waterAvailable;
        this.daysSincePlanting = daysSincePlanting;
        this.growthStage = growthStage;
        this.expectedBehavior = expectedBehavior;
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

    public String getExpectedBehavior() {
        return expectedBehavior;
    }
}
