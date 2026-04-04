package com.lunatierra.backend.service;

import com.lunatierra.backend.dto.LunarDayInsightResponse;
import com.lunatierra.backend.dto.LunarPhaseResponse;
import com.lunatierra.backend.dto.OnboardingRecommendationResponse;
import com.lunatierra.backend.repository.PlantingCalendarRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Locale;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class LunarRecommendationService {

    private static final Logger logger = LoggerFactory.getLogger(LunarRecommendationService.class);
    private static final List<String> FALLBACK_CROPS = List.of("CORN", "BEANS", "SQUASH");
    
    private final LunarService lunarService;
    private final PlantingCalendarRepository plantingCalendarRepository;

    public LunarRecommendationService(LunarService lunarService, PlantingCalendarRepository plantingCalendarRepository) {
        this.lunarService = lunarService;
        this.plantingCalendarRepository = plantingCalendarRepository;
    }

    /**
     * Normalize lunar phase string to match database format.
     * Converts "Waxing Crescent" → "WAXING_CRESCENT"
     * Handles: spaces, dashes, mixed case
     */
    private String normalizePhaseCode(String rawPhase) {
        System.out.println("[normalizePhaseCode] Input: '" + rawPhase + "'");
        
        if (rawPhase == null || rawPhase.isEmpty()) {
            System.out.println("[normalizePhaseCode] Phase is null/empty, returning UNKNOWN");
            logger.warn("🌙 Lunar phase is null or empty");
            return "UNKNOWN";
        }
        
        String normalized = rawPhase
                .trim()
                .toUpperCase()
                .replace(" ", "_")
                .replace("-", "_")
                .replaceAll("_+", "_");  // Remove multiple underscores
        
        System.out.println("[normalizePhaseCode] Output: '" + normalized + "'");
        logger.debug("🌙 Raw phase: '{}' → Normalized: '{}'", rawPhase, normalized);
        
        return normalized;
    }

    /**
     * Fetch crops from planting_calendar table based on month and lunar phase.
     */
    private List<String> fetchCropsFromDatabase(int month, String normalizedPhaseCode) {
        System.out.println("[fetchCropsFromDatabase] Querying: month=" + month + ", phase='" + normalizedPhaseCode + "'");
        logger.info("📅 Querying planting_calendar: month={}, lunarPhase='{}'", month, normalizedPhaseCode);
        
        try {
            List<String> crops = plantingCalendarRepository
                    .findByMonthAndLunarPhaseOrderByIdAsc(month, normalizedPhaseCode)
                    .stream()
                    .map(pc -> {
                        System.out.println("   └─ Found crop: " + pc.getCropCode());
                        logger.debug("🌱 Retrieved crop: {}", pc.getCropCode());
                        return pc.getCropCode();
                    })
                    .distinct()
                    .toList();
            
            System.out.println("[fetchCropsFromDatabase] Result count: " + crops.size() + ", crops: " + crops);
            logger.info("📦 Database returned {} crops: {}", crops.size(), crops);
            return crops;
        } catch (Exception e) {
            System.out.println("❌ [fetchCropsFromDatabase] ERROR: " + e.getMessage());
            logger.error("❌ Error querying planting_calendar", e);
            return List.of();
        }
    }

    /**
     * Get safe crop list with fallback.
     */
    private List<String> getSafeCrops(List<String> fromDatabase, String debugContext) {
        System.out.println("[getSafeCrops] Context: " + debugContext + ", input: " + fromDatabase);
        
        if (fromDatabase != null && !fromDatabase.isEmpty()) {
            System.out.println("[getSafeCrops] Using database crops: " + fromDatabase);
            return fromDatabase;
        }
        
        System.out.println("[getSafeCrops] ⚠️ Database empty, using FALLBACK: " + FALLBACK_CROPS);
        logger.warn("⚠️ No crops found in database ({}), using fallback: {}", debugContext, FALLBACK_CROPS);
        return FALLBACK_CROPS;
    }
    
    /**
     * Create fallback recommendation when data is unavailable.
     */
    private OnboardingRecommendationResponse createFallbackRecommendation(Locale locale, String reason) {
        System.out.println("🔴 createFallbackRecommendation: reason=" + reason);
        boolean spanish = locale == null || locale.getLanguage().toLowerCase(Locale.ROOT).startsWith("es");
        logger.warn("⚠️ Using fallback recommendation due to: {}", reason);
        return new OnboardingRecommendationResponse(
                "Unknown",
                spanish ? "Por favor, intenta de nuevo más tarde." : "Please try again later.",
                FALLBACK_CROPS,
                "maintain"
        );
    }

    public OnboardingRecommendationResponse getTodayRecommendation(Locale locale) {
        // CRITICAL DEBUG: Force visible output
        System.out.println("\n\n🔥🔥🔥 ENTERING getTodayRecommendation 🔥🔥🔥");
        System.out.println("📍 Locale: " + locale);
        
        LocalDate today = LocalDate.now();
        System.out.println("📅 Today's date: " + today);
        System.out.println("📅 Month value: " + today.getMonthValue());
        
        LunarPhaseResponse lunarPhase = lunarService.getCurrentPhase(locale);
        System.out.println("🌙 LunarPhaseResponse received: " + lunarPhase);
        
        if (lunarPhase == null) {
            System.out.println("❌❌❌ ERROR: LunarPhaseResponse is NULL");
            logger.error("❌ LunarPhaseResponse is null, cannot generate recommendation");
            return createFallbackRecommendation(locale, "LunarPhaseResponse is null");
        }
        
        // CRITICAL: Get phase CODE, not display name
        String rawPhaseCode = lunarPhase.getPhase();
        String displayName = lunarPhase.getDisplayName();
        System.out.println("🌙 getPhase() returns: '" + rawPhaseCode + "'");
        System.out.println("🌙 getDisplayName() returns: '" + displayName + "'");
        
        if (rawPhaseCode == null || rawPhaseCode.isEmpty()) {
            System.out.println("⚠️ WARNING: getPhase() returned null or empty! Using displayName as fallback.");
            rawPhaseCode = displayName != null ? displayName : "UNKNOWN";
        }
        
        String normalizedPhaseCode = normalizePhaseCode(rawPhaseCode);
        System.out.println("🌙 Normalized phase: '" + normalizedPhaseCode + "'");
        
        int month = today.getMonthValue();
        boolean spanish = locale == null || locale.getLanguage().toLowerCase(Locale.ROOT).startsWith("es");
        
        logger.info("🌙 getTodayRecommendation START: date={}, rawPhase='{}', normalized='{}', month={}, spanish={}", 
                today, rawPhaseCode, normalizedPhaseCode, month, spanish);
        System.out.println("🌍 Spanish mode: " + spanish);

        // Fetch from database
        System.out.println("\n📦 DATABASE QUERY: findByMonthAndLunarPhaseOrderByIdAsc(" + month + ", '" + normalizedPhaseCode + "')");
        List<String> dbCrops = fetchCropsFromDatabase(month, normalizedPhaseCode);
        System.out.println("📦 Database returned: " + dbCrops);
        
        List<String> recommendedCrops = getSafeCrops(dbCrops, "getTodayRecommendation");
        System.out.println("🌱 Final recommended crops (after fallback): " + recommendedCrops);
        
        // Determine action type based on phase
        String actionType = determineActionType(normalizedPhaseCode);
        String message = buildMessage(normalizedPhaseCode, actionType, spanish);
        System.out.println("💬 Action type: " + actionType);
        System.out.println("💬 Message: " + message);
        
        OnboardingRecommendationResponse response = new OnboardingRecommendationResponse(
                displayName,
                message,
                recommendedCrops,
                actionType
        );
        
        System.out.println("✅ FINAL RESPONSE: " + response);
        logger.info("✅ getTodayRecommendation SUCCESS: actionType='{}', crops={}, displayName='{}'", 
                actionType, recommendedCrops, displayName);
        System.out.println("✅✅✅ EXITING getTodayRecommendation ✅✅✅\n\n");
        
        return response;
    }
    
    /**
     * Determine action type based on lunar phase.
     */
    private String determineActionType(String normalizedPhaseCode) {
        if (normalizedPhaseCode.contains("WAXING") || "NEW_MOON".equals(normalizedPhaseCode)) {
            return "plant";
        }
        return "maintain";
    }
    
    /**
     * Build appropriate message based on phase and action type.
     */
    private String buildMessage(String normalizedPhaseCode, String actionType, boolean spanish) {
        if ("plant".equals(actionType)) {
            return spanish 
                ? "Hoy la luna ayuda al crecimiento. Es buen día para sembrar 🌱"
                : "Today the moon supports growth. It is a good day to plant 🌱";
        }
        
        if ("FULL_MOON".equals(normalizedPhaseCode)) {
            return spanish
                ? "Hoy conviene cuidar y nutrir. No hace falta sembrar algo nuevo."
                : "Today is better for caring and feeding. You do not need to plant something new.";
        }
        
        return spanish
            ? "Hoy es mejor limpiar y observar. Si quieres, te muestro más opciones."
            : "Today is better for cleaning and observing. If you want, I can show more options.";
    }

    public LunarDayInsightResponse getDayInsight(LocalDate date, Locale locale) {
        System.out.println("\n🔥 ENTERING getDayInsight: date=" + date + ", locale=" + locale);
        
        LunarPhaseResponse lunarPhase = lunarService.getPhaseForDate(date, locale);
        System.out.println("🌙 LunarPhaseResponse: " + lunarPhase);
        
        if (lunarPhase == null) {
            System.out.println("❌ LunarPhaseResponse is NULL");
            logger.error("❌ LunarPhaseResponse is null for date={}", date);
            return createFallbackDayInsight(locale);
        }
        
        String rawPhaseCode = lunarPhase.getPhase();
        String displayName = lunarPhase.getDisplayName();
        System.out.println("🌙 getPhase(): '" + rawPhaseCode + "'");
        System.out.println("🌙 getDisplayName(): '" + displayName + "'");
        
        String normalizedPhaseCode = normalizePhaseCode(rawPhaseCode);
        System.out.println("🌙 Normalized: '" + normalizedPhaseCode + "'");
        
        int month = date.getMonthValue();
        boolean spanish = locale == null || locale.getLanguage().toLowerCase(Locale.ROOT).startsWith("es");
        
        System.out.println("📅 Month: " + month + ", Spanish: " + spanish);
        logger.info("🌙 getDayInsight START: date={}, rawPhase='{}', normalized='{}', month={}", 
                date, rawPhaseCode, normalizedPhaseCode, month);

        // Fetch crops from database
        System.out.println("📦 DATABASE QUERY for getDayInsight");
        List<String> dbCrops = fetchCropsFromDatabase(month, normalizedPhaseCode);
        List<String> recommendedCrops = getSafeCrops(dbCrops, "getDayInsight");
        System.out.println("🌱 Final crops for getDayInsight: " + recommendedCrops);
        
        // Build activities based on phase
        List<String> dos = buildActivitiesDo(normalizedPhaseCode, spanish);
        List<String> donts = buildActivitiesDont(normalizedPhaseCode, spanish);
        
        LunarDayInsightResponse response = new LunarDayInsightResponse(
                normalizedPhaseCode,
                buildDayMessage(normalizedPhaseCode, spanish),
                dos,
                donts,
                recommendedCrops
        );
        
        logger.info("✅ getDayInsight SUCCESS: crops={}", recommendedCrops);
        return response;
    }
    
    /**
     * Build "do" activities for the day based on lunar phase.
     */
    private List<String> buildActivitiesDo(String normalizedPhaseCode, boolean spanish) {
        if ("NEW_MOON".equals(normalizedPhaseCode)) {
            return spanish 
                ? List.of("Preparar la tierra", "Sembrar frijol")
                : List.of("Prepare the soil", "Plant beans");
        }
        
        if (normalizedPhaseCode.contains("WAXING") || "FIRST_QUARTER".equals(normalizedPhaseCode)) {
            return spanish
                ? List.of("Sembrar", "Revisar brotes", "Mover la tierra con calma")
                : List.of("Plant", "Check sprouts", "Loosen the soil gently");
        }
        
        if ("FULL_MOON".equals(normalizedPhaseCode)) {
            return spanish
                ? List.of("Observar hojas", "Fertilizar ligero")
                : List.of("Check leaves", "Apply a light feeding");
        }
        
        return spanish
            ? List.of("Podar", "Limpiar", "Observar el terreno")
            : List.of("Prune", "Clean", "Look over the field");
    }
    
    /**
     * Build "don't" activities for the day based on lunar phase.
     */
    private List<String> buildActivitiesDont(String normalizedPhaseCode, boolean spanish) {
        if ("NEW_MOON".equals(normalizedPhaseCode)) {
            return spanish ? List.of("Podar fuerte") : List.of("Heavy pruning");
        }
        
        if (normalizedPhaseCode.contains("WAXING") || "FIRST_QUARTER".equals(normalizedPhaseCode)) {
            return spanish 
                ? List.of("Dejar la tierra seca")
                : List.of("Let the soil dry out");
        }
        
        if ("FULL_MOON".equals(normalizedPhaseCode)) {
            return spanish ? List.of("Sembrar") : List.of("Plant");
        }
        
        return spanish ? List.of("Sembrar") : List.of("Plant");
    }
    
    /**
     * Build day insight message based on lunar phase.
     */
    private String buildDayMessage(String normalizedPhaseCode, boolean spanish) {
        if ("NEW_MOON".equals(normalizedPhaseCode)) {
            return spanish ? "Día ideal para empezar 🌱" : "An ideal day to start 🌱";
        }
        
        if (normalizedPhaseCode.contains("WAXING") || "FIRST_QUARTER".equals(normalizedPhaseCode)) {
            return spanish 
                ? "Buen día para sembrar y ayudar al crecimiento 🌱"
                : "A good day to plant and support growth 🌱";
        }
        
        if ("FULL_MOON".equals(normalizedPhaseCode)) {
            return spanish 
                ? "Dale mantenimiento a tu cultivo"
                : "Give your crop some care today";
        }
        
        return spanish 
            ? "Buen día para limpiar y podar"
            : "A good day for cleaning and pruning";
    }
    
    /**
     * Fallback day insight when data is unavailable.
     */
    private LunarDayInsightResponse createFallbackDayInsight(Locale locale) {
        boolean spanish = locale == null || locale.getLanguage().toLowerCase(Locale.ROOT).startsWith("es");
        logger.warn("⚠️ Using fallback day insight");
        return new LunarDayInsightResponse(
                "UNKNOWN",
                spanish ? "Intenta de nuevo más tarde" : "Please try again later",
                spanish ? List.of("Revisar el cultivo") : List.of("Check crop"),
                spanish ? List.of("Podar fuerte") : List.of("Heavy pruning"),
                FALLBACK_CROPS
        );
    }
}
