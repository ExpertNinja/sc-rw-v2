package com.example.demo.repository;

import com.example.demo.entity.TransferLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransferLogRepository extends JpaRepository<TransferLog, Long> {
    TransferLog findByUniqueId(String uniqueId);
}
