package com.dailycodework.lakesidehotel.repository;

import com.dailycodework.lakesidehotel.model.Status;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StatusRepository extends JpaRepository<Status, Long> {
    List<Status> findAllStatusByRoomId(Long roomId);
}
