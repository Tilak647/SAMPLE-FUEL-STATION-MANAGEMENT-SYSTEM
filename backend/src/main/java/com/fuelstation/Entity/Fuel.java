package com.fuelstation.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "fuel_inventory")
public class Fuel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fuelType;
    private Double quantity;
    private Double pricePerLiter;
    private String supplier;
    private Double minimumThreshold = 500.0; // Default threshold
    private Double reorderQuantity = 2000.0; // Default reorder amount

    public Fuel() {}

    public Long getId() {
        return id;
    }

    public String getFuelType() {
        return fuelType;
    }

    public void setFuelType(String fuelType) {
        this.fuelType = fuelType;
    }

    public Double getQuantity() {
        return quantity;
    }

    public void setQuantity(Double quantity) {
        this.quantity = quantity;
    }

    public Double getPricePerLiter() {
        return pricePerLiter;
    }

    public void setPricePerLiter(Double pricePerLiter) {
        this.pricePerLiter = pricePerLiter;
    }

    public String getSupplier() {
        return supplier;
    }

    public void setSupplier(String supplier) {
        this.supplier = supplier;
    }

    public Double getMinimumThreshold() {
        return minimumThreshold;
    }

    public void setMinimumThreshold(Double minimumThreshold) {
        this.minimumThreshold = minimumThreshold;
    }

    public Double getReorderQuantity() {
        return reorderQuantity;
    }

    public void setReorderQuantity(Double reorderQuantity) {
        this.reorderQuantity = reorderQuantity;
    }
}