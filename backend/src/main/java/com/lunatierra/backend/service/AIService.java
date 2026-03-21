package com.lunatierra.backend.service;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.lunatierra.backend.dto.AIContext;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class AIService {

    private static final Logger logger = LoggerFactory.getLogger(AIService.class);
    private static final int MAX_SENTENCES = 3;
    private static final int MAX_CHARS = 280;

    private final RestClient restClient;
    private final String model;
    private final boolean enabled;

    public AIService(
            @Value("${ai.ollama.base-url:http://localhost:11434}") String baseUrl,
            @Value("${ai.ollama.model:gemma:2b}") String model,
            @Value("${ai.ollama.enabled:true}") boolean enabled,
            @Value("${ai.ollama.timeout-ms:4000}") int timeoutMs
    ) {
        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(Duration.ofMillis(timeoutMs));
        requestFactory.setReadTimeout(Duration.ofMillis(timeoutMs));

        this.restClient = RestClient.builder()
                .baseUrl(baseUrl)
                .requestFactory(requestFactory)
                .build();
        this.model = model;
        this.enabled = enabled;
    }

    public String generateAdvice(AIContext context) {
        if (!enabled) {
            return null;
        }

        try {
            OllamaGenerateResponse response = restClient.post()
                    .uri("/api/generate")
                    .body(new OllamaGenerateRequest(model, buildPrompt(context), false))
                    .retrieve()
                    .body(OllamaGenerateResponse.class);

            if (response == null || response.response() == null || response.response().isBlank()) {
                return null;
            }

            return sanitizeResponse(response.response(), context);
        } catch (Exception exception) {
            logger.warn("Ollama advice unavailable, continuing without AI explanation: {}", exception.getMessage());
            return null;
        }
    }

    private String buildPrompt(AIContext context) {
        String warnings = context.getWarnings() == null || context.getWarnings().isEmpty()
                ? "- No hay advertencias importantes hoy"
                : context.getWarnings().stream()
                        .map(warning -> "- " + warning)
                        .collect(Collectors.joining("\n"));

        return """
                Eres un asistente agricola para personas con cultivos en casa en Mexico.

                Contexto:
                Cultivo: %s
                Etapa: %s
                Dia: %s
                Clima: %s
                Agua disponible: %s

                Hoy:
                Accion: %s
                Observacion: %s

                Advertencias:
                %s

                Instrucciones:
                - Habla en espanol simple
                - Maximo 3 frases
                - No uses lenguaje tecnico
                - Se claro y directo
                - Da consejos practicos
                - Usa solo la informacion del contexto
                - No inventes datos, causas, plagas, fechas o clima extra
                - Si el contexto no alcanza, repite la accion u observacion con palabras simples
                - No menciones informacion externa ni supuestos
                """.formatted(
                context.getCrop(),
                context.getStage(),
                context.getDay(),
                context.getWeatherCondition(),
                context.isWaterAvailable() ? "si" : "no",
                context.getActionToday(),
                context.getObservation(),
                warnings
        );
    }

    private String sanitizeResponse(String rawResponse, AIContext context) {
        String normalized = rawResponse
                .replace('\n', ' ')
                .replace('\r', ' ')
                .replaceAll("\\s+", " ")
                .trim();

        if (normalized.isBlank()) {
            return null;
        }

        String withoutMetaText = normalized
                .replaceAll("(?i)^(claro|por supuesto|aqui tienes|respuesta:)\\s*[:,.-]*\\s*", "")
                .replaceAll("(?i)\\b(como ia|no soy experto|te recomiendo consultar|segun expertos)\\b.*", "")
                .trim();

        List<String> sentences = splitSentences(withoutMetaText);
        List<String> relevantSentences = sentences.stream()
                .filter(sentence -> isRelevant(sentence, context))
                .limit(MAX_SENTENCES)
                .collect(Collectors.toCollection(ArrayList::new));

        if (relevantSentences.isEmpty()) {
            relevantSentences.add(context.getActionToday());
            if (context.getObservation() != null && !context.getObservation().isBlank()) {
                relevantSentences.add(context.getObservation());
            }
        }

        String compact = String.join(" ", relevantSentences).trim();
        if (compact.length() > MAX_CHARS) {
            compact = compact.substring(0, MAX_CHARS).trim();
            int lastBoundary = Math.max(compact.lastIndexOf('.'), Math.max(compact.lastIndexOf('!'), compact.lastIndexOf('?')));
            if (lastBoundary > 40) {
                compact = compact.substring(0, lastBoundary + 1).trim();
            }
        }

        return compact.isBlank() ? null : compact;
    }

    private List<String> splitSentences(String text) {
        return List.of(text.split("(?<=[.!?])\\s+")).stream()
                .map(String::trim)
                .filter(sentence -> !sentence.isBlank())
                .toList();
    }

    private boolean isRelevant(String sentence, AIContext context) {
        String normalizedSentence = sentence.toLowerCase(Locale.ROOT);
        return containsAny(normalizedSentence, context)
                && !normalizedSentence.contains("internet")
                && !normalizedSentence.contains("especialista")
                && !normalizedSentence.contains("doctor")
                && !normalizedSentence.contains("mercado")
                && !normalizedSentence.contains("quimico");
    }

    private boolean containsAny(String normalizedSentence, AIContext context) {
        List<String> contextTerms = new ArrayList<>();
        addWords(contextTerms, context.getCrop());
        addWords(contextTerms, context.getStage());
        addWords(contextTerms, context.getWeatherCondition());
        addWords(contextTerms, context.getActionToday());
        addWords(contextTerms, context.getObservation());
        if (context.getWarnings() != null) {
            context.getWarnings().forEach(warning -> addWords(contextTerms, warning));
        }
        contextTerms.add(context.isWaterAvailable() ? "agua" : "riego");
        contextTerms.add("hoy");
        contextTerms.add("cultivo");
        contextTerms.add("planta");

        return contextTerms.stream()
                .filter(term -> term.length() >= 4)
                .anyMatch(normalizedSentence::contains);
    }

    private void addWords(List<String> collector, String source) {
        if (source == null || source.isBlank()) {
            return;
        }

        for (String part : source.toLowerCase(Locale.ROOT).split("[^\\p{L}\\p{N}]+")) {
            if (part.length() >= 4) {
                collector.add(part);
            }
        }
    }

    private record OllamaGenerateRequest(String model, String prompt, boolean stream) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record OllamaGenerateResponse(String response) {
    }
}
