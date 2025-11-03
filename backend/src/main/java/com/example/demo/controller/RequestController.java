package com.example.demo.controller;

import com.example.demo.dto.RequestDTO;
import com.example.demo.entity.PathConfig;
import com.example.demo.entity.ReportEntity;
import com.example.demo.repository.PathConfigRepository;
import com.example.demo.repository.ReportRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/requests")
@Slf4j
public class RequestController {

    @Autowired
    private PathConfigRepository pathConfigRepository;

    @Autowired
    private ReportRepository reportRepository;

    @PostMapping
    public ResponseEntity<String> createRequest(@RequestBody RequestDTO requestDTO) {
        log.info("Received request: {}", requestDTO);

        try {
            // Create PathConfig from request
            PathConfig pathConfig = new PathConfig();
            pathConfig.setUniqueId(requestDTO.getUniqueId());
            pathConfig.setAction(requestDTO.getAction());
            pathConfig.setInputFileName(requestDTO.getInputFileName());
            pathConfig.setFileType(requestDTO.getFileType());
            pathConfig.setOutputFolderPath(requestDTO.getOutputFolderPath());
            pathConfig.setDescription("Auto-created from API request");

            PathConfig savedPathConfig = pathConfigRepository.save(pathConfig);
            log.info("Saved PathConfig: {}", savedPathConfig.getId());

            // Create corresponding Report
            ReportEntity report = new ReportEntity();
            report.setName(requestDTO.getInputFileName());
            report.setDate(LocalDate.now()); // Extract from filename if possible
            report.setStatus("pending");
            report.setPathConfig(savedPathConfig);
            report.setCreatedAt(LocalDateTime.now());
            report.setUpdatedAt(LocalDateTime.now());

            reportRepository.save(report);
            log.info("Saved Report: {}", report.getId());

            return ResponseEntity.ok("Request processed successfully");

        } catch (Exception e) {
            log.error("Error processing request: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body("Error processing request: " + e.getMessage());
        }
    }
}
