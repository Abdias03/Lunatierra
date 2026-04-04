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
    private static final int MAX_SENTENCES = 2;
    private static final int MAX_CHARS = 180;

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
            logger.info("AIService: Ollama disabled, returning null");
            return null;
        }

        logger.info("AIService: Starting AI advice generation for crop: {}, stage: {}, day: {}",
                   context.getCrop(), context.getStage(), context.getDay());

        try {
            String prompt = buildPrompt(context);
            logger.debug("AIService: Generated prompt: {}", prompt);

            OllamaGenerateRequest request = new OllamaGenerateRequest(model, prompt, false);
            logger.info("AIService: Sending request to Ollama at {} with model {}", model);

            OllamaGenerateResponse response = restClient.post()
                    .uri("/api/generate")
                    .body(request)
                    .retrieve()
                    .body(OllamaGenerateResponse.class);

            logger.info("AIService: Received response from Ollama: {}", response);

            if (response == null) {
                logger.warn("AIService: Ollama returned null response");
                return null;
            }

            String rawResponse = response.response();
            logger.debug("AIService: Raw response from Ollama: {}", rawResponse);

            if (rawResponse == null || rawResponse.isBlank()) {
                logger.warn("AIService: Ollama returned empty response");
                return null;
            }

            String sanitized = sanitizeResponse(rawResponse, context);
            logger.info("AIService: Final sanitized response: {}", sanitized);

            return sanitized;
        } catch (Exception exception) {
            logger.error("AIService: Ollama advice unavailable: {}", exception.getMessage(), exception);
            return null;
        }
    }

    private String buildPrompt(AIContext context) {
        String warnings = (context.getWarnings() == null || context.getWarnings().isEmpty())
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
                - Maximo 2 frases
                - No uses lenguaje tecnico
                - Suena cercano, como alguien que acompana el cultivo
                - Se claro, amable y directo
                - Da consejos practicos y faciles de hacer hoy
                - Usa solo la informacion del contexto
                - No inventes datos, causas, plagas, fechas o clima extra
                - Si el contexto no alcanza, repite la accion u observacion con palabras mas calidas
                - No menciones informacion externa ni supuestos
                - Evita listas, titulos y explicaciones largas
                - Puedes usar palabras como "tu planta", "hoy" y "dale una revisada"
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
                .replaceAll("(i)^(claro|por supuesto|aqui tienes|respuesta:)\\s*[:,.-]*\\s*", "")
                .replaceAll("(i)\\b(como ia|no soy experto|te recomiendo consultar|segun expertos)\\b.*", "")
                .trim();

        List<String> sentences = splitSentences(withoutMetaText);
        List<String> relevantSentences = sentences.stream()
                .filter(sentence -> isRelevant(sentence, context))
                .limit(MAX_SENTENCES)
                .collect(Collectors.toCollection(ArrayList::new));

        if (relevantSentences.isEmpty()) {
            return buildFriendlyFallback(context);
        }

        String compact = String.join(" ", relevantSentences).trim();
        if (compact.length() > MAX_CHARS) {
            compact = compact.substring(0, MAX_CHARS).trim();
            int lastBoundary = Math.max(compact.lastIndexOf('.'), Math.max(compact.lastIndexOf('!'), compact.lastIndexOf('?')));
            if (lastBoundary > 40) {
                compact = compact.substring(0, lastBoundary + 1).trim();
            }
        }

        return compact.isBlank() ? buildFriendlyFallback(context) : compact;
    }

    private List<String> splitSentences(String text) {
        return List.of(text.split("(<=[.!])\\s+")).stream()
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
                && !normalizedSentence.contains("quimico")
                && !normalizedSentence.contains("fertilizante quimico")
                && !normalizedSentence.contains("diagnostico");
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

    private String buildFriendlyFallback(AIContext context) {
        List<String> lines = new ArrayList<>();

        if (context.getActionToday() != null && !context.getActionToday().isBlank()) {
            lines.add(softenSentence(context.getActionToday(), true));
        }

        if (context.getObservation() != null && !context.getObservation().isBlank()) {
            lines.add(softenSentence(context.getObservation(), false));
        }

        if (lines.isEmpty()) {
            lines.add("Tu planta va bien. Hoy solo dale una revisada tranquila.");
        }

        return lines.stream()
                .limit(MAX_SENTENCES)
                .collect(Collectors.joining(" "));
    }

    private String softenSentence(String source, boolean actionLine) {
        String cleaned = source.trim()
                .replaceAll("\\s+", " ")
                .replaceAll("(i)^mant[eé]n\\b", "Mantén")
                .replaceAll("(i)^revisa\\b", "Revisa")
                .replaceAll("(i)^observa\\b", "Observa")
                .replaceAll("(i)^evita\\b", "Evita");

        if (actionLine) {
            return "Hoy " + lowercaseFirst(cleaned);
        }

        return "Tu planta va bien, solo " + lowercaseFirst(cleaned);
    }

    private String lowercaseFirst(String value) {
        if (value == null || value.isBlank()) {
            return "";
        }

        String trimmed = value.strip();
        if (trimmed.length() == 1) {
            return trimmed.toLowerCase(Locale.ROOT);
        }

        return Character.toLowerCase(trimmed.charAt(0)) + trimmed.substring(1);
    }

    private record OllamaGenerateRequest(String model, String prompt, boolean stream) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record OllamaGenerateResponse(String response) {
    }
}
