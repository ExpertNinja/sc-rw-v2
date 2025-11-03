package com.example.demo.service;

import com.example.demo.dto.ReportDTO;
import com.example.demo.entity.ReportEntity;
import com.example.demo.model.Group;
import com.example.demo.repository.ReportRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReportService {

    private final ReportRepository reportRepository;

    public ReportService(ReportRepository reportRepository) {
        this.reportRepository = reportRepository;
    }

    /**
     * Returns all reports between given dates.
     */
    public List<ReportEntity> getReportsByDateRange(LocalDate startDate, LocalDate endDate) {
        return reportRepository.findByDateBetween(startDate, endDate);
    }

    /**
     * Returns reports by status.
     */
    public List<ReportEntity> getReportsByStatus(String status) {
        return reportRepository.findByStatus(status);
    }

    /**
     * Returns all reports.
     */
    public List<ReportEntity> getAllReports() {
        return reportRepository.findAll();
    }

    /**
     * Returns reports by group id.
     * Note: ReportEntity does not have groupId field, so this method is commented out.
     */
    // public List<ReportEntity> getReportsByGroupId(Integer groupId) {
    //     // Assuming Report has a groupId field or relationship
    //     return reportRepository.findByGroupId(groupId);
    // }

    /**
     * Returns recent reports by user email.
     */
    public List<ReportDTO> getRecentReportsByUserEmail(String email) {
        // Assuming logic to get recent reports for user
        return reportRepository.findRecentByUserEmail(email);
    }

    /**
     * Searches reports with pagination.
     */
    public Page<ReportEntity> searchReports(String q, LocalDate startDate, LocalDate endDate, Pageable pageable) {
        return reportRepository.searchReports(q, startDate, endDate, pageable);
    }

    /**
     * Returns recent reports with pagination.
     */
    public Page<ReportDTO> getRecentReports(Pageable pageable) {
        return reportRepository.findRecentReports(pageable);
    }

    /**
     * Returns a report by ID.
     */
    public ReportEntity getReportById(Long id) {
        return reportRepository.findById(id).orElseThrow(() -> new RuntimeException("Report not found"));
    }

    /**
     * Returns reports by list of IDs.
     */
    public List<ReportEntity> getReportsByIds(List<Long> ids) {
        return reportRepository.findAllById(ids);
    }

    /**
     * Updates the status of a report.
     */
    public ReportEntity updateReportStatus(Long id, String status) {
        ReportEntity report = getReportById(id);
        report.setStatus(status);
        report.setUpdatedAt(LocalDateTime.now());
        return reportRepository.save(report);
    }
}
