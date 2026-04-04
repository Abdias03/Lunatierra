package com.lunatierra.backend.util;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

public class DateUtil {

    public static int calculateDaysSincePlanting(LocalDate plantingDate, LocalDate currentDate) {
        if (plantingDate == null || currentDate == null) {
            return 0;
        }
        return (int) ChronoUnit.DAYS.between(plantingDate, currentDate);
    }

    public static int calculateDaysSincePlanting(LocalDate plantingDate) {
        return calculateDaysSincePlanting(plantingDate, LocalDate.now());
    }

    public static int calculateMonthsSincePlanting(LocalDate plantingDate, LocalDate currentDate) {
        if (plantingDate == null || currentDate == null) {
            return 0;
        }
        return (int) ChronoUnit.MONTHS.between(plantingDate, currentDate);
    }

    public static int calculateMonthsSincePlanting(LocalDate plantingDate) {
        return calculateMonthsSincePlanting(plantingDate, LocalDate.now());
    }

    private DateUtil() {
        throw new AssertionError();
    }
}
