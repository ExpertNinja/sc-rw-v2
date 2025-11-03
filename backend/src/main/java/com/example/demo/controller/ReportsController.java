package com.example.demo.controller;

import com.example.demo.dto.ReportDTO;
import com.example.demo.entity.ReportEntity;
import com.example.demo.service.ReportService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportsController {

    private final ReportService reportService;

    public ReportsController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/pending")
    public List<ReportEntity> getPendingReports() {
        return reportService.getReportsByStatus("pending");
    }

    @GetMapping("/search")
    public Page<ReportEntity> searchReports(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return reportService.searchReports(q, startDate, endDate, PageRequest.of(page, size));
    }

    @GetMapping("/recent")
    public Page<ReportDTO> getRecentReports(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return reportService.getRecentReports(PageRequest.of(page, size));
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<Resource> downloadReport(@PathVariable Long id) throws IOException {
        ReportEntity report = reportService.getReportById(id);
        Path filePath = Paths.get(report.getFilePath());
        Resource resource = new UrlResource(filePath.toUri());

        if (resource.exists() || resource.isReadable()) {
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + report.getName() + "\"")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(resource);
        } else {
            throw new RuntimeException("Could not read the file!");
        }
    }

    @PostMapping("/download/bulk")
    public ResponseEntity<Resource> downloadBulkReports(@RequestBody List<Long> ids) throws IOException {
        List<ReportEntity> reports = reportService.getReportsByIds(ids);
        Path zipFile = Paths.get("temp.zip");

        try (ZipOutputStream zos = new ZipOutputStream(Files.newOutputStream(zipFile))) {
            for (ReportEntity report : reports) {
                Path filePath = Paths.get(report.getFilePath());
                if (Files.exists(filePath)) {
                    zos.putNextEntry(new ZipEntry(report.getName()));
                    Files.copy(filePath, zos);
                    zos.closeEntry();
                }
            }
        }

        Resource resource = new UrlResource(zipFile.toUri());
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"reports.zip\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ReportEntity> updateReportStatus(@PathVariable Long id, @RequestBody Map<String, String> statusUpdate) {
        String status = statusUpdate.get("status");
        if (status == null || status.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        ReportEntity updatedReport = reportService.updateReportStatus(id, status);
        return ResponseEntity.ok(updatedReport);
    }
}
