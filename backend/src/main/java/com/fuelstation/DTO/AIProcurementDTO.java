package com.fuelstation.DTO;

import lombok.Data;
import java.util.List;

@Data
public class AIProcurementDTO {
    private String recommendedSupplier;
    private String nextPurchaseDate;
    private String predictedCost;
    private String suggestedPetrolQuantity;
    private String suggestedDieselQuantity;
    private String procurementSummary;
    private List<String> economicalSuppliers;
}
