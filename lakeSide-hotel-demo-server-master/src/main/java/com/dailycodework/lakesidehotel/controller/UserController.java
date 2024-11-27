package com.dailycodework.lakesidehotel.controller;

import com.dailycodework.lakesidehotel.model.Role;
import com.dailycodework.lakesidehotel.model.Room;
import com.dailycodework.lakesidehotel.model.User;
import com.dailycodework.lakesidehotel.response.RoleResponse;
import com.dailycodework.lakesidehotel.response.RoomResponse;
import com.dailycodework.lakesidehotel.response.UserResponse;
import com.dailycodework.lakesidehotel.service.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/users")
public class UserController {
    private final RoleController roleController;
    private final IUserService iUserService;

    @DeleteMapping("/delete/{userId}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or (hasRole('ROLE_USER') and #email == principal.username)")
    public ResponseEntity<String> deleteUser(@PathVariable("userId") String email){
        try{
            iUserService.deleteUser(email);
            return ResponseEntity.ok("User deleted successfully");
        }catch (UsernameNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting user: " + e.getMessage());
        }
    }

    @PutMapping("/update/{userId}")
    //@PreAuthorize("hasRole('ROLE_ADMIN')")
    public  ResponseEntity<UserResponse>updateRoom(@PathVariable Long userId, @RequestBody User updateUser) {
        System.out.println("dữ liệu update nhận được: "+updateUser);
        User userCurrent = iUserService.GetUserById(userId);
        User saveUpdateUser = iUserService.UpdateUser(userCurrent, updateUser);
        return ResponseEntity.ok(GetUserResponse(saveUpdateUser));
    }

    @GetMapping("/{email}")
    //@PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> getUserByEmail(@PathVariable("email") String email){
        try{
            User theUser = iUserService.getUser(email);
            return ResponseEntity.ok(GetUserResponse(theUser));
        }catch (UsernameNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching user");
        }
    }

    @GetMapping("/user/{userId}")
    //@PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<UserResponse> getUser(@PathVariable Long userId){

        User user = iUserService.GetUserById(userId);
        List<UserResponse> userResponses = new ArrayList<>();

        return ResponseEntity.status(HttpStatus.OK).body(GetUserResponse(user));
    }

    @GetMapping("/all")
    //@PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<UserResponse>> getUsers(){

        List<User> users = iUserService.getUsers();
        List<UserResponse> userResponses = new ArrayList<>();
        for(User user : users){
            userResponses.add(GetUserResponse(user));
        }

        return ResponseEntity.status(HttpStatus.OK).body(userResponses);
    }

    public UserResponse GetUserResponse(User user){
        List<Role> roles = user.getRoles();
        List<RoleResponse> roleResponses = new ArrayList<>();
        if(roles != null){
            for(Role role : roles){
                roleResponses.add(roleController.GetRoleResponse(role));
            }
        }
        return new UserResponse(user.getId(), user.getFirstName(), user.getLastName(), user.getEmail(),
                user.getPassword(),user.getIdNumber(),roleResponses);
    }
}
