package com.fuelstation.DTO;

import java.util.List;

public class AIBusinessIntelligenceDTO {

    private int businessHealthScore;
    private String dailyBusinessSummary;
    private String weeklyBusinessSummary;
    private String monthlyBusinessSummary;
    private String revenuePrediction;
    private String fuelDemandPrediction;
    private String petrolRefillPrediction;
    private String dieselRefillPrediction;
    private String peakBusinessHours;
    private String slowBusinessHours;
    private String bestSellingFuel;
    private String worstSellingFuel;
    private double revenueGrowthPct;
    private double salesGrowthPct;
    private String fuelConsumptionTrend;
    private String profitAnalysis;
    private List<String> businessRecommendations;
    private String aiExecutiveSummary;

    // Getters and Setters

    public int getBusinessHealthScore() { return businessHealthScore; }
    public void setBusinessHealthScore(int businessHealthScore) { this.businessHealthScore = businessHealthScore; }

    public String getDailyBusinessSummary() { return dailyBusinessSummary; }
    public void setDailyBusinessSummary(String dailyBusinessSummary) { this.dailyBusinessSummary = dailyBusinessSummary; }

    public String getWeeklyBusinessSummary() { return weeklyBusinessSummary; }
    public void setWeeklyBusinessSummary(String weeklyBusinessSummary) { this.weeklyBusinessSummary = weeklyBusinessSummary; }

    public String getMonthlyBusinessSummary() { return monthlyBusinessSummary; }
    public void setMonthlyBusinessSummary(String monthlyBusinessSummary) { this.monthlyBusinessSummary = monthlyBusinessSummary; }

    public String getRevenuePrediction() { return revenuePrediction; }
    public void setRevenuePrediction(String revenuePrediction) { this.revenuePrediction = revenuePrediction; }

    public String getFuelDemandPrediction() { return fuelDemandPrediction; }
    public void setFuelDemandPrediction(String fuelDemandPrediction) { this.fuelDemandPrediction = fuelDemandPrediction; }

    public String getPetrolRefillPrediction() { return petrolRefillPrediction; }
    public void setPetrolRefillPrediction(String petrolRefillPrediction) { this.petrolRefillPrediction = petrolRefillPrediction; }

    public String getDieselRefillPrediction() { return dieselRefillPrediction; }
    public void setDieselRefillPrediction(String dieselRefillPrediction) { this.dieselRefillPrediction = dieselRefillPrediction; }

    public String getPeakBusinessHours() { return peakBusinessHours; }
    public void setPeakBusinessHours(String peakBusinessHours) { this.peakBusinessHours = peakBusinessHours; }

    public String getSlowBusinessHours() { return slowBusinessHours; }
    public void setSlowBusinessHours(String slowBusinessHours) { this.slowBusinessHours = slowBusinessHours; }

    public String getBestSellingFuel() { return bestSellingFuel; }
    public void setBestSellingFuel(String bestSellingFuel) { this.bestSellingFuel = bestSellingFuel; }

    public String getWorstSellingFuel() { return worstSellingFuel; }
    public void setWorstSellingFuel(String worstSellingFuel) { this.worstSellingFuel = worstSellingFuel; }

    public double getRevenueGrowthPct() { return revenueGrowthPct; }
    public void setRevenueGrowthPct(double revenueGrowthPct) { this.revenueGrowthPct = revenueGrowthPct; }

    public double getSalesGrowthPct() { return salesGrowthPct; }
    public void setSalesGrowthPct(double salesGrowthPct) { this.salesGrowthPct = salesGrowthPct; }

    public String getFuelConsumptionTrend() { return fuelConsumptionTrend; }
    public void setFuelConsumptionTrend(String fuelConsumptionTrend) { this.fuelConsumptionTrend = fuelConsumptionTrend; }

    public String getProfitAnalysis() { return profitAnalysis; }
    public void setProfitAnalysis(String profitAnalysis) { this.profitAnalysis = profitAnalysis; }

    public List<String> getBusinessRecommendations() { return businessRecommendations; }
    public void setBusinessRecommendations(List<String> businessRecommendations) { this.businessRecommendations = businessRecommendations; }

    public String getAiExecutiveSummary() { return aiExecutiveSummary; }
    public void setAiExecutiveSummary(String aiExecutiveSummary) { this.aiExecutiveSummary = aiExecutiveSummary; }
}
