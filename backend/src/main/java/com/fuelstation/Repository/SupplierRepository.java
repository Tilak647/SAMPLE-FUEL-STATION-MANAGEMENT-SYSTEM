package com.fuelstation.Repository;

import com.fuelstation.Entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Long> {
    java.util.Optional<Supplier> findByNameIgnoreCase(String name);
}
