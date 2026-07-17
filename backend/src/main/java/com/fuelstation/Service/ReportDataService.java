package com.fuelstation.Service;

import com.fuelstation.DTO.ReportDataDTO;
import com.fuelstation.Entity.Sale;
import com.fuelstation.Repository.FuelRepository;
import com.fuelstation.Repository.SaleRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ReportDataService {

    private final SaleRepository saleRepository;
    private final FuelRepository fuelRepository;

    public ReportDataService(SaleRepository saleRepository, FuelRepository fuelRepository) {
        this.saleRepository = saleRepository;
        this.fuelRepository = fuelRepository;
    }

    public ReportDataDTO generateReportData(LocalDateTime startDate, LocalDateTime endDate, String reportType) {
        List<Sale> sales = saleRepository.findBySaleDateBetween(startDate, endDate);

        ReportDataDTO dto = new ReportDataDTO();
        dto.setReportType(reportType);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
        dto.setStartDate(startDate.format(formatter));
        dto.setEndDate(endDate.format(formatter));

        double totalRevenue = 0;
        double petrolSold = 0;
        double dieselSold = 0;
        Map<Integer, Integer> hourCounts = new HashMap<>();

        for (Sale sale : sales) {
            double amount = sale.getAmount() != null ? sale.getAmount() : 0;
            double liters = sale.getLiters() != null ? sale.getLiters() : 0;

            totalRevenue += amount;

            if ("Petrol".equalsIgnoreCase(sale.getFuelType())) {
                petrolSold += liters;
            } else if ("Diesel".equalsIgnoreCase(sale.getFuelType())) {
                dieselSold += liters;
            }

            int hour = sale.getSaleDate().getHour();
            hourCounts.put(hour, hourCounts.getOrDefault(hour, 0) + 1);
        }

        dto.setTotalRevenue(totalRevenue);
        dto.setTotalSales(sales.size());
        dto.setNumberOfBills(sales.size());
        dto.setPetrolSold(petrolSold);
        dto.setDieselSold(dieselSold);

        if (sales.isEmpty()) {
            dto.setAverageSaleValue(0);
            dto.setPeakSalesHour("N/A");
            dto.setBestSellingFuel("N/A");
        } else {
            dto.setAverageSaleValue(totalRevenue / sales.size());

            int peakHour = hourCounts.entrySet().stream()
                    .max(Map.Entry.comparingByValue())
                    .map(Map.Entry::getKey)
                    .orElse(-1);
            if (peakHour != -1) {
                dto.setPeakSalesHour(String.format("%02d:00 - %02d:00", peakHour, peakHour + 1));
            } else {
                dto.setPeakSalesHour("N/A");
            }

            if (petrolSold > dieselSold) {
                dto.setBestSellingFuel("Petrol");
            } else if (dieselSold > petrolSold) {
                dto.setBestSellingFuel("Diesel");
            } else {
                dto.setBestSellingFuel("Equal (Petrol & Diesel)");
            }
        }

        Double petrolStock = fuelRepository.getPetrolStock();
        Double dieselStock = fuelRepository.getDieselStock();
        dto.setRemainingPetrolStock(petrolStock != null ? petrolStock : 0.0);
        dto.setRemainingDieselStock(dieselStock != null ? dieselStock : 0.0);

        Map<String, Double> revenueComparison = new HashMap<>();
        revenueComparison.put("Petrol", sales.stream().filter(s -> "Petrol".equalsIgnoreCase(s.getFuelType())).mapToDouble(Sale::getAmount).sum());
        revenueComparison.put("Diesel", sales.stream().filter(s -> "Diesel".equalsIgnoreCase(s.getFuelType())).mapToDouble(Sale::getAmount).sum());
        dto.setRevenueComparison(revenueComparison);

        return dto;
    }
}
