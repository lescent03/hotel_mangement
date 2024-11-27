package com.dailycodework.lakesidehotel.response;

import lombok.*;

import java.util.List;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CategoryResponse {
    private  Long id;
    private String type;
    private String description;
    private List<RoomResponse> rooms;

    public CategoryResponse(Long id, String type, String description) {
        this.id = id;
        this.type = type;
        this.description = description;
    }
}
