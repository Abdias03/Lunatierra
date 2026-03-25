package com.lunatierra.backend.service;

import com.lunatierra.backend.dto.LunarDayInsightResponse;
import com.lunatierra.backend.dto.LunarPhaseResponse;
import com.lunatierra.backend.dto.OnboardingRecommendationResponse;
import java.time.LocalDate;
import java.util.List;
import java.util.Locale;
import org.springframework.stereotype.Service;

@Service
public class LunarRecommendationService {

    private final LunarService lunarService;

    public LunarRecommendationService(LunarService lunarService) {
        this.lunarService = lunarService;
    }

    public OnboardingRecommendationResponse getTodayRecommendation(Locale locale) {
        LocalDate today = LocalDate.now();
        LunarPhaseResponse lunarPhase = lunarService.getCurrentPhase(locale);
        String phaseCode = lunarPhase.getPhase();
        int month = today.getMonthValue();
        boolean spanish = locale == null || locale.getLanguage().toLowerCase(Locale.ROOT).startsWith("es");
        boolean warmSeason = month >= 3 && month <= 9;

        if ("NEW_MOON".equals(phaseCode)) {
            return new OnboardingRecommendationResponse(
                    lunarPhase.getDisplayName(),
                    spanish ? "Buen momento para sembrar algo que crezca con calma 🌱" : "A good moment to plant something that can start calmly 🌱",
                    warmSeason ? List.of("beans", "squash") : List.of("beans"),
                    "plant"
            );
        }

        if ("WAXING_CRESCENT".equals(phaseCode) || "FIRST_QUARTER".equals(phaseCode) || "WAXING_GIBBOUS".equals(phaseCode)) {
            return new OnboardingRecommendationResponse(
                    lunarPhase.getDisplayName(),
                    spanish ? "Hoy la luna ayuda al crecimiento. Es buen día para sembrar 🌱" : "Today the moon supports growth. It is a good day to plant 🌱",
                    warmSeason ? List.of("corn", "squash") : List.of("corn", "beans"),
                    "plant"
            );
        }

        if ("FULL_MOON".equals(phaseCode)) {
            return new OnboardingRecommendationResponse(
                    lunarPhase.getDisplayName(),
                    spanish ? "Hoy conviene cuidar y nutrir. No hace falta sembrar algo nuevo." : "Today is better for caring and feeding. You do not need to plant something new.",
                    List.of(),
                    "maintain"
            );
        }

        return new OnboardingRecommendationResponse(
                lunarPhase.getDisplayName(),
                spanish ? "Hoy es mejor limpiar y observar. Si quieres, te muestro más opciones." : "Today is better for cleaning and observing. If you want, I can show more options.",
                List.of(),
                "maintain"
        );
    }

    public LunarDayInsightResponse getDayInsight(LocalDate date, Locale locale) {
        LunarPhaseResponse lunarPhase = lunarService.getPhaseForDate(date, locale);
        String phaseCode = lunarPhase.getPhase();
        boolean spanish = locale == null || locale.getLanguage().toLowerCase(Locale.ROOT).startsWith("es");

        if ("NEW_MOON".equals(phaseCode)) {
            return new LunarDayInsightResponse(
                    phaseCode,
                    spanish ? "Día ideal para empezar 🌱" : "An ideal day to start 🌱",
                    List.of(
                            spanish ? "Preparar la tierra" : "Prepare the soil",
                            spanish ? "Sembrar frijol" : "Plant beans"
                    ),
                    List.of(spanish ? "Podar fuerte" : "Heavy pruning"),
                    List.of("beans")
            );
        }

        if ("WAXING_CRESCENT".equals(phaseCode) || "FIRST_QUARTER".equals(phaseCode) || "WAXING_GIBBOUS".equals(phaseCode)) {
            return new LunarDayInsightResponse(
                    phaseCode,
                    spanish ? "Buen día para sembrar y ayudar al crecimiento 🌱" : "A good day to plant and support growth 🌱",
                    List.of(
                            spanish ? "Sembrar" : "Plant",
                            spanish ? "Revisar brotes" : "Check sprouts",
                            spanish ? "Mover la tierra con calma" : "Loosen the soil gently"
                    ),
                    List.of(spanish ? "Dejar la tierra seca" : "Let the soil dry out"),
                    List.of("corn", "squash")
            );
        }

        if ("FULL_MOON".equals(phaseCode)) {
            return new LunarDayInsightResponse(
                    phaseCode,
                    spanish ? "Dale mantenimiento a tu cultivo" : "Give your crop some care today",
                    List.of(
                            spanish ? "Observar hojas" : "Check leaves",
                            spanish ? "Fertilizar ligero" : "Apply a light feeding"
                    ),
                    List.of(spanish ? "Sembrar" : "Plant"),
                    lunarPhase.getRecommendedCrops().stream().limit(1).toList()
            );
        }

        return new LunarDayInsightResponse(
                phaseCode,
                spanish ? "Buen día para limpiar y podar" : "A good day for cleaning and pruning",
                List.of(
                        spanish ? "Podar" : "Prune",
                        spanish ? "Limpiar" : "Clean",
                        spanish ? "Observar el terreno" : "Look over the field"
                ),
                List.of(spanish ? "Sembrar" : "Plant"),
                List.of("beans")
        );
    }
}
