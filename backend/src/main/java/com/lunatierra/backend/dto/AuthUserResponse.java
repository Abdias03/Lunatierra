package com.lunatierra.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Información básica del usuario autenticado.")
public class AuthUserResponse {

    @Schema(description = "Identificador interno del usuario.", example = "12")
    private final Long id;
    @Schema(description = "Nombre visible del usuario.", example = "Abdías Morales")
    private final String name;
    @Schema(description = "Correo del usuario.", example = "abdias.morales03@gmail.com")
    private final String email;
    @Schema(description = "URL de la foto de perfil si existe.", example = "https://lh3.googleusercontent.com/a/photo.jpg")
    private final String picture;

    public AuthUserResponse(Long id, String name, String email, String picture) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.picture = picture;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPicture() {
        return picture;
    }
}
