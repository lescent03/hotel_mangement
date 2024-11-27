package com.dailycodework.lakesidehotel.response;

import lombok.*;

import java.util.List;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String idNumber;
    private List<RoleResponse> roles;
    private List<BookedRoomResponse> bookedRooms;
    private List<BillResponse> bills;

    public UserResponse(Long id, String firstName, String lastName, String email, String password, String idNumber, List<RoleResponse> roleResponses) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.idNumber = idNumber;
        this.roles = roleResponses;
    }
}
