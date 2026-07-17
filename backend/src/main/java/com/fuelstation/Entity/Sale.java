package com.fuelstation.Entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "sales")
public class Sale {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "bill_no")
    private String billNo;

    @Column(name = "fuel_type")
    private String fuelType;

    @Column(name = "customer_name")
    private String customerName;

    private Double liters;

    private Double amount;

    @Column(name = "tax_amount")
    private Double taxAmount = 0.0;

    @Column(name = "sale_date")
    private LocalDateTime saleDate = LocalDateTime.now();

    // Default Constructor
    public Sale() {
    }

    // Parameterized Constructor
    public Sale(Long id, String billNo, String fuelType, String customerName,
                Double liters, Double amount, LocalDateTime saleDate) {
        this.id = id;
        this.billNo = billNo;
        this.fuelType = fuelType;
        this.customerName = customerName;
        this.liters = liters;
        this.amount = amount;
        this.saleDate = saleDate;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBillNo() {
        return billNo;
    }

    public void setBillNo(String billNo) {
        this.billNo = billNo;
    }

    public String getFuelType() {
        return fuelType;
    }

    public void setFuelType(String fuelType) {
        this.fuelType = fuelType;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public Double getLiters() {
        return liters;
    }

    public void setLiters(Double liters) {
        this.liters = liters;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public Double getTaxAmount() {
        return taxAmount;
    }

    public void setTaxAmount(Double taxAmount) {
        this.taxAmount = taxAmount;
    }

    public LocalDateTime getSaleDate() {
        return saleDate;
    }

    public void setSaleDate(LocalDateTime saleDate) {
        this.saleDate = saleDate;
    }
}