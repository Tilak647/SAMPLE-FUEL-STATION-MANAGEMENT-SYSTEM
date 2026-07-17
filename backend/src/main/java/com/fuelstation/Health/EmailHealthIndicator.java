package com.fuelstation.Health;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Component;
import java.net.Socket;

@Component
public class EmailHealthIndicator implements HealthIndicator {

    @Value("${spring.mail.host:smtp.gmail.com}")
    private String host;

    @Value("${spring.mail.port:587}")
    private int port;

    @Override
    public Health health() {
        try (Socket socket = new Socket(host, port)) {
            return Health.up().withDetail("status", "Available").withDetail("host", host).build();
        } catch (Exception e) {
            return Health.down().withDetail("status", "Unavailable").withDetail("error", e.getMessage()).build();
        }
    }
}
