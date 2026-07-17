package com.fuelstation.Repository;

import com.fuelstation.Entity.TankerDelivery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TankerDeliveryRepository extends JpaRepository<TankerDelivery, Long> {
}
