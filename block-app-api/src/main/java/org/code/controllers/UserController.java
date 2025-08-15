package org.code.controllers;

import jakarta.validation.Valid;
import org.code.payload.ApiResponse;
import org.code.payload.UserDto;
import org.code.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {
    //create user
    //update user
    //delete user
    @Autowired
    private UserService userService;
    @PostMapping("/")
    public ResponseEntity<?> createUser(@Valid @RequestBody UserDto userDto) {
        UserDto user = this.userService.createUser(userDto);
        return new  ResponseEntity<>(user, HttpStatus.CREATED);
    }
    @PutMapping("/{id}")
    public ResponseEntity<UserDto> updateUser(@RequestBody @Valid    UserDto userDto,@PathVariable Integer id) {
        UserDto userDto1 = this.userService.updateUser(userDto, id);
        return ResponseEntity.ok(userDto1);
    }
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<UserDto> deleteUser(@PathVariable Integer id) {
        this.userService.deleteUserById(id);
        return new ResponseEntity(new ApiResponse("user deleted successfully",true),HttpStatus.OK);
    }
    @GetMapping("/")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(this.userService.getAllUsers());
    }
    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getAllUsers(@PathVariable Integer id) {
        return ResponseEntity.ok(this.userService.getUserById(id));
    }


}
