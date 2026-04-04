package com.lunatierra.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "Pregunta breve enviada por el usuario al asistente.")
public class QuestionRequest {

    @NotBlank
    @Schema(description = "Texto de la pregunta.", example = "¿Debo regar hoy mi cultivo?")
    private String question;

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }
}
