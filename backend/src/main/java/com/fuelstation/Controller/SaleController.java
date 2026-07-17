package com.fuelstation.Controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import com.fuelstation.Entity.Sale;
import com.fuelstation.Service.SaleService;
import com.fuelstation.DTO.RevenueDTO;
@RestController
@RequestMapping("/api/sales")
@CrossOrigin(origins = "http://localhost:3000")
public class SaleController {

    private final SaleService service;
    public SaleController(SaleService service) {
        this.service = service;

    }
    @GetMapping

    public List<Sale> getAllSales() {

        return service.getAllSales();

    }

    @PostMapping
public Sale addSale(@RequestBody Sale sale) {

    System.out.println("Bill No : " + sale.getBillNo());
    System.out.println("Customer : " + sale.getCustomerName());
    System.out.println("Fuel : " + sale.getFuelType());

    return service.save(sale);
}

    @DeleteMapping("/{id}")
public void deleteSale(@PathVariable Long id) {
    service.deleteSale(id);
}

    @GetMapping("/recent")
public List<Sale> getRecentSales() {
    return service.getRecentSales();
}

@GetMapping("/revenue-chart")
public List<RevenueDTO> getRevenueChart() {
    return service.getRevenueChart();
}
}