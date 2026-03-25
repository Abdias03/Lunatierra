package com.lunatierra.backend.dto;

import java.time.LocalDate;

public class MigrateCropItem {

    private String cropName;
    private LocalDate plantingDate;
    private Boolean waterAvailable;

    public String getCropName() {
        return cropName;
    }

    public void setCropName(String cropName) {
        this.cropName = cropName;
    }

    public LocalDate getPlantingDate() {
        return plantingDate;
    }

    public void setPlantingDate(LocalDate plantingDate) {
        this.plantingDate = plantingDate;
    }

    public Boolean getWaterAvailable() {
        return waterAvailable;
    }

    public void setWaterAvailable(Boolean waterAvailable) {
        this.waterAvailable = waterAvailable;
    }
}
