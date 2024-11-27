package com.dailycodework.lakesidehotel.service;

import com.dailycodework.lakesidehotel.exception.RoleAlreadyExistException;
import com.dailycodework.lakesidehotel.exception.UserAlreadyExistsException;
import com.dailycodework.lakesidehotel.model.Role;
import com.dailycodework.lakesidehotel.model.User;
import com.dailycodework.lakesidehotel.repository.RoleRepository;
import com.dailycodework.lakesidehotel.repository.UserRepository;
import com.dailycodework.lakesidehotel.response.ServiceResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RoleService implements IRoleService{
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;

    @Override
    public List<Role> getRoles() {
        return roleRepository.findAll();
    }

    public String CreateRoleName(String name){
        String roleName = name.trim().toUpperCase();
        if (!roleName.startsWith("ROLE_")) {
            roleName = roleName.replaceAll("(?i)role", "").trim();

            roleName = "ROLE_" + roleName;
        }
        return roleName;
    }

    @Override
    public Role createRole(Role theRole) {
        String roleName = CreateRoleName(theRole.getName());
        Role role = new Role(roleName);
        if (roleRepository.existsByName(roleName)){
            throw new RoleAlreadyExistException(theRole.getName()+" role already exists");
        }
        return roleRepository.save(role);
    }

    @Override
    public Optional<Role> GetRoleById(Long roleId){
        return roleRepository.findById(roleId);
    }

    @Override
    public Role UpdateRole(Long roleId, Role roleUpdate){
        Role role = roleRepository.findById(roleId).orElse(new Role());
        if(role.getId() != null){
            role.setName(CreateRoleName(roleUpdate.getName()));
            return roleRepository.save(role);
        }
        return role;
    }

    @Override
    public User removeUserFromRole(Long userId, Long roleId) {
        Optional<User> user = userRepository.findById(userId);
        Optional<Role>  role = roleRepository.findById(roleId);
        if (role.isPresent() && role.get().getUsers().contains(user.get())){
            role.get().removeUserFromRole(user.get());
            roleRepository.save(role.get());
            return user.get();
        }
        throw new UsernameNotFoundException("User not found");
    }

    @Override
    public User assignRoleToUser(Long userId, Long roleId) {
        Optional<User> user = userRepository.findById(userId);
        Optional<Role>  role = roleRepository.findById(roleId);
        if (user.isPresent() && user.get().getRoles().contains(role.orElse(new Role()))){
            throw new UserAlreadyExistsException(
                    user.get().getFirstName()+ " is already assigned to the" + role.orElse(new Role()).getName()+ " role");
        }
        if (role.isPresent()){
            role.get().assignRoleToUser(user.orElse(new User()));
            roleRepository.save(role.get());
        }
        return user.orElse(new User());
    }

    @Override
    public Role removeAllUsersFromRole(Long roleId) {
        Optional<Role> role = roleRepository.findById(roleId);
        role.ifPresent(Role::removeAllUsersFromRole);
        return roleRepository.save(role.orElse(new Role()));
    }

    public User SetRoleForUser(User userCurrent, User updateUser){
        List<Role> newRoles = updateUser.getRoles();
        List<Role> currentRoles = userCurrent.getRoles();
        List<Long> idUserRoleCurrents = new ArrayList<>();
        List<Long> idUserRoleNews = new ArrayList<>();

        if(newRoles != null){
            for(Role role : newRoles){
                idUserRoleNews.add(role.getId());
            }
        }
        for(Role role : currentRoles){
            idUserRoleCurrents.add(role.getId());
        }
        System.out.println("danh sách id hiện tại: " + idUserRoleCurrents);
        System.out.println("danh sách id mới: " + idUserRoleNews);

        if(newRoles != null){
            for (Role role : newRoles ){
                Role role1 = GetRoleById(role.getId()).orElse(new Role());
                if(currentRoles.contains(role1)){
                    continue;
                }
                else{
                    assignRoleToUser(userCurrent.getId(), role.getId());
                }
            }
        }

        idUserRoleNews.removeIf(Objects::isNull);
        List<Long> diffIds = new ArrayList<>(idUserRoleCurrents);
        diffIds.removeAll(idUserRoleNews);
        System.out.println("danh sách id cần xóa: " + diffIds);

        for(Long id : diffIds){
            removeUserFromRole(userCurrent.getId(), id);
        }

        return userCurrent;
    }
}
