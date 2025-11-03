package com.example.demo.repository;

import com.example.demo.entity.PathConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PathConfigRepository extends JpaRepository<PathConfig, Long> {
    // Removed findByReportName as PathConfig does not have reportName field
}
