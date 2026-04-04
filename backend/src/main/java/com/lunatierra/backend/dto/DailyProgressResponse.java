package com.lunatierra.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;

@Schema(description = "Estado del hábito diario del usuario.")
public class DailyProgressResponse {

    @Schema(description = "Días consecutivos de actividad.", example = "4")
    private final int streakCount;
    @Schema(description = "Última fecha en que el usuario marcó revisión.", example = "2026-04-01")
    private final LocalDate lastCheckDate;
    @Schema(description = "Indica si el usuario ya revisó hoy.", example = "true")
    private final boolean checkedToday;

    public DailyProgressResponse(int streakCount, LocalDate lastCheckDate, boolean checkedToday) {
        this.streakCount = streakCount;
        this.lastCheckDate = lastCheckDate;
        this.checkedToday = checkedToday;
    }

    public int getStreakCount() {
        return streakCount;
    }

    public LocalDate getLastCheckDate() {
        return lastCheckDate;
    }

    public boolean isCheckedToday() {
        return checkedToday;
    }
}
