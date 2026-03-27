package com.lunatierra.backend.dto;

public class CropCatalogItemResponse {

    private final Long id;
    private final String code;
    private final String displayName;
    private final String description;

    public CropCatalogItemResponse(Long id, String code, String displayName, String description) {
        this.id = id;
        this.code = code;
        this.displayName = displayName;
        this.description = description;
    }

    public Long getId() {
        return id;
    }

    public String getCode() {
        return code;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getDescription() {
        return description;
    }
}
