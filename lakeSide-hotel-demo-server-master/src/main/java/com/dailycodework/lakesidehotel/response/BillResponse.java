package com.dailycodework.lakesidehotel.response;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BillResponse {
    private  Long id;
    private String content;
    private LocalDate date;
    private BigDecimal total;
    private BookedRoomResponse bookedRoom;
    private UserResponse user;
    private String status;

    public BillResponse(Long id, String content, LocalDate date, BigDecimal total, UserResponse userResponse, String status) {
        this.id = id;
        this.content = content;
        this.date = date;
        this.total = total;
        this.user = userResponse;
        this.status = status;
    }
}
