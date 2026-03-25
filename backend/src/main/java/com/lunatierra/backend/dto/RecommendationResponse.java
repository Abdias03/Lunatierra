package com.lunatierra.backend.dto;

import java.util.List;

public class RecommendationResponse {

    private final String lunarPhase;
    private final WeatherSummary weather;
    private final String dailyFocus;
    private final String dailyMessage;
    private final List<RecommendationItem> recommendations;
    private final List<CropDetailRecommendation> cropDetails;
    private final DailyProgressResponse dailyProgress;

    public RecommendationResponse(String lunarPhase, WeatherSummary weather, String dailyFocus,
                                  String dailyMessage,
                                  List<RecommendationItem> recommendations,
                                  List<CropDetailRecommendation> cropDetails,
                                  DailyProgressResponse dailyProgress) {
        this.lunarPhase = lunarPhase;
        this.weather = weather;
        this.dailyFocus = dailyFocus;
        this.dailyMessage = dailyMessage;
        this.recommendations = recommendations;
        this.cropDetails = cropDetails;
        this.dailyProgress = dailyProgress;
    }

    public String getLunarPhase() {
        return lunarPhase;
    }

    public WeatherSummary getWeather() {
        return weather;
    }

    public String getDailyFocus() {
        return dailyFocus;
    }

    public String getDailyMessage() {
        return dailyMessage;
    }

    public List<RecommendationItem> getRecommendations() {
        return recommendations;
    }

    public List<CropDetailRecommendation> getCropDetails() {
        return cropDetails;
    }

    public DailyProgressResponse getDailyProgress() {
        return dailyProgress;
    }
}
