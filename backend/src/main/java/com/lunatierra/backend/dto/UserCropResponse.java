package com.lunatierra.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;

@Schema(description = "Respuesta resumida de un cultivo registrado por el usuario.")
public class UserCropResponse {

    @Schema(description = "Identificador del cultivo del usuario.", example = "7")
    private Long id;
    @Schema(description = "Código estable del cultivo.", example = "corn")
    private String cropName;
    @Schema(description = "Nombre visible del cultivo para UI.", example = "Maíz")
    private String cropDisplayName;
    @Schema(description = "Fecha de siembra.", example = "2026-03-24")
    private LocalDate plantingDate;
    @Schema(description = "Disponibilidad de agua para el cultivo.", example = "true")
    private boolean waterAvailable;
    @Schema(description = "Días transcurridos desde la siembra.", example = "9")
    private long daysSincePlanting;
    @Schema(description = "Etapa actual del cultivo.", example = "Germinación")
    private String growthStage;
    @Schema(description = "Icono asociado a la etapa para frontend.", example = "🌱")
    private String growthStageIcon;
    @Schema(description = "Descripción simple del comportamiento esperado.", example = "La semilla empieza a brotar y necesita humedad constante.")
    private String expectedBehavior;
    @Schema(description = "Día mínimo de la etapa actual.", example = "0")
    private int stageMinDay;
    @Schema(description = "Día máximo de la etapa actual.", example = "15")
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
