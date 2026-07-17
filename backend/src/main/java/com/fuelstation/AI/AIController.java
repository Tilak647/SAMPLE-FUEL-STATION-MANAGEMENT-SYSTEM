package com.fuelstation.AI;

import com.fuelstation.DTO.AIBusinessIntelligenceDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AIController {

    private final AIService aiService;

    public AIController(AIService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/ask")
    public String ask(@RequestBody String question) {
        return aiService.askAI(question);
    }

    @GetMapping("/intelligence")
    public AIBusinessIntelligenceDTO getBusinessIntelligence() {
        return aiService.generateBusinessIntelligence();
    }

    @GetMapping("/procurement")
    public com.fuelstation.DTO.AIProcurementDTO getProcurementInsights() {
        return aiService.generateProcurementInsights();
    }
}