package com.lunatierra.backend.repository;

import com.lunatierra.backend.model.LunarActivity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LunarActivityRepository extends JpaRepository<LunarActivity, Long> {

    List<LunarActivity> findByPhaseOrderByIdAsc(String phase);

    List<LunarActivity> findAllByOrderByPhaseAscIdAsc();
}
