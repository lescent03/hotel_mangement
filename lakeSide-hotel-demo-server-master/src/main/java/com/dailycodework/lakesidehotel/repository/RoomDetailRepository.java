package com.dailycodework.lakesidehotel.repository;

import com.dailycodework.lakesidehotel.model.RoomDetail;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoomDetailRepository extends JpaRepository<RoomDetail, Long> {

    List<RoomDetail>findAllByRoomId(Long roomId);

}
