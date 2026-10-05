package com.fuelstation.Config;

import com.fuelstation.Entity.Sale;
import com.fuelstation.Service.SaleService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Random;

@Component
public class SimulationScheduler {

    private final SaleService saleService;
    private final Random random = new Random();

    public SimulationScheduler(SaleService saleService) {
        this.saleService = saleService;
    }

    // Run every 2 minutes
    @Scheduled(fixedRate = 120000)
    public void simulateCustomerSale() {
        System.out.println("--- SIMULATION: Generating Automatic Customer Sale ---");
        
        try {
            boolean isPetrol = random.nextBoolean();
            String fuelType = isPetrol ? "Petrol" : "Diesel";
            
            // Random amount between 2 to 20 liters
            double liters = 2.0 + (random.nextDouble() * 18.0);
            
            // Generate dummy customer name
            String customerName = "Auto-Customer-" + (1000 + random.nextInt(9000));
            
            Sale sale = new Sale();
            sale.setCustomerName(customerName);
            sale.setFuelType(fuelType);
            sale.setLiters(Math.round(liters * 100.0) / 100.0);
            sale.setSaleDate(LocalDateTime.now());
            
            saleService.save(sale);
            
            System.out.println("SIMULATION SUCCESS: Sold " + sale.getLiters() + "L of " + fuelType + " to " + customerName);
        } catch (Exception e) {
            System.err.println("SIMULATION ERROR: " + e.getMessage());
        }
    }
}
