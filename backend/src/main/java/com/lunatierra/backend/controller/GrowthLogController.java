package com.lunatierra.backend.controller;

import com.lunatierra.backend.dto.GrowthLogResponse;
import com.lunatierra.backend.service.AuthenticatedUserService;
import com.lunatierra.backend.service.GrowthLogService;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/growth-log")
public class GrowthLogController {

    private final GrowthLogService growthLogService;
    private final AuthenticatedUserService authenticatedUserService;

    public GrowthLogController(GrowthLogService growthLogService, AuthenticatedUserService authenticatedUserService) {
        this.growthLogService = growthLogService;
        this.authenticatedUserService = authenticatedUserService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public GrowthLogResponse uploadPhoto(
            @RequestPart("file") @NotNull MultipartFile file,
            @RequestParam("userCropId") Long userCropId,
            @RequestParam(value = "description", required = false) String description,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        Long userId = authenticatedUserService.requireUserId(authorizationHeader);
        return growthLogService.uploadPhoto(userId, userCropId, file, description);
    }

    @GetMapping("/{userCropId}")
    public List<GrowthLogResponse> getPhotos(@PathVariable Long userCropId,
                                             @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        Long userId = authenticatedUserService.requireUserId(authorizationHeader);
        return growthLogService.getPhotosByUserCrop(userId, userCropId);
    }

    @DeleteMapping("/{userCropId}/{growthLogId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePhoto(@PathVariable Long userCropId,
                            @PathVariable Long growthLogId,
                            @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        Long userId = authenticatedUserService.requireUserId(authorizationHeader);
        growthLogService.deletePhoto(userId, userCropId, growthLogId);
    }
}
