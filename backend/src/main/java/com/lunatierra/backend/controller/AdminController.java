package com.lunatierra.backend.controller;

import com.lunatierra.backend.dto.AdminCreateCropRequest;
import com.lunatierra.backend.dto.AdminLunarActivityRequest;
import com.lunatierra.backend.dto.AdminCreateRecommendationRequest;
import com.lunatierra.backend.dto.AdminCreateStageRequest;
import com.lunatierra.backend.dto.AdminLunarActivityResponse;
import com.lunatierra.backend.dto.AdminOverviewResponse;
import com.lunatierra.backend.dto.AdminRecommendationResponse;
import com.lunatierra.backend.dto.AdminStageResponse;
import com.lunatierra.backend.dto.CropCatalogItemResponse;
import com.lunatierra.backend.model.CropStage;
import com.lunatierra.backend.model.Recommendation;
import com.lunatierra.backend.service.CropCatalogService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final CropCatalogService cropCatalogService;

    public AdminController(CropCatalogService cropCatalogService) {
        this.cropCatalogService = cropCatalogService;
    }

    @GetMapping("/overview")
    public AdminOverviewResponse getOverview() {
        return cropCatalogService.getOverview();
    }

    @GetMapping("/crops")
    public List<CropCatalogItemResponse> getCrops() {
        return cropCatalogService.getCatalog();
    }

    @GetMapping("/stages")
    public List<AdminStageResponse> getStages() {
        return cropCatalogService.getStages();
    }

    @GetMapping("/recommendations")
    public List<AdminRecommendationResponse> getRecommendations() {
        return cropCatalogService.getRecommendations();
    }

    @GetMapping("/lunar-activities")
    public List<AdminLunarActivityResponse> getLunarActivities() {
        return cropCatalogService.getLunarActivities();
    }

    @PostMapping("/crops")
    @ResponseStatus(HttpStatus.CREATED)
    public CropCatalogItemResponse createCrop(@Valid @RequestBody AdminCreateCropRequest request) {
        return cropCatalogService.createCrop(request);
    }

    @PostMapping("/stages")
    @ResponseStatus(HttpStatus.CREATED)
    public CropStage createStage(@Valid @RequestBody AdminCreateStageRequest request) {
        return cropCatalogService.createStage(request);
    }

    @PostMapping("/recommendations")
    @ResponseStatus(HttpStatus.CREATED)
    public Recommendation createRecommendation(@Valid @RequestBody AdminCreateRecommendationRequest request) {
        return cropCatalogService.createRecommendation(request);
    }

    @PostMapping("/lunar-activities")
    @ResponseStatus(HttpStatus.CREATED)
    public AdminLunarActivityResponse createLunarActivity(@Valid @RequestBody AdminLunarActivityRequest request) {
        return cropCatalogService.createLunarActivity(request);
    }
}
