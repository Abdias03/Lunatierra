package com.lunatierra.backend.service;

import com.lunatierra.backend.dto.AIContext;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class QuestionAnswerService {

    private static final Logger logger = LoggerFactory.getLogger(QuestionAnswerService.class);
    private final AIService aiService;

    public QuestionAnswerService(AIService aiService) {
        this.aiService = aiService;
    }

    public String answer(String question) {
        logger.info("QuestionAnswerService: Received question: '{}'", question);

        // Crear un contexto simplificado para Ollama basado en la pregunta
        AIContext context = new AIContext(
            "cultivo general",           // crop - genérico
            "crecimiento",               // stage - genérico
            0,                           // day
            "soleado",                   // weatherCondition - genérico
            true,                        // waterAvailable
            "el usuario pregunta: " + question,  // actionToday
            question,                    // observation/pregunta del usuario
            new ArrayList<>()            // warnings
        );

        logger.debug("QuestionAnswerService: Created AIContext for Ollama: crop={}, stage={}, observation={}",
                    context.getCrop(), context.getStage(), context.getObservation());

        // Intentar respuesta con Ollama (AIService)
        logger.info("QuestionAnswerService: Calling AIService.generateAdvice()");
        String aiResponse = aiService.generateAdvice(context);

        if (aiResponse != null && !aiResponse.isBlank()) {
            logger.info("QuestionAnswerService: Returning AI response: '{}'", aiResponse);
            return aiResponse;
        }

        logger.warn("QuestionAnswerService: AI response was null/empty, using fallback");
        // Fallback a respuestas estáticas si Ollama no responde
        String fallbackResponse = getFallbackAnswer(question);
        logger.info("QuestionAnswerService: Returning fallback response: '{}'", fallbackResponse);
        return fallbackResponse;
    }

    private String getFallbackAnswer(String question) {
        String normalized = question.toLowerCase(Locale.ROOT);
        if (normalized.contains("amarillo") || normalized.contains("yellow")) {
            return "Las hojas amarillas pueden significar exceso de agua, nutrientes bajos o mal drenaje. Revisa primero la humedad del suelo.";
        }
        if (normalized.contains("plaga") || normalized.contains("pest") || normalized.contains("bugs") || normalized.contains("insecto")) {
            return "La alta humedad atrae plagas. Inspecciona el envés de las hojas y evita riego si hay lluvia en camino.";
        }
        if (normalized.contains("agua") || normalized.contains("water") || normalized.contains("riego")) {
            return "Riega temprano en el día y revisa que la tierra esté seca antes de regar de nuevo.";
        }
        if (normalized.contains("fertiliz") || normalized.contains("nutrient")) {
            return "Los cultivos domésticos agradecen fertilizante suave cada 2-3 semanas. Sigue las instrucciones del producto.";
        }
        return "Observa el color de las hojas, la humedad del suelo y el clima reciente. Si la pregunta sigue sin respuesta, consulta con un agrónomo local.";
    }
}
