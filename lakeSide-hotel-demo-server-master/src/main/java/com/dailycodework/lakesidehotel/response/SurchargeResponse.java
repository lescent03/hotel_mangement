package com.dailycodework.lakesidehotel.response;

import lombok.*;

import java.math.BigDecimal;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SurchargeResponse {
    private  Long id;
    private String content;
    private int quantity;
    private BigDecimal price;
    private BigDecimal total;
    private BookedRoomResponse bookedRoom;
    private String status;

    public SurchargeResponse(Long id, String content, int quantity, BigDecimal price, BigDecimal total, String status) {
        this.id = id;
        this.content = content;
        this.quantity = quantity;
        this.price = price;
        this.total = total;
        this.status = status;
    }

}
