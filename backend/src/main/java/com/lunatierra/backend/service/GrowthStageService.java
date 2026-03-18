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
                    new GrowthStageDefinition("crop.stage.planting", "crop.stage_behavior.corn.planting", 0, 4),
                    new GrowthStageDefinition("crop.stage.germination", "crop.stage_behavior.corn.germination", 5, 10),
                    new GrowthStageDefinition("crop.stage.vegetative", "crop.stage_behavior.corn.vegetative", 11, 45),
                    new GrowthStageDefinition("crop.stage.flowering", "crop.stage_behavior.corn.flowering", 46, 75),
                    new GrowthStageDefinition("crop.stage.harvest", "crop.stage_behavior.corn.harvest", 76, Integer.MAX_VALUE)
            );
            case "beans" -> List.of(
                    new GrowthStageDefinition("crop.stage.planting", "crop.stage_behavior.beans.planting", 0, 3),
                    new GrowthStageDefinition("crop.stage.germination", "crop.stage_behavior.beans.germination", 4, 8),
                    new GrowthStageDefinition("crop.stage.vegetative", "crop.stage_behavior.beans.vegetative", 9, 35),
                    new GrowthStageDefinition("crop.stage.flowering", "crop.stage_behavior.beans.flowering", 36, 55),
                    new GrowthStageDefinition("crop.stage.harvest", "crop.stage_behavior.beans.harvest", 56, Integer.MAX_VALUE)
            );
            case "squash" -> List.of(
                    new GrowthStageDefinition("crop.stage.planting", "crop.stage_behavior.squash.planting", 0, 4),
                    new GrowthStageDefinition("crop.stage.germination", "crop.stage_behavior.squash.germination", 5, 9),
                    new GrowthStageDefinition("crop.stage.vegetative", "crop.stage_behavior.squash.vegetative", 10, 40),
                    new GrowthStageDefinition("crop.stage.flowering", "crop.stage_behavior.squash.flowering", 41, 60),
                    new GrowthStageDefinition("crop.stage.harvest", "crop.stage_behavior.squash.harvest", 61, Integer.MAX_VALUE)
            );
            default -> List.of(new GrowthStageDefinition("crop.stage.monitoring", "crop.stage_behavior.default.monitoring", 0, Integer.MAX_VALUE));
        };

        return stages.stream()
                .filter(stage -> daysSincePlanting >= stage.getMinDay() && daysSincePlanting <= stage.getMaxDay())
                .findFirst()
                .orElse(stages.get(stages.size() - 1));
    }
}
