package com.lunatierra.backend.dto;

import java.util.List;

public class MigrateUserDataRequest {

    private List<MigrateCropItem> crops;

    public List<MigrateCropItem> getCrops() {
        return crops;
    }

    public void setCrops(List<MigrateCropItem> crops) {
        this.crops = crops;
    }
}
