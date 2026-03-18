package com.lunatierra.backend.dto;

import java.util.List;

public class RecommendationResponse {

    private final String lunarPhase;
    private final WeatherSummary weather;
    private final String dailyFocus;
    private final List<RecommendationItem> recommendations;
    private final List<CropDetailRecommendation> cropDetails;

    public RecommendationResponse(String lunarPhase, WeatherSummary weather, String dailyFocus,
                                  List<RecommendationItem> recommendations,
                                  List<CropDetailRecommendation> cropDetails) {
        this.lunarPhase = lunarPhase;
        this.weather = weather;
        this.dailyFocus = dailyFocus;
        this.recommendations = recommendations;
        this.cropDetails = cropDetails;
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

    public List<RecommendationItem> getRecommendations() {
        return recommendations;
    }

    public List<CropDetailRecommendation> getCropDetails() {
        return cropDetails;
    }
}
