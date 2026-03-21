package com.lunatierra.backend.dto;

import java.time.LocalDate;

public class DailyProgressResponse {

    private final int streakCount;
    private final LocalDate lastCheckDate;
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
