package com.lunatierra.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;

@Schema(description = "Foto registrada en la bitácora de crecimiento de un cultivo.")
public class GrowthLogResponse {

    @Schema(description = "Identificador de la foto.", example = "21")
    private Long id;
    @Schema(description = "Identificador del cultivo del usuario asociado.", example = "7")
    private Long userCropId;
    @Schema(description = "URL pública o relativa de la imagen almacenada.", example = "/uploads/growth/7/photo-21.jpg")
    private String imageUrl;
    @Schema(description = "Descripción opcional escrita por el usuario.", example = "La planta ya tiene dos hojas grandes.")
    private String description;
    @Schema(description = "Fecha y hora de creación del registro.", example = "2026-04-02T10:15:00")
    private LocalDateTime createdAt;

    public GrowthLogResponse(Long id, Long userCropId, String imageUrl, String description, LocalDateTime createdAt) {
        this.id = id;
        this.userCropId = userCropId;
        this.imageUrl = imageUrl;
        this.description = description;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public Long getUserCropId() {
        return userCropId;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public String getDescription() {
        return description;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
