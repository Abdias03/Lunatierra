package com.lunatierra.backend.model;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class UserCrop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "crop_id", nullable = false)
    private Crop crop;

    private LocalDate plantingDate;

    private Boolean waterAvailable;

    public UserCrop() {
    }

    public UserCrop(User user, Crop crop, LocalDate plantingDate, Boolean waterAvailable) {
        this.user = user;
        this.crop = crop;
        this.plantingDate = plantingDate;
        this.waterAvailable = waterAvailable;
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Crop getCrop() {
        return crop;
    }

    public void setCrop(Crop crop) {
        this.crop = crop;
    }

    public LocalDate getPlantingDate() {
        return plantingDate;
    }

    public void setPlantingDate(LocalDate plantingDate) {
        this.plantingDate = plantingDate;
    }

    public Boolean getWaterAvailable() {
        return waterAvailable;
    }

    public void setWaterAvailable(Boolean waterAvailable) {
        this.waterAvailable = waterAvailable;
    }
}
