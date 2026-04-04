package com.lunatierra.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Respuesta de autenticación passwordless.")
public class AuthResponse {

    @Schema(description = "JWT de sesión para consumir endpoints autenticados.", example = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMiJ9.signature")
    private final String token;
    @Schema(description = "Información básica del usuario autenticado.")
    private final AuthUserResponse user;

    public AuthResponse(String token, AuthUserResponse user) {
        this.token = token;
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public AuthUserResponse getUser() {
        return user;
    }
}
