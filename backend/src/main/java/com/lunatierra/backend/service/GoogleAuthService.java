package com.lunatierra.backend.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.lunatierra.backend.dto.AuthResponse;
import com.lunatierra.backend.dto.AuthUserResponse;
import com.lunatierra.backend.model.User;
import com.lunatierra.backend.repository.UserRepository;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class GoogleAuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final String googleClientId;

    public GoogleAuthService(
            UserRepository userRepository,
            JwtService jwtService,
            @Value("${auth.google.client-id}") String googleClientId
    ) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.googleClientId = googleClientId;
    }

    public AuthResponse authenticate(String token) {
        if (token == null || token.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Google token is required");
        }

        GoogleIdToken.Payload payload = verifyToken(token);
        String email = payload.getEmail();
        String name = (String) payload.get("name");
        String picture = (String) payload.get("picture");
        String googleSub = payload.getSubject();

        User user = userRepository.findByEmailIgnoreCase(email)
                .or(() -> userRepository.findByGoogleSub(googleSub))
                .map(existing -> updateUser(existing, name, email, picture, googleSub))
                .orElseGet(() -> createUser(name, email, picture, googleSub));

        String jwt = jwtService.generateToken(user);
        return new AuthResponse(jwt, new AuthUserResponse(user.getId(), user.getName(), user.getEmail(), user.getPicture()));
    }

    private GoogleIdToken.Payload verifyToken(String token) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(),
                    GsonFactory.getDefaultInstance()
            )
                    .setAudience(Collections.singletonList(googleClientId))
                    .setIssuers(List.of("https://accounts.google.com", "accounts.google.com"))
                    .build();

            GoogleIdToken idToken = verifier.verify(token);
            if (idToken == null) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Google token");
            }

            GoogleIdToken.Payload payload = idToken.getPayload();
            if (payload.getExpirationTimeSeconds() == null || payload.getExpirationTimeSeconds() * 1000 < System.currentTimeMillis()) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Expired Google token");
            }
            if (payload.getEmail() == null || payload.getEmail().isBlank()) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Google token does not contain email");
            }
            if (payload.getEmailVerified() != null && !payload.getEmailVerified()) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Google email is not verified");
            }

            return payload;
        } catch (GeneralSecurityException | IOException ex) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unable to verify Google token");
        }
    }

    private User updateUser(User user, String name, String email, String picture, String googleSub) {
        user.setName(name != null && !name.isBlank() ? name : user.getName());
        user.setEmail(email);
        user.setPicture(picture);
        user.setGoogleSub(googleSub);
        return userRepository.save(user);
    }

    private User createUser(String name, String email, String picture, String googleSub) {
        User user = new User(name != null && !name.isBlank() ? name : "Lunatierra");
        user.setEmail(email);
        user.setPicture(picture);
        user.setGoogleSub(googleSub);
        return userRepository.save(user);
    }
}
