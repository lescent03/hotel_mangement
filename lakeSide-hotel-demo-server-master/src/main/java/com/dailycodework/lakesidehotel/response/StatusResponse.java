package com.dailycodework.lakesidehotel.response;

import lombok.*;

import java.time.LocalDate;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StatusResponse {
    private  Long id;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
    private String description;
    private RoomResponse room;

    public StatusResponse(Long id, String status, String description, LocalDate startDate, LocalDate endDate) {
        this.id = id;
        this.status = status;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
    }
}
