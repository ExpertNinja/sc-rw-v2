package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "transfer_logs")
@Data
public class TransferLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String uniqueId;

    @Column(nullable = false)
    private String action;

    @Column(nullable = false)
    private String inputFileName;

    @Column(nullable = false)
    private String fileType;

    @Column(nullable = false)
    private String outputFolderPath;

    @Column(nullable = false)
    private String status = "PENDING";

    @Column(length = 1000)
    private String errorMessage;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime processedAt;
}
