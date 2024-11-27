package com.dailycodework.lakesidehotel.repository;

import com.dailycodework.lakesidehotel.model.Surcharge;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SurchargeRepository extends JpaRepository<Surcharge, Long> {
    List<Surcharge> findByBookedRoomId(Long bookedRoom_id);
}
