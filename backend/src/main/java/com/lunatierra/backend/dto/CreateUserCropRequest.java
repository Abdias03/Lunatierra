package com.lunatierra.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Schema(description = "Solicitud para registrar un cultivo del usuario.")
public class CreateUserCropRequest {

    @NotBlank
    @Schema(
            description = "Código estable del cultivo disponible en catálogo.",
            example = "CORN",
            requiredMode = Schema.RequiredMode.REQUIRED
    )
    private String cropName;

    @NotNull
    @Schema(
            description = "Fecha en la que se sembró el cultivo.",
            example = "2026-03-24",
            type = "string",
            format = "date",
            requiredMode = Schema.RequiredMode.REQUIRED
    )
    private LocalDate plantingDate;

    @Schema(
            description = "Indica si el usuario tiene agua disponible para atender el cultivo.",
            example = "true"
    )
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
