package com.fuelstation.Service;

import com.fuelstation.AI.AIService;
import com.fuelstation.DTO.ReportDataDTO;
import com.fuelstation.Entity.ReportHistory;
import com.fuelstation.Repository.ReportHistoryRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.WeekFields;
import java.util.Locale;

@Service
public class ReportOrchestratorService {

    private final ReportDataService reportDataService;
    private final AIService aiService;
    private final PdfGenerationService pdfGenerationService;
    private final EmailService emailService;
    private final ReportHistoryRepository reportHistoryRepository;

    @Value("${app.report.storage.path:reports/}")
    private String reportStoragePath;

    public ReportOrchestratorService(ReportDataService reportDataService,
                                     AIService aiService,
                                     PdfGenerationService pdfGenerationService,
                                     EmailService emailService,
                                     ReportHistoryRepository reportHistoryRepository) {
        this.reportDataService = reportDataService;
        this.aiService = aiService;
        this.pdfGenerationService = pdfGenerationService;
        this.emailService = emailService;
        this.reportHistoryRepository = reportHistoryRepository;
    }

    public void generateAndSendReport(String reportType, LocalDateTime startDate, LocalDateTime endDate) {
        System.out.println("Starting " + reportType + " Report Generation...");
        String generationStatus = "SUCCESS";
        String emailStatus = "PENDING";
        String filePath = "";
        File pdfFile = null;
        ReportDataDTO data = null;
        String aiInsights = null;

        try {
            // 1. Gather Data
            data = reportDataService.generateReportData(startDate, endDate, reportType);

            // 2. Generate AI Insights
            aiInsights = aiService.generateReportInsights(data);

            // 3. Generate PDF Path dynamically
            String fileName = generateFileName(reportType);
            filePath = getUniqueFilePath(reportStoragePath + fileName);
            
            // 4. Create PDF
            pdfFile = pdfGenerationService.generatePdfReport(data, aiInsights, filePath);
            System.out.println("Report Generated Successfully: " + filePath);

        } catch (Exception e) {
            System.err.println("Failed to generate report: " + e.getMessage());
            generationStatus = "FAILED";
            emailStatus = "FAILED";
        }

        // 5. Store History First (to get ID for async email)
        ReportHistory history = new ReportHistory(
                reportType,
                LocalDate.now(),
                LocalTime.now(),
                emailStatus,
                filePath,
                generationStatus
        );
        history = reportHistoryRepository.save(history);

        // 6. Send Email Asynchronously
        if ("SUCCESS".equals(generationStatus) && pdfFile != null && data != null && aiInsights != null) {
            try {
                emailService.sendReportEmailAsync(history.getId(), data, aiInsights, pdfFile);
            } catch (Exception e) {
                System.err.println("Error initiating async email: " + e.getMessage());
            }
        }
    }

    private String generateFileName(String reportType) {
        LocalDate now = LocalDate.now();
        if ("DAILY".equalsIgnoreCase(reportType)) {
            return "Daily_Report_" + now.format(DateTimeFormatter.ofPattern("yyyy-MM-dd")) + ".pdf";
        } else if ("WEEKLY".equalsIgnoreCase(reportType)) {
            int weekNum = now.get(WeekFields.of(Locale.getDefault()).weekOfWeekBasedYear());
            return "Weekly_Report_Week-" + weekNum + ".pdf";
        } else if ("MONTHLY".equalsIgnoreCase(reportType)) {
            return "Monthly_Report_" + now.format(DateTimeFormatter.ofPattern("yyyy-MM")) + ".pdf";
        }
        return reportType + "_Report_" + now.format(DateTimeFormatter.ofPattern("yyyyMMdd")) + ".pdf";
    }

    private String getUniqueFilePath(String originalPath) {
        File file = new File(originalPath);
        if (!file.exists()) {
            return originalPath;
        }
        
        String pathWithoutExt = originalPath.substring(0, originalPath.lastIndexOf('.'));
        String ext = originalPath.substring(originalPath.lastIndexOf('.'));
        int counter = 1;
        while (file.exists()) {
            file = new File(pathWithoutExt + "_" + counter + ext);
            counter++;
        }
        return file.getAbsolutePath();
    }
}
