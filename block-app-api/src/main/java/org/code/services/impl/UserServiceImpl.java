    package org.code.services.impl;

    import org.code.entities.Role;
    import org.code.entities.User;
    import org.code.exceptions.ResouceNotFoundException;
    import org.code.payload.UserDto;
    import org.code.repo.RoleRepo;
    import org.code.repo.UserRepo;
    import org.code.services.UserService;
    import org.modelmapper.ModelMapper;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
    import org.springframework.security.crypto.password.PasswordEncoder;
    import org.springframework.stereotype.Service;
    import java.util.List;
    import java.util.Optional;
    import java.util.stream.Collectors;

    @Service
    public class UserServiceImpl implements UserService {
        @Autowired
        private UserRepo userRepo;
        @Autowired
        private ModelMapper modelMapper;
        @Autowired
        private PasswordEncoder passwordEncoder;
        @Autowired
        private RoleRepo roleRepo;
        @Override
        public UserDto registeUser(UserDto userDto) {
            User user = this.modelMapper.map(userDto, User.class);
            user.setPassword(passwordEncoder.encode(userDto.getPassword()));
            //roles
            Role role = this.roleRepo.findById(501).get();
            user.getRoles().add(role);
            this.userRepo.save(user);
            return this.modelMapper.map(user, UserDto.class);
        }

        @Override
        public UserDto createUser(UserDto user) {
            User user1 = this.dtoToUser(user);
            User d=this.userRepo.save(user1);
            return this.userToDto(d);
        }

        @Override
        public UserDto updateUser(UserDto userDto, int id) {
            User existingUser = this.userRepo.findById(id)
                    .orElseThrow(() -> new ResouceNotFoundException("User","Id" ,(long)id));

            // Update fields
            existingUser.setName(userDto.getName());
            existingUser.setEmail(userDto.getEmail());
            existingUser.setPassword(userDto.getPassword());
            existingUser.setAbout(userDto.getAbout());

            // Save updated user
            User updatedUser = this.userRepo.save(existingUser);

            return this.userToDto(updatedUser);
        }

        @Override
        public UserDto getUserById(int id) {
             User user= this.userRepo.findById(id).orElseThrow(() -> new ResouceNotFoundException("User","Id" ,(long)id));
             return this.userToDto(user);
        }

        @Override
        public List<UserDto> getAllUsers() {
           List<User> users=this.userRepo.findAll();
           List<UserDto> userDtos=users.stream().map(u->this.userToDto(u)).collect(Collectors.toList());

            return userDtos;
        }

        @Override
        public void deleteUserById(int id) {
            User user= this.userRepo.findById(id).orElseThrow(() -> new ResouceNotFoundException("User","Id" ,(long)id));
            this.userRepo.delete(user);
        }
    //    public User dtoToUser(UserDto userDto) {
    //        User user = new User();
    //        user.setId(userDto.getId());
    //        user.setName(userDto.getName());
    //        user.setEmail(userDto.getEmail());
    //        user.setPassword(userDto.getPassword());
    //        user.setAbout(userDto.getAbout());
    //        return user;
    //    }
        public User dtoToUser(UserDto userDto) {
            User map = this.modelMapper.map(userDto, User.class);
            return map;
        }
    //    public UserDto userToDto(User user) {
    //        UserDto userDto = new UserDto();
    //        userDto.setId(user.getId());
    //        userDto.setName(user.getName());
    //        userDto.setEmail(user.getEmail());
    //        userDto.setPassword(user.getPassword());
    //        userDto.setAbout(user.getAbout());
    //        return userDto;
    //    }
        public UserDto userToDto(User user){
            UserDto map = this.modelMapper.map(user, UserDto.class);
            return map;
        }
    }
