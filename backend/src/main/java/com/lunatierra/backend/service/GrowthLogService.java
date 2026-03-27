package com.lunatierra.backend.service;

import com.lunatierra.backend.dto.GrowthLogResponse;
import com.lunatierra.backend.model.GrowthLog;
import com.lunatierra.backend.model.UserCrop;
import com.lunatierra.backend.repository.GrowthLogRepository;
import com.lunatierra.backend.repository.UserCropRepository;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@Service
public class GrowthLogService {

    private static final String UPLOAD_DIR = "uploads/growth-photos/";

    private final GrowthLogRepository growthLogRepository;
    private final UserCropRepository userCropRepository;

    public GrowthLogService(GrowthLogRepository growthLogRepository, UserCropRepository userCropRepository) {
        this.growthLogRepository = growthLogRepository;
        this.userCropRepository = userCropRepository;
        createUploadDirectory();
    }

    public GrowthLogResponse uploadPhoto(Long userId, Long userCropId, MultipartFile file, String description) {
        UserCrop userCrop = userCropRepository.findByIdAndUser_Id(userCropId, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Crop not found"));

        if (file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File is empty");
        }

        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(UPLOAD_DIR + fileName);

        try {
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to save file");
        }

        GrowthLog growthLog = new GrowthLog(userCrop, "/uploads/growth-photos/" + fileName, description);
        GrowthLog saved = growthLogRepository.save(growthLog);

        return toResponse(saved);
    }

    public List<GrowthLogResponse> getPhotosByUserCrop(Long userId, Long userCropId) {
        UserCrop userCrop = userCropRepository.findByIdAndUser_Id(userCropId, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Crop not found"));

        List<GrowthLog> logs = growthLogRepository.findAllByUserCrop_IdOrderByCreatedAtDesc(userCropId);
        return logs.stream().map(this::toResponse).toList();
    }

    public void deletePhoto(Long userId, Long userCropId, Long growthLogId) {
        GrowthLog growthLog = growthLogRepository.findByIdAndUserCrop_IdAndUserCrop_User_Id(growthLogId, userCropId, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Growth photo not found"));

        deletePhysicalFileIfExists(growthLog.getImageUrl());
        growthLogRepository.delete(growthLog);
    }

    private GrowthLogResponse toResponse(GrowthLog growthLog) {
        return new GrowthLogResponse(
                growthLog.getId(),
                growthLog.getUserCrop().getId(),
                growthLog.getImageUrl(),
                growthLog.getDescription(),
                growthLog.getCreatedAt()
        );
    }

    private void createUploadDirectory() {
        try {
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory", e);
        }
    }

    private void deletePhysicalFileIfExists(String imageUrl) {
        if (imageUrl == null || imageUrl.isBlank()) {
            return;
        }

        String relativePath = imageUrl.startsWith("/") ? imageUrl.substring(1) : imageUrl;
        Path filePath = Paths.get(relativePath);

        try {
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to delete file");
        }
    }
}
