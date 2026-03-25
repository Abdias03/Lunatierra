package com.lunatierra.backend.controller;

import com.lunatierra.backend.dto.MigrateUserDataRequest;
import com.lunatierra.backend.service.AuthenticatedUserService;
import com.lunatierra.backend.service.UserCropService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
public class UserMigrationController {

    private final AuthenticatedUserService authenticatedUserService;
    private final UserCropService userCropService;

    public UserMigrationController(AuthenticatedUserService authenticatedUserService, UserCropService userCropService) {
        this.authenticatedUserService = authenticatedUserService;
        this.userCropService = userCropService;
    }

    @PostMapping("/migrate")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void migrateUserData(
            @RequestBody MigrateUserDataRequest request,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader
    ) {
        Long userId = authenticatedUserService.requireUserId(authorizationHeader);
        userCropService.migrateGuestCrops(userId, request);
    }
}
