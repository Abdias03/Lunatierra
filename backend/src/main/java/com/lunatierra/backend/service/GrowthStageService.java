package com.lunatierra.backend.service;

import com.lunatierra.backend.dto.GrowthStageDefinition;
import java.util.List;
import java.util.Locale;
import org.springframework.stereotype.Service;

@Service
public class GrowthStageService {

    public GrowthStageDefinition resolveStage(String cropName, long daysSincePlanting) {
        List<GrowthStageDefinition> stages = switch (cropName.toLowerCase(Locale.ROOT)) {
            case "corn" -> List.of(
                    new GrowthStageDefinition("crop.stage.germination", "crop.stage_behavior.corn.germination", 0, 7),
                    new GrowthStageDefinition("crop.stage.early_growth", "crop.stage_behavior.corn.early_growth", 8, 25),
                    new GrowthStageDefinition("crop.stage.vegetative", "crop.stage_behavior.corn.vegetative", 26, 50),
                    new GrowthStageDefinition("crop.stage.flowering", "crop.stage_behavior.corn.flowering", 51, 70),
                    new GrowthStageDefinition("crop.stage.ear_formation", "crop.stage_behavior.corn.ear_formation", 71, 90),
                    new GrowthStageDefinition("crop.stage.maturation", "crop.stage_behavior.corn.maturation", 91, Integer.MAX_VALUE)
            );
            case "beans" -> List.of(
                    new GrowthStageDefinition("crop.stage.germination", "crop.stage_behavior.beans.germination", 0, 5),
                    new GrowthStageDefinition("crop.stage.early_growth", "crop.stage_behavior.beans.early_growth", 6, 20),
                    new GrowthStageDefinition("crop.stage.vegetative", "crop.stage_behavior.beans.vegetative", 21, 40),
                    new GrowthStageDefinition("crop.stage.flowering", "crop.stage_behavior.beans.flowering", 41, 55),
                    new GrowthStageDefinition("crop.stage.pod_formation", "crop.stage_behavior.beans.pod_formation", 56, 75),
                    new GrowthStageDefinition("crop.stage.maturation", "crop.stage_behavior.beans.maturation", 76, Integer.MAX_VALUE)
            );
            case "squash" -> List.of(
                    new GrowthStageDefinition("crop.stage.germination", "crop.stage_behavior.squash.germination", 0, 7),
                    new GrowthStageDefinition("crop.stage.early_growth", "crop.stage_behavior.squash.early_growth", 8, 20),
                    new GrowthStageDefinition("crop.stage.vine_development", "crop.stage_behavior.squash.vine_development", 21, 40),
                    new GrowthStageDefinition("crop.stage.flowering", "crop.stage_behavior.squash.flowering", 41, 60),
                    new GrowthStageDefinition("crop.stage.fruit_development", "crop.stage_behavior.squash.fruit_development", 61, 90),
                    new GrowthStageDefinition("crop.stage.maturation", "crop.stage_behavior.squash.maturation", 91, Integer.MAX_VALUE)
            );
            default -> List.of(new GrowthStageDefinition("crop.stage.monitoring", "crop.stage_behavior.default.monitoring", 0, Integer.MAX_VALUE));
        };

        return stages.stream()
                .filter(stage -> daysSincePlanting >= stage.getMinDay() && daysSincePlanting <= stage.getMaxDay())
                .findFirst()
                .orElse(stages.get(stages.size() - 1));
    }
}
