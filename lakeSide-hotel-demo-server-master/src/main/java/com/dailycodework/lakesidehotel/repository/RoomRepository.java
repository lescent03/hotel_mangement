package com.dailycodework.lakesidehotel.repository;

import com.dailycodework.lakesidehotel.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Long> {

//    @Query("SELECT r FROM Room r " +
//            "LEFT JOIN ( " +
//                "SELECT br.room.id AS roomId, SUM(br.numOfRoom) AS bookedRooms " +
//                "FROM BookedRoom br " +
//                "WHERE (br.checkInDate <= :checkOutDate AND br.checkOutDate >= :checkInDate) " +
//                "GROUP BY br.room.id " +
//                ") b ON r.id = b.roomId " +
//            "WHERE r.numOfRoom - COALESCE(b.bookedRooms, 0) >= :required_rooms " +
//            "AND r.adults * :required_rooms >= :required_adults " +
//            "AND r.childrents * :required_rooms >= (:required_children_0_4 + :required_children_5_11)")
@Query("SELECT r FROM Room r " +
        "LEFT JOIN ( " +
            "SELECT br.room.id AS roomId, SUM(br.numOfRoom) AS bookedRooms " +
            "FROM BookedRoom br " +
            "WHERE (br.checkInDate < :checkOutDate AND br.checkOutDate > :checkInDate AND br.status NOT LIKE '%Hủy%') " +
            "GROUP BY br.room.id " +
            ") b ON r.id = b.roomId " +
        "WHERE r.numOfRoom - COALESCE(b.bookedRooms, 0) >= :required_rooms " +
        "AND (" +
            "(" +
                "r.adults * :required_rooms >= :required_adults " +
                "AND r.childrents * :required_rooms >= (:required_children_0_4 + :required_children_5_11) " +
                "AND ((r.adults + r.childrents) * :required_rooms) <= (:required_adults + :required_children_0_4 + :required_children_5_11 + 3) " +
                "AND ((r.adults + r.childrents) * :required_rooms) >= (:required_adults + :required_children_0_4 + :required_children_5_11 - 2)" +
            ") " +
            "OR (" +
                "((r.adults + r.childrents) * :required_rooms) <= (:required_adults + :required_children_0_4 + :required_children_5_11 + 3) " +
                "AND ((r.adults + r.childrents) * :required_rooms) >= (:required_adults + :required_children_0_4 + :required_children_5_11 - 2)" +
            ")" +
        ")")

    List<Room> findAvailableRoomsByDatesAndType(LocalDate checkInDate, LocalDate checkOutDate,
                                                int required_rooms, int required_adults,
                                                int required_children_0_4, int required_children_5_11);

}
