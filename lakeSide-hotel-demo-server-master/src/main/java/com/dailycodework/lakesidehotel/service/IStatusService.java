package com.dailycodework.lakesidehotel.service;

import com.dailycodework.lakesidehotel.model.Room;
import com.dailycodework.lakesidehotel.model.Status;

import java.util.List;
import java.util.Optional;

public interface IStatusService {
    List<Status> getAllStatusByRoomId(Long roomId);

    Optional<Status> GetById(Long statusId);

    Status AddNewStatus(Room room, Status status);

    Status UpdateStatus(Long statusId, Status statusUpdate);

}
