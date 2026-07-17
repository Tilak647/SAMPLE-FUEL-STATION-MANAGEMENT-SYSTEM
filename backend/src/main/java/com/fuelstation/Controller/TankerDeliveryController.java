package com.fuelstation.Controller;

import com.fuelstation.Entity.TankerDelivery;
import com.fuelstation.Service.TankerDeliveryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deliveries")
@CrossOrigin("*")
public class TankerDeliveryController {

    private final TankerDeliveryService tankerDeliveryService;

    public TankerDeliveryController(TankerDeliveryService tankerDeliveryService) {
        this.tankerDeliveryService = tankerDeliveryService;
    }

    @GetMapping
    public List<TankerDelivery> getAllDeliveries() {
        return tankerDeliveryService.getAllDeliveries();
    }

    @PostMapping
    public TankerDelivery recordDelivery(@RequestBody TankerDelivery delivery) {
        return tankerDeliveryService.recordDelivery(delivery);
    }
}
