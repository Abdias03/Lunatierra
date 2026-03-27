package com.lunatierra.backend.dto;

import java.time.LocalDate;

public class AdminUserSummary {

    private final Long id;
    private final String name;
    private final String email;
    private final Integer streakCount;
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
