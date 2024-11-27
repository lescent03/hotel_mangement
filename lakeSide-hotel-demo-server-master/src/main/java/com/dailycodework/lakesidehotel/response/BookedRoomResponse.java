package com.dailycodework.lakesidehotel.response;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookedRoomResponse {
    private  Long id;
    private LocalDateTime bookingDateTime;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private String guestFullName;
    private String guestEmail;
    private int NumOfAdults;
    private int NumOfChildren;
    private int children5_11;
    private int totalNumOfGuest;
    private int numOfRoom;
    private String bookingConfirmationCode;
    private String status;
    private RoomResponse room;
    private List<ServiceResponse> services;
    private UserResponse user;
    private BillResponse bill;
    private List<SurchargeResponse> surcharges;

}
