# Database Design Document: NIT Website

## 1. Overview
A comprehensive MySQL database for managing student registrations, course progress tracking, and certificate verification for the NIT Website.

## 2. Schema Design (MySQL)

### Tables

#### 1. `students`
Stores student information and unique registration IDs.
- `id`: INT (Primary Key, AUTO_INCREMENT)
- `reg_id`: VARCHAR(20) (Unique, Index) - Generated format: `NIT-YYYY-XXXX`
- `name`: VARCHAR(100)
- `email`: VARCHAR(100) (Unique)
- `password`: VARCHAR(255) (Hashed)
- `created_at`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP

#### 2. `courses`
Stores details of internships/courses.
- `id`: INT (Primary Key, AUTO_INCREMENT)
- `title`: VARCHAR(100)
- `type`: ENUM('course', 'internship')
- `category`: VARCHAR(50)
- `duration`: VARCHAR(50)
- `description`: TEXT
- `created_at`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP

#### 3. `enrollments`
Links students to courses and tracks progress.
- `id`: INT (Primary Key, AUTO_INCREMENT)
- `student_id`: INT (Foreign Key -> students.id)
- `course_id`: INT (Foreign Key -> courses.id)
- `progress`: INT (0 to 100) - Used for Dashboard
- `status`: ENUM('applied', 'ongoing', 'completed') DEFAULT 'applied'
- `enrolled_at`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP

#### 4. `certificates`
Stores issued certificates and unique certificate IDs.
- `id`: INT (Primary Key, AUTO_INCREMENT)
- `cert_id`: VARCHAR(50) (Unique, Index) - Generated format: `CERT-NIT-XXXX`
- `student_id`: INT (Foreign Key -> students.id)
- `course_id`: INT (Foreign Key -> courses.id)
- `type`: ENUM('course', 'internship') - Matches the course type
- `issue_date`: DATE
- `grade`: VARCHAR(5)
- `verification_url`: VARCHAR(255)

#### 5. `admins`
Stores admin credentials for the management panel.
- `id`: INT (Primary Key, AUTO_INCREMENT)
- `username`: VARCHAR(50) (Unique)
- `password`: VARCHAR(255) (Hashed)
- `last_login`: TIMESTAMP

## 3. Implementation Strategy

### Database Access
- Use `mysql2/promise` for database connectivity.
- Connection pooling will be implemented in `src/lib/db.ts`.

### Logic
- **Registration**: On user signup, a unique `reg_id` is generated using a combination of year and a random/sequential number.
- **Progress Tracking**: API endpoints will update the `progress` column in `enrollments` as the student completes modules.
- **Certification**: Admins can issue certificates. A unique `cert_id` is generated and linked to the student and course.
- **Verification**: A public endpoint will allow anyone to verify a certificate by its `cert_id`.

## 4. Next Steps
1. Finalize SQL schema in `setup.sql`.
2. Configure environment variables for DB connection.
3. Implement DB connection utility in `src/lib/db.ts`.
4. Create initial API routes for core functionality.
