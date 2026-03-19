package com.lunatierra.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Index;

@Table(name = "crop_stages", indexes = {
        @Index(name = "idx_crop_stage_crop_id", columnList = "crop_id"),
        @Index(name = "idx_crop_stage_name", columnList = "name"),
        @Index(name = "idx_crop_stage_crop_name", columnList = "crop_id, name")
})
@Entity
public class CropStage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "crop_id", nullable = false)
    private Crop crop;

    private String name;
    @Column(name = "min_day")
    private int minDay;
    @Column(name = "max_day")
    private int maxDay;
    private String description;

    public CropStage() {
    }

    public CropStage(Crop crop, String name, int minDay, int maxDay, String description) {
        this.crop = crop;
        this.name = name;
        this.minDay = minDay;
        this.maxDay = maxDay;
        this.description = description;
    }

    public Long getId() {
        return id;
    }

    public Crop getCrop() {
        return crop;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public int getMinDay() {
        return minDay;
    }

    public int getMaxDay() {
        return maxDay;
    }
}
