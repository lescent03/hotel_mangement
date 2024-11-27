package com.dailycodework.lakesidehotel.service;

import com.dailycodework.lakesidehotel.model.RoomDetail;

import java.util.List;

public interface IRoomDetailService {
    List<RoomDetail> getAllRoomDetailByRoomId(Long roomId);
}
