package com.example.demo.repository;

import com.example.demo.dto.ReportDTO;
import com.example.demo.entity.ReportEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<ReportEntity, Long> {
    List<ReportEntity> findByDateBetween(LocalDate startDate, LocalDate endDate);
    List<ReportEntity> findByStatus(String status);

    // Removed findByGroupId as ReportEntity does not have groupId field

    @Query("SELECT new com.example.demo.dto.ReportDTO(r.id, r.name, r.description, r.filePath, r.fileType, r.createdAt) FROM ReportEntity r ORDER BY r.createdAt DESC")
    List<ReportDTO> findRecentByUserEmail(String email);

    @Query("SELECT r FROM ReportEntity r WHERE " +
           "(:q IS NULL OR LOWER(r.name) LIKE LOWER(CONCAT('%', :q, '%'))) AND " +
           "(:startDate IS NULL OR r.date >= :startDate) AND " +
           "(:endDate IS NULL OR r.date <= :endDate)")
    Page<ReportEntity> searchReports(@Param("q") String q,
                                   @Param("startDate") LocalDate startDate,
                                   @Param("endDate") LocalDate endDate,
                                   Pageable pageable);

    @Query("SELECT new com.example.demo.dto.ReportDTO(r.id, r.name, r.description, r.filePath, r.fileType, r.createdAt) FROM ReportEntity r ORDER BY r.createdAt DESC")
    Page<ReportDTO> findRecentReports(Pageable pageable);
}
