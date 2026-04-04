package com.lunatierra.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "Solicitud para crear un cultivo desde el panel administrativo.")
public class AdminCreateCropRequest {

    @NotBlank
    @Schema(description = "Código estable del cultivo.", example = "JITOMATE")
    private String code;

    @NotBlank
    @Schema(description = "Nombre visible del cultivo.", example = "Jitomate")
    private String name;

    @NotBlank
    @Schema(description = "Tipo biológico del cultivo.", example = "ANNUAL")
    private String type;

    @Schema(description = "Descripción breve del cultivo.", example = "Jitomate de mesa para seguimiento diario.")
    private String description;

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
