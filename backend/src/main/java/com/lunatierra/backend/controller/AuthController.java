package com.lunatierra.backend.controller;

import com.lunatierra.backend.dto.AuthResponse;
import com.lunatierra.backend.dto.GoogleAuthRequest;
import com.lunatierra.backend.service.GoogleAuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Autenticación", description = "Endpoints passwordless listos para Google Sign-In y evolución a JWT.")
public class AuthController {

    private final GoogleAuthService googleAuthService;

    public AuthController(GoogleAuthService googleAuthService) {
        this.googleAuthService = googleAuthService;
    }

    @PostMapping("/google")
    @Operation(
            summary = "Autenticar con Google",
            description = "Recibe un ID token emitido por Google, lo valida en backend y devuelve un JWT de sesión con los datos básicos del usuario."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Usuario autenticado correctamente"),
            @ApiResponse(responseCode = "400", description = "Token inválido o solicitud incorrecta", content = @Content),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor", content = @Content)
    })
    public AuthResponse authenticateWithGoogle(@RequestBody GoogleAuthRequest request) {
        return googleAuthService.authenticate(request.getToken());
    }
}
