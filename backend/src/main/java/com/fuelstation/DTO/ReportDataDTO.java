package com.fuelstation.DTO;

import java.util.Map;

public class ReportDataDTO {
    private String reportType;
    private String startDate;
    private String endDate;
    private double totalRevenue;
    private int totalSales;
    private double petrolSold;
    private double dieselSold;
    private double remainingPetrolStock;
    private double remainingDieselStock;
    private double averageSaleValue;
    private String bestSellingFuel;
    private String peakSalesHour;
    private int numberOfBills;
    private Map<String, Double> revenueComparison; // Optional, e.g., Petrol vs Diesel

    // Getters and Setters
    public String getReportType() { return reportType; }
    public void setReportType(String reportType) { this.reportType = reportType; }

    public String getStartDate() { return startDate; }
    public void setStartDate(String startDate) { this.startDate = startDate; }

    public String getEndDate() { return endDate; }
    public void setEndDate(String endDate) { this.endDate = endDate; }

    public double getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(double totalRevenue) { this.totalRevenue = totalRevenue; }

    public int getTotalSales() { return totalSales; }
    public void setTotalSales(int totalSales) { this.totalSales = totalSales; }

    public double getPetrolSold() { return petrolSold; }
    public void setPetrolSold(double petrolSold) { this.petrolSold = petrolSold; }

    public double getDieselSold() { return dieselSold; }
    public void setDieselSold(double dieselSold) { this.dieselSold = dieselSold; }

    public double getRemainingPetrolStock() { return remainingPetrolStock; }
    public void setRemainingPetrolStock(double remainingPetrolStock) { this.remainingPetrolStock = remainingPetrolStock; }

    public double getRemainingDieselStock() { return remainingDieselStock; }
    public void setRemainingDieselStock(double remainingDieselStock) { this.remainingDieselStock = remainingDieselStock; }

    public double getAverageSaleValue() { return averageSaleValue; }
    public void setAverageSaleValue(double averageSaleValue) { this.averageSaleValue = averageSaleValue; }

    public String getBestSellingFuel() { return bestSellingFuel; }
    public void setBestSellingFuel(String bestSellingFuel) { this.bestSellingFuel = bestSellingFuel; }

    public String getPeakSalesHour() { return peakSalesHour; }
    public void setPeakSalesHour(String peakSalesHour) { this.peakSalesHour = peakSalesHour; }

    public int getNumberOfBills() { return numberOfBills; }
    public void setNumberOfBills(int numberOfBills) { this.numberOfBills = numberOfBills; }

    public Map<String, Double> getRevenueComparison() { return revenueComparison; }
    public void setRevenueComparison(Map<String, Double> revenueComparison) { this.revenueComparison = revenueComparison; }
}
