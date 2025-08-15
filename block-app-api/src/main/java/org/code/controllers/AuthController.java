    package org.code.controllers;

    import org.code.payload.JwtAuthRequest;
    import org.code.payload.JwtAuthResponse;
    import org.code.payload.UserDto;
    import org.code.security.JwtTokenHelper;
    import org.code.services.UserService;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.http.HttpStatus;
    import org.springframework.http.ResponseEntity;
    import org.springframework.security.authentication.AuthenticationManager;
    import org.springframework.security.authentication.BadCredentialsException;
    import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
    import org.springframework.security.core.userdetails.UserDetails;
    import org.springframework.security.core.userdetails.UserDetailsService;
    import org.springframework.web.bind.annotation.PostMapping;
    import org.springframework.web.bind.annotation.RequestBody;
    import org.springframework.web.bind.annotation.RequestMapping;
    import org.springframework.web.bind.annotation.RestController;

    @RestController
    @RequestMapping("/api/v1/auth/")
    public class AuthController {
        @Autowired
        private JwtTokenHelper jwtTokenHelper;
        @Autowired
        private UserDetailsService userDetailsService;
        @Autowired
        private AuthenticationManager authenticationManager;
        @Autowired
        private UserService  userService;
        private JwtAuthRequest jwtAuthRequest;
        private JwtAuthResponse jwtAuthResponse;

        @PostMapping("/login")
        public ResponseEntity<JwtAuthResponse> createToken(@RequestBody JwtAuthRequest jwtAuthRequest) {

            this.authenticate(jwtAuthRequest.getUsername(), jwtAuthRequest.getPassword());
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(jwtAuthRequest.getUsername());
            String token = this.jwtTokenHelper.generateToken(userDetails);
            JwtAuthResponse jwtAuthResponse = new JwtAuthResponse();
            jwtAuthResponse.setToken(token);
            return new ResponseEntity<>(jwtAuthResponse, HttpStatus.OK);
        }
        private void authenticate(String username, String password) {
            UsernamePasswordAuthenticationToken  usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(username, password);
            try {
                this.authenticationManager.authenticate(usernamePasswordAuthenticationToken);
            } catch (BadCredentialsException e){
                System.out.println("Bad credentials");
                throw new BadCredentialsException("Bad credentials");
            }

        }
        //register new user
        @PostMapping("/register")
        public ResponseEntity<UserDto> registerUser(@RequestBody UserDto userDto) {
            UserDto userDto1 = this.userService.registeUser(userDto);
            return new ResponseEntity<UserDto>(userDto1, HttpStatus.CREATED);
        }
    }
