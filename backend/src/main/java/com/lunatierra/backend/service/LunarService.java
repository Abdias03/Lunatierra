package com.lunatierra.backend.service;

import com.lunatierra.backend.dto.LunarCalendarDayResponse;
import com.lunatierra.backend.dto.LunarPhaseResponse;
import com.lunatierra.backend.repository.CropRepository;
import com.lunatierra.backend.repository.PlantingCalendarRepository;
import com.lunatierra.backend.repository.LunarActivityRepository;
import java.time.LocalDate;
import java.time.YearMonth;
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
    private final PlantingCalendarRepository plantingCalendarRepository;
    private final CropRepository cropRepository;

    public LunarService(MessageSource messageSource, LunarActivityRepository lunarActivityRepository,
                        PlantingCalendarRepository plantingCalendarRepository,
                        CropRepository cropRepository) {
        this.messageSource = messageSource;
        this.lunarActivityRepository = lunarActivityRepository;
        this.plantingCalendarRepository = plantingCalendarRepository;
        this.cropRepository = cropRepository;
    }

    public LunarPhaseResponse getCurrentPhase(Locale locale) {
        LocalDate today = LocalDate.now();
        MoonPhase phase = resolvePhase(today);
        return new LunarPhaseResponse(
                phase.name(),
                message(phase.getMessageKey(), locale),
                getActivities(phase),
                getRecommendedCrops(today.getMonthValue(), phase, locale)
        );
    }

    public List<LunarCalendarDayResponse> getCalendar(int month, int year, Locale locale) {
        YearMonth yearMonth = YearMonth.of(year, month);
        return yearMonth.atDay(1)
                .datesUntil(yearMonth.atEndOfMonth().plusDays(1))
                .map(date -> {
                    MoonPhase phase = resolvePhase(date);
                    return new LunarCalendarDayResponse(
                            date.toString(),
                            phase.name(),
                            message(phase.getMessageKey(), locale),
                            getActivities(phase),
                            getRecommendedCrops(month, phase, locale)
                    );
                })
                .toList();
    }

    public List<String> getActivities(Locale locale) {
        return getCurrentPhase(locale).getActivities();
    }

    public String getCurrentPhaseDisplayName(Locale locale) {
        return getCurrentPhase(locale).getDisplayName();
    }

    public LunarPhaseResponse getPhaseForDate(LocalDate date, Locale locale) {
        MoonPhase phase = resolvePhase(date);
        return new LunarPhaseResponse(
                phase.name(),
                message(phase.getMessageKey(), locale),
                getActivities(phase),
                getRecommendedCrops(date.getMonthValue(), phase, locale)
        );
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

    private List<String> getRecommendedCrops(int month, MoonPhase phase, Locale locale) {
        List<String> crops = plantingCalendarRepository.findByMonthAndLunarPhaseOrderByIdAsc(month, phase.name()).stream()
                .map(calendar -> localizeCropCode(calendar.getCropCode(), locale))
                .distinct()
                .toList();

        if (!crops.isEmpty()) {
            return crops;
        }

        if (phase == MoonPhase.NEW_MOON || phase == MoonPhase.WANING_CRESCENT) {
            return List.of(localizeCropCode("BEANS", locale), localizeCropCode("SQUASH", locale));
        }

        if (phase == MoonPhase.FIRST_QUARTER || phase == MoonPhase.WAXING_CRESCENT) {
            return List.of(localizeCropCode("CORN", locale), localizeCropCode("BEANS", locale));
        }

        return List.of(localizeCropCode("CORN", locale), localizeCropCode("SQUASH", locale));
    }

    private String message(String key, Locale locale) {
        return messageSource.getMessage(key, null, key, locale);
    }

    private String localizeCropCode(String cropCode, Locale locale) {
        return cropRepository.findByCodeIgnoreCase(cropCode)
                .map(crop -> crop.getName())
                .orElse(cropCode);
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
