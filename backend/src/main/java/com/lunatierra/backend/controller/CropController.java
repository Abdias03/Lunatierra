package com.lunatierra.backend.controller;

import com.lunatierra.backend.dto.CreateUserCropRequest;
import com.lunatierra.backend.dto.CropIntelligenceResponse;
import com.lunatierra.backend.dto.UserCropResponse;
import com.lunatierra.backend.service.CropEngineService;
import com.lunatierra.backend.service.AuthenticatedUserService;
import com.lunatierra.backend.service.UserCropService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Locale;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/crops")
public class CropController {

    private final UserCropService userCropService;
    private final CropEngineService cropEngineService;
    private final AuthenticatedUserService authenticatedUserService;

    public CropController(UserCropService userCropService, CropEngineService cropEngineService,
                          AuthenticatedUserService authenticatedUserService) {
        this.userCropService = userCropService;
        this.cropEngineService = cropEngineService;
        this.authenticatedUserService = authenticatedUserService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserCropResponse createCrop(@Valid @RequestBody CreateUserCropRequest request, Locale locale,
                                       @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        Long userId = authenticatedUserService.requireUserId(authorizationHeader);
        return userCropService.create(userId, request, locale);
    }

    @GetMapping
    public List<UserCropResponse> getCrops(Locale locale,
                                           @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        Long userId = authenticatedUserService.getOptionalUserId(authorizationHeader);
        if (userId == null) {
            return List.of();
        }
        return userCropService.getAll(userId, locale);
    }

    @GetMapping("/{id}/intelligence")
    public CropIntelligenceResponse getCropIntelligence(@PathVariable Long id, Locale locale,
                                                        @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        Long userId = authenticatedUserService.requireUserId(authorizationHeader);
        UserCropResponse crop = userCropService.getById(userId, id, locale);
        return cropEngineService.buildInsight(crop, locale);
    }
}
