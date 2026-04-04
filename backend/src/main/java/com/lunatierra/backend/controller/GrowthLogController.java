package com.lunatierra.backend.controller;

import com.lunatierra.backend.dto.GrowthLogResponse;
import com.lunatierra.backend.service.AuthenticatedUserService;
import com.lunatierra.backend.service.GrowthLogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "Bitácora de crecimiento", description = "Carga, consulta y eliminación de fotos del crecimiento del cultivo.")
public class GrowthLogController {

    private final GrowthLogService growthLogService;
    private final AuthenticatedUserService authenticatedUserService;

    public GrowthLogController(GrowthLogService growthLogService, AuthenticatedUserService authenticatedUserService) {
        this.growthLogService = growthLogService;
        this.authenticatedUserService = authenticatedUserService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(
            summary = "Subir foto de crecimiento",
            description = "Carga una imagen para la bitácora de un cultivo del usuario.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Foto subida correctamente"),
            @ApiResponse(responseCode = "400", description = "Archivo o parámetros inválidos", content = @Content),
            @ApiResponse(responseCode = "404", description = "Cultivo no encontrado", content = @Content),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor", content = @Content)
    })
    public GrowthLogResponse uploadPhoto(
            @Parameter(description = "Archivo de imagen del crecimiento.")
            @RequestPart("file") @NotNull MultipartFile file,
            @Parameter(description = "Identificador del cultivo del usuario.", example = "7")
            @RequestParam("userCropId") Long userCropId,
            @Parameter(description = "Descripción opcional de la foto.", example = "Ya tiene hojas nuevas.")
            @RequestParam(value = "description", required = false) String description,
            @Parameter(description = "JWT del usuario autenticado.", example = "Bearer eyJhbGciOiJIUzI1NiJ9...")
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        Long userId = authenticatedUserService.requireUserId(authorizationHeader);
        return growthLogService.uploadPhoto(userId, userCropId, file, description);
    }

    @GetMapping("/{userCropId}")
    @Operation(
            summary = "Listar fotos de un cultivo",
            description = "Obtiene todas las fotos asociadas a un cultivo del usuario autenticado.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Fotos obtenidas correctamente"),
            @ApiResponse(responseCode = "404", description = "Cultivo no encontrado", content = @Content),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor", content = @Content)
    })
    public List<GrowthLogResponse> getPhotos(@PathVariable Long userCropId,
                                             @Parameter(description = "JWT del usuario autenticado.", example = "Bearer eyJhbGciOiJIUzI1NiJ9...")
                                             @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        Long userId = authenticatedUserService.requireUserId(authorizationHeader);
        return growthLogService.getPhotosByUserCrop(userId, userCropId);
    }

    @DeleteMapping("/{userCropId}/{growthLogId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(
            summary = "Eliminar foto de crecimiento",
            description = "Elimina una foto específica de la bitácora de crecimiento.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Foto eliminada correctamente"),
            @ApiResponse(responseCode = "404", description = "Foto o cultivo no encontrado", content = @Content),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor", content = @Content)
    })
    public void deletePhoto(@PathVariable Long userCropId,
                            @Parameter(description = "Identificador de la foto a eliminar.", example = "21")
                            @PathVariable Long growthLogId,
                            @Parameter(description = "JWT del usuario autenticado.", example = "Bearer eyJhbGciOiJIUzI1NiJ9...")
                            @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        Long userId = authenticatedUserService.requireUserId(authorizationHeader);
        growthLogService.deletePhoto(userId, userCropId, growthLogId);
    }
}
