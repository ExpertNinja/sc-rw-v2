// src/components/Subscription_Status/Subscription_Status.jsx
import React, { useState, useEffect } from "react";
import "./Subscription_Status.css";

/**
 * Subscription_Status
 * - Fetches subscription requests for a hardcoded email (admin@example.com)
 * - Maps backend response shape to the frontend table shape
 * - No authentication headers are sent (your backend has no auth right now)
 */

const Subscription_Status = () => {
  // UI state
  const [filter, setFilter] = useState("All");
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // HARD-CODED email as requested
  const email = "admin@example.com";

  useEffect(() => {
    // Immediately-invoked async function inside useEffect
    (async function fetchSubscriptions() {
      setLoading(true);
      setError(null);

      try {
        const url = `http://localhost:8081/api/subscription-requests?email=${encodeURIComponent(
          email
        )}`;

        const resp = await fetch(url);
        if (!resp.ok) {
          // Throw with status so we can show a meaningful error
          throw new Error(`Failed to fetch (status ${resp.status})`);
        }

        const data = await resp.json();

        // ---------- Dynamic mapping ----------
        // Backend returns objects like:
        // {
        //   id, groupId, groupName, groupDescription,
        //   status, requestedAt, approvedAt, approvedByEmail
        // }
        //
        // Map to the frontend's table row shape:
        // {
        //   id,
        //   groupName,
        //   groupDescription,
        //   status (capitalized for UI),
        //   requestDate (YYYY-MM-DD),
        //   approvalDate (YYYY-MM-DD or '-'),
        //   approvedByEmail
        // }

        const formatted = Array.isArray(data)
          ? data.map((item) => {
              // safe extraction and formatting
              const requestDate = item.requestedAt
                ? item.requestedAt.substring(0, 10)
                : "-";
              const approvalDate = item.approvedAt
                ? item.approvedAt.substring(0, 10)
                : "-";

              // Capitalize first letter of status for nicer UI (pending -> Pending)
              const statusRaw = item.status || "";
              const status =
                statusRaw.length > 0
                  ? statusRaw.charAt(0).toUpperCase() + statusRaw.slice(1)
                  : "Unknown";

              return {
                id: item.id,
                groupId: item.groupId,
                groupName: item.groupName || "N/A",
                groupDescription: item.groupDescription || "",
                status,
                requestDate,
                approvalDate,
                approvedByEmail: item.approvedByEmail || "-",
              };
            })
          : [];

        setSubscriptions(formatted);
      } catch (err) {
        console.error("Error fetching subscription requests:", err);
        setError("Unable to load subscription requests. Try again later.");
      } finally {
        // IMPORTANT: always unset loading so component can render states
        setLoading(false);
      }
    })();
    // empty deps -> run once on mount
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Filtering
  const filteredSubscriptions =
    filter === "All"
      ? subscriptions
      : subscriptions.filter((s) => s.status === filter);

  // CSS badge classes for status
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Approved":
        return "badge bg-success";
      case "Pending":
        return "badge bg-warning text-dark";
      case "Rejected":
        return "badge bg-danger";
      default:
        return "badge bg-secondary";
    }
  };

  // ---------- Render ----------
  return (
    <div className="subscription-status-container">
      <div className="subscription-status-header">
        <h2 className="subscription-status-title">Subscription Status</h2>
        <p className="subscription-status-subtitle">
          Track your group subscription requests
        </p>
      </div>

      {/* Summary cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-4 col-sm-12">
          <div className="summary-item">
            <p className="summary-label">Approved</p>
            <p className="summary-value text-success">
              {subscriptions.filter((s) => s.status === "Approved").length}
            </p>
          </div>
        </div>
        <div className="col-md-4 col-sm-12">
          <div className="summary-item">
            <p className="summary-label">Pending</p>
            <p className="summary-value text-warning">
              {subscriptions.filter((s) => s.status === "Pending").length}
            </p>
          </div>
        </div>
        <div className="col-md-4 col-sm-12">
          <div className="summary-item">
            <p className="summary-label">Rejected</p>
            <p className="summary-value text-danger">
              {subscriptions.filter((s) => s.status === "Rejected").length}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-section mb-3">
        <h5 className="filter-title">Filter by Status</h5>
        <div className="filter-buttons-container">
          {["All", "Pending", "Approved", "Rejected"].map((status) => (
            <button
              key={status}
              className={`filter-btn filter-${status.toLowerCase()} ${
                filter === status ? "active" : ""
              }`}
              onClick={() => setFilter(status)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Table / Loading / Error */}
      <div className="table-wrapper">
        {loading ? (
          <div className="text-center text-muted py-4">Loading subscriptions...</div>
        ) : error ? (
          <div className="text-center text-danger py-4">{error}</div>
        ) : (
          <table className="table table-hover subscription-table">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Group Name</th>
                <th>Status</th>
                <th>Request Date</th>
                <th>Approval Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubscriptions.length > 0 ? (
                filteredSubscriptions.map((sub, idx) => (
                  <tr key={sub.id}>
                    <td>{idx + 1}</td>
                    <td title={sub.groupDescription}>{sub.groupName}</td>
                    <td>
                      <span className={getStatusBadgeClass(sub.status)}>
                        {sub.status}
                      </span>
                    </td>
                    <td>{sub.requestDate}</td>
                    <td>{sub.approvalDate}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-muted py-4">
                    No subscriptions found for the selected filter
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Subscription_Status;
