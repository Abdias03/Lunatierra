package com.lunatierra.backend.dto;

public class AuthResponse {

    private final String token;
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
