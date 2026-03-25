package com.lunatierra.backend.repository;

import com.lunatierra.backend.model.PlantingCalendar;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlantingCalendarRepository extends JpaRepository<PlantingCalendar, Long> {

    List<PlantingCalendar> findByMonthAndLunarPhaseOrderByIdAsc(Integer month, String lunarPhase);
}
