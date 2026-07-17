package com.fuelstation.Config;
// trigger reload

import com.fuelstation.Entity.*;
import com.fuelstation.Repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private EmployeeRepository employeeRepository;
    @Autowired private FuelRepository fuelRepository;
    @Autowired private SaleRepository saleRepository;
    @Autowired private ReportHistoryRepository reportHistoryRepository;
    @Autowired private SupplierRepository supplierRepository;
    @Autowired private PurchaseOrderRepository purchaseOrderRepository;
    @Autowired private TankerDeliveryRepository tankerDeliveryRepository;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("DataInitializer Started");
        System.out.println("Creating Demo Data");

        User admin = userRepository.findByEmail("admin@test.com").orElse(new User());
        admin.setName("Super Admin");
        admin.setEmail("admin@test.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRole(Role.ADMIN);
        admin.setActive(true);
        userRepository.save(admin);
        System.out.println("Default Admin user ensured: admin@test.com / admin123");

        if (employeeRepository.count() == 0) {
            List<Employee> employees = new ArrayList<>();
            for (int i = 1; i <= 20; i++) {
                Employee e = new Employee();
                e.setName("Employee " + i);
                e.setPhone("99999900" + (i < 10 ? "0" + i : i));
                e.setPosition(i % 5 == 0 ? "Manager" : "Operator");
                e.setSalary(25000.0 + (i * 1000));
                employees.add(e);
            }
            employeeRepository.saveAll(employees);
            System.out.println("Demo Data Inserted: 20 Employees");
        }

        if (fuelRepository.count() == 0) {
            Fuel petrol = new Fuel(); petrol.setFuelType("Petrol"); petrol.setQuantity(20000.0); petrol.setPricePerLiter(105.0); petrol.setSupplier("IOCL");
            Fuel diesel = new Fuel(); diesel.setFuelType("Diesel"); diesel.setQuantity(15000.0); diesel.setPricePerLiter(95.0); diesel.setSupplier("BPCL");
            fuelRepository.save(petrol);
            fuelRepository.save(diesel);
            System.out.println("Demo Data Inserted: 2 Fuel Inventory");
        }

        if (saleRepository.count() == 0) {
            List<Sale> sales = new ArrayList<>();
            for (int i = 1; i <= 50; i++) {
                boolean isPetrol = i % 2 == 0;
                double liters = 5.0 + (i % 10);
                double price = isPetrol ? 105.0 : 95.0;
                LocalDateTime saleDate = LocalDateTime.now().minusHours(i);
                sales.add(new Sale(null, "BILL-100" + i, isPetrol ? "Petrol" : "Diesel", "Customer " + i, liters, liters * price, saleDate));
            }
            saleRepository.saveAll(sales);
            System.out.println("Demo Data Inserted: 50 Sales");
        }

        if (supplierRepository.count() == 0) {
            List<Supplier> suppliers = new ArrayList<>();
            for (int i = 1; i <= 10; i++) {
                Supplier s = new Supplier();
                s.setName("Supplier " + i);
                s.setContactPerson("Person " + i);
                s.setContactNumber("88888800" + (i < 10 ? "0" + i : i));
                s.setEmail("supp" + i + "@example.com");
                s.setAddress("City " + i);
                s.setGstNumber("GST" + i + "000");
                suppliers.add(s);
            }
            supplierRepository.saveAll(suppliers);
            System.out.println("Demo Data Inserted: 10 Suppliers");
        }

        if (purchaseOrderRepository.count() == 0 && supplierRepository.count() > 0) {
            List<Supplier> allSuppliers = supplierRepository.findAll();
            List<PurchaseOrder> pos = new ArrayList<>();
            for (int i = 1; i <= 15; i++) {
                PurchaseOrder po = new PurchaseOrder();
                po.setSupplier(allSuppliers.get(i % allSuppliers.size()));
                po.setFuelType(i % 2 == 0 ? "Petrol" : "Diesel");
                po.setQuantityLiters(1000.0 * i);
                po.setPricePerLiter(i % 2 == 0 ? 100.0 : 90.0);
                po.setStatus(i % 3 == 0 ? "PENDING" : "APPROVED");
                po.setOrderDate(LocalDateTime.now().minusDays(i));
                pos.add(po);
            }
            purchaseOrderRepository.saveAll(pos);
            System.out.println("Demo Data Inserted: 15 Purchase Orders");
        }

        if (tankerDeliveryRepository.count() == 0 && purchaseOrderRepository.count() > 0) {
            List<PurchaseOrder> allPos = purchaseOrderRepository.findAll();
            List<TankerDelivery> deliveries = new ArrayList<>();
            for (int i = 1; i <= 10; i++) {
                TankerDelivery td = new TankerDelivery();
                td.setPurchaseOrder(allPos.get(i % allPos.size()));
                td.setDriverName("Driver " + i);
                td.setVehicleNumber("MH12CD" + i);
                td.setLitersDelivered(allPos.get(i % allPos.size()).getQuantityLiters());
                td.setStatus("CONFIRMED");
                td.setArrivalTime(LocalDateTime.now().minusHours(i * 2));
                deliveries.add(td);
            }
            tankerDeliveryRepository.saveAll(deliveries);
            System.out.println("Demo Data Inserted: 10 Tanker Deliveries");
        }

        System.out.println("Demo Data Inserted");
    }
}
