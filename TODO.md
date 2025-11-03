# TODO: Implement Notification System (US05) and Report Search/Download (US06)

## Backend Implementation
- [x] Create ReportsController.java with endpoints:
  - GET /api/reports/pending
  - GET /api/reports/search (with q, startDate, endDate, page, size)
  - GET /api/reports/recent
  - GET /api/reports/download/{id}
  - POST /api/reports/download/bulk
- [x] Create TransferLogController.java with GET /api/transfer-logs
- [x] Update ReportService.java: Add searchReports() and getRecentReports() with pagination
- [x] Update ReportRepository.java: Add @Query for searchReports and findRecentReports with Pageable
- [x] Verify file paths and error handling in controllers
- [x] Confirm DB schema matches entities (check data.sql if needed)

## Frontend Implementation
- [x] Update ReportSearch.js: Integrate with /api/reports/search endpoint, add pagination params
- [x] Update Notification.js: Ensure full integration with /api/reports/pending
- [x] Update UserDashboard.js: Add download functionality for reports
- [x] Update OpsPage.js: Ensure transfer logs fetch and sync simulation
- [x] Verify auth context and protected routes work correctly

## Testing and Verification
- [x] Fix compilation errors (UserService.java - added SubscriptionRequestRepository dependency)
- [x] Fix database schema issues (added schema.sql, updated application.properties)
- [x] Backend application starts successfully on port 8081
- [x] Fix admin user management - added GET /api/users endpoint and User model getters for frontend compatibility
- [x] Backend compiles successfully after fixes
- [ ] Test all new endpoints with Postman or similar
- [ ] Test frontend-backend integration
- [ ] Verify access control (JWT, roles)
- [ ] Check error handling and file paths
- [ ] Provide completion rundown of all files
