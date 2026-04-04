package com.lunatierra.backend.controller;

import com.lunatierra.backend.dto.DailyProgressResponse;
import com.lunatierra.backend.service.AuthenticatedUserService;
import com.lunatierra.backend.service.DailyProgressService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/daily-progress")
@Tag(name = "Progreso diario", description = "Racha, check-in y estado diario del usuario.")
public class DailyProgressController {

    private final DailyProgressService dailyProgressService;
    private final AuthenticatedUserService authenticatedUserService;

    public DailyProgressController(DailyProgressService dailyProgressService,
                                   AuthenticatedUserService authenticatedUserService) {
        this.dailyProgressService = dailyProgressService;
        this.authenticatedUserService = authenticatedUserService;
    }

    @GetMapping
    @Operation(
            summary = "Obtener progreso diario",
            description = "Devuelve la racha, la última fecha de revisión y si el usuario ya marcó hoy como revisado."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Progreso obtenido correctamente"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    public DailyProgressResponse getProgress(
            @Parameter(
                    description = "JWT opcional del usuario autenticado. Si no se envía, se devuelve un progreso vacío.",
                    example = "Bearer eyJhbGciOiJIUzI1NiJ9..."
            )
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        Long userId = authenticatedUserService.getOptionalUserId(authorizationHeader);
        if (userId == null) {
            return new DailyProgressResponse(0, null, false);
        }
        return dailyProgressService.getProgress(userId);
    }

    @PostMapping("/check-in")
    @Operation(
            summary = "Registrar check-in del día",
            description = "Marca el día como revisado y actualiza la racha del usuario."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Check-in registrado correctamente"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @SecurityRequirement(name = "bearerAuth")
    public DailyProgressResponse checkIn(
            @Parameter(
                    description = "JWT opcional del usuario autenticado.",
                    example = "Bearer eyJhbGciOiJIUzI1NiJ9..."
            )
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        Long userId = authenticatedUserService.getOptionalUserId(authorizationHeader);
        if (userId == null) {
            return new DailyProgressResponse(0, null, false);
        }
        return dailyProgressService.registerCheckIn(userId);
    }
}
