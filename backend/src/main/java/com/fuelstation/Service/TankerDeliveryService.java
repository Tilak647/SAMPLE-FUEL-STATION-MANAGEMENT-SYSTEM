package com.fuelstation.Service;

import com.fuelstation.Entity.Fuel;
import com.fuelstation.Entity.PurchaseOrder;
import com.fuelstation.Entity.TankerDelivery;
import com.fuelstation.Repository.FuelRepository;
import com.fuelstation.Repository.PurchaseOrderRepository;
import com.fuelstation.Repository.TankerDeliveryRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TankerDeliveryService {

    private final TankerDeliveryRepository tankerDeliveryRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;
    private final FuelRepository fuelRepository;
    private final SseService sseService;

    public TankerDeliveryService(TankerDeliveryRepository tankerDeliveryRepository,
                                 PurchaseOrderRepository purchaseOrderRepository,
                                 FuelRepository fuelRepository,
                                 SseService sseService) {
        this.tankerDeliveryRepository = tankerDeliveryRepository;
        this.purchaseOrderRepository = purchaseOrderRepository;
        this.fuelRepository = fuelRepository;
        this.sseService = sseService;
    }

    public List<TankerDelivery> getAllDeliveries() {
        return tankerDeliveryRepository.findAll();
    }

    public TankerDelivery recordDelivery(TankerDelivery delivery) {
        // Find associated purchase order
        PurchaseOrder order = purchaseOrderRepository.findById(delivery.getPurchaseOrder().getId())
                .orElseThrow(() -> new IllegalArgumentException("Purchase Order not found"));
        
        // Update Order Status
        order.setStatus("COMPLETED");
        purchaseOrderRepository.save(order);

        // Record Delivery
        TankerDelivery savedDelivery = tankerDeliveryRepository.save(delivery);

        // Automatically update Fuel Inventory
        List<Fuel> fuels = fuelRepository.findAll();
        for (Fuel fuel : fuels) {
            if (fuel.getFuelType().equalsIgnoreCase(order.getFuelType())) {
                fuel.setQuantity(fuel.getQuantity() + delivery.getLitersDelivered());
                fuelRepository.save(fuel);
                break;
            }
        }

        // Notify
        sseService.sendEvent("dashboard-refresh", "Tanker Delivery Recorded");
        sseService.sendEvent("notification", "Tanker Delivery Confirmed: " + delivery.getLitersDelivered() + "L of " + order.getFuelType() + " added to inventory.");

        return savedDelivery;
    }
}
