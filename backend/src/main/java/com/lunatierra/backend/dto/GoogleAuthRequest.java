package com.lunatierra.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Solicitud para autenticación con Google Identity Services.")
public class GoogleAuthRequest {

    @Schema(
            description = "ID token emitido por Google en el frontend.",
            example = "eyJhbGciOiJSUzI1NiIsImtpZCI6Ij...google-token...",
            requiredMode = Schema.RequiredMode.REQUIRED
    )
    private String token;

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
