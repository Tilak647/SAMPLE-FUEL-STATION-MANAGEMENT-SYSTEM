package com.fuelstation.Service;

import com.fuelstation.DTO.ReportDataDTO;
import com.fuelstation.Entity.ReportHistory;
import com.fuelstation.Repository.ReportHistoryRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Recover;
import org.springframework.retry.annotation.Retryable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.File;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

@Service
public class EmailService {

    private final JavaMailSender javaMailSender;
    private final ReportHistoryRepository reportHistoryRepository;

    @Value("${spring.mail.username}")
    private String senderEmail;

    private final String MANAGER_EMAIL = "manager@fuelstation.com"; // Replace with actual manager email

    public EmailService(JavaMailSender javaMailSender, ReportHistoryRepository reportHistoryRepository) {
        this.javaMailSender = javaMailSender;
        this.reportHistoryRepository = reportHistoryRepository;
    }

    @Async
    @Retryable(
            value = {Exception.class},
            maxAttempts = 3,
            backoff = @Backoff(delay = 5000)
    )
    public void sendReportEmailAsync(Long historyId, ReportDataDTO data, String aiInsights, File attachment) throws Exception {
        System.out.println("Attempting to send email for report history ID: " + historyId);
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom(senderEmail);
            helper.setTo(MANAGER_EMAIL);
            
            String reportTypeStr = data.getReportType().substring(0, 1).toUpperCase() + data.getReportType().substring(1).toLowerCase();
            String dateStr = LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMMM yyyy"));
            helper.setSubject(reportTypeStr + " Smart Fuel Station Report - " + dateStr);

            String body = String.format("""
                    Dear Manager,
                    
                    Today's operations have been completed successfully.
                    
                    Summary
                    
                    Revenue
                    ₹%.2f
                    
                    Total Sales
                    %d
                    
                    Petrol Sold
                    %.2f Liters
                    
                    Diesel Sold
                    %.2f Liters
                    
                    Current Stock
                    
                    Petrol
                    %.2f L
                    
                    Diesel
                    %.2f L
                    
                    AI Business Insights
                    
                    %s
                    
                    Please find the detailed PDF report attached.
                    
                    Regards,
                    Smart Fuel Station Management System
                    """,
                    data.getTotalRevenue(),
                    data.getTotalSales(),
                    data.getPetrolSold(),
                    data.getDieselSold(),
                    data.getRemainingPetrolStock(),
                    data.getRemainingDieselStock(),
                    aiInsights);

            helper.setText(body);

            FileSystemResource file = new FileSystemResource(attachment);
            helper.addAttachment(attachment.getName(), file);

            javaMailSender.send(message);
            
            // On success, update status
            updateEmailStatus(historyId, "SUCCESS");
            System.out.println("Email Sent Successfully.");

        } catch (MessagingException e) {
            System.err.println("Failed to send email: " + e.getMessage());
            throw e; // Throw to trigger retry
        }
    }

    @Recover
    public void recover(Exception e, Long historyId, ReportDataDTO data, String aiInsights, File attachment) {
        System.err.println("Email sending failed after 3 retries for history ID: " + historyId);
        updateEmailStatus(historyId, "FAILED");
    }

    private void updateEmailStatus(Long historyId, String status) {
        Optional<ReportHistory> historyOpt = reportHistoryRepository.findById(historyId);
        if (historyOpt.isPresent()) {
            ReportHistory history = historyOpt.get();
            history.setEmailStatus(status);
            reportHistoryRepository.save(history);
        }
    }
}
