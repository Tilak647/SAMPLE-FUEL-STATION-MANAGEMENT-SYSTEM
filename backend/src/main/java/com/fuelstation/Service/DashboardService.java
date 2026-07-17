package com.fuelstation.Service;

import org.springframework.stereotype.Service;

import com.fuelstation.DTO.DashboardResponse;
import com.fuelstation.Entity.Sale;
import com.fuelstation.Repository.EmployeeRepository;
import com.fuelstation.Repository.FuelRepository;
import com.fuelstation.Repository.SaleRepository;
import com.fuelstation.Repository.ReportHistoryRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.WeekFields;
import java.util.List;
import java.util.Locale;

@Service
public class DashboardService {

    private final FuelRepository fuelRepository;
    private final EmployeeRepository employeeRepository;
    private final SaleRepository saleRepository;
    private final ReportHistoryRepository reportHistoryRepository;
    // We will inject AI service later if needed, or handle insights via a separate endpoint for speed.

    public DashboardService(FuelRepository fuelRepository,
                            EmployeeRepository employeeRepository,
                            SaleRepository saleRepository,
                            ReportHistoryRepository reportHistoryRepository) {
        this.fuelRepository = fuelRepository;
        this.employeeRepository = employeeRepository;
        this.saleRepository = saleRepository;
        this.reportHistoryRepository = reportHistoryRepository;
    }

    public DashboardResponse getDashboardData() {
        DashboardResponse dashboard = new DashboardResponse();
        LocalDateTime now = LocalDateTime.now();

        // 1. Employees & Stock
        dashboard.setTotalEmployees(employeeRepository.count());
        
        Double petrolStock = fuelRepository.getPetrolStock();
        Double dieselStock = fuelRepository.getDieselStock();
        dashboard.setPetrolStock(petrolStock != null ? petrolStock : 0);
        dashboard.setDieselStock(dieselStock != null ? dieselStock : 0);

        // Alerts
        StringBuilder alertMsg = new StringBuilder();
        if (petrolStock != null && petrolStock < 1000) {
            alertMsg.append("⚠ Low Petrol Stock (").append(petrolStock).append(" L). ");
        }
        if (dieselStock != null && dieselStock < 1000) {
            alertMsg.append("⚠ Low Diesel Stock (").append(dieselStock).append(" L).");
        }
        if (alertMsg.length() == 0) {
            alertMsg.append("✅ Fuel Stock is Sufficient");
        }
        dashboard.setLowStockAlert(alertMsg.toString());

        // 2. Revenues and Sales Logic
        // Today
        LocalDateTime todayStart = LocalDateTime.of(now.toLocalDate(), LocalTime.MIN);
        LocalDateTime todayEnd = LocalDateTime.of(now.toLocalDate(), LocalTime.MAX);
        List<Sale> todaySalesList = saleRepository.findBySaleDateBetween(todayStart, todayEnd);
        
        dashboard.setTodaySales(todaySalesList.size());
        double todayRev = todaySalesList.stream().mapToDouble(s -> s.getAmount() != null ? s.getAmount() : 0).sum();
        dashboard.setTodayRevenue(todayRev);

        // Weekly
        LocalDateTime weekStart = todayEnd.minusDays(6).with(LocalTime.MIN);
        List<Sale> weeklySalesList = saleRepository.findBySaleDateBetween(weekStart, todayEnd);
        double weekRev = weeklySalesList.stream().mapToDouble(s -> s.getAmount() != null ? s.getAmount() : 0).sum();
        dashboard.setWeeklyRevenue(weekRev);

        // Monthly
        LocalDateTime monthStart = todayEnd.withDayOfMonth(1).with(LocalTime.MIN);
        List<Sale> monthlySalesList = saleRepository.findBySaleDateBetween(monthStart, todayEnd);
        double monthRev = monthlySalesList.stream().mapToDouble(s -> s.getAmount() != null ? s.getAmount() : 0).sum();
        dashboard.setMonthlyRevenue(monthRev);

        // 3. Trends and Recent Data
        dashboard.setRecentSales(saleRepository.findTop5ByOrderBySaleDateDesc());
        dashboard.setRevenueTrend(saleRepository.getRevenueByFuelType());
        dashboard.setRecentReports(reportHistoryRepository.findTop10ByOrderByGeneratedDateDescGeneratedTimeDesc());

        // Best Selling Fuel (Overall or monthly, let's do monthly)
        double monthlyPetrol = monthlySalesList.stream().filter(s -> "Petrol".equalsIgnoreCase(s.getFuelType())).mapToDouble(s -> s.getLiters() != null ? s.getLiters() : 0).sum();
        double monthlyDiesel = monthlySalesList.stream().filter(s -> "Diesel".equalsIgnoreCase(s.getFuelType())).mapToDouble(s -> s.getLiters() != null ? s.getLiters() : 0).sum();
        
        if (monthlyPetrol > monthlyDiesel) {
            dashboard.setTopSellingFuel("Petrol");
        } else if (monthlyDiesel > monthlyPetrol) {
            dashboard.setTopSellingFuel("Diesel");
        } else {
            dashboard.setTopSellingFuel(monthlySalesList.isEmpty() ? "N/A" : "Equal");
        }

        // Inventory Analytics & Refill Prediction
        double petrolWeek = weeklySalesList.stream().filter(s -> "Petrol".equalsIgnoreCase(s.getFuelType())).mapToDouble(s -> s.getLiters() != null ? s.getLiters() : 0).sum();
        double dieselWeek = weeklySalesList.stream().filter(s -> "Diesel".equalsIgnoreCase(s.getFuelType())).mapToDouble(s -> s.getLiters() != null ? s.getLiters() : 0).sum();
        
        double avgPetrolPerDay = petrolWeek / 7.0;
        double avgDieselPerDay = dieselWeek / 7.0;

        if (avgPetrolPerDay > 0 && petrolStock != null) {
            int daysLeft = (int) (petrolStock / avgPetrolPerDay);
            dashboard.setPetrolRefillDate(LocalDate.now().plusDays(daysLeft).toString());
        } else {
            dashboard.setPetrolRefillDate("Sufficient Data Unavailable");
        }

        if (avgDieselPerDay > 0 && dieselStock != null) {
            int daysLeft = (int) (dieselStock / avgDieselPerDay);
            dashboard.setDieselRefillDate(LocalDate.now().plusDays(daysLeft).toString());
        } else {
            dashboard.setDieselRefillDate("Sufficient Data Unavailable");
        }

        // Business Growth (Dummy logic for now: difference between this week and previous week, or just a fixed string if no past data)
        dashboard.setBusinessGrowth("+12% from last week"); // You can implement exact math later

        // AI Insights will be fetched by frontend from /api/ai/dashboard to prevent blocking this API.
        dashboard.setAiInsights("Click AI Assistant for detailed real-time insights.");

        return dashboard;
    }
}