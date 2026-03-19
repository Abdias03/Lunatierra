package com.lunatierra.backend.service;

import com.lunatierra.backend.dto.StageInsight;
import com.lunatierra.backend.model.Crop;
import com.lunatierra.backend.model.CropStage;
import com.lunatierra.backend.repository.CropRepository;
import com.lunatierra.backend.repository.CropStageRepository;
import java.util.Collection;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@Service
public class StageService {

    private final CropRepository cropRepository;
    private final CropStageRepository cropStageRepository;

    public StageService(CropRepository cropRepository, CropStageRepository cropStageRepository) {
        this.cropRepository = cropRepository;
        this.cropStageRepository = cropStageRepository;
    }

    public StageInsight resolveStage(String cropName, long daysSincePlanting, Locale locale) {
        Crop crop = cropRepository.findByCodeIgnoreCase(cropName)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Crop not supported"));
        return resolveStage(crop, daysSincePlanting, locale);
    }

    public StageInsight resolveStage(Crop crop, long daysSincePlanting, Locale locale) {
        List<CropStage> stages = cropStageRepository.findByCropOrderByMinDayAsc(crop);
        return resolveStageFromStages(stages, daysSincePlanting, locale);
    }

    public Map<Long, List<CropStage>> getStagesByCropIds(Collection<Crop> crops) {
        return cropStageRepository.findByCropInOrderByCropIdAscMinDayAsc(crops).stream()
                .collect(Collectors.groupingBy(stage -> stage.getCrop().getId()));
    }

    public StageInsight resolveStageFromStages(List<CropStage> stages, long daysSincePlanting, Locale locale) {
        CropStage stage = stages.stream()
                .filter(item -> daysSincePlanting >= item.getMinDay() && daysSincePlanting <= item.getMaxDay())
                .findFirst()
                .orElseGet(() -> stages.isEmpty() ? null : stages.get(stages.size() - 1));

        if (stage == null) {
            return new StageInsight(null, "Monitoreo",
                    "Monitoreo",
                    "Observa el cultivo y revisa su avance diario.",
                    daysSincePlanting);
        }

        return new StageInsight(
                stage.getId(),
                stage.getName(),
                stage.getName(),
                stage.getDescription(),
                daysSincePlanting
        );
    }
}
