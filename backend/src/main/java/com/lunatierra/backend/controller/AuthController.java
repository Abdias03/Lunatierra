package com.lunatierra.backend.controller;

import com.lunatierra.backend.dto.AuthResponse;
import com.lunatierra.backend.dto.GoogleAuthRequest;
import com.lunatierra.backend.service.GoogleAuthService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final GoogleAuthService googleAuthService;

    public AuthController(GoogleAuthService googleAuthService) {
        this.googleAuthService = googleAuthService;
    }

    @PostMapping("/google")
    public AuthResponse authenticateWithGoogle(@RequestBody GoogleAuthRequest request) {
        return googleAuthService.authenticate(request.getToken());
    }
}
