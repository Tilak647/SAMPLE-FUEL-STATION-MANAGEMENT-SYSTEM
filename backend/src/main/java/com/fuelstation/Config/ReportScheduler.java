package com.fuelstation.Config;

import com.fuelstation.Service.ReportOrchestratorService;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Configuration
@EnableScheduling
public class ReportScheduler {

    private final ReportOrchestratorService reportOrchestratorService;

    public ReportScheduler(ReportOrchestratorService reportOrchestratorService) {
        this.reportOrchestratorService = reportOrchestratorService;
    }

    // Daily at 11:59 PM
    @Scheduled(cron = "0 59 23 * * *")
    public void generateDailyReport() {
        LocalDateTime startDate = LocalDateTime.of(LocalDate.now(), LocalTime.MIN);
        LocalDateTime endDate = LocalDateTime.of(LocalDate.now(), LocalTime.MAX);
        reportOrchestratorService.generateAndSendReport("DAILY", startDate, endDate);
    }

    // Weekly every Sunday at 11:59 PM
    @Scheduled(cron = "0 59 23 * * SUN")
    public void generateWeeklyReport() {
        LocalDateTime endDate = LocalDateTime.of(LocalDate.now(), LocalTime.MAX);
        LocalDateTime startDate = endDate.minusDays(6).with(LocalTime.MIN); // Monday to Sunday
        reportOrchestratorService.generateAndSendReport("WEEKLY", startDate, endDate);
    }

    // Monthly on the last day of every month at 11:59 PM
    // The "L" in the day-of-month field specifies the last day of the month.
    @Scheduled(cron = "0 59 23 L * *")
    public void generateMonthlyReport() {
        LocalDateTime endDate = LocalDateTime.of(LocalDate.now(), LocalTime.MAX);
        LocalDateTime startDate = endDate.withDayOfMonth(1).with(LocalTime.MIN);
        reportOrchestratorService.generateAndSendReport("MONTHLY", startDate, endDate);
    }
}
