package org.code.security;

import org.code.entities.User;
import org.code.exceptions.ResouceNotFoundException;
import org.code.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailService implements UserDetailsService {
    @Autowired
    UserRepo userRepo;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        //loading user from database using string
        User user = this.userRepo.findByEmail(username).orElseThrow(() -> new UsernameNotFoundException(username));

        return user;
    }
}
