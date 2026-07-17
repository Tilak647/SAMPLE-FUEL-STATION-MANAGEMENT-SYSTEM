package com.fuelstation.DTO;

public class RevenueDTO {

    private String fuelType;
    private Double revenue;

    public RevenueDTO(String fuelType, Double revenue) {
        this.fuelType = fuelType;
        this.revenue = revenue;
    }

    public String getFuelType() {
        return fuelType;
    }

    public void setFuelType(String fuelType) {
        this.fuelType = fuelType;
    }

    public Double getRevenue() {
        return revenue;
    }

    public void setRevenue(Double revenue) {
        this.revenue = revenue;
    }
}