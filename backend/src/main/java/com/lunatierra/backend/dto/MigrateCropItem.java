package com.lunatierra.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;

@Schema(description = "Cultivo local creado en modo invitado para migración.")
public class MigrateCropItem {

    @Schema(description = "Código estable del cultivo.", example = "CORN")
    private String cropName;
    @Schema(description = "Fecha de siembra registrada localmente.", example = "2026-03-24")
    private LocalDate plantingDate;
    @Schema(description = "Disponibilidad de agua configurada localmente.", example = "true")
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
