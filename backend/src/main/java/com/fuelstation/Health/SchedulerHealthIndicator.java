package com.fuelstation.Health;

import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Component;

@Component
public class SchedulerHealthIndicator implements HealthIndicator {

    @Override
    public Health health() {
        // Simple check to indicate scheduler is configured and loaded in context
        return Health.up().withDetail("status", "Active").withDetail("jobs", "Daily, Weekly, Monthly Reports").build();
    }
}
