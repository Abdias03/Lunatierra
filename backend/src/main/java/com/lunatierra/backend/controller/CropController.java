package com.lunatierra.backend.controller;

import com.lunatierra.backend.dto.CreateUserCropRequest;
import com.lunatierra.backend.dto.CropIntelligenceResponse;
import com.lunatierra.backend.dto.CropCatalogItemResponse;
import com.lunatierra.backend.dto.UserCropResponse;
import com.lunatierra.backend.service.CropEngineService;
import com.lunatierra.backend.service.AuthenticatedUserService;
import com.lunatierra.backend.service.CropCatalogService;
import com.lunatierra.backend.service.UserCropService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "Cultivos", description = "Operaciones para catálogo de cultivos y cultivos registrados por usuario.")
public class CropController {

    private final UserCropService userCropService;
    private final CropEngineService cropEngineService;
    private final AuthenticatedUserService authenticatedUserService;
    private final CropCatalogService cropCatalogService;

    public CropController(UserCropService userCropService, CropEngineService cropEngineService,
                          AuthenticatedUserService authenticatedUserService,
                          CropCatalogService cropCatalogService) {
        this.userCropService = userCropService;
        this.cropEngineService = cropEngineService;
        this.authenticatedUserService = authenticatedUserService;
        this.cropCatalogService = cropCatalogService;
    }

    @GetMapping("/catalog")
    @Operation(
            summary = "Obtener catálogo de cultivos",
            description = "Devuelve todos los cultivos configurados en la base de datos para que el frontend cargue opciones dinámicamente."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Catálogo obtenido correctamente"),
            @ApiResponse(responseCode = "500", description = "Error interno al leer el catálogo", content = @Content)
    })
    public List<CropCatalogItemResponse> getCatalog() {
        return cropCatalogService.getCatalog();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(
            summary = "Registrar cultivo del usuario",
            description = "Crea un nuevo cultivo para el usuario autenticado usando el código del cultivo y la fecha de siembra.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Cultivo creado correctamente"),
            @ApiResponse(responseCode = "400", description = "Solicitud inválida", content = @Content),
            @ApiResponse(responseCode = "404", description = "Cultivo no encontrado", content = @Content),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor", content = @Content)
    })
    public UserCropResponse createCrop(@Valid @RequestBody CreateUserCropRequest request, Locale locale,
                                       @Parameter(description = "JWT del usuario autenticado. Formato: Bearer {token}", example = "Bearer eyJhbGciOiJIUzI1NiJ9...")
                                       @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        Long userId = authenticatedUserService.requireUserId(authorizationHeader);
        return userCropService.create(userId, request, locale);
    }

    @GetMapping
    @Operation(
            summary = "Listar cultivos del usuario",
            description = "Obtiene todos los cultivos asociados al usuario autenticado. Si no hay usuario autenticado, devuelve lista vacía."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista obtenida correctamente"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor", content = @Content)
    })
    public List<UserCropResponse> getCrops(Locale locale,
                                           @Parameter(description = "JWT opcional del usuario autenticado. Si no se envía, la respuesta será una lista vacía.", example = "Bearer eyJhbGciOiJIUzI1NiJ9...")
                                           @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        Long userId = authenticatedUserService.getOptionalUserId(authorizationHeader);
        if (userId == null) {
            return List.of();
        }
        return userCropService.getAll(userId, locale);
    }

    @GetMapping("/{id}/intelligence")
    @Operation(
            summary = "Obtener inteligencia de un cultivo",
            description = "Devuelve etapa, clima, luna, recomendaciones y mensaje del asistente para un cultivo específico.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Insight generado correctamente"),
            @ApiResponse(responseCode = "404", description = "Cultivo no encontrado", content = @Content),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor", content = @Content)
    })
    public CropIntelligenceResponse getCropIntelligence(@PathVariable Long id, Locale locale,
                                                        @Parameter(description = "JWT del usuario autenticado.", example = "Bearer eyJhbGciOiJIUzI1NiJ9...")
                                                        @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        Long userId = authenticatedUserService.requireUserId(authorizationHeader);
        UserCropResponse crop = userCropService.getById(userId, id, locale);
        return cropEngineService.buildInsight(crop, locale);
    }
}
