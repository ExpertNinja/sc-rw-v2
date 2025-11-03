package com.example.demo.dto;

import java.time.LocalDateTime;

public class ReportDTO {
    private Long id;
    private String name;
    private String description;
    private String filePath;
    private String fileType;
    private LocalDateTime createdAt;

    // Constructor for JPQL query
    public ReportDTO(Long id, String name, String description, String filePath, String fileType, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.filePath = filePath;
        this.fileType = fileType;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
