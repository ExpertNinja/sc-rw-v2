package com.example.demo.dto;

import java.time.LocalDateTime;

public class SubscriptionRequestDTO {
    private Integer id;
    private Integer groupId;
    private String groupName;
    private String groupDescription;
    private String status;
    private LocalDateTime requestedAt;
    private LocalDateTime approvedAt;
    private String approvedByEmail;

    // Constructor for JPQL query
    public SubscriptionRequestDTO(Integer id, Integer groupId, String groupName, String groupDescription,
                                  String status, LocalDateTime requestedAt, LocalDateTime approvedAt,
                                  String approvedByEmail) {
        this.id = id;
        this.groupId = groupId;
        this.groupName = groupName;
        this.groupDescription = groupDescription;
        this.status = status;
        this.requestedAt = requestedAt;
        this.approvedAt = approvedAt;
        this.approvedByEmail = approvedByEmail;
    }

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getGroupId() {
        return groupId;
    }

    public void setGroupId(Integer groupId) {
        this.groupId = groupId;
    }

    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public String getGroupDescription() {
        return groupDescription;
    }

    public void setGroupDescription(String groupDescription) {
        this.groupDescription = groupDescription;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getRequestedAt() {
        return requestedAt;
    }

    public void setRequestedAt(LocalDateTime requestedAt) {
        this.requestedAt = requestedAt;
    }

    public LocalDateTime getApprovedAt() {
        return approvedAt;
    }

    public void setApprovedAt(LocalDateTime approvedAt) {
        this.approvedAt = approvedAt;
    }

    public String getApprovedByEmail() {
        return approvedByEmail;
    }

    public void setApprovedByEmail(String approvedByEmail) {
        this.approvedByEmail = approvedByEmail;
    }
}