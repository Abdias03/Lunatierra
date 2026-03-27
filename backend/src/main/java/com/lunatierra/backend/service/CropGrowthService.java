package com.lunatierra.backend.service;

import com.lunatierra.backend.model.CropGrowthStage;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class CropGrowthService {

    private static final Map<String, List<String>> CROP_EMOJI_SEQUENCE = Map.of(
            "corn", List.of("🌰", "🌱", "🌿", "🌾", "🌽"),
            "beans", List.of("🫘", "🌱", "🍃", "🌸", "🫘"),
            "pumpkin", List.of("🎃", "🌱", "🍃", "🌼", "🎃"),
            "tomato", List.of("🍅", "🌱", "🌿", "🌼", "🍅")
    );

    private static final Map<String, List<Integer>> CROP_STAGE_THRESHOLDS = Map.of(
            "corn", List.of(7, 25, 50, 70),
            "beans", List.of(5, 20, 40, 55),
            "pumpkin", List.of(7, 20, 40, 60),
            "tomato", List.of(5, 20, 35, 55)
    );

    public String getGrowthStageIcon(String cropName, long daysAfterPlanting) {
        String key = normalizeCropName(cropName);
        List<String> emojis = CROP_EMOJI_SEQUENCE.getOrDefault(key, CROP_EMOJI_SEQUENCE.get("corn"));
        int stageIndex = determineStageIndex(key, daysAfterPlanting);
        return emojis.get(stageIndex);
    }

    public CropGrowthStage getGrowthStage(String cropName, long daysAfterPlanting) {
        int stageIndex = determineStageIndex(normalizeCropName(cropName), daysAfterPlanting);
        return CropGrowthStage.fromIndex(stageIndex);
    }

    public String getGrowthStageName(String cropName, long daysAfterPlanting, Locale locale) {
        CropGrowthStage stage = getGrowthStage(cropName, daysAfterPlanting);
        if (locale != null && locale.getLanguage().startsWith("es")) {
            return stage.getNameEs();
        }
        return stage.getNameEn();
    }

    private int determineStageIndex(String normalizedCropName, long daysAfterPlanting) {
        List<Integer> thresholds = CROP_STAGE_THRESHOLDS.getOrDefault(normalizedCropName, CROP_STAGE_THRESHOLDS.get("corn"));
        if (daysAfterPlanting <= 0) {
            return 0;
        }

        for (int i = 0; i < thresholds.size(); i++) {
            if (daysAfterPlanting <= thresholds.get(i)) {
                return i;
            }
        }

        return 4;
    }

    private String normalizeCropName(String cropName) {
        if (cropName == null) {
            return "corn";
        }
        switch (cropName.trim().toLowerCase(Locale.ROOT)) {
            case "maiz":
            case "maíz":
            case "corn":
                return "corn";
            case "frijol":
            case "beans":
            case "bean":
                return "beans";
            case "calabaza":
            case "squash":
            case "pumpkin":
                return "pumpkin";
            case "jitomate":
            case "tomato":
                return "tomato";
            default:
                return "corn";
        }
    }
}
