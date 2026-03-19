package com.lunatierra.backend.controller;

import com.lunatierra.backend.dto.LunarPhaseResponse;
import com.lunatierra.backend.service.LunarService;
import java.util.Locale;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/lunar-phase")
public class LunarPhaseController {

    private final LunarService lunarService;

    public LunarPhaseController(LunarService lunarService) {
        this.lunarService = lunarService;
    }

    @GetMapping
    public LunarPhaseResponse getCurrentPhase(Locale locale) {
        return lunarService.getCurrentPhase(locale);
    }
}
