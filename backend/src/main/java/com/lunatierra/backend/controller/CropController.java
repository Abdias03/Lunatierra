package com.lunatierra.backend.controller;

import com.lunatierra.backend.dto.CreateUserCropRequest;
import com.lunatierra.backend.dto.UserCropResponse;
import com.lunatierra.backend.service.UserCropService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Locale;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/crops")
public class CropController {

    private final UserCropService userCropService;

    public CropController(UserCropService userCropService) {
        this.userCropService = userCropService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserCropResponse createCrop(@Valid @RequestBody CreateUserCropRequest request, Locale locale) {
        return userCropService.create(request, locale);
    }

    @GetMapping
    public List<UserCropResponse> getCrops(Locale locale) {
        return userCropService.getAll(locale);
    }
}
