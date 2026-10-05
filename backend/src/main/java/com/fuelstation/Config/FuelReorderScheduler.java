package com.fuelstation.Config;

import com.fuelstation.Entity.Fuel;
import com.fuelstation.Entity.PurchaseOrder;
import com.fuelstation.Entity.Supplier;
import com.fuelstation.Repository.SupplierRepository;
import com.fuelstation.Service.FuelService;
import com.fuelstation.Service.PurchaseOrderService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class FuelReorderScheduler {

    private final FuelService fuelService;
    private final PurchaseOrderService purchaseOrderService;
    private final SupplierRepository supplierRepository;

    public FuelReorderScheduler(FuelService fuelService, PurchaseOrderService purchaseOrderService, SupplierRepository supplierRepository) {
        this.fuelService = fuelService;
        this.purchaseOrderService = purchaseOrderService;
        this.supplierRepository = supplierRepository;
    }

    // Run every hour. For testing purposes, you could change this to something like "0 * * * * *" (every minute)
    @Scheduled(cron = "0 0 * * * *")
    public void monitorAndReorderFuel() {
        System.out.println("Running automated fuel stock check...");
        List<Fuel> fuels = fuelService.getAllFuel();

        for (Fuel fuel : fuels) {
            // Null safety checks for thresholds
            Double threshold = fuel.getMinimumThreshold() != null ? fuel.getMinimumThreshold() : 500.0;
            Double reorderQty = fuel.getReorderQuantity() != null ? fuel.getReorderQuantity() : 2000.0;
            Double currentQty = fuel.getQuantity() != null ? fuel.getQuantity() : 0.0;

            if (currentQty < threshold) {
                System.out.println("Low stock detected for " + fuel.getFuelType() + " (Current: " + currentQty + ", Threshold: " + threshold + ")");
                
                // Attempt to find supplier
                String supplierName = fuel.getSupplier();
                if (supplierName != null && !supplierName.isEmpty()) {
                    Optional<Supplier> supplierOpt = supplierRepository.findByNameIgnoreCase(supplierName);
                    
                    if (supplierOpt.isPresent()) {
                        Supplier supplier = supplierOpt.get();
                        
                        // Generate Purchase Order
                        PurchaseOrder po = new PurchaseOrder();
                        po.setSupplier(supplier);
                        po.setFuelType(fuel.getFuelType());
                        po.setQuantityLiters(reorderQty);
                        po.setPricePerLiter(fuel.getPricePerLiter());
                        po.setStatus("PENDING");
                        
                        purchaseOrderService.saveOrder(po);
                        System.out.println("Automatically generated Purchase Order for " + fuel.getFuelType());
                    } else {
                        System.err.println("Could not generate Purchase Order: Supplier '" + supplierName + "' not found in database.");
                    }
                } else {
                    System.err.println("Could not generate Purchase Order: No supplier defined for fuel " + fuel.getFuelType());
                }
            }
        }
    }
}
