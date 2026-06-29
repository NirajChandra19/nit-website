import pool from '@/lib/db';
import InternshipsClient from './InternshipsClient';

export const revalidate = 60; // Cache for 60 seconds

async function fetchInternships() {
  try {
    const [rows]: any = await pool.query(
      `SELECT id, title, category, description, duration, applicant_count AS users, icon_name, type 
       FROM courses 
       WHERE type = 'internship' 
       ORDER BY created_at DESC`
    );
    
    // If the database is empty, provide some default placeholder data
    // if (rows.length === 0) {
    //   return [
    //     { title: "Frontend Development", category: "Development", users: "23.9K", duration: "4 Weeks", color: "from-blue-400 to-blue-600" },
    //     { title: "Backend Development", category: "Development", users: "21.9K", duration: "4 Weeks", color: "from-teal-400 to-teal-600" },
    //     { title: "Full Stack Development", category: "Development", users: "91.5K", duration: "4 Weeks", color: "from-indigo-400 to-indigo-600" },
    //     { title: "App Development", category: "Development", users: "50.0K", duration: "4 Weeks", color: "from-purple-400 to-purple-600" },
    //     { title: "Python Programming", category: "Programming", users: "19.7K", duration: "4 Weeks", color: "from-yellow-400 to-orange-500" },
    //     { title: "Java Programming", category: "Programming", users: "57.1K", duration: "4 Weeks", color: "from-red-400 to-rose-600" }
    //   ];
    // }
    
    return rows;
  } catch (error) {
    console.error('Fetch Internships Error:', error);
    return [];
  }
}

export default async function InternshipsPage() {
  const internships = await fetchInternships();

  return <InternshipsClient initialInternships={internships} />;
}