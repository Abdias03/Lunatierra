package com.lunatierra.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

@Schema(description = "Respuesta integral del motor de inteligencia agrícola para un cultivo.")
public class CropIntelligenceResponse {

    @Schema(description = "Etapa actual del cultivo.")
    private final StageInsight stage;
    @Schema(description = "Acción principal sugerida para hoy.", example = "Revisa la humedad del suelo")
    private final String actionToday;
    @Schema(description = "Observación simple para el usuario.", example = "La planta va bien y solo necesita seguimiento ligero.")
    private final String observation;
    @Schema(description = "Explicación breve de por qué se generó la recomendación.", example = "Se detectó una etapa temprana con clima seco.")
    private final String reason;
    @Schema(description = "Advertencias adicionales que debe considerar el usuario.")
    private final List<String> warnings;
    @Schema(description = "Fase lunar del día.", example = "Cuarto creciente")
    private final String lunarPhase;
    @Schema(description = "Actividades sugeridas por fase lunar.")
    private final List<String> lunarActivities;
    @Schema(description = "Resumen del clima.")
    private final WeatherSummary weather;
    @Schema(description = "Mensaje opcional generado por el asistente de IA.", example = "Hoy solo revisa la humedad y deja que tu cultivo siga tomando fuerza.")
    private final String assistantMessage;

    public CropIntelligenceResponse(StageInsight stage, String actionToday, String observation, String reason, List<String> warnings,
                                    String lunarPhase, List<String> lunarActivities, WeatherSummary weather,
                                    String assistantMessage) {
        this.stage = stage;
        this.actionToday = actionToday;
        this.observation = observation;
        this.reason = reason;
        this.warnings = warnings;
        this.lunarPhase = lunarPhase;
        this.lunarActivities = lunarActivities;
        this.weather = weather;
        this.assistantMessage = assistantMessage;
    }

    public StageInsight getStage() {
        return stage;
    }

    public String getActionToday() {
        return actionToday;
    }

    public String getObservation() {
        return observation;
    }

    public String getReason() {
        return reason;
    }

    public List<String> getWarnings() {
        return warnings;
    }

    public String getLunarPhase() {
        return lunarPhase;
    }

    public List<String> getLunarActivities() {
        return lunarActivities;
    }

    public WeatherSummary getWeather() {
        return weather;
    }

    public String getAssistantMessage() {
        return assistantMessage;
    }
}
