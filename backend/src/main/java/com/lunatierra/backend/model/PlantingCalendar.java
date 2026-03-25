package com.lunatierra.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;

@Entity
@Table(name = "planting_calendar", indexes = {
        @Index(name = "idx_planting_calendar_lookup", columnList = "month,lunar_phase")
})
public class PlantingCalendar {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "month", nullable = false)
    private Integer month;

    @Column(name = "lunar_phase", nullable = false, length = 50)
    private String lunarPhase;

    @Column(name = "crop_code", nullable = false, length = 50)
    private String cropCode;

    protected PlantingCalendar() {
    }

    public PlantingCalendar(Integer month, String lunarPhase, String cropCode) {
        this.month = month;
        this.lunarPhase = lunarPhase;
        this.cropCode = cropCode;
    }

    public Long getId() {
        return id;
    }

    public Integer getMonth() {
        return month;
    }

    public String getLunarPhase() {
        return lunarPhase;
    }

    public String getCropCode() {
        return cropCode;
    }
}
