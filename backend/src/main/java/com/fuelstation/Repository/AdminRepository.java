package com.fuelstation.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fuelstation.Entity.Admin;

public interface AdminRepository extends JpaRepository<Admin, Long> {

    Admin findByEmailAndPassword(String email, String password);

}