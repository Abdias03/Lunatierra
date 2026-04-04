package com.lunatierra.backend.controller;

import com.lunatierra.backend.dto.LunarCalendarDayResponse;
import com.lunatierra.backend.dto.LunarPhaseResponse;
import com.lunatierra.backend.service.LunarService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.Locale;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@Tag(name = "Luna", description = "Fases lunares, calendario mensual y recomendaciones agrícolas basadas en la luna.")
public class LunarPhaseController {

    private final LunarService lunarService;

    public LunarPhaseController(LunarService lunarService) {
        this.lunarService = lunarService;
    }

    @GetMapping("/lunar-phase")
    @Operation(
            summary = "Obtener fase lunar actual",
            description = "Devuelve la fase lunar del día, sus actividades sugeridas y cultivos recomendados."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Fase lunar obtenida correctamente"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor", content = @Content)
    })
    public LunarPhaseResponse getCurrentPhase(Locale locale) {
        return lunarService.getCurrentPhase(locale);
    }

    @GetMapping("/lunar/recommendations")
    @Operation(
            summary = "Obtener recomendaciones lunares del día",
            description = "Atajo para onboarding y sugerencias rápidas usando la fase lunar actual."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Recomendaciones lunares obtenidas correctamente"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor", content = @Content)
    })
    public LunarPhaseResponse getLunarRecommendations(Locale locale) {
        return lunarService.getCurrentPhase(locale);
    }

    @GetMapping("/lunar/calendar")
    @Operation(
            summary = "Obtener calendario lunar mensual",
            description = "Genera el calendario lunar de un mes específico con actividades y cultivos sugeridos por día."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Calendario generado correctamente"),
            @ApiResponse(responseCode = "400", description = "Mes o año inválidos", content = @Content),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor", content = @Content)
    })
    public List<LunarCalendarDayResponse> getLunarCalendar(
            @Parameter(description = "Mes solicitado en formato numérico del 1 al 12.", example = "4")
            @RequestParam int month,
            @Parameter(description = "Año solicitado.", example = "2026")
            @RequestParam int year,
            Locale locale
    ) {
        return lunarService.getCalendar(month, year, locale);
    }
}
