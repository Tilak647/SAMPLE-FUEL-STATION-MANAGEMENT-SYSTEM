package com.fuelstation.Entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "tanker_deliveries")
public class TankerDelivery {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "purchase_order_id", nullable = false)
    private PurchaseOrder purchaseOrder;
    
    private String driverName;
    private String vehicleNumber;
    private Double litersDelivered;
    
    private LocalDateTime arrivalTime = LocalDateTime.now();
    
    private String status = "CONFIRMED";
    
    @PrePersist
    protected void onCreate() {
        arrivalTime = LocalDateTime.now();
    }
}
