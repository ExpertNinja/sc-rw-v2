# SC-RW Tool

A full-stack application for managing reports, subscriptions, and file processing with admin, operations, and user dashboards.

## Features

- **Admin Dashboard**: View stats (total users, approved today), manage access requests, configure paths.
- **Operations Dashboard**: View reports.
- **User Dashboard**: Subscribe to groups, view reports.
- **File Watching**: Automatically process new files placed in the storage path.
- **Authentication**: JWT-based login with role-based access.

## Tech Stack

- **Backend**: Spring Boot (Java), JPA/Hibernate, H2 Database, Maven
- **Frontend**: React, Axios, CSS
- **File Processing**: Java WatchService for directory monitoring

## Prerequisites

Before running the project, ensure you have the following installed:

- **Java 17 or higher** (for Spring Boot)
- **Node.js 16 or higher** (for React frontend)
- **Maven 3.6 or higher** (for building the backend)
- **Git** (for cloning the repository)

## Getting Started

Follow these steps to set up and run the project locally.

### 1. Clone the Repository

```bash
git clone <repository-url>
cd sc-rw-tool
```

### 2. Backend Setup

Navigate to the backend directory and build/run the Spring Boot application.

```bash
cd backend
```

#### Install Dependencies and Build

```bash
./mvnw clean install
```

#### Run the Backend

```bash
./mvnw spring-boot:run
```

The backend will start on `http://localhost:8080`. It includes:
- Embedded H2 database (data loaded from `src/main/resources/data.sql`)
- File watching service monitoring `source_system/StoragePath`
- REST APIs for authentication, users, groups, reports, etc.

**Note**: The backend uses H2 in-memory database. Data persists during the session but resets on restart.

### 3. Frontend Setup

Open a new terminal and navigate to the frontend directory.

```bash
cd ../UI/frontend
```

#### Install Dependencies

```bash
npm install
```

#### Run the Frontend

```bash
npm start
```

The frontend will start on `http://localhost:3000`.

### 4. Access the Application

- Open your browser and go to `http://localhost:3000`
- Login with one of the predefined users:
  - Admin: `admin@sc.com` / `password` (Role: Admin)
  - Operations: `operations@sc.com` / `password` (Role: Operations)
  - User: `user@sc.com` / `password` (Role: User)

### 5. Testing File Watching

To test the file watching feature:

1. Ensure the backend is running.
2. Place a PDF file (e.g., `test_report.pdf`) in the `source_system/StoragePath` directory.
3. The FileWatchService will detect the new file, process it, and create entries in the database.
4. Refresh the Admin Path Config page (`http://localhost:3000/admin/path-config`) to see the new path configuration.

## Project Structure

```
sc-rw-tool/
├── backend/                          # Spring Boot backend
│   ├── src/main/java/com/example/demo/
│   │   ├── controller/               # REST controllers
│   │   ├── service/                  # Business logic
│   │   ├── repository/               # Data access
│   │   ├── model/                    # JPA entities
│   │   └── dto/                      # Data transfer objects
│   ├── src/main/resources/
│   │   ├── application.properties    # App config
│   │   └── data.sql                  # Initial data
│   └── pom.xml                       # Maven config
├── UI/frontend/                      # React frontend
│   ├── src/
│   │   ├── components/               # Reusable components
│   │   ├── pages/                    # Page components
│   │   ├── context/                  # React context
│   │   └── App.js                    # Main app
│   ├── public/
│   └── package.json                  # NPM config
├── source_system/StoragePath/        # Directory for file watching
└── README.md                         # This file
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login and get JWT token

### Admin
- `GET /api/admin/stats` - Get total users and approved today
- `GET /api/access-requests` - Get pending access requests
- `POST /api/subscription-requests/{id}/approve` - Approve subscription request

### Users
- `GET /api/users/subscribed-groups` - Get user's subscribed groups
- `GET /api/users/recent-reports` - Get user's recent reports
- `GET /api/users/available-groups` - Get available groups for subscription

### Groups & Reports
- `GET /api/groups/{id}/reports` - Get reports for a group
- `GET /api/path-configs` - Get path configurations

## Database Schema

The application uses H2 database with the following main tables:
- `users` - User accounts
- `groups` - Report groups
- `subscriptions` - User-group subscriptions
- `subscription_requests` - Pending/approved requests
- `reports` - Report entities
- `path_configs` - File processing configurations

## Development Notes

- **File Watching**: The backend monitors `source_system/StoragePath` for new files. When a file is added, it creates a PathConfig and ReportEntity via internal API call.
- **JWT Authentication**: All protected endpoints require `Authorization: Bearer <token>` header.
- **CORS**: Backend allows requests from `http://localhost:3000` (frontend).
- **Roles**: Users have roles (Admin, Operations, User) that control dashboard access.

## Troubleshooting

- **Backend won't start**: Ensure Java 17+ is installed and `JAVA_HOME` is set.
- **Frontend won't start**: Ensure Node.js 16+ is installed.
- **Login fails**: Check that the user exists in `data.sql` and passwords match.
- **File watching not working**: Ensure the `source_system/StoragePath` directory exists and the backend is running.
- **Database issues**: H2 console is available at `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:testdb`).

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes and test
4. Submit a pull request

## License

This project is licensed under the MIT License.
