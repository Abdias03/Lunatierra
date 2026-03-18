package com.lunatierra.backend.service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Locale;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Service;

@Service
public class LunarPhaseService {

    private static final List<String> PHASE_KEYS = List.of(
            "lunar.phase.new_moon",
            "lunar.phase.waxing_crescent",
            "lunar.phase.first_quarter",
            "lunar.phase.waxing_gibbous",
            "lunar.phase.full_moon",
            "lunar.phase.waning_gibbous",
            "lunar.phase.last_quarter",
            "lunar.phase.waning_crescent"
    );

    private final MessageSource messageSource;

    public LunarPhaseService(MessageSource messageSource) {
        this.messageSource = messageSource;
    }

    public String getCurrentPhase(Locale locale) {
        long days = ChronoUnit.DAYS.between(LocalDate.of(2024, 1, 11), LocalDate.now());
        int index = (int) Math.floorMod(days / 4, PHASE_KEYS.size());
        return messageSource.getMessage(PHASE_KEYS.get(index), null, locale);
    }

    public boolean isWaxingPhase() {
        long days = ChronoUnit.DAYS.between(LocalDate.of(2024, 1, 11), LocalDate.now());
        int index = (int) Math.floorMod(days / 4, PHASE_KEYS.size());
        String key = PHASE_KEYS.get(index);
        return "lunar.phase.waxing_crescent".equals(key) || "lunar.phase.waxing_gibbous".equals(key);
    }
}
