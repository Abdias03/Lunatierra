package com.lunatierra.backend.service;

import com.lunatierra.backend.model.User;
import com.lunatierra.backend.repository.UserRepository;
import io.jsonwebtoken.JwtException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthenticatedUserService {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    public AuthenticatedUserService(JwtService jwtService, UserRepository userRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    public Long requireUserId(String authorizationHeader) {
        Long userId = getOptionalUserId(authorizationHeader);
        if (userId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing or invalid user context");
        }
        return userId;
    }

    public Long getOptionalUserId(String authorizationHeader) {
        try {
            return jwtService.extractUserId(authorizationHeader);
        } catch (JwtException | IllegalArgumentException ex) {
            return null;
        }
    }

    public User requireUser(String authorizationHeader) {
        Long userId = requireUserId(authorizationHeader);
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
    }
}
