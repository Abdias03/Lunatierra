package com.lunatierra.backend.controller;

import com.lunatierra.backend.dto.DailyProgressResponse;
import com.lunatierra.backend.service.DailyProgressService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/daily-progress")
public class DailyProgressController {

    private final DailyProgressService dailyProgressService;

    public DailyProgressController(DailyProgressService dailyProgressService) {
        this.dailyProgressService = dailyProgressService;
    }

    @GetMapping
    public DailyProgressResponse getProgress() {
        return dailyProgressService.getProgress();
    }

    @PostMapping("/check-in")
    public DailyProgressResponse checkIn() {
        return dailyProgressService.registerCheckIn();
    }
}
