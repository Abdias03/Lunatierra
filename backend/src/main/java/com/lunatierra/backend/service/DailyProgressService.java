package com.lunatierra.backend.service;

import com.lunatierra.backend.dto.DailyProgressResponse;
import com.lunatierra.backend.model.User;
import com.lunatierra.backend.repository.UserRepository;
import java.time.LocalDate;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class DailyProgressService {

    private final UserRepository userRepository;

    public DailyProgressService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public DailyProgressResponse getProgress(Long userId) {
        User user = getUser(userId);
        LocalDate today = LocalDate.now();
        LocalDate lastCheckDate = user.getLastCheckDate();
        boolean checkedToday = today.equals(lastCheckDate);

        return new DailyProgressResponse(
                resolveEffectiveStreak(user.getStreakCount(), lastCheckDate, today),
                lastCheckDate,
                checkedToday
        );
    }

    @Transactional
    public DailyProgressResponse registerCheckIn(Long userId) {
        User user = getUser(userId);
        LocalDate today = LocalDate.now();
        LocalDate lastCheckDate = user.getLastCheckDate();

        if (today.equals(lastCheckDate)) {
            return new DailyProgressResponse(user.getStreakCount(), lastCheckDate, true);
        }

        int nextStreak = 1;
        if (today.minusDays(1).equals(lastCheckDate)) {
            nextStreak = safeStreak(user.getStreakCount()) + 1;
        }

        user.setStreakCount(nextStreak);
        user.setLastCheckDate(today);
        User savedUser = userRepository.save(user);

        return new DailyProgressResponse(savedUser.getStreakCount(), savedUser.getLastCheckDate(), true);
    }

    private int resolveEffectiveStreak(Integer storedStreak, LocalDate lastCheckDate, LocalDate today) {
        if (lastCheckDate == null) {
            return 0;
        }

        if (today.equals(lastCheckDate) || today.minusDays(1).equals(lastCheckDate)) {
            return safeStreak(storedStreak);
        }

        return 0;
    }

    private int safeStreak(Integer streakCount) {
        return streakCount != null ? streakCount : 0;
    }

    private User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
    }
}
