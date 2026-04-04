package com.lunatierra.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;

@Schema(description = "Resumen breve de un usuario para el panel admin.")
public class AdminUserSummary {

    @Schema(description = "Identificador del usuario.", example = "12")
    private final Long id;
    @Schema(description = "Nombre visible del usuario.", example = "Abdías Morales")
    private final String name;
    @Schema(description = "Correo electrónico del usuario.", example = "abdias.morales03@gmail.com")
    private final String email;
    @Schema(description = "Racha actual del usuario.", example = "5")
    private final Integer streakCount;
    @Schema(description = "Última fecha de actividad.", example = "2026-04-01")
    private final LocalDate lastCheckDate;

    public AdminUserSummary(Long id, String name, String email, Integer streakCount, LocalDate lastCheckDate) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.streakCount = streakCount;
        this.lastCheckDate = lastCheckDate;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public Integer getStreakCount() {
        return streakCount;
    }

    public LocalDate getLastCheckDate() {
        return lastCheckDate;
    }
}
