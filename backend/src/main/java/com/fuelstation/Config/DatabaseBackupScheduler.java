package com.fuelstation.Config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

@Component
public class DatabaseBackupScheduler {

    @Value("${spring.datasource.username:root}")
    private String dbUser;

    @Value("${spring.datasource.password:root123}")
    private String dbPassword;

    // Daily at midnight
    @Scheduled(cron = "0 0 0 * * ?")
    public void backupDatabase() {
        System.out.println("--- Starting Automated Database Backup ---");
        
        String dbName = "fuelstation_db";
        String backupDir = "backups";
        
        File dir = new File(backupDir);
        if (!dir.exists()) {
            dir.mkdir();
        }

        String timestamp = new SimpleDateFormat("yyyy-MM-dd_HH-mm-ss").format(new Date());
        String fileName = backupDir + File.separator + "backup_" + timestamp + ".sql";

        // Using mysqldump command
        String command = String.format("mysqldump -u%s -p%s --add-drop-database -B %s -r %s", 
                dbUser, dbPassword, dbName, fileName);

        try {
            Process process = Runtime.getRuntime().exec(command);
            int processComplete = process.waitFor();
            
            if (processComplete == 0) {
                System.out.println("Backup created successfully: " + fileName);
            } else {
                System.err.println("Could not create the backup. Ensure mysqldump is in the system PATH.");
            }
        } catch (IOException | InterruptedException e) {
            System.err.println("Error during database backup: " + e.getMessage());
        }
    }
}
