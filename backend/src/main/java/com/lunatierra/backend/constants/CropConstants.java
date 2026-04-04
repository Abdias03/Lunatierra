package com.lunatierra.backend.constants;

public class CropConstants {
    public static final String CROP_NOT_FOUND = "Crop not found";
    public static final String CROP_STAGE_NOT_FOUND = "Crop stage not found";
    public static final String USER_CROP_NOT_FOUND = "User crop not found";
    public static final String RECOMMENDATION_NOT_FOUND = "Recommendation not found";
    public static final String LUNAR_ACTIVITY_NOT_FOUND = "Lunar activity not found";

    // Crop codes
    public static final String CROP_CODE_CORN = "corn";
    public static final String CROP_CODE_BEANS = "beans";
    public static final String CROP_CODE_SQUASH = "squash";

    // Days thresholds for stage determination
    public static final int DEFAULT_MIN_STAGE_DAYS = 0;
    public static final int DEFAULT_MAX_STAGE_DAYS = Integer.MAX_VALUE;

    private CropConstants() {
        throw new AssertionError();
    }
}
