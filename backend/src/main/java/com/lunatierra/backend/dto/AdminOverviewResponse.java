package com.lunatierra.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

@Schema(description = "Resumen principal del panel administrativo.")
public class AdminOverviewResponse {

    @Schema(description = "Total de usuarios registrados.", example = "18")
    private final long totalUsers;
    @Schema(description = "Usuarios activos hoy.", example = "7")
    private final long activeToday;
    @Schema(description = "Usuarios activos en la semana.", example = "12")
    private final long activeThisWeek;
    @Schema(description = "Total de cultivos registrados en catálogo.", example = "6")
    private final long totalCrops;
    @Schema(description = "Total de etapas de crecimiento configuradas.", example = "24")
    private final long totalStages;
    @Schema(description = "Total de reglas de recomendación configuradas.", example = "86")
    private final long totalRecommendations;
    @Schema(description = "Total de actividades lunares registradas.", example = "16")
    private final long totalLunarActivities;
    @Schema(description = "Usuarios recientes para visualización rápida.")
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
