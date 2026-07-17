package com.fuelstation.Controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.fuelstation.Entity.Fuel;
import com.fuelstation.Repository.FuelRepository;

@RestController
@RequestMapping("/api/fuel")
@CrossOrigin(origins = "http://localhost:3000")
public class FuelController {

    private final FuelRepository repository;

    public FuelController(FuelRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Fuel> getFuel() {
        return repository.findAll();
    }

    @PostMapping
    public Fuel addFuel(
            @RequestBody Fuel fuel) {

        return repository.save(fuel);
    }

@DeleteMapping("/{id}")
public String deleteFuel(@PathVariable Long id) {

        repository.deleteById(id);

        return "Fuel Deleted Successfully";
    }
}