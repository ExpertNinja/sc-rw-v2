# Database Schema

This document describes the schema for the following tables:  
**roles, users, groups, reports, subscriptions, subscription_requests**

---

## 1. roles
**Stores user roles.**

| Column     | Type        | Constraints         | Description                     |
|-------------|-------------|--------------------|----------------------------------|
| id          | SERIAL      | PRIMARY KEY        | Unique role ID                  |
| name        | VARCHAR(50) | UNIQUE, NOT NULL   | Role name (Admin, User, Operations) |
| created_at  | TIMESTAMP   | DEFAULT NOW()      | Creation timestamp              |
| updated_at  | TIMESTAMP   | DEFAULT NOW()      | Update timestamp                |

---

## 2. users
**Stores user information.**

| Column     | Type        | Constraints                        | Description          |
|-------------|-------------|------------------------------------|----------------------|
| id          | SERIAL      | PRIMARY KEY                        | Unique user ID       |
| email       | VARCHAR(255)| UNIQUE, NOT NULL                   | User email           |
| password    | VARCHAR(255)| NOT NULL                           | Hashed password      |
| role_id     | INTEGER     | FOREIGN KEY (roles.id), NOT NULL   | User role            |
| is_active   | BOOLEAN     | DEFAULT TRUE                       | Account status       |
| created_at  | TIMESTAMP   | DEFAULT NOW()                      | Creation timestamp   |
| updated_at  | TIMESTAMP   | DEFAULT NOW()                      | Update timestamp     |

---

## 3. groups
**Stores AD groups for subscriptions.**

| Column     | Type        | Constraints       | Description         |
|-------------|-------------|------------------|---------------------|
| id          | SERIAL      | PRIMARY KEY      | Unique group ID     |
| name        | VARCHAR(255)| UNIQUE, NOT NULL | Group name          |
| description | TEXT        |                  | Group description   |
| created_at  | TIMESTAMP   | DEFAULT NOW()    | Creation timestamp  |
| updated_at  | TIMESTAMP   | DEFAULT NOW()    | Update timestamp    |

---

## 4. reports
**Stores report metadata.**

| Column     | Type        | Constraints             | Description                      |
|-------------|-------------|------------------------|----------------------------------|
| id          | SERIAL      | PRIMARY KEY            | Unique report ID                 |
| name        | VARCHAR(255)| NOT NULL               | Report name                      |
| date        | DATE        | NOT NULL               | Report date                      |
| group_id    | INTEGER     | FOREIGN KEY (groups.id)| Associated group                 |
| status      | VARCHAR(50) | DEFAULT 'pending'      | Sync status (pending, synced)    |
| file_path   | VARCHAR(500)|                        | File path if stored              |
| created_at  | TIMESTAMP   | DEFAULT NOW()          | Creation timestamp               |
| updated_at  | TIMESTAMP   | DEFAULT NOW()          | Update timestamp                 |

---

## 5. subscriptions
**Stores user subscriptions to groups.**

| Column     | Type        | Constraints                        | Description          |
|-------------|-------------|------------------------------------|----------------------|
| id          | SERIAL      | PRIMARY KEY                        | Unique subscription ID |
| user_id     | INTEGER     | FOREIGN KEY (users.id), NOT NULL   | Subscribed user      |
| group_id    | INTEGER     | FOREIGN KEY (groups.id), NOT NULL  | Subscribed group     |
| created_at  | TIMESTAMP   | DEFAULT NOW()                      | Creation timestamp   |

---

## 6. subscription_requests
**Stores subscription requests from users to admins.**

| Column      | Type        | Constraints                        | Description                          |
|--------------|-------------|------------------------------------|--------------------------------------|
| id           | SERIAL      | PRIMARY KEY                        | Unique request ID                    |
| user_id      | INTEGER     | FOREIGN KEY (users.id), NOT NULL   | Requesting user                      |
| group_id     | INTEGER     | FOREIGN KEY (groups.id), NOT NULL  | Requested group                      |
| status       | VARCHAR(50) | DEFAULT 'pending'                  | Request status (pending, approved, denied) |
| requested_at | TIMESTAMP   | DEFAULT NOW()                      | Request timestamp                    |
| approved_at  | TIMESTAMP   |                                    | Approval timestamp                   |
| approved_by  | INTEGER     | FOREIGN KEY (users.id)             | Approving admin                      |

---
