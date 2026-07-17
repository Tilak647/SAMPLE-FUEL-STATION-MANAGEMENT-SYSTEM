package com.fuelstation.Controller;

import com.fuelstation.Entity.User;
import com.fuelstation.Repository.UserRepository;
import com.fuelstation.Security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping
    public ResponseEntity<?> getProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentPrincipalName = authentication.getName();
        
        Optional<User> userOptional = userRepository.findByEmail(currentPrincipalName);
        if (userOptional.isPresent()) {
            return ResponseEntity.ok(userOptional.get());
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping
    public ResponseEntity<?> updateProfile(@RequestBody User profileDetails) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentPrincipalName = authentication.getName();
        
        Optional<User> userOptional = userRepository.findByEmail(currentPrincipalName);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setName(profileDetails.getName());
            user.setPhone(profileDetails.getPhone());
            user.setProfilePicture(profileDetails.getProfilePicture());
            
            userRepository.save(user);
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }
    
    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> body) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentPrincipalName = authentication.getName();
        
        Optional<User> userOptional = userRepository.findByEmail(currentPrincipalName);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            String currentPassword = body.get("currentPassword");
            String newPassword = body.get("newPassword");
            
            if (passwordEncoder.matches(currentPassword, user.getPassword())) {
                user.setPassword(passwordEncoder.encode(newPassword));
                userRepository.save(user);
                return ResponseEntity.ok("Password changed successfully");
            } else {
                return ResponseEntity.badRequest().body("Incorrect current password");
            }
        }
        return ResponseEntity.notFound().build();
    }
}
