-- MySQL Script (Corrected for Hostinger)
-- Model: New Model    Version: 1.0

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Table `admins`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `admins` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `last_login` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `username` (`username` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `students`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `students` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `reg_id` VARCHAR(20) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `language` VARCHAR(50) NULL DEFAULT 'English',
  `two_factor_secret` VARCHAR(255) NULL DEFAULT NULL,
  `is_2fa_enabled` TINYINT(1) NULL DEFAULT '0',
  `reset_otp` VARCHAR(6) NULL DEFAULT NULL,
  `reset_otp_expiry` DATETIME NULL DEFAULT NULL,
  `last_notification_read_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `reg_id` (`reg_id` ASC) VISIBLE,
  UNIQUE INDEX `email` (`email` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `courses`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `courses` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(100) NOT NULL,
  `type` ENUM('course', 'internship') NULL DEFAULT 'internship',
  `category` VARCHAR(50) NULL DEFAULT NULL,
  `description` TEXT NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `icon_name` VARCHAR(50) NULL DEFAULT NULL,
  `duration` INT NULL DEFAULT NULL,
  `applicant_count` INT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  INDEX `idx_type` (`type` ASC) VISIBLE,
  INDEX `idx_category` (`category` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `certificates`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `certificates` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `cert_id` VARCHAR(50) NOT NULL,
  `student_id` INT NOT NULL,
  `course_id` INT NOT NULL,
  `type` ENUM('course', 'internship') NOT NULL,
  `issue_date` DATE NOT NULL,
  `grade` VARCHAR(5) NULL DEFAULT NULL,
  `verification_url` VARCHAR(255) NULL DEFAULT NULL,
  `percentage` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `cert_id` (`cert_id` ASC) VISIBLE,
  INDEX `student_id` (`student_id` ASC) VISIBLE,
  INDEX `course_id` (`course_id` ASC) VISIBLE,
  CONSTRAINT `certificates_ibfk_1`
    FOREIGN KEY (`student_id`)
    REFERENCES `students` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `certificates_ibfk_2`
    FOREIGN KEY (`course_id`)
    REFERENCES `courses` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `enrollments`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `enrollments` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `student_id` INT NOT NULL,
  `course_id` INT NOT NULL,
  `progress` INT NULL DEFAULT '0',
  `status` ENUM('applied', 'ongoing', 'completed') NULL DEFAULT 'applied',
  `enrolled_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `idx_student_course` (`student_id` ASC, `course_id` ASC) VISIBLE,
  INDEX `idx_status` (`status` ASC) VISIBLE,
  INDEX `course_id` (`course_id` ASC) VISIBLE,
  CONSTRAINT `enrollments_ibfk_1`
    FOREIGN KEY (`student_id`)
    REFERENCES `students` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `enrollments_ibfk_2`
    FOREIGN KEY (`course_id`)
    REFERENCES `courses` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `notifications`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NULL DEFAULT NULL,
  `title` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `type` ENUM('certificate', 'course') NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_user_date` (`user_id` ASC, `created_at` DESC) VISIBLE,
  INDEX `fk_notifications_user` (`user_id` ASC) VISIBLE,
  CONSTRAINT `fk_notifications_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `students` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `questions`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `questions` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `course_id` INT NOT NULL,
  `question_text` TEXT NOT NULL,
  `options` JSON NOT NULL,
  `correct_answer` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_questions_course` (`course_id` ASC) VISIBLE,
  CONSTRAINT `fk_questions_course`
    FOREIGN KEY (`course_id`)
    REFERENCES `courses` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `testimonials`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `testimonials` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `role` VARCHAR(100) NULL DEFAULT NULL,
  `text` TEXT NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


DELIMITER $$
CREATE TRIGGER `after_enrollment_insert`
AFTER INSERT ON `enrollments`
FOR EACH ROW
BEGIN                                                                                                          
    UPDATE courses SET applicant_count = applicant_count + 1 WHERE id = NEW.course_id;                         
END$$
DELIMITER ;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- Insert Sample Courses/Internships
INSERT INTO courses (title, type, category, duration, description) VALUES
('Frontend Development', 'internship', 'Development', 4, 'Hands-on frontend development with React and Next.js'),
('Backend Development', 'internship', 'Development', 4, 'Scalable backend services with Node.js and MySQL'),
('Full Stack Development', 'internship', 'Development', 4, 'Complete web application development'),
('Python Programming', 'course', 'Programming', 4, 'Introduction to Python and its applications'),
('Data Science', 'course', 'Data Science', 4, 'Data analysis and visualization with Python');

-- Insert Sample Testimonials
INSERT INTO testimonials (name, role, text) VALUES
('Aisha Sharma', 'Full-Stack Developer Intern', 'The hands-on projects at NIT completely changed my trajectory. I was able to build a real-world portfolio that got me hired instantly!'),
('Rahul Verma', 'Python Backend Intern', 'I loved the mentorship provided. The Python programming module was incredibly detailed and easy to follow. Highly recommended for beginners.'),
('Sneha Gupta', 'UI/UX Design Intern', 'Transitioning from a non-tech background was daunting, but the design track gave me the exact confidence and practical skills I needed to succeed.');