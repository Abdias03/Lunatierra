package com.lunatierra.backend.model;

public enum CropGrowthStage {
    SEED("Seed", "Semilla"),
    GERMINATION("Germination", "Germinación"),
    VEGETATIVE("Vegetative growth", "Crecimiento vegetativo"),
    FLOWERING("Flowering", "Floración"),
    HARVEST("Harvest", "Cosecha");

    private final String nameEn;
    private final String nameEs;

    CropGrowthStage(String nameEn, String nameEs) {
        this.nameEn = nameEn;
        this.nameEs = nameEs;
    }

    public String getNameEn() {
        return nameEn;
    }

    public String getNameEs() {
        return nameEs;
    }

    public static CropGrowthStage fromIndex(int index) {
        if (index <= 0) {
            return SEED;
        }
        if (index >= values().length) {
            return HARVEST;
        }
        return values()[index];
    }
}