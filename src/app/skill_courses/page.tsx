import pool from '@/lib/db';
import SkillCoursesClient from './SkillCoursesClient';

// export const revalidate = 3600; // Cache for 1 hour

async function fetchCourses() {
  try {
    const [rows]: any = await pool.query(
      `SELECT id, title, category, description, duration, applicant_count AS users, icon_name, type 
       FROM courses 
       WHERE type = 'course' 
       ORDER BY created_at DESC 
       LIMIT 50 OFFSET 0`
    );
    return rows;
  } catch (error) {
    console.error('Fetch Courses Error:', error);
    return [];
  }
}

export default async function SkillCoursesPage() {
  const courses = await fetchCourses();

  return <SkillCoursesClient initialCourses={courses} />;
}
