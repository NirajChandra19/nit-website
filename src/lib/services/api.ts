import { CourseOrInternship, Testimonial } from '@/types';

export const internshipService = {
  getAll: async (): Promise<CourseOrInternship[]> => {
    try {
      const response = await fetch('/api/admin/courses?type=internship');
      if (!response.ok) throw new Error('Failed to fetch internships');
      return response.json();
    } catch (error) {
      console.error('internshipService.getAll error:', error);
      return [];
    }
  },
};

export const testimonialService = {
  getAll: async (): Promise<Testimonial[]> => {
    try {
      const response = await fetch('/api/testimonials');
      if (!response.ok) throw new Error('Failed to fetch testimonials');
      return response.json();
    } catch (error) {
      console.error('testimonialService.getAll error:', error);
      return [];
    }
  },
};

export const studentService = {
  getDashboardData: async () => {
    try {
      const response = await fetch(`/api/student/dashboard`);
      if (response.status === 401) throw new Error('Unauthorized');
      if (!response.ok) throw new Error('Failed to fetch dashboard data');
      return response.json();
    } catch (error: unknown) {
      console.error('studentService.getDashboardData error:', error);
      throw error;
    }
  }
};
