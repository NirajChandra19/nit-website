"use client";

import { useState } from 'react';

export default function AddProgramForm({ fetchCourses }: { fetchCourses: () => void }) {
  const [loading, setLoading] = useState(false);
  const [courseForm, setCourseForm] = useState({ 
    title: '', 
    type: 'internship', 
    category: 'Development', 
    duration: '', 
    description: '', 
    icon_name: 'FiBookOpen' 
  });

  const handleCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Construct payload dynamically
    const payload: any = {
      title: courseForm.title,
      type: courseForm.type,
      category: courseForm.category,
      description: courseForm.description,
      // Only include icon if it's a course
      ...(courseForm.type === 'course' && { icon_name: courseForm.icon_name }),
      // Only include duration if it's an internship
      ...(courseForm.type === 'internship' && { 
        duration: courseForm.duration ? parseInt(courseForm.duration, 10) : null 
      })
    };

    const res = await fetch('/api/admin/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      alert('Program added successfully!');
      // Reset form to default state
      setCourseForm({ 
        title: '', type: 'internship', category: 'Development', 
        duration: '', description: '', icon_name: 'FiBookOpen' 
      });
      fetchCourses();
    } else {
      alert('Failed to add program.');
    }
    setLoading(false);
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-8 rounded-3xl">
      <h2 className="text-xl font-bold mb-6 text-blue-400">Add New Program</h2>
      <form onSubmit={handleCourseSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title and Type Row */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase">Program Title</label>
          <input className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl outline-none focus:border-blue-500" value={courseForm.title} onChange={e => setCourseForm({...courseForm, title: e.target.value})} placeholder="e.g. Web Development" required />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase">Type</label>
          <select className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl outline-none focus:border-blue-500" value={courseForm.type} onChange={e => setCourseForm({...courseForm, type: e.target.value})}>
            <option value="internship">Internship</option>
            <option value="course">Course</option>
          </select>
        </div>

        {/* Dynamic Fields */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase">Category</label>
          
          {courseForm.type === 'internship' ? (
            // Dropdown for Internships
            <select 
              className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl outline-none focus:border-blue-500" 
              value={courseForm.category} 
              onChange={e => setCourseForm({...courseForm, category: e.target.value})}
            >
              <option value="Development">Development</option>
              <option value="Programming">Programming</option>
              <option value="AI & Data Science">AI & Data Science</option>
              <option value="Design">Design</option>
              <option value="Business">Business</option>
            </select>
          ) : (
            // Free-text input for Courses
            <input 
              className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl outline-none focus:border-blue-500"  
              onChange={e => setCourseForm({...courseForm, category: e.target.value})} 
              required 
              placeholder="e.g. Technology" 
            />
          )}
        </div>

        {courseForm.type === 'internship' ? (
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Duration (Weeks)</label>
            <input type="number" className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl outline-none focus:border-blue-500" value={courseForm.duration} onChange={e => setCourseForm({...courseForm, duration: e.target.value})} required placeholder="e.g. 4" />
          </div>
        ) : (
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Icon</label>
            <select className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl outline-none focus:border-blue-500" value={courseForm.icon_name} onChange={e => setCourseForm({...courseForm, icon_name: e.target.value})}>
              <option value="FiBookOpen">Book</option>
              <option value="FiCode">Code</option>
              <option value="FiDatabase">Database</option>
              <option value="FiTerminal">Terminal</option>
              {/* Add other options as needed */}
            </select>
          </div>
        )}

        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
          <textarea className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl outline-none focus:border-blue-500 h-32" value={courseForm.description} onChange={e => setCourseForm({...courseForm, description: e.target.value})} required />
        </div>
        
        <button disabled={loading} className="md:col-span-2 bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-bold transition-all shadow-lg disabled:opacity-50">
          {loading ? 'Publishing...' : 'Publish Program'}
        </button>
      </form>
    </div>
  );
}