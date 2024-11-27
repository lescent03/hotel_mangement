package com.dailycodework.lakesidehotel.controller;

import com.dailycodework.lakesidehotel.exception.RoleAlreadyExistException;
import com.dailycodework.lakesidehotel.model.Role;
import com.dailycodework.lakesidehotel.model.User;
import com.dailycodework.lakesidehotel.response.RoleResponse;
import com.dailycodework.lakesidehotel.service.IRoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

import static org.springframework.http.HttpStatus.FOUND;

@RestController
@RequiredArgsConstructor
@RequestMapping("/roles")
public class RoleController {
    private final IRoleService iRoleService;

    @GetMapping("/all-roles")
    public ResponseEntity<List<RoleResponse>> getAllRoles(){
        List<Role> roles = iRoleService.getRoles();
        List<RoleResponse> roleResponses = new ArrayList<>();
        for(Role role : roles){
            roleResponses.add(GetRoleResponse(role));
        }

        return ResponseEntity.status(HttpStatus.OK).body(roleResponses);
    }

    @PostMapping("/create-new-role")
    public ResponseEntity<RoleResponse> createRole(@RequestBody Role theRole){
        try{
            Role role = iRoleService.createRole(theRole);
            return ResponseEntity.status(HttpStatus.CREATED).body(GetRoleResponse(role));
        }catch(RoleAlreadyExistException re){
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new RoleResponse());

        }
    }

    @PutMapping("/role/update/{roleId}")
    public ResponseEntity<RoleResponse> UpdateRole(@PathVariable Long roleId, @RequestBody Role role){
        Role updateRole = iRoleService.UpdateRole(roleId,role);
        return ResponseEntity.ok(GetRoleResponse(updateRole));
    }

    @GetMapping("/role/{roleId}")
    public ResponseEntity<RoleResponse> GetRoleById(@PathVariable Long roleId){
        Role role = iRoleService.GetRoleById(roleId).orElse(new Role());
        return ResponseEntity.ok(GetRoleResponse(role));
    }

    @PostMapping("/remove-user-from-role")
    public User removeUserFromRole(
            @RequestParam("userId") Long userId,
            @RequestParam("roleId") Long roleId){
        return iRoleService.removeUserFromRole(userId, roleId);
    }

    @PostMapping("/assign-user-to-role")
    public User assignUserToRole(
            @RequestParam("userId") Long userId,
            @RequestParam("roleId") Long roleId){
        return iRoleService.assignRoleToUser(userId, roleId);
    }

    public RoleResponse GetRoleResponse(Role role){

        return new RoleResponse(role.getId(),role.getName());
    }
}
