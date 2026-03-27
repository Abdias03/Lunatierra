package com.lunatierra.backend.dto;

import java.util.List;

public class AdminOverviewResponse {

    private final long totalUsers;
    private final long activeToday;
    private final long activeThisWeek;
    private final long totalCrops;
    private final long totalStages;
    private final long totalRecommendations;
    private final long totalLunarActivities;
    private final List<AdminUserSummary> recentUsers;

    public AdminOverviewResponse(long totalUsers, long activeToday, long activeThisWeek, long totalCrops,
                                 long totalStages, long totalRecommendations, long totalLunarActivities,
                                 List<AdminUserSummary> recentUsers) {
        this.totalUsers = totalUsers;
        this.activeToday = activeToday;
        this.activeThisWeek = activeThisWeek;
        this.totalCrops = totalCrops;
        this.totalStages = totalStages;
        this.totalRecommendations = totalRecommendations;
        this.totalLunarActivities = totalLunarActivities;
        this.recentUsers = recentUsers;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public long getActiveToday() {
        return activeToday;
    }

    public long getActiveThisWeek() {
        return activeThisWeek;
    }

    public long getTotalCrops() {
        return totalCrops;
    }

    public long getTotalStages() {
        return totalStages;
    }

    public long getTotalRecommendations() {
        return totalRecommendations;
    }

    public long getTotalLunarActivities() {
        return totalLunarActivities;
    }

    public List<AdminUserSummary> getRecentUsers() {
        return recentUsers;
    }
}
