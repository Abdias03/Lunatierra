package com.lunatierra.backend.controller;

import com.lunatierra.backend.dto.MigrateUserDataRequest;
import com.lunatierra.backend.service.AuthenticatedUserService;
import com.lunatierra.backend.service.UserCropService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
@Tag(name = "Migración de usuario", description = "Migración de datos locales del modo invitado hacia una cuenta autenticada.")
public class UserMigrationController {

    private final AuthenticatedUserService authenticatedUserService;
    private final UserCropService userCropService;

    public UserMigrationController(AuthenticatedUserService authenticatedUserService, UserCropService userCropService) {
        this.authenticatedUserService = authenticatedUserService;
        this.userCropService = userCropService;
    }

    @PostMapping("/migrate")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(
            summary = "Migrar datos del modo invitado",
            description = "Asocia cultivos creados localmente a la cuenta autenticada después del login."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Migración completada correctamente"),
            @ApiResponse(responseCode = "400", description = "Solicitud inválida"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @SecurityRequirement(name = "bearerAuth")
    public void migrateUserData(
            @RequestBody MigrateUserDataRequest request,
            @Parameter(
                    description = "JWT del usuario autenticado.",
                    example = "Bearer eyJhbGciOiJIUzI1NiJ9..."
            )
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader
    ) {
        Long userId = authenticatedUserService.requireUserId(authorizationHeader);
        userCropService.migrateGuestCrops(userId, request);
    }
}
