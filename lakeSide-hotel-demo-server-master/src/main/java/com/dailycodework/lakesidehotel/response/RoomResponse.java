package com.dailycodework.lakesidehotel.response;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RoomResponse {
    private  Long id;
    private String codeRoom;
    private BigDecimal price;
    private int adults;
    private int childrents;
    private int numOfRoom;
    private String description;
    private CategoryResponse category;
    private List<RoomDetailResponse> roomDetails;
    private List<StatusResponse> statuses;
    private List<ServiceResponse> services;
    private List<BookedRoomResponse> bookings;

    public RoomResponse(Long id, String codeRoom, BigDecimal price, int adults, int childrents,
                        int numOfRoom, String description,
                        List<RoomDetailResponse> roomDetailResponses,
                        List<StatusResponse> statusResponses,
                        List<ServiceResponse> serviceResponses) {
        this.id = id;
        this.codeRoom = codeRoom;
        this.price = price;
        this.adults = adults;
        this.childrents = childrents;
        this.numOfRoom = numOfRoom;
        this.description = description;
        this.roomDetails = roomDetailResponses;
        this.statuses = statusResponses;
        this.services = serviceResponses;
    }

    public RoomResponse(Long id, BigDecimal price, int adults, int childrents, String description) {
        this.id = id;
        this.price = price;
        this.adults = adults;
        this.childrents = childrents;
        this.description = description;
    }
}
