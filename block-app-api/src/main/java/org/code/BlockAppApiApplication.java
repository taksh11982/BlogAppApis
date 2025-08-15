package org.code;

import org.code.entities.Role;
import org.code.repo.RoleRepo;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@SpringBootApplication
public class BlockAppApiApplication implements CommandLineRunner {
    @Autowired
    PasswordEncoder passwordEncoder;
    @Autowired
    private RoleRepo roleRepo;
    public static void main(String[] args) {
        SpringApplication.run(BlockAppApiApplication.class, args);
    }
    @Bean
    public ModelMapper modelMapper(){
        return new ModelMapper();
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println(this.passwordEncoder.encode("abcde"));
        try{
            Role role= new Role();
            role.setId(501);
            role.setRoleName("ROLE_NORMAL");
            Role role1= new Role();
            role1.setId(502);
            role1.setRoleName("ROLE_ADMIN");
            List<Role> roles = List.of(role, role1);
            List<Role> roles1 = this.roleRepo.saveAll(roles);
            roles.forEach(r -> {
                System.out.println(r.getRoleName());
            });
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
