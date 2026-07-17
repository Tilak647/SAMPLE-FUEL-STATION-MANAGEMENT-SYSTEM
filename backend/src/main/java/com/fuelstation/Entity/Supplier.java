package com.fuelstation.Entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "suppliers")
public class Supplier {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String contactPerson;
    private String contactNumber;
    private String email;
    private String address;
    private String gstNumber;
    
    // Performance score out of 100
    private Integer performanceScore = 100;
    
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (performanceScore == null) {
            performanceScore = 100;
        }
    }
}
