import { cookies } from 'next/headers';
import pool from '@/lib/db';
import AdminLoginForm from './AdminLoginForm';
import AdminDashboardClient from './AdminDashboardClient';

// Helper to fetch courses directly on the server
async function fetchCourses() {
  const query = 'SELECT id, title, type, category, description, duration, icon_name, created_at FROM courses ORDER BY created_at DESC';
  const [rows] = await pool.query(query);
  return rows as any[];
}


export default async function AdminPage() {
  // 1. Secure Server-Side Auth Check
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('admin_session');

  if (!sessionCookie || !sessionCookie.value) {
    // Return the login form if not authenticated
    return <AdminLoginForm />;
  }

  // 2. Fetch all necessary data on the server simultaneously
  const courses = await fetchCourses();

  // Secure Server Action to clear the cookie
  async function logoutAction() {
    "use server";
    const cookieStore = await cookies();
    cookieStore.delete('admin_session');
  }

  // 3. Pass data to the Client Component
  // The client component handles tabs, states, and mutations.
  return (
    <AdminDashboardClient 
      initialCourses={courses} 
      logoutAction={logoutAction}
    />
  );
}
