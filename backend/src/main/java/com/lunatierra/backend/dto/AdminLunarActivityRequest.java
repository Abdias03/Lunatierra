package com.lunatierra.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "Solicitud para registrar una actividad agrícola por fase lunar.")
public class AdminLunarActivityRequest {

    @NotBlank
    @Schema(description = "Fase lunar asociada.", example = "FULL_MOON")
    private String phase;

    @NotBlank
    @Schema(description = "Actividad sugerida para esa fase.", example = "Podar y limpiar el cultivo")
    private String activity;

    public String getPhase() {
        return phase;
    }

    public void setPhase(String phase) {
        this.phase = phase;
    }

    public String getActivity() {
        return activity;
    }

    public void setActivity(String activity) {
        this.activity = activity;
    }
}
