package org.code.services;

import org.code.entities.User;
import org.code.payload.UserDto;

import java.util.List;

public interface UserService {
    UserDto registeUser(UserDto user);
    UserDto createUser(UserDto user);
    UserDto updateUser(UserDto user,int id );
    UserDto getUserById(int id);
    List<UserDto> getAllUsers();
    void deleteUserById(int id);
}
