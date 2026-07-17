package com.fuelstation.fuelstation_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.retry.annotation.EnableRetry;

@SpringBootApplication(scanBasePackages = "com.fuelstation")
@EntityScan(basePackages = "com.fuelstation.Entity")
@EnableJpaRepositories(basePackages = "com.fuelstation.Repository")
@EnableAsync
@EnableRetry
public class FuelstationBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(FuelstationBackendApplication.class, args);
    }
}