package com.fuelstation.Service;

import com.fuelstation.Entity.PurchaseOrder;
import com.fuelstation.Repository.PurchaseOrderRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PurchaseOrderService {

    private final PurchaseOrderRepository purchaseOrderRepository;
    private final SseService sseService;

    public PurchaseOrderService(PurchaseOrderRepository purchaseOrderRepository, SseService sseService) {
        this.purchaseOrderRepository = purchaseOrderRepository;
        this.sseService = sseService;
    }

    public List<PurchaseOrder> getAllOrders() {
        return purchaseOrderRepository.findAll();
    }

    public PurchaseOrder saveOrder(PurchaseOrder order) {
        PurchaseOrder saved = purchaseOrderRepository.save(order);
        sseService.sendEvent("dashboard-refresh", "Purchase Order Created: " + saved.getId());
        sseService.sendEvent("notification", "New Purchase Order Created for " + saved.getQuantityLiters() + "L of " + saved.getFuelType());
        return saved;
    }

    public PurchaseOrder updateOrderStatus(Long id, String status) {
        PurchaseOrder order = purchaseOrderRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Order not found"));
        order.setStatus(status);
        PurchaseOrder saved = purchaseOrderRepository.save(order);
        sseService.sendEvent("notification", "Purchase Order #" + id + " " + status);
        return saved;
    }
}
