package com.dailycodework.lakesidehotel.service;

import com.dailycodework.lakesidehotel.model.Room;
import com.dailycodework.lakesidehotel.response.RoomResponse;

import java.sql.SQLException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface IRoomService {
    List<Room> getAllRooms();

    Optional<Room> getRoomById(Long roomId);

    Room addNewRoom(RoomResponse newRoom) throws SQLException;

    Room updateRoom(Room currentRoom, RoomResponse updateRoom) throws SQLException;

    void deleteRoom(Long id);

    List<Room> getAvailableRooms(LocalDate checkInDate, LocalDate checkOutDate, int required_rooms,
                                 int required_adults, int required_children_0_4, int required_children_5_11);

    Boolean ReservationRoom(Long roomId, int numRoom);

    Boolean CancelReservationRoom(Long roomId, int numRoom);
}
