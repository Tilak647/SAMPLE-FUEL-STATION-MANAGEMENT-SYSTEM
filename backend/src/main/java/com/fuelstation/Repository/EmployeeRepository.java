package com.fuelstation.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.fuelstation.Entity.Employee;

public interface EmployeeRepository
        extends JpaRepository<Employee, Long> {
}