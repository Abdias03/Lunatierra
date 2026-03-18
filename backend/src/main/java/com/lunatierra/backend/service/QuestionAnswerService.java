package com.lunatierra.backend.service;

import java.util.Locale;
import org.springframework.stereotype.Service;

@Service
public class QuestionAnswerService {

    public String answer(String question) {
        String normalized = question.toLowerCase(Locale.ROOT);
        if (normalized.contains("yellow")) {
            return "Yellow leaves can mean too much water, low nutrients, or poor drainage. Check the soil moisture first.";
        }
        if (normalized.contains("pest") || normalized.contains("bugs")) {
            return "High humidity can attract pests. Inspect the underside of leaves and avoid spraying if rain is expected.";
        }
        if (normalized.contains("water")) {
            return "Water early in the day and check whether the top soil is dry before watering again.";
        }
        return "Observe leaf color, soil moisture, and recent weather. This MVP gives simple guidance and can be expanded later.";
    }
}
