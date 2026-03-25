package com.lunatierra.backend.dto;

public class AuthUserResponse {

    private final Long id;
    private final String name;
    private final String email;
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
