package com.dailycodework.lakesidehotel.controller;

import com.dailycodework.lakesidehotel.exception.PhotoRetrievalException;
import com.dailycodework.lakesidehotel.exception.ResourceNotFoundException;
import com.dailycodework.lakesidehotel.model.*;
import com.dailycodework.lakesidehotel.response.*;
import com.dailycodework.lakesidehotel.service.ICategoryService;
import com.dailycodework.lakesidehotel.service.IRoomDetailService;
import com.dailycodework.lakesidehotel.service.IRoomService;
import com.dailycodework.lakesidehotel.service.IStatusService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.sql.Blob;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/rooms")
public class RoomController {
    private final IRoomService iRoomService;
    private final IRoomDetailService iRoomDetailService;
    private final IStatusService iStatusService;
    private  final ICategoryService iCategoryService;

    @PutMapping("/room/cancelReservation/{roomId}")
    public ResponseEntity<Boolean> CancelReservationRoom(@PathVariable Long roomId, @RequestParam int numRoom){
        Boolean b =  iRoomService.CancelReservationRoom(roomId, numRoom);
        System.out.println("Thực hiện hủy giữ chỗ cho room " + roomId+" số lượng "+numRoom+" kết quả "+b);
        return ResponseEntity.ok(b);
    }

    @PutMapping("/room/reservation/{roomId}")
    public ResponseEntity<Boolean> ReservationRoom(@PathVariable Long roomId, @RequestParam int numRoom){
        Boolean b =  iRoomService.ReservationRoom(roomId, numRoom);
        System.out.println("Thực hiện giữ chỗ cho room " + roomId+" số lượng "+numRoom+" kết quả "+b);
        return ResponseEntity.ok(b);
    }

