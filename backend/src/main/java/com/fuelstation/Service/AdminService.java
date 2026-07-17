package com.fuelstation.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fuelstation.Entity.Admin;
import com.fuelstation.Repository.AdminRepository;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    public Admin login(String email, String password) {

        return adminRepository.findByEmailAndPassword(email, password);

    }

}