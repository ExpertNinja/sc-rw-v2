// src/components/User_Subscribe/User_Subscribe.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import "./User_Subscribe.css";

/**
 * User_Subscribe component
 *
 * - Fetches "available groups" the user is NOT subscribed to:
 *   GET http://localhost:8081/api/users/available-groups?email=admin@example.com
 *
 * - Sends subscription request:
 *   POST http://localhost:8081/api/subscription-requests
 *   body: { userEmail: "admin@example.com", groupId: 1 }
 *
 * IMPORTANT:
 * - Backend currently has no auth; adjust headers if you add Basic Auth later.
 * - Replace USER_EMAIL with dynamic value from AuthContext when ready.
 */

const User_Subscribe = () => {
  // If you later want dynamic email, get user from context:
  // const { user } = useAuth();
  // const USER_EMAIL = user?.email || "admin@example.com";
  // For now user asked to hardcode admin@example.com — change as required:
  const { token } = useAuth(); // left in case you later want to use it
  const USER_EMAIL = "admin@example.com";

  // UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [availableGroups, setAvailableGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postingGroupId, setPostingGroupId] = useState(null); // shows spinner on subscribe button
  const [error, setError] = useState(null);

  // Fetch available groups on mount
  useEffect(() => {
    let mounted = true;
    const fetchAvailableGroups = async () => {
      setLoading(true);
      setError(null);

      try {
        // Build URL with email param (encoded)
        const url = `http://localhost:8081/api/users/available-groups?email=${encodeURIComponent(
          USER_EMAIL
        )}`;

        const resp = await fetch(url, {
          method: "GET",
          // No auth header right now; add if needed later
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!resp.ok) {
          throw new Error(`Failed to fetch groups (status ${resp.status})`);
        }

        const data = await resp.json();

        // Expecting array of groups:
        // [{ id, name, description, createdAt, updatedAt }, ...]
        if (!Array.isArray(data)) {
          throw new Error("Invalid response from server - expected array");
        }

        if (mounted) {
          setAvailableGroups(data);
        }
      } catch (err) {
        console.error("Error fetching available groups:", err);
        if (mounted) setError("Unable to load groups. Try again later.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchAvailableGroups();

    // cleanup
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once

  // Filter groups by search term (name or description)
  const filteredGroups = availableGroups.filter((group) => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return true;
    return (
      (group.name || "").toLowerCase().includes(q) ||
      (group.description || "").toLowerCase().includes(q)
    );
  });

  // Handler to request subscription for a group
  const handleSubscribe = async (groupId) => {
    // simple confirm prompt
    const group = availableGroups.find((g) => g.id === groupId);
    if (!group) return;
    const confirmed = window.confirm(
      `Send subscription request for "${group.name}"?`
    );
    if (!confirmed) return;

    setPostingGroupId(groupId);
    setError(null);

    try {
      const url = "http://localhost:8081/api/subscription-requests";
      const body = {
        userEmail: USER_EMAIL,
        groupId: groupId,
      };

      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // No Authorization header: backend currently has no auth.
          // If you add Basic Auth, include:
          // 'Authorization': 'Basic ' + btoa(`${USER_EMAIL}:${PASSWORD}`)
        },
        body: JSON.stringify(body),
      });

      if (!resp.ok) {
        // If backend returns 4xx/5xx with JSON error you can parse it:
        let msg = `Request failed (status ${resp.status})`;
        try {
          const errJson = await resp.json();
          if (errJson && errJson.message) msg = errJson.message;
        } catch (_) { /* ignore */ }
        throw new Error(msg);
      }

      // Sample success response contains the created subscription object
      // You can use it for UI (but we only need to remove group from available list)
      const created = await resp.json();
      console.log("Created subscription:", created);

      // Remove the group from availableGroups so it no longer appears
      setAvailableGroups((prev) => prev.filter((g) => g.id !== groupId));

      // Optional: show a quick alert/toast — using window.alert for simplicity
      window.alert(`Subscription request sent for "${group.name}".`);
    } catch (err) {
      console.error("Error sending subscription request:", err);
      setError("Failed to send subscription request. Try again.");
    } finally {
      setPostingGroupId(null);
    }
  };

  return (
    <div className="subscribe-container container-fluid py-4">
      <div className="text-center mb-5">
        <h2 className="subscribe-title">Subscribe to Groups</h2>
        <p className="subscribe-subtitle">
          Explore available groups and request access instantly
        </p>
      </div>

      {/* Search box */}
      <div className="row justify-content-center mb-4">
        <div className="col-md-6 col-lg-5">
          <div className="input-group subscribe-search-box shadow-sm rounded">
            <span className="input-group-text bg-white border-end-0">
              <i className="bi bi-search text-primary"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search groups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="btn btn-outline-secondary"
                onClick={() => setSearchTerm("")}
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Loading / Error */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-3 text-muted">Loading available groups...</p>
        </div>
      ) : error ? (
        <div className="text-center py-4 text-danger">{error}</div>
      ) : (
        <>
          {/* Groups Grid */}
          <div className="row g-4">
            {filteredGroups.length > 0 ? (
              filteredGroups.map((group) => (
                <div className="col-md-6 col-lg-4" key={group.id}>
                  <div className="card subscribe-group-card h-100">
                    <div className="card-body text-center">
                      <h5 className="subscribe-group-title">{group.name}</h5>
                      <p className="subscribe-group-description">
                        {group.description}
                      </p>

                      <div className="d-grid">
                        <button
                          className="subscribe-btn btn btn-primary"
                          onClick={() => handleSubscribe(group.id)}
                          disabled={postingGroupId === group.id}
                        >
                          {postingGroupId === group.id ? (
                            <>
                              <span
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                                aria-hidden="true"
                              ></span>
                              Requesting...
                            </>
                          ) : (
                            <>
                              <i className="bi bi-plus-circle me-2"></i>
                              Subscribe
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center py-5">
                <i className="bi bi-inbox display-1 text-muted"></i>
                <h5 className="mt-3 text-muted">No groups available</h5>
                <p className="text-muted">You are already subscribed to all groups.</p>
              </div>
            )}
          </div>

          {/* Info card */}
          <div className="card mt-5 shadow-sm bg-light border-0">
            <div className="card-body">
              <h6 className="fw-bold text-primary mb-3">
                <i className="bi bi-info-circle me-2"></i>Subscription Information
              </h6>
              <ul className="text-muted small mb-0">
                <li>Subscription requests are reviewed by administrators.</li>
                <li>You’ll receive a notification once your request is processed.</li>
                <li>Access is typically granted within 24–48 hours.</li>
                <li>Track your status in the “Subscription Status” page.</li>
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default User_Subscribe;
