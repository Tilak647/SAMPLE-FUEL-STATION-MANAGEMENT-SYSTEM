package com.fuelstation.Service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.fuelstation.Entity.Fuel;
import com.fuelstation.Repository.FuelRepository;

@Service
public class FuelService {

    private final FuelRepository repository;
    private final SseService sseService;

    public FuelService(FuelRepository repository, SseService sseService) {
        this.repository = repository;
        this.sseService = sseService;
    }

    public List<Fuel> getAllFuel() {
        return repository.findAll();
    }

    public Fuel save(Fuel fuel) {
        Fuel saved = repository.save(fuel);
        sseService.sendEvent("dashboard-refresh", "Fuel Inventory Updated");
        sseService.sendEvent("notification", "Fuel Stock Updated for " + fuel.getFuelType());
        return saved;
    }

    public void delete(Long id) {
        repository.deleteById(id);
        sseService.sendEvent("dashboard-refresh", "Fuel Inventory Deleted");
    }
}