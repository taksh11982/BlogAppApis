package org.code.payload;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.code.entities.Role;

import java.util.HashSet;
import java.util.Set;

@NoArgsConstructor
@Getter
@Setter
public class UserDto {
    private int id;
    @NotBlank(message = "name should not be blank")
    private String name;
    @NotBlank(message = "password should not be blank")
    private String password;
    @Email
    private String email;
    @NotBlank(message = "about should not be blank")
    private String about;
    private Set<RoleDto> roles=new HashSet<>();
}
