import { NextResponse } from 'next/server';

const INTERNSHIPS = [
  { title: "Frontend Development", category: "Development", users: "23.9K", duration: "4 Weeks", color: "from-blue-400 to-blue-600" },
  { title: "Backend Development", category: "Development", users: "21.9K", duration: "4 Weeks", color: "from-teal-400 to-teal-600" },
  { title: "Full Stack Development", category: "Development", users: "91.5K", duration: "4 Weeks", color: "from-indigo-400 to-indigo-600" },
  { title: "App Development", category: "Development", users: "50.0K", duration: "4 Weeks", color: "from-purple-400 to-purple-600" },
  { title: "Python Programming", category: "Programming", users: "19.7K", duration: "4 Weeks", color: "from-yellow-400 to-orange-500" },
  { title: "Java Programming", category: "Programming", users: "57.1K", duration: "4 Weeks", color: "from-red-400 to-rose-600" },
];

export async function GET() {
  return NextResponse.json(INTERNSHIPS);
}
