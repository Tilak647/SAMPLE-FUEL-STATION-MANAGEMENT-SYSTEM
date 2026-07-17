package com.fuelstation.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fuelstation.Entity.Employee;
import com.fuelstation.Repository.EmployeeRepository;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository repository;

    public List<Employee> getAllEmployees() {
        return repository.findAll();
    }

    public Employee save(Employee employee) {
        return repository.save(employee);
    }

    public Employee update(Long id, Employee employee) {

        Employee emp = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        emp.setName(employee.getName());
        emp.setPhone(employee.getPhone());
        emp.setPosition(employee.getPosition());
        emp.setSalary(employee.getSalary());

        return repository.save(emp);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}