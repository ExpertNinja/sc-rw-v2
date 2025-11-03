package com.example.demo.service;

import com.example.demo.dto.SubscriptionRequestDTO;
import com.example.demo.model.Group;
import com.example.demo.model.SubscriptionRequest;
import com.example.demo.model.User;
import com.example.demo.repository.SubscriptionRequestRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.GroupRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class SubscriptionRequestService {

    private final SubscriptionRequestRepository subscriptionRequestRepository;
    private final UserRepository userRepository;
    private final GroupRepository groupRepository;

    public SubscriptionRequestService(SubscriptionRequestRepository subscriptionRequestRepository,
                                     UserRepository userRepository,
                                     GroupRepository groupRepository) {
        this.subscriptionRequestRepository = subscriptionRequestRepository;
        this.userRepository = userRepository;
        this.groupRepository = groupRepository;
    }

    /**
     * Creates or updates a subscription request.
     * If a request already exists (any status), it updates the request to 'pending' and resets the timestamp.
     * Otherwise, creates a new pending request.
     */
    @Transactional
    public SubscriptionRequest createOrUpdateSubscriptionRequest(String userEmail, Integer groupId) {
        // Find user
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + userEmail));

        // Find group
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found with id: " + groupId));

        // Check if a request already exists (regardless of status)
        Optional<SubscriptionRequest> existingRequest = subscriptionRequestRepository.findByUserAndGroup(user, group);

        if (existingRequest.isPresent()) {
            // Update existing request
            SubscriptionRequest request = existingRequest.get();
            request.setStatus("pending");
            request.setRequestedAt(LocalDateTime.now());
            request.setApprovedAt(null);
            request.setApprovedBy(null);
            return subscriptionRequestRepository.save(request);
        } else {
            // Create new request
            SubscriptionRequest newRequest = new SubscriptionRequest(user, group);
            return subscriptionRequestRepository.save(newRequest);
        }
    }

    /**
     * Returns all subscription requests for a user with group details.
     * Sorted by requested date (most recent first).
     */
    public List<SubscriptionRequestDTO> getUserSubscriptionRequests(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + userEmail));

        return subscriptionRequestRepository.findAllByUserId(user.getId());
    }

    /**
     * Approves a subscription request by setting status to 'approved', approvedAt to now, and approvedBy to the admin user.
     */
    @Transactional
    public SubscriptionRequest approveSubscriptionRequest(Integer requestId, String adminEmail) {
        SubscriptionRequest request = subscriptionRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Subscription request not found with id: " + requestId));

        User admin = userRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new RuntimeException("Admin user not found with email: " + adminEmail));

        request.setStatus("approved");
        request.setApprovedAt(LocalDateTime.now());
        request.setApprovedBy(admin);

        return subscriptionRequestRepository.save(request);
    }
}