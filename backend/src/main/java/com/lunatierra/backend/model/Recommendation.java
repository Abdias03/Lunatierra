package com.lunatierra.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Index;

@Table(name = "recommendations", indexes = {
        @Index(name = "idx_recommendation_crop_id", columnList = "crop_id"),
        @Index(name = "idx_recommendation_stage_id", columnList = "stage_id"),
        @Index(name = "idx_recommendation_condition", columnList = "condition"),
        @Index(name = "idx_recommendation_active", columnList = "active"),
        @Index(name = "idx_recommendation_region_id", columnList = "region_id"),
        @Index(name = "idx_recommendation_lookup", columnList = "crop_id, stage_id, condition, active, region_id")
})
@Entity
public class Recommendation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "crop_id")
    private Crop crop;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "stage_id")
    private CropStage stage;

    @Column(name = "condition")
    private String condition;
    @Enumerated(EnumType.STRING)
    private RecommendationType type;
    private String message;
    @Column(name = "priority")
    private Integer priority;
    @Column(name = "version")
    private Integer version;
    private Boolean active;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "region_id")
    private Region region;

    public Recommendation() {
    }

    public Recommendation(Crop crop, CropStage stage, String condition, RecommendationType type,
                          String message, Integer priority, Integer version, Boolean active, Region region) {
        this.crop = crop;
        this.stage = stage;
        this.condition = condition;
        this.type = type;
        this.message = message;
        this.priority = priority;
        this.version = version;
        this.active = active;
        this.region = region;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Crop getCrop() {
        return crop;
    }

    public void setCrop(Crop crop) {
        this.crop = crop;
    }

    public CropStage getStage() {
        return stage;
    }

    public String getCondition() {
        return condition;
    }

    public void setCondition(String condition) {
        this.condition = condition;
    }

    public RecommendationType getType() {
        return type;
    }

    public void setType(RecommendationType type) {
        this.type = type;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Integer getPriority() {
        return priority;
    }

    public void setPriority(Integer priority) {
        this.priority = priority;
    }

    public Integer getVersion() {
        return version;
    }

    public void setVersion(Integer version) {
        this.version = version;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public Region getRegion() {
        return region;
    }

    public void setRegion(Region region) {
        this.region = region;
    }

    public void setStage(CropStage stage) {
        this.stage = stage;
    }
}
