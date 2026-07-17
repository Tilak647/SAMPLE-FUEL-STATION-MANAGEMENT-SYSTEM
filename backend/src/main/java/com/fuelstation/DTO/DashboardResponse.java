package com.fuelstation.DTO;

import java.util.List;
import com.fuelstation.Entity.Sale;
import com.fuelstation.Entity.ReportHistory;

public class DashboardResponse {

    private double todayRevenue;
    private long todaySales;
    private double weeklyRevenue;
    private double monthlyRevenue;

    private double petrolStock;
    private double dieselStock;
    private long totalEmployees;

    private List<Sale> recentSales;
    private String topSellingFuel;
    private String businessGrowth;
    
    private List<RevenueDTO> revenueTrend;
    private String lowStockAlert;
    
    private String petrolRefillDate;
    private String dieselRefillDate;

    private List<ReportHistory> recentReports;
    private String aiInsights;

    // Getters and Setters

    public double getTodayRevenue() { return todayRevenue; }
    public void setTodayRevenue(double todayRevenue) { this.todayRevenue = todayRevenue; }

    public long getTodaySales() { return todaySales; }
    public void setTodaySales(long todaySales) { this.todaySales = todaySales; }

    public double getWeeklyRevenue() { return weeklyRevenue; }
    public void setWeeklyRevenue(double weeklyRevenue) { this.weeklyRevenue = weeklyRevenue; }

    public double getMonthlyRevenue() { return monthlyRevenue; }
    public void setMonthlyRevenue(double monthlyRevenue) { this.monthlyRevenue = monthlyRevenue; }

    public double getPetrolStock() { return petrolStock; }
    public void setPetrolStock(double petrolStock) { this.petrolStock = petrolStock; }

    public double getDieselStock() { return dieselStock; }
    public void setDieselStock(double dieselStock) { this.dieselStock = dieselStock; }

    public long getTotalEmployees() { return totalEmployees; }
    public void setTotalEmployees(long totalEmployees) { this.totalEmployees = totalEmployees; }

    public List<Sale> getRecentSales() { return recentSales; }
    public void setRecentSales(List<Sale> recentSales) { this.recentSales = recentSales; }

    public String getTopSellingFuel() { return topSellingFuel; }
    public void setTopSellingFuel(String topSellingFuel) { this.topSellingFuel = topSellingFuel; }

    public String getBusinessGrowth() { return businessGrowth; }
    public void setBusinessGrowth(String businessGrowth) { this.businessGrowth = businessGrowth; }

    public List<RevenueDTO> getRevenueTrend() { return revenueTrend; }
    public void setRevenueTrend(List<RevenueDTO> revenueTrend) { this.revenueTrend = revenueTrend; }

    public String getLowStockAlert() { return lowStockAlert; }
    public void setLowStockAlert(String lowStockAlert) { this.lowStockAlert = lowStockAlert; }

    public String getPetrolRefillDate() { return petrolRefillDate; }
    public void setPetrolRefillDate(String petrolRefillDate) { this.petrolRefillDate = petrolRefillDate; }

    public String getDieselRefillDate() { return dieselRefillDate; }
    public void setDieselRefillDate(String dieselRefillDate) { this.dieselRefillDate = dieselRefillDate; }

    public List<ReportHistory> getRecentReports() { return recentReports; }
    public void setRecentReports(List<ReportHistory> recentReports) { this.recentReports = recentReports; }

    public String getAiInsights() { return aiInsights; }
    public void setAiInsights(String aiInsights) { this.aiInsights = aiInsights; }
}