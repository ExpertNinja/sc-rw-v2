package com.example.demo.controller;

import com.example.demo.dto.SubscriptionRequestDTO;
import com.example.demo.model.SubscriptionRequest;
import com.example.demo.service.SubscriptionRequestService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/subscription-requests")
@CrossOrigin(origins = "*")
public class SubscriptionRequestController {

    private final SubscriptionRequestService subscriptionRequestService;

    public SubscriptionRequestController(SubscriptionRequestService subscriptionRequestService) {
        this.subscriptionRequestService = subscriptionRequestService;
    }

    /**
     * POST /api/subscription-requests
     * Creates or updates a subscription request for a user to join a group.
     * Request body should contain: { "userEmail": "user@example.com", "groupId": 1 }
     */
    @PostMapping
    public ResponseEntity<SubscriptionRequest> createSubscriptionRequest(@RequestBody Map<String, Object> request) {
        String userEmail = (String) request.get("userEmail");
        Integer groupId = (Integer) request.get("groupId");

        if (userEmail == null || groupId == null) {
            return ResponseEntity.badRequest().build();
        }

        SubscriptionRequest subscriptionRequest = subscriptionRequestService.createOrUpdateSubscriptionRequest(userEmail, groupId);
        return ResponseEntity.ok(subscriptionRequest);
    }

    /**
     * GET /api/subscription-requests?email={userEmail}
     * Returns all subscription requests for a user with group details.
     */
    @GetMapping
    public List<SubscriptionRequestDTO> getUserSubscriptionRequests(@RequestParam String email) {
        return subscriptionRequestService.getUserSubscriptionRequests(email);
    }

    /**
     * POST /api/subscription-requests/{id}/approve
     * Approves a subscription request.
     * Request body should contain: { "adminEmail": "admin@example.com" }
     */
    @PostMapping("/{id}/approve")
    public ResponseEntity<SubscriptionRequest> approveSubscriptionRequest(@PathVariable Integer id, @RequestBody Map<String, Object> request) {
        String adminEmail = (String) request.get("adminEmail");
        if (adminEmail == null) {
            return ResponseEntity.badRequest().build();
        }
        SubscriptionRequest approvedRequest = subscriptionRequestService.approveSubscriptionRequest(id, adminEmail);
        return ResponseEntity.ok(approvedRequest);
    }
}