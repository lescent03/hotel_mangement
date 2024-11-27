package com.dailycodework.lakesidehotel.repository;

import com.dailycodework.lakesidehotel.model.Service;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ServiceRepository extends JpaRepository<Service,Long> {
    @Query("SELECT s FROM Service s JOIN s.bookedRooms br WHERE br.id = :bookingId")
    List<Service> findByBookedRoomId(Long bookingId);
}
