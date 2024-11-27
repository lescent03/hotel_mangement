package com.dailycodework.lakesidehotel.service;

import com.dailycodework.lakesidehotel.model.User;

import java.util.List;

public interface IUserService {
    List<User> getUsers();

    User getUser(String email);

    User GetUserById(Long userId);

    User UpdateUser(User userCurrent, User updateUser);

    void deleteUser(String email);

    User registerUser(User user);
}
