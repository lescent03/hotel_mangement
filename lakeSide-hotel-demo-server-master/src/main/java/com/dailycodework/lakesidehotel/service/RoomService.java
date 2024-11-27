package com.dailycodework.lakesidehotel.service;

import com.dailycodework.lakesidehotel.model.Room;
import com.dailycodework.lakesidehotel.repository.RoomRepository;
import com.dailycodework.lakesidehotel.response.RoomResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.sql.SQLException;
import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
public class RoomService implements IRoomService {
    private final RoomRepository roomRepository;
    private final CategoryService categoryService;
    private final ServiceService serviceService;
    private final RoomDetailService roomDetailService;
    private final StatusService statusService;

    @Override
    public Boolean CancelReservationRoom(Long roomId, int numRoom){
        Room room = roomRepository.findById(roomId).orElse(null);
        if(room != null){
            room.setNumOfRoom(room.getNumOfRoom() + numRoom);
            roomRepository.save(room);
            return true;
        }
        return false;
    }

    @Override
    public Boolean ReservationRoom(Long roomId, int numRoom){
        Room room = roomRepository.findById(roomId).orElse(null);
        if(room != null){
            room.setNumOfRoom(room.getNumOfRoom() - numRoom);
            roomRepository.save(room);
            return true;
        }
        return false;
    }

    @Override
    public List<Room> getAvailableRooms(LocalDate checkInDate, LocalDate checkOutDate, int required_rooms, int required_adults,
                                        int required_children_0_4, int required_children_5_11) {
        return roomRepository.findAvailableRoomsByDatesAndType(checkInDate, checkOutDate,
                required_rooms, required_adults, required_children_0_4, required_children_5_11);
    }

    @Override
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    @Override
    public Optional<Room> getRoomById(Long roomId) {
        return roomRepository.findById(roomId);
    }

    public Room SetBasicInfoRoom(Room currentRoom, RoomResponse newRoom){
        currentRoom.setPrice(newRoom.getPrice());
        currentRoom.setCodeRoom(newRoom.getCodeRoom());
        currentRoom.setAdults(newRoom.getAdults());
        currentRoom.setChildrents((newRoom.getChildrents()));
        currentRoom.setNumOfRoom((newRoom.getNumOfRoom()));
        currentRoom.setDescription(newRoom.getDescription());
        return currentRoom;
    }

    @Override
    public Room addNewRoom(RoomResponse newRoom) throws SQLException {
        Room room = new Room();
        room = SetBasicInfoRoom(room,newRoom);

        room = categoryService.SetCategory(room, newRoom);

        room = roomDetailService.SetRoomDetail(room, newRoom);

        room = serviceService.SetServiceForRoom(room, newRoom);

        return roomRepository.save(room);
    }

    @Override
    public Room updateRoom(Room currentRoom, RoomResponse updateRoom) throws SQLException {
        currentRoom = SetBasicInfoRoom(currentRoom,updateRoom);

        currentRoom = categoryService.SetCategory(currentRoom, updateRoom);

        if (currentRoom.getRoomDetails() != null && !currentRoom.getRoomDetails().isEmpty()) {
            currentRoom.getRoomDetails().clear();
        }
        currentRoom = roomDetailService.SetRoomDetail(currentRoom, updateRoom);

        currentRoom = serviceService.SetServiceForRoom(currentRoom, updateRoom);

        currentRoom = statusService.SetStatus(currentRoom, updateRoom);

        return roomRepository.save(currentRoom);
    }

    @Override
    public void deleteRoom(Long id){
        roomRepository.deleteById(id);
    }
}
