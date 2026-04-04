package com.lunatierra.backend.controller;

import com.lunatierra.backend.dto.QuestionRequest;
import com.lunatierra.backend.dto.QuestionResponse;
import com.lunatierra.backend.service.QuestionAnswerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/questions")
@Tag(name = "Preguntas rápidas", description = "Asistente de preguntas cortas para acompañar al usuario.")
public class QuestionController {

    private final QuestionAnswerService questionAnswerService;

    public QuestionController(QuestionAnswerService questionAnswerService) {
        this.questionAnswerService = questionAnswerService;
    }

    @PostMapping
    @Operation(
            summary = "Responder pregunta rápida",
            description = "Recibe una pregunta breve del usuario y devuelve una respuesta simple y amigable."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Pregunta respondida correctamente"),
            @ApiResponse(responseCode = "400", description = "Solicitud inválida"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    public QuestionResponse ask(
            @Valid @RequestBody QuestionRequest request,
            @Parameter(
                    description = "JWT opcional del usuario autenticado.",
                    example = "Bearer eyJhbGciOiJIUzI1NiJ9..."
            )
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        if (!RequestUserContext.hasUserContext(authorizationHeader)) {
            return new QuestionResponse(questionAnswerService.answer(request.getQuestion()));
        }

        return new QuestionResponse(questionAnswerService.answer(request.getQuestion()));
    }
}
