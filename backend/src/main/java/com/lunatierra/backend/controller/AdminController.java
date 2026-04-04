package com.lunatierra.backend.controller;

import com.lunatierra.backend.dto.AdminCreateCropRequest;
import com.lunatierra.backend.dto.AdminCreateRecommendationRequest;
import com.lunatierra.backend.dto.AdminCreateStageRequest;
import com.lunatierra.backend.dto.AdminLunarActivityRequest;
import com.lunatierra.backend.dto.AdminLunarActivityResponse;
import com.lunatierra.backend.dto.AdminOverviewResponse;
import com.lunatierra.backend.dto.AdminRecommendationResponse;
import com.lunatierra.backend.dto.AdminStageResponse;
import com.lunatierra.backend.dto.CropCatalogItemResponse;
import com.lunatierra.backend.model.CropStage;
import com.lunatierra.backend.model.Recommendation;
import com.lunatierra.backend.service.CropCatalogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@Tag(name = "Administración agrícola", description = "Catálogo interno para crear cultivos, etapas, reglas y actividades lunares.")
@SecurityRequirement(name = "bearerAuth")
public class AdminController {

    private final CropCatalogService cropCatalogService;

    public AdminController(CropCatalogService cropCatalogService) {
        this.cropCatalogService = cropCatalogService;
    }

    @GetMapping("/overview")
    @Operation(summary = "Obtener resumen del panel admin", description = "Devuelve métricas generales de usuarios, cultivos y reglas.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Resumen obtenido correctamente"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    public AdminOverviewResponse getOverview() {
        return cropCatalogService.getOverview();
    }

    @GetMapping("/crops")
    @Operation(summary = "Listar cultivos administrables", description = "Devuelve el catálogo completo para administración.")
    public List<CropCatalogItemResponse> getCrops() {
        return cropCatalogService.getCatalog();
    }

    @GetMapping("/stages")
    @Operation(summary = "Listar etapas", description = "Devuelve todas las etapas registradas por cultivo.")
    public List<AdminStageResponse> getStages() {
        return cropCatalogService.getStages();
    }

    @GetMapping("/recommendations")
    @Operation(summary = "Listar recomendaciones", description = "Devuelve las reglas de recomendación configuradas en base de datos.")
    public List<AdminRecommendationResponse> getRecommendations() {
        return cropCatalogService.getRecommendations();
    }

    @GetMapping("/lunar-activities")
    @Operation(summary = "Listar actividades lunares", description = "Devuelve las actividades recomendadas por fase lunar.")
    public List<AdminLunarActivityResponse> getLunarActivities() {
        return cropCatalogService.getLunarActivities();
    }

    @PostMapping("/crops")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Crear cultivo", description = "Registra un nuevo cultivo en el catálogo dinámico.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Cultivo creado correctamente"),
            @ApiResponse(responseCode = "400", description = "Solicitud inválida"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    public CropCatalogItemResponse createCrop(@Valid @RequestBody AdminCreateCropRequest request) {
        return cropCatalogService.createCrop(request);
    }

    @PostMapping("/stages")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Crear etapa", description = "Registra una nueva etapa de crecimiento para un cultivo.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Etapa creada correctamente"),
            @ApiResponse(responseCode = "400", description = "Solicitud inválida"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    public CropStage createStage(@Valid @RequestBody AdminCreateStageRequest request) {
        return cropCatalogService.createStage(request);
    }

    @PostMapping("/recommendations")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Crear recomendación", description = "Crea una nueva regla dinámica para el motor de recomendaciones.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Recomendación creada correctamente"),
            @ApiResponse(responseCode = "400", description = "Solicitud inválida"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    public Recommendation createRecommendation(@Valid @RequestBody AdminCreateRecommendationRequest request) {
        return cropCatalogService.createRecommendation(request);
    }

    @PostMapping("/lunar-activities")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Crear actividad lunar", description = "Registra una actividad recomendada para una fase lunar.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Actividad creada correctamente"),
            @ApiResponse(responseCode = "400", description = "Solicitud inválida"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    public AdminLunarActivityResponse createLunarActivity(@Valid @RequestBody AdminLunarActivityRequest request) {
        return cropCatalogService.createLunarActivity(request);
    }
}
