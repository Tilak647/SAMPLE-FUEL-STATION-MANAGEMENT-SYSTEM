package com.fuelstation.Entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "report_history")
public class ReportHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "report_type")
    private String reportType; // DAILY, WEEKLY, MONTHLY

    @Column(name = "generated_date")
    private LocalDate generatedDate;

    @Column(name = "generated_time")
    private LocalTime generatedTime;

    @Column(name = "email_status")
    private String emailStatus; // SUCCESS, FAILED

    @Column(name = "file_path")
    private String filePath;

    @Column(name = "generation_status")
    private String generationStatus; // SUCCESS, FAILED

    public ReportHistory() {
    }

    public ReportHistory(String reportType, LocalDate generatedDate, LocalTime generatedTime, String emailStatus, String filePath, String generationStatus) {
        this.reportType = reportType;
        this.generatedDate = generatedDate;
        this.generatedTime = generatedTime;
        this.emailStatus = emailStatus;
        this.filePath = filePath;
        this.generationStatus = generationStatus;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getReportType() {
        return reportType;
    }

    public void setReportType(String reportType) {
        this.reportType = reportType;
    }

    public LocalDate getGeneratedDate() {
        return generatedDate;
    }

    public void setGeneratedDate(LocalDate generatedDate) {
        this.generatedDate = generatedDate;
    }

    public LocalTime getGeneratedTime() {
        return generatedTime;
    }

    public void setGeneratedTime(LocalTime generatedTime) {
        this.generatedTime = generatedTime;
    }

    public String getEmailStatus() {
        return emailStatus;
    }

    public void setEmailStatus(String emailStatus) {
        this.emailStatus = emailStatus;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public String getGenerationStatus() {
        return generationStatus;
    }

    public void setGenerationStatus(String generationStatus) {
        this.generationStatus = generationStatus;
    }
}
