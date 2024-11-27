package com.dailycodework.lakesidehotel.response;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ServiceResponse {
    private Long id; // Unique ID for the service

    private String serviceName; // Name of the service

    private String description;
    private List<BookedRoomResponse> bookedRooms;
    private List<RoomResponse> rooms;
    private String status;

    public ServiceResponse(Long id, String serviceName, String description, String status) {
        this.id = id;
        this.serviceName = serviceName;
        this.description = description;
        this.status = status;
    }
}
