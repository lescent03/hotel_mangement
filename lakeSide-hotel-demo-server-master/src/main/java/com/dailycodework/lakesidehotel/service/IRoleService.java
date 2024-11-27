package com.dailycodework.lakesidehotel.service;

import com.dailycodework.lakesidehotel.model.Role;
import com.dailycodework.lakesidehotel.model.User;

import java.util.List;
import java.util.Optional;

public interface IRoleService {
    List<Role> getRoles();

    Role createRole(Role theRole);

    Optional<Role> GetRoleById(Long roleId);

    Role UpdateRole(Long roleId, Role role);

    User removeUserFromRole(Long userId, Long roleId);

    User assignRoleToUser(Long userId, Long roleId);

    Role removeAllUsersFromRole(Long roleId);
}
