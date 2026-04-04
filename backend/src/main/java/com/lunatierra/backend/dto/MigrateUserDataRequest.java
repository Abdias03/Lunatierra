package com.lunatierra.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

@Schema(description = "Datos locales del modo invitado que deben asociarse a la cuenta del usuario.")
public class MigrateUserDataRequest {

    @Schema(description = "Cultivos creados localmente en modo invitado.")
    private List<MigrateCropItem> crops;

    public List<MigrateCropItem> getCrops() {
        return crops;
    }

    public void setCrops(List<MigrateCropItem> crops) {
        this.crops = crops;
    }
}
