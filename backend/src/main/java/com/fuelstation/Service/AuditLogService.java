package com.fuelstation.Service;

import com.fuelstation.Entity.AuditLog;
import com.fuelstation.Entity.User;
import com.fuelstation.Repository.AuditLogRepository;
import com.fuelstation.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;

@Service
public class AuditLogService {

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Autowired
    private UserRepository userRepository;

    public void logAction(String action, String module, String ipAddress) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        Long userId = null;
        String userName = "System";

        if (authentication != null && authentication.isAuthenticated() && !authentication.getPrincipal().equals("anonymousUser")) {
            String email = authentication.getName();
            Optional<User> user = userRepository.findByEmail(email);
            if (user.isPresent()) {
                userId = user.get().getId();
                userName = user.get().getName();
            }
        }

        AuditLog log = new AuditLog();
        log.setUserId(userId);
        log.setUserName(userName);
        log.setAction(action);
        log.setModule(module);
        log.setDate(LocalDate.now());
        log.setTime(LocalTime.now());
        log.setIpAddress(ipAddress != null ? ipAddress : "Unknown");

        auditLogRepository.save(log);
    }
}
