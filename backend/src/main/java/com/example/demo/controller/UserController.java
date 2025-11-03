package com.example.demo.controller;

import com.example.demo.dto.ReportDTO;
import com.example.demo.model.Group;
import com.example.demo.service.ReportService;
import com.example.demo.service.UserService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")  // Allow frontend access
public class UserController {

    private final UserService userService;
    private final ReportService reportService;

    public UserController(UserService userService, ReportService reportService) {
        this.userService = userService;
        this.reportService = reportService;
    }

    @GetMapping("/subscribed-groups")
    public List<Group> getSubscribedGroups(@RequestParam String email) {
        return userService.getSubscribedGroupsByEmail(email);
    }

    @GetMapping("/recent-reports")
    public List<ReportDTO> getRecentReports(@RequestParam String email) {
        return reportService.getRecentReportsByUserEmail(email);
    }

    @GetMapping("/available-groups")
    public List<Group> getAvailableGroups(@RequestParam String email) {
        return userService.getAvailableGroupsByEmail(email);
    }
}
