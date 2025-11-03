package com.example.demo.controller;

import com.example.demo.service.UserService;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    private final UserService userService;

    public AdminController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/stats")
    public Map<String, Long> getStats() {
        long totalUsers = userService.getTotalUsers();
        long approvedToday = userService.getApprovedToday();
        return Map.of(
            "totalUsers", totalUsers,
            "approvedToday", approvedToday
        );
    }
}
