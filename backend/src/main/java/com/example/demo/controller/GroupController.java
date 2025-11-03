package com.example.demo.controller;

import com.example.demo.entity.ReportEntity;
import com.example.demo.service.ReportService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/groups")
@CrossOrigin(origins = "*")
public class GroupController {

    private final ReportService reportService;

    public GroupController(ReportService reportService) {
        this.reportService = reportService;
    }

    /**
     * GET /api/groups/{groupId}/reports
     * Returns all reports for the given group id.
     * Note: Method commented out as getReportsByGroupId is not available in ReportService.
     */
    // @GetMapping("/{groupId}/reports")
    // public List<ReportEntity> getReportsForGroup(@PathVariable Integer groupId) {
    //     return reportService.getReportsByGroupId(groupId);
    // }
}
