-- MySQL Database Schema for NIT Website

CREATE DATABASE IF NOT EXISTS nit_db;
USE nit_db;

ALTER TABLE students                                                                                                                 
    ADD COLUMN language VARCHAR(50) DEFAULT 'English',                                                                                   
    ADD COLUMN two_factor_secret VARCHAR(255) DEFAULT NULL,                                                                              
    ADD COLUMN is_2fa_enabled BOOLEAN DEFAULT FALSE;     

desc students;
-- 1. Students Table
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reg_id VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_reg_id (reg_id)
);

ALTER TABLE courses
ADD COLUMN questions VARCHAR(20) DEFAULT NULL,
ADD COLUMN pass_percentage VARCHAR(20) DEFAULT NULL,
ADD COLUMN icon_name VARCHAR(50) DEFAULT NULL;

-- 2. Courses Table
CREATE TABLE IF NOT EXISTS courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    type ENUM('course', 'internship') DEFAULT 'internship',
    category VARCHAR(50),
    duration VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Enrollments Table (Progress Tracking)
CREATE TABLE IF NOT EXISTS enrollments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    progress INT DEFAULT 0,
    status ENUM('applied', 'ongoing', 'completed') DEFAULT 'applied',
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    CHECK (progress >= 0 AND progress <= 100)
);

-- 4. Certificates Table (Verification)
CREATE TABLE IF NOT EXISTS certificates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cert_id VARCHAR(50) NOT NULL UNIQUE,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    type ENUM('course', 'internship') NOT NULL,
    issue_date DATE NOT NULL,
    grade VARCHAR(5),
    verification_url VARCHAR(255),
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    INDEX idx_cert_id (cert_id)
);

-- 5. Admins Table
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 6. Testimonials Table
CREATE TABLE IF NOT EXISTS testimonials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(100),
    text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Sample Courses/Internships
INSERT INTO courses (title, type, category, duration, description) VALUES
('Frontend Development', 'internship', 'Development', '4 Weeks', 'Hands-on frontend development with React and Next.js'),
('Backend Development', 'internship', 'Development', '4 Weeks', 'Scalable backend services with Node.js and MySQL'),
('Full Stack Development', 'internship', 'Development', '4 Weeks', 'Complete web application development'),
('Python Programming', 'course', 'Programming', '4 Weeks', 'Introduction to Python and its applications'),
('Data Science', 'course', 'Data Science', '4 Weeks', 'Data analysis and visualization with Python');

-- Insert Sample Testimonials
INSERT INTO testimonials (name, role, text) VALUES
('Aisha Sharma', 'Full-Stack Developer Intern', 'The hands-on projects at NIT completely changed my trajectory. I was able to build a real-world portfolio that got me hired instantly!'),
('Rahul Verma', 'Python Backend Intern', 'I loved the mentorship provided. The Python programming module was incredibly detailed and easy to follow. Highly recommended for beginners.'),
('Sneha Gupta', 'UI/UX Design Intern', 'Transitioning from a non-tech background was daunting, but the design track gave me the exact confidence and practical skills I needed to succeed.');

-- Create an Initial Admin (Password: admin123 - should be hashed in production)
-- In a real app, use a script to hash the password before inserting.