package com.lunatierra.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Respuesta breve del asistente para la pregunta del usuario.")
public class QuestionResponse {

    @Schema(description = "Mensaje de respuesta.", example = "Hoy solo revisa la humedad antes de regar.")
    private final String answer;

    public QuestionResponse(String answer) {
        this.answer = answer;
    }

    public String getAnswer() {
        return answer;
    }
}