    @GetMapping("/available-rooms")
    public ResponseEntity<List<RoomResponse>> getAvailableRooms(
            @RequestParam("checkInDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkInDate,
            @RequestParam("checkOutDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)LocalDate checkOutDate,
            @RequestParam("required_rooms") int required_rooms,
            @RequestParam("required_adults") int required_adults,
            @RequestParam("required_children_0_4") int required_children_0_4,
            @RequestParam("required_children_5_11") int required_children_5_11) throws SQLException {
        List<Room> availableRooms = iRoomService.getAvailableRooms(checkInDate, checkOutDate,
                required_rooms, required_adults, required_children_0_4, required_children_5_11);
        List<RoomResponse> roomResponses = new ArrayList<>();
        for (Room room : availableRooms){
            RoomResponse roomResponse = GetRoomResponse(room);
            roomResponses.add(roomResponse);
        }
        if(roomResponses.isEmpty()){
            return ResponseEntity.noContent().build();
        }else{
            return ResponseEntity.ok(roomResponses);
        }
    }

    @DeleteMapping("/delete/room/{roomId}")
    //@PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteRoom(@PathVariable Long roomId){
        iRoomService.deleteRoom(roomId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping("/update/{roomId}")
    //@PreAuthorize("hasRole('ROLE_ADMIN')")
    public  ResponseEntity<RoomResponse>updateRoom(@PathVariable Long roomId, @RequestBody RoomResponse updateRoom) throws SQLException {
        System.out.println("dữ liệu update nhận được: "+updateRoom);
        Room roomCurrent = iRoomService.getRoomById(roomId).orElse(new Room());
        Room saveUpdateRoom = iRoomService.updateRoom(roomCurrent, updateRoom);
        return ResponseEntity.ok(GetRoomResponse(saveUpdateRoom));
    }

    @PostMapping("/add/new-room")
    //@PreAuthorize("hasRole('ROLE_ADMIN')")
    public  ResponseEntity<RoomResponse>addNewRoom(@RequestBody RoomResponse newRoom) throws SQLException {
        Room saveRoom = iRoomService.addNewRoom(newRoom);
        return ResponseEntity.status(HttpStatus.CREATED).body(GetRoomResponse(saveRoom));
    }

    @GetMapping("/{roomId}/service")
    public List<ServiceResponse> getAllServiceOfRoom(@PathVariable Long roomId){
        Optional<Room> optionalRoom = iRoomService.getRoomById(roomId);
        // Kiểm tra xem Room có tồn tại hay không
        if (optionalRoom.isPresent()) {
            Room room = optionalRoom.get(); // Lấy Room từ Optional
            // Giả sử room có phương thức getServices() để lấy danh sách dịch vụ
            return room.getServices().stream()
                    .map(service -> new ServiceResponse(service.getId(), service.getServiceName(), service.getDescription(), service.getStatus()))
                    .toList();
        } else {
            // Xử lý trường hợp không tìm thấy Room (ví dụ: trả về một danh sách rỗng hoặc ném ngoại lệ)
            return Collections.emptyList();
        }
    }

    @GetMapping("/{roomId}/status")
    public List<StatusResponse> getAllStatusResponseOfRoom(@PathVariable Long roomId){
        List<Status> statuses = iStatusService.getAllStatusByRoomId(roomId);
        List<StatusResponse> statusResponses = new ArrayList<>();
        for(Status status : statuses){
            StatusResponse statusResponse = new StatusResponse(
                    status.getId(), status.getStatus(), status.getDescription(),
                    status.getStartDate(), status.getEndDate()
            );
            statusResponses.add(statusResponse);
        }
        return statusResponses;
    }

    @GetMapping("/{roomId}/details")
    public List<RoomDetailResponse> getAllRoomDetailResponseOfRoom(@PathVariable Long roomId){
        List<RoomDetail> roomDetails = iRoomDetailService.getAllRoomDetailByRoomId(roomId);
        List<RoomDetailResponse> roomDetailResponses = new ArrayList<>();
        for(RoomDetail roomDetail : roomDetails){
            byte[] photoBytes = null;
            Blob photoBlob = roomDetail.getPhoto();
            if (photoBlob != null) {
                try {
                    photoBytes = photoBlob.getBytes(1, (int) photoBlob.length());
                } catch (SQLException e) {
                    throw new PhotoRetrievalException("Error retrieving photo");
                }
            }
            RoomDetailResponse roomDetailResponse = new RoomDetailResponse(
                    roomDetail.getId(), roomDetail.getInfo(),photoBytes, roomDetail.getPhoto_url()
            );
            roomDetailResponses.add(roomDetailResponse);
        }
        return roomDetailResponses;
    }

    @GetMapping("/room/{roomId}")
    public ResponseEntity<Optional<RoomResponse>> getRoomById(@PathVariable Long roomId){
        Optional<Room> theRoom = iRoomService.getRoomById(roomId);
        return theRoom.map(room -> {
            RoomResponse roomResponse = GetRoomResponse(room);
            return  ResponseEntity.ok(Optional.of(roomResponse));
        }).orElseThrow(() -> new ResourceNotFoundException("Room not found"));
    }

    @GetMapping("/all-rooms")
    public ResponseEntity<List<RoomResponse>> getAllRooms() {
        List<Room> rooms = iRoomService.getAllRooms();
        List<RoomResponse> roomResponses = new ArrayList<>();
        for (Room room : rooms) {
            RoomResponse roomResponse = GetRoomResponse(room);

            roomResponses.add(roomResponse);
        }
        return ResponseEntity.status(HttpStatus.OK).body(roomResponses);
    }

    public RoomResponse GetRoomResponse(Room room){
        // lấy danh sách các room detail của phòng (trả về dạng kiểu RoomDetailResponse)
        List<RoomDetailResponse> roomDetailResponses = new ArrayList<>();
        roomDetailResponses = getAllRoomDetailResponseOfRoom(room.getId());

        // lấy danh sách các status của phòng (trả về dạng kiểu StatusResponse)
        List<StatusResponse> statusResponses = new ArrayList<>();
        statusResponses = getAllStatusResponseOfRoom(room.getId());

        List<ServiceResponse> serviceResponses = new ArrayList<>();
        serviceResponses = getAllServiceOfRoom(room.getId());

        // tạo đối tượng roomResponse kiểu RoomResponse (đối tượng chính)
        RoomResponse roomResponse = new RoomResponse(room.getId(), room.getCodeRoom(),
                room.getPrice(), room.getAdults(), room.getChildrents(), room.getNumOfRoom(),
                room.getDescription(), roomDetailResponses, statusResponses,  serviceResponses);

        // gán category cho roomResponse
        Category category = room.getCategory();
        CategoryResponse categoryResponse = null;
        if(category != null)
            categoryResponse = new CategoryResponse(category.getId(), category.getType(), category.getDescription());
        roomResponse.setCategory(categoryResponse);

        return roomResponse;
    }
}
