package com.dailycodework.lakesidehotel.service;

import com.dailycodework.lakesidehotel.exception.UserAlreadyExistsException;
import com.dailycodework.lakesidehotel.model.Role;
import com.dailycodework.lakesidehotel.model.Room;
import com.dailycodework.lakesidehotel.model.User;
import com.dailycodework.lakesidehotel.repository.RoleRepository;
import com.dailycodework.lakesidehotel.repository.UserRepository;
import com.dailycodework.lakesidehotel.response.RoomResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService implements IUserService{
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    private final RoleService roleService;

    private final PasswordEncoder passwordEncoder;

    @Override
    public List<User> getUsers(){
        return  userRepository.findAll();
    }

    @Override
    public User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    @Override
    public User GetUserById(Long userId) {
        return userRepository.findById(userId).orElse(new User());
    }

    public User SetBasicInfoUser(User userCurrent, User updateUser){
        userCurrent.setFirstName(updateUser.getFirstName());
        userCurrent.setLastName(updateUser.getLastName());
        userCurrent.setEmail(updateUser.getEmail());
        String pass = updateUser.getPassword();
        if(pass != null && pass.startsWith("$2a$") && pass.length() == 60)
            userCurrent.setPassword(updateUser.getPassword());
        else
            userCurrent.setPassword(passwordEncoder.encode(updateUser.getPassword()));

        userCurrent.setIdNumber(updateUser.getIdNumber());
        return userCurrent;
    }

    @Override
    public  User UpdateUser(User userCurrent, User updateUser){
        userCurrent = SetBasicInfoUser(userCurrent,updateUser);

        userCurrent = roleService.SetRoleForUser(userCurrent, updateUser);

        return userRepository.save(userCurrent);
    }

    @Transactional
    @Override
    public void deleteUser(String email) {
        User theUser = getUser(email);
        if (theUser != null){
            userRepository.deleteByEmail(email);
        }
    }

    @Override
    public User registerUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())){
            throw new UserAlreadyExistsException(user.getEmail() + " already exists");
        }
        User newUser = new User();
        newUser = SetBasicInfoUser(newUser, user);
        Role userRole = roleRepository.findByName("ROLE_USER").orElse(null);
        newUser.setRoles(Collections.singletonList(userRole));
        return userRepository.save(newUser);
    }
}
