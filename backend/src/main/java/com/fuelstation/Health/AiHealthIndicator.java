package com.fuelstation.Health;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Component;

@Component
public class AiHealthIndicator implements HealthIndicator {

    @Value("${gemini.api.key:}")
    private String geminiApiKey;

    @Override
    public Health health() {
        if (geminiApiKey != null && !geminiApiKey.trim().isEmpty()) {
            return Health.up().withDetail("status", "Available").withDetail("provider", "Gemini API").build();
        }
        return Health.up().withDetail("status", "Available (Mock Mode)").withDetail("provider", "Local Mock").build();
    }
}
