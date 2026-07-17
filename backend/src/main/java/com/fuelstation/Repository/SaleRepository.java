package com.fuelstation.Repository;

import com.fuelstation.Entity.Sale;
import com.fuelstation.DTO.RevenueDTO;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface SaleRepository extends JpaRepository<Sale, Long> {

    // Total Revenue
    @Query("SELECT COALESCE(SUM(s.amount),0) FROM Sale s")
    Double getTotalRevenue();

    // Total Sales Count
    @Query("SELECT COUNT(s) FROM Sale s")
    Long getTotalSales();

    // Petrol Revenue
    @Query("SELECT COALESCE(SUM(s.amount),0) FROM Sale s WHERE s.fuelType='Petrol'")
    Double getPetrolRevenue();

    // Diesel Revenue
    @Query("SELECT COALESCE(SUM(s.amount),0) FROM Sale s WHERE s.fuelType='Diesel'")
    Double getDieselRevenue();

    // Petrol Litres Sold
    @Query("SELECT COALESCE(SUM(s.liters),0) FROM Sale s WHERE s.fuelType='Petrol'")
    Double getPetrolLitersSold();

    // Diesel Litres Sold
    @Query("SELECT COALESCE(SUM(s.liters),0) FROM Sale s WHERE s.fuelType='Diesel'")
    Double getDieselLitersSold();

    // ✅ Recent 5 Sales
    List<Sale> findTop5ByOrderBySaleDateDesc();

@Query("""
    SELECT new com.fuelstation.DTO.RevenueDTO(
        s.fuelType,
        SUM(s.amount)
    )
    FROM Sale s
    GROUP BY s.fuelType
""")
List<RevenueDTO> getRevenueByFuelType();

    // Sales within a date range
    List<Sale> findBySaleDateBetween(java.time.LocalDateTime startDate, java.time.LocalDateTime endDate);
}