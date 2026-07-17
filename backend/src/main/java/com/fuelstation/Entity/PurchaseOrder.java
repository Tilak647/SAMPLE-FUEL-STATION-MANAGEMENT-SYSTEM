package com.fuelstation.Entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "purchase_orders")
public class PurchaseOrder {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "supplier_id", nullable = false)
    private Supplier supplier;
    
    private String fuelType;
    private Double quantityLiters;
    private Double pricePerLiter;
    private Double totalCost;
    
    private String status = "PENDING"; // PENDING, APPROVED, REJECTED, COMPLETED
    
    private LocalDateTime orderDate = LocalDateTime.now();
    private LocalDateTime expectedDeliveryDate;
    
    @PrePersist
    protected void onCreate() {
        orderDate = LocalDateTime.now();
        if (totalCost == null && quantityLiters != null && pricePerLiter != null) {
            totalCost = quantityLiters * pricePerLiter;
        }
    }
}
