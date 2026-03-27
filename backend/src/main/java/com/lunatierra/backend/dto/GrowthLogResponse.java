package com.lunatierra.backend.dto;

import java.time.LocalDateTime;

public class GrowthLogResponse {

    private Long id;
    private Long userCropId;
    private String imageUrl;
    private String description;
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