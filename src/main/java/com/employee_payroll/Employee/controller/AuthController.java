package com.employee_payroll.Employee.controller;

import com.employee_payroll.Employee.model.Role;
import com.employee_payroll.Employee.model.User;
import com.employee_payroll.Employee.repository.UsersRepo;
import com.employee_payroll.Employee.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UsersRepo usersRepo;
    private final PasswordEncoder passwordEncoder;

    // API for logging
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request)
    {
        String username = request.get("username");
        String password = request.get("password");


        if (username == null || username.isBlank() ||
                password == null || password.isBlank())
        {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "username and password are required"));
        }

        try
        {

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password));

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();


            String role = userDetails.getAuthorities()
                    .iterator().next()
                    .getAuthority()
                    .replace("ROLE_", "");


            String token = jwtUtil.generateToken(username, role);

            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "username", username,
                    "role", role
            ));
        }
        catch (Exception e)
        {

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid username or password"));
        }
    }

    // API for Registering EMPLOYEE
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request)
    {
        String username = request.get("username");
        String password = request.get("password");
        String roleStr  = request.get("role");

        if (username == null || username.isBlank() ||
                password == null || password.isBlank() ||
                roleStr  == null || roleStr.isBlank())
        {
            return ResponseEntity.badRequest()
                    .body(Map.of("message",
                            "username, password and role are required"));
        }

        if (usersRepo.findByUsername(username).isPresent())
        {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Username already exists"));
        }

        Role role;
        try {
            role = Role.valueOf(roleStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Invalid role. Use ADMIN or EMPLOYEE"));
        }

        // ✅ Create and save user
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);
        usersRepo.save(user);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", "User registered successfully",
                        "username", username,
                        "role", role));
    }

//     API for Registering ADMIN
    @PostMapping("/register/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> registerAdmin(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");

        if (username == null || username.isBlank() ||
                password == null || password.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "username and password are required"));
        }

        if (usersRepo.findByUsername(username).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Username already exists"));
        }

        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(Role.ADMIN);
        usersRepo.save(user);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", "User registered successfully", "username", username, "role", Role.ADMIN));
    }
}