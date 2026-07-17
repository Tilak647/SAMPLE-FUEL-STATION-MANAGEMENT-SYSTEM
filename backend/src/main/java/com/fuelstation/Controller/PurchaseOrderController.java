package com.fuelstation.Controller;

import com.fuelstation.Entity.PurchaseOrder;
import com.fuelstation.Service.PurchaseOrderService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin("*")
public class PurchaseOrderController {

    private final PurchaseOrderService purchaseOrderService;

    public PurchaseOrderController(PurchaseOrderService purchaseOrderService) {
        this.purchaseOrderService = purchaseOrderService;
    }

    @GetMapping
    public List<PurchaseOrder> getAllOrders() {
        return purchaseOrderService.getAllOrders();
    }

    @PostMapping
    public PurchaseOrder createOrder(@RequestBody PurchaseOrder order) {
        return purchaseOrderService.saveOrder(order);
    }

    @PutMapping("/{id}/status")
    public PurchaseOrder updateStatus(@PathVariable Long id, @RequestParam String status) {
        return purchaseOrderService.updateOrderStatus(id, status);
    }
}
