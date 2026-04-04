package com.lunatierra.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Elemento del catálogo de cultivos disponibles.")
public class CropCatalogItemResponse {

    @Schema(description = "Identificador interno del cultivo.", example = "1")
    private final Long id;
    @Schema(description = "Código estable para usar en integraciones.", example = "CORN")
    private final String code;
    @Schema(description = "Nombre visible del cultivo.", example = "Maíz")
    private final String displayName;
    @Schema(description = "Descripción corta del cultivo.", example = "Maíz de ciclo anual para manejo diario.")
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
