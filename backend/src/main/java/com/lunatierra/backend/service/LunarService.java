package com.lunatierra.backend.service;

import com.lunatierra.backend.dto.LunarPhaseResponse;
import com.lunatierra.backend.repository.LunarActivityRepository;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Locale;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Service;

@Service
public class LunarService {

    private static final double SYNODIC_MONTH_DAYS = 29.53;
    private static final double PHASE_LENGTH = SYNODIC_MONTH_DAYS / 8.0;
    private static final LocalDate REFERENCE_NEW_MOON = LocalDate.of(2024, 1, 11);

    private final MessageSource messageSource;
    private final LunarActivityRepository lunarActivityRepository;

    public LunarService(MessageSource messageSource, LunarActivityRepository lunarActivityRepository) {
        this.messageSource = messageSource;
        this.lunarActivityRepository = lunarActivityRepository;
    }

    public LunarPhaseResponse getCurrentPhase(Locale locale) {
        MoonPhase phase = resolvePhase(LocalDate.now());
        return new LunarPhaseResponse(
                phase.name(),
                message(phase.getMessageKey(), locale),
                getActivities(phase)
        );
    }

    public List<String> getActivities(Locale locale) {
        return getCurrentPhase(locale).getActivities();
    }

    public String getCurrentPhaseDisplayName(Locale locale) {
        return getCurrentPhase(locale).getDisplayName();
    }

    public boolean isWaxingPhase() {
        MoonPhase phase = resolvePhase(LocalDate.now());
        return phase == MoonPhase.WAXING_CRESCENT
                || phase == MoonPhase.FIRST_QUARTER
                || phase == MoonPhase.WAXING_GIBBOUS;
    }

    private MoonPhase resolvePhase(LocalDate date) {
        long daysSinceReference = ChronoUnit.DAYS.between(REFERENCE_NEW_MOON, date);
        double moonAge = ((daysSinceReference % SYNODIC_MONTH_DAYS) + SYNODIC_MONTH_DAYS) % SYNODIC_MONTH_DAYS;
        int phaseIndex = (int) Math.floor(moonAge / PHASE_LENGTH) % MoonPhase.values().length;
        return MoonPhase.values()[phaseIndex];
    }

    private List<String> getActivities(MoonPhase phase) {
        return lunarActivityRepository.findByPhaseOrderByIdAsc(phase.name()).stream()
                .map(activity -> activity.getActivity())
                .toList();
    }

    private String message(String key, Locale locale) {
        return messageSource.getMessage(key, null, key, locale);
    }

    private enum MoonPhase {
        NEW_MOON("lunar.phase.new_moon"),
        WAXING_CRESCENT("lunar.phase.waxing_crescent"),
        FIRST_QUARTER("lunar.phase.first_quarter"),
        WAXING_GIBBOUS("lunar.phase.waxing_gibbous"),
        FULL_MOON("lunar.phase.full_moon"),
        WANING_GIBBOUS("lunar.phase.waning_gibbous"),
        LAST_QUARTER("lunar.phase.last_quarter"),
        WANING_CRESCENT("lunar.phase.waning_crescent");

        private final String messageKey;

        MoonPhase(String messageKey) {
            this.messageKey = messageKey;
        }

        public String getMessageKey() {
            return messageKey;
        }
    }
}
