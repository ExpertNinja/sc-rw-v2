package com.example.demo.repository;

import com.example.demo.dto.SubscriptionRequestDTO;
import com.example.demo.model.SubscriptionRequest;
import com.example.demo.model.User;
import com.example.demo.model.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface SubscriptionRequestRepository extends JpaRepository<SubscriptionRequest, Integer> {

    // Find a subscription request by user and group
    Optional<SubscriptionRequest> findByUserAndGroup(User user, Group group);

    // Find all pending requests for a specific user
    List<SubscriptionRequest> findByUserAndStatus(User user, String status);

    // Check if a pending request exists for user and group
    boolean existsByUserAndGroupAndStatus(User user, Group group, String status);

    // Get all subscription requests for a user with group details
    @Query("SELECT new com.example.demo.dto.SubscriptionRequestDTO(sr.id, g.id, g.name, g.description, " +
           "sr.status, sr.requestedAt, sr.approvedAt, approver.email) " +
           "FROM SubscriptionRequest sr " +
           "JOIN sr.group g " +
           "LEFT JOIN sr.approvedBy approver " +
           "WHERE sr.user.id = :userId " +
           "ORDER BY sr.requestedAt DESC")
    List<SubscriptionRequestDTO> findAllByUserId(@Param("userId") Integer userId);

    // Count approved requests for today
    long countByStatusAndApprovedAtBetween(String status, java.time.LocalDateTime start, java.time.LocalDateTime end);
}