package com.dailycodework.lakesidehotel.response;

import com.dailycodework.lakesidehotel.model.User;
import lombok.*;

import java.util.List;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RoleResponse {
    private Long id;
    private String name;
    private List<UserResponse> users;

    public RoleResponse(Long id, String name) {
        this.id = id;
        this.name = name;
    }
}
