package com.example.demo.repository;

import com.example.demo.model.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupRepository extends JpaRepository<Group, Integer> {

    /**
     * Find all groups that a user is NOT subscribed to and has NO pending subscription request for.
     * Excludes groups where:
     * 1. User has an active subscription
     * 2. User has a pending subscription request
     */
    @Query("SELECT g FROM Group g WHERE g.id NOT IN " +
           "(SELECT s.group.id FROM Subscription s WHERE s.user.id = :userId) " +
           "AND g.id NOT IN " +
           "(SELECT sr.group.id FROM SubscriptionRequest sr WHERE sr.user.id = :userId AND sr.status = 'pending')")
    List<Group> findAvailableGroupsForUser(@Param("userId") Integer userId);
}
