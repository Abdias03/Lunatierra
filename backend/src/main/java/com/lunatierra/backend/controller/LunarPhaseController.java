package com.lunatierra.backend.controller;

import com.lunatierra.backend.dto.LunarCalendarDayResponse;
import com.lunatierra.backend.dto.LunarPhaseResponse;
import com.lunatierra.backend.service.LunarService;
import java.util.Locale;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class LunarPhaseController {

    private final LunarService lunarService;

    public LunarPhaseController(LunarService lunarService) {
        this.lunarService = lunarService;
    }

    @GetMapping("/lunar-phase")
    public LunarPhaseResponse getCurrentPhase(Locale locale) {
        return lunarService.getCurrentPhase(locale);
    }

    @GetMapping("/lunar/recommendations")
    public LunarPhaseResponse getLunarRecommendations(Locale locale) {
        return lunarService.getCurrentPhase(locale);
    }

    @GetMapping("/lunar/calendar")
    public List<LunarCalendarDayResponse> getLunarCalendar(
            @RequestParam int month,
            @RequestParam int year,
            Locale locale
    ) {
        return lunarService.getCalendar(month, year, locale);
    }
}
