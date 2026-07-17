package com.fuelstation.Controller;

import com.fuelstation.Entity.ReportHistory;
import com.fuelstation.Repository.ReportHistoryRepository;
import com.fuelstation.Service.ReportOrchestratorService;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/report")
@CrossOrigin("*") // Adjust for specific origins if needed
public class ReportController {

    private final ReportOrchestratorService reportOrchestratorService;
    private final ReportHistoryRepository reportHistoryRepository;

    public ReportController(ReportOrchestratorService reportOrchestratorService, ReportHistoryRepository reportHistoryRepository) {
        this.reportOrchestratorService = reportOrchestratorService;
        this.reportHistoryRepository = reportHistoryRepository;
    }

    @PostMapping("/generate")
    public ResponseEntity<String> generateReport(@RequestParam(defaultValue = "DAILY") String type) {
        LocalDateTime startDate;
        LocalDateTime endDate = LocalDateTime.of(LocalDate.now(), LocalTime.MAX);

        if ("WEEKLY".equalsIgnoreCase(type)) {
            startDate = endDate.minusDays(6).with(LocalTime.MIN);
        } else if ("MONTHLY".equalsIgnoreCase(type)) {
            startDate = endDate.withDayOfMonth(1).with(LocalTime.MIN);
        } else {
            startDate = LocalDateTime.of(LocalDate.now(), LocalTime.MIN);
            type = "DAILY"; // Default
        }

        // Generate report (blocks until PDF created, email is async)
        reportOrchestratorService.generateAndSendReport(type.toUpperCase(), startDate, endDate);

        return ResponseEntity.ok(type.toUpperCase() + " report generation triggered successfully.");
    }

    @GetMapping("/history")
    public ResponseEntity<List<ReportHistory>> getReportHistory() {
        List<ReportHistory> history = reportHistoryRepository.findAll();
        // Alternatively, sort by date descending
        history.sort((h1, h2) -> h2.getGeneratedDate().compareTo(h1.getGeneratedDate()));
        return ResponseEntity.ok(history);
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<Resource> downloadReport(@PathVariable Long id) {
        Optional<ReportHistory> historyOpt = reportHistoryRepository.findById(id);

        if (historyOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        String filePath = historyOpt.get().getFilePath();
        File file = new File(filePath);

        if (!file.exists()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        Resource resource = new FileSystemResource(file);

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getName() + "\"");

        return ResponseEntity.ok()
                .headers(headers)
                .contentLength(file.length())
                .contentType(MediaType.APPLICATION_PDF)
                .body(resource);
    }
}
