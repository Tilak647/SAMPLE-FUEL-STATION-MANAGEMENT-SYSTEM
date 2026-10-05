package com.fuelstation.Service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.fuelstation.DTO.RevenueDTO;
import com.fuelstation.Entity.Fuel;
import com.fuelstation.Entity.Sale;
import com.fuelstation.Repository.FuelRepository;
import com.fuelstation.Repository.SaleRepository;

@Service
public class SaleService {

    private final SaleRepository repository;
    private final FuelRepository fuelRepository;
    private final SseService sseService;
    private final InvoiceService invoiceService;

    // Default GST Rate
    private final double GST_RATE = 0.18; // 18%

    public SaleService(SaleRepository repository,
                    FuelRepository fuelRepository,
                    SseService sseService,
                    InvoiceService invoiceService) {
        this.repository = repository;
        this.fuelRepository = fuelRepository;
        this.sseService = sseService;
        this.invoiceService = invoiceService;
    }

    public List<Sale> getAllSales() {
        return repository.findAll();
    }

    public Sale save(Sale sale) {
        if (sale.getSaleDate() == null) {
            sale.setSaleDate(LocalDateTime.now());
        }

        System.out.println("Fuel Type: " + sale.getFuelType());

        // Find the selected fuel
        Fuel fuel = fuelRepository.findFirstByFuelType(sale.getFuelType())
                .orElseThrow(() -> new RuntimeException("Fuel Not Found"));

        // Check stock
        if (fuel.getQuantity() < sale.getLiters()) {
            throw new RuntimeException("Insufficient Stock");
        }

        // Calculate amount automatically
        double subtotal = sale.getLiters() * fuel.getPricePerLiter();
        double tax = subtotal * GST_RATE;
        sale.setTaxAmount(tax);
        sale.setAmount(subtotal + tax);

        // Reduce stock
        fuel.setQuantity(fuel.getQuantity() - sale.getLiters());

        // Save updated stock
        fuelRepository.save(fuel);

        // Generate Bill Number
        sale.setBillNo("BILL-" + System.currentTimeMillis());

        // Save sale
        Sale savedSale = repository.save(sale);

        // Generate Invoice Async (using Thread or just generate it here)
        try {
            invoiceService.generateInvoicePdf(savedSale);
        } catch (Exception e) {
            System.err.println("Failed to generate invoice PDF: " + e.getMessage());
        }

        // Dispatch SSE Events
        sseService.sendEvent("dashboard-refresh", "Sale Completed");
        sseService.sendEvent("notification", "Sale Completed: " + savedSale.getBillNo());
        
        if (fuel.getQuantity() < 1000) {
            sseService.sendEvent("notification", "⚠ Low Stock Alert: " + fuel.getFuelType() + " dropping below 1000L.");
        }

        return savedSale;
    }

    public void deleteSale(Long id) {
        repository.deleteById(id);
        sseService.sendEvent("dashboard-refresh", "Sale Deleted");
    }

    public List<Sale> getRecentSales() {
        return repository.findTop5ByOrderBySaleDateDesc();
    }

    public List<RevenueDTO> getRevenueChart() {
        return repository.getRevenueByFuelType();
    }
}