export interface CourseOrInternship {
  id?: number;
  title: string;
  type: 'course' | 'internship';
  category: string;
  duration: string;
  description?: string;
  color?: string; // For UI
  users?: string; // For UI
}

export type EnrollmentStatus = 'applied' | 'ongoing' | 'completed';

export interface Enrollment {
  id: number;
  student_id: number;
  course_id: number;
  progress: number;
  status: EnrollmentStatus;
  enrolled_at: string;
}

export interface Certificate {
  id: number;
  cert_id: string;
  student_id: number;
  course_id: number;
  type: 'course' | 'internship';
  issue_date: string;
  grade: string;
  verification_url: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  text: string;
}
