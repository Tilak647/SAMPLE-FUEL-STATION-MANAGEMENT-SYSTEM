package com.fuelstation.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.fuelstation.Entity.Fuel;

public interface FuelRepository extends JpaRepository<Fuel, Long> {

        @Query("SELECT COALESCE(SUM(f.quantity),0) FROM Fuel f WHERE f.fuelType='Petrol'")
        Double getPetrolStock();

        @Query("SELECT COALESCE(SUM(f.quantity),0) FROM Fuel f WHERE f.fuelType='Diesel'")
        Double getDieselStock();

        Optional<Fuel> findFirstByFuelType(String fuelType);
}