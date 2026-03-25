package com.lunatierra.backend.controller;

import com.lunatierra.backend.dto.DailyProgressResponse;
import com.lunatierra.backend.service.AuthenticatedUserService;
import com.lunatierra.backend.service.DailyProgressService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/daily-progress")
public class DailyProgressController {

    private final DailyProgressService dailyProgressService;
    private final AuthenticatedUserService authenticatedUserService;

    public DailyProgressController(DailyProgressService dailyProgressService,
                                   AuthenticatedUserService authenticatedUserService) {
        this.dailyProgressService = dailyProgressService;
        this.authenticatedUserService = authenticatedUserService;
    }

    @GetMapping
    public DailyProgressResponse getProgress(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        Long userId = authenticatedUserService.getOptionalUserId(authorizationHeader);
        if (userId == null) {
            return new DailyProgressResponse(0, null, false);
        }
        return dailyProgressService.getProgress(userId);
    }

    @PostMapping("/check-in")
    public DailyProgressResponse checkIn(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        Long userId = authenticatedUserService.getOptionalUserId(authorizationHeader);
        if (userId == null) {
            return new DailyProgressResponse(0, null, false);
        }
        return dailyProgressService.registerCheckIn(userId);
    }
}
