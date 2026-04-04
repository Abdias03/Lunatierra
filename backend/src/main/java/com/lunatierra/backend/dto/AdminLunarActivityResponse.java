package com.lunatierra.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Actividad lunar registrada en el sistema.")
public class AdminLunarActivityResponse {

    @Schema(description = "Identificador interno.", example = "14")
    private final Long id;
    @Schema(description = "Fase lunar asociada.", example = "WAXING_MOON")
    private final String phase;
    @Schema(description = "Actividad sugerida.", example = "Sembrar cultivos de crecimiento aéreo")
    private final String activity;

    public AdminLunarActivityResponse(Long id, String phase, String activity) {
        this.id = id;
        this.phase = phase;
        this.activity = activity;
    }

    public Long getId() {
        return id;
    }

    public String getPhase() {
        return phase;
    }

    public String getActivity() {
        return activity;
    }
}
