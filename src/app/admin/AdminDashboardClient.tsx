"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import { CertificateTable } from '@/components/admin/CertificateTable';

export default function AdminDashboardClient({ 
  initialCourses,
  logoutAction
}: { 
  initialCourses: any[],
  logoutAction: () => Promise<void>
}) {
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<'courses' | 'certificates' | 'manage_certificates' | 'assessments'>('courses');
  const [courses, setCourses] = useState<any[]>(initialCourses);
  const [loading, setLoading] = useState(false);

  // Form States
  const [courseForm, setCourseForm] = useState({ 
    title: '', type: 'internship', category: 'Development', 
    duration: '4 Weeks', description: '', icon_name: 'FiBookOpen' 
  });
  const [certForm, setCertForm] = useState({ 
    isNewStudent: false, student_name: '', reg_id: '', course_id: '', 
    type: 'internship', grade: 'A', percentage: '', issue_date: new Date().toISOString().split('T')[0] 
  });

  // Assessments States
  const [questions, setQuestions] = useState<any[]>([]);
  const [selectedCourseForQuestions, setSelectedCourseForQuestions] = useState('');
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [questionForm, setQuestionForm] = useState({
    id: null as number | null,
    question_text: '',
    option1: '', option2: '', option3: '', option4: '',
    correct_answer: ''
  });

  const fetchCourses = async () => {
    const res = await fetch('/api/admin/courses');
    const data = await res.json();
    setCourses(data);
  };

  // We still fetch questions on demand (client-side) because it depends on the selected course
  // and we don't want to load all questions for all courses on initial load.
  const fetchQuestions = async (courseId: string) => {
    const res = await fetch(`/api/admin/questions?course_id=${courseId}`);
    const data = await res.json();
    setQuestions(data);
  };

  const handleLogout = async () => {
    try {
      await logoutAction();
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/admin/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(courseForm)
    });
    if (res.ok) {
      alert('Course added!');
      setCourseForm({ 
        title: '', type: 'internship', category: 'Development', 
        duration: '4 Weeks', description: '', icon_name: 'FiBookOpen' 
      });
      fetchCourses();
    }
    setLoading(false);
  };

  const handleCertSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/admin/certificates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(certForm)
    });
    const data = await res.json().catch(() => ({ error: 'An unknown error occurred' }));
    if (res.ok) {
      alert(`Certificate Issued! ID: ${data.cert_id}`);
      setCertForm({ ...certForm, student_name: '', reg_id: '', course_id: '' });
    } else {
      alert(`Error: ${data.error}`);
    }
    setLoading(false);
  };

  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const method = questionForm.id ? 'PUT' : 'POST';
    const payload = {
      id: questionForm.id,
      course_id: selectedCourseForQuestions,
      question_text: questionForm.question_text,
      options: [questionForm.option1, questionForm.option2, questionForm.option3, questionForm.option4],
      correct_answer: questionForm.correct_answer
    };
    const res = await fetch('/api/admin/questions', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      alert(questionForm.id ? 'Question Updated!' : 'Question Created!');
      setIsQuestionModalOpen(false);
      fetchQuestions(selectedCourseForQuestions);
    } else {
      alert('Error saving question');
    }
    setLoading(false);
  };

  const handleDeleteQuestion = async (id: number) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    const res = await fetch(`/api/admin/questions?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      fetchQuestions(selectedCourseForQuestions);
    }
  };

  const handleEditQuestion = (q: any) => {
    setQuestionForm({
      id: q.id,
      question_text: q.question_text,
      option1: q.options[0] || '', option2: q.options[1] || '',
      option3: q.options[2] || '', option4: q.options[3] || '',
      correct_answer: q.correct_answer
    });
    setIsQuestionModalOpen(true);
  };

  const handleCreateQuestionClick = () => {
    setQuestionForm({ id: null, question_text: '', option1: '', option2: '', option3: '', option4: '', correct_answer: '' });
    setIsQuestionModalOpen(true);
  };

  // When selected course changes, fetch its questions
  // We use standard onChange event in the select now instead of useEffect for simplicity, 
  // but let's keep it simple by fetching when they open the tab or change dropdown.
  const onCourseSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedCourseForQuestions(val);
    if (val) {
      fetchQuestions(val);
    } else {
      setQuestions([]);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white p-4 md:p-10">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-12 border-b border-slate-800 pb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Management Center</h1>
            <p className="text-slate-400 text-sm mt-1">Platform control & Certification Engine</p>
          </div>
          <button 
            onClick={handleLogout}
            className="text-xs bg-slate-800 border border-slate-700 px-4 py-2 rounded-lg hover:bg-red-900/30 hover:text-red-400 transition-all"
          >
            Logout
          </button>
        </header>

        <div className="flex flex-wrap gap-4 mb-10">
          <button 
            onClick={() => setActiveTab('courses')} 
            className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'courses' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
          >
            Courses & Internships
          </button>
          <button 
            onClick={() => setActiveTab('certificates')} 
            className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'certificates' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
          >
            Issue New Certificate
          </button>
          <button 
            onClick={() => setActiveTab('manage_certificates')} 
            className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'manage_certificates' ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/30' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
          >
            Manage Certificates
          </button>
          <button 
            onClick={() => setActiveTab('assessments')} 
            className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'assessments' ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/30' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
          >
            Manage Assessments
          </button>
        </div>

        {activeTab === 'courses' ? (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-8 rounded-3xl">
            <h2 className="text-xl font-bold mb-6 text-blue-400">Add New Program</h2>
            <form onSubmit={handleCourseSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Program Title</label>
                <input className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl outline-none focus:border-blue-500" value={courseForm.title} onChange={e => setCourseForm({...courseForm, title: e.target.value})} required placeholder="e.g. Web Development" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Type</label>
                <select className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl outline-none focus:border-blue-500" value={courseForm.type} onChange={e => setCourseForm({...courseForm, type: e.target.value as any})}>
                  <option value="internship">Internship</option>
                  <option value="course">Course</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Category</label>
                <input className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl outline-none focus:border-blue-500" value={courseForm.category} onChange={e => setCourseForm({...courseForm, category: e.target.value})} required placeholder="e.g. Technology" />
              </div>

              
              {courseForm.type === 'course' && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Icon</label>
                  <select className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl outline-none focus:border-blue-500" value={courseForm.icon_name} onChange={e => setCourseForm({...courseForm, icon_name: e.target.value})}>
                    <option value="FiBookOpen">Book</option>
                    <option value="FiCode">Code</option>
                    <option value="FiDatabase">Database</option>
                    <option value="FiLayout">Layout</option>
                    <option value="FiTerminal">Terminal</option>
                    <option value="FiMonitor">Monitor</option>
                    <option value="FiCpu">CPU</option>
                    <option value="FiLayers">Layers</option>
                  </select>
                </div>
              )}

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
                <textarea className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl outline-none focus:border-blue-500 h-32" value={courseForm.description} onChange={e => setCourseForm({...courseForm, description: e.target.value})} placeholder="Detailed program curriculum..." />
              </div>
              <button disabled={loading} className="md:col-span-2 bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-bold transition-all shadow-lg disabled:opacity-50">
                {loading ? 'Processing...' : 'Publish Program'}
              </button>
            </form>
          </div>
        ) : activeTab === 'certificates' ? (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-8 rounded-3xl">
            <h2 className="text-xl font-bold mb-6 text-green-400">Issuance Terminal</h2>
            <form onSubmit={handleCertSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 flex justify-center mb-2">
                <div className="bg-slate-900 p-1 rounded-full inline-flex border border-slate-700">
                  <button 
                    type="button"
                    onClick={() => setCertForm({...certForm, isNewStudent: false})}
                    className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${!certForm.isNewStudent ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    Existing Student
                  </button>
                  <button 
                    type="button"
                    onClick={() => setCertForm({...certForm, isNewStudent: true})}
                    className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${certForm.isNewStudent ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    New Student
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Program Type</label>
                <select className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl outline-none focus:border-blue-500" value={certForm.type} onChange={e => setCertForm({...certForm, type: e.target.value, course_id: ''})}>
                  <option value="internship">Internship</option>
                  <option value="course">Course</option>
                </select>
              </div>

              {certForm.isNewStudent ? (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Student Name</label>
                  <input className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl outline-none focus:border-blue-500" value={certForm.student_name} onChange={e => setCertForm({...certForm, student_name: e.target.value})} required placeholder="e.g. John Doe" />
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Student Registration ID</label>
                  <input className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl outline-none focus:border-blue-500" value={certForm.reg_id} onChange={e => setCertForm({...certForm, reg_id: e.target.value})} required placeholder="e.g. NIT-2026-1234" />
                </div>
              )}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Select Program</label>
                <select className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl outline-none focus:border-blue-500" value={certForm.course_id} onChange={e => setCertForm({...certForm, course_id: e.target.value})} required>
                  <option value="">Choose...</option>
                  {courses.filter(c => c.type === certForm.type).map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </div>
              {certForm.type === 'internship' ? (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Performance Grade</label>
                  <input className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl outline-none focus:border-blue-500" value={certForm.grade} onChange={e => setCertForm({...certForm, grade: e.target.value})} placeholder="e.g. A+" />
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Percentage Marks</label>
                  <input type="number" min="0" max="100" className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl outline-none focus:border-blue-500" value={certForm.percentage} onChange={e => setCertForm({...certForm, percentage: e.target.value})} placeholder="e.g. 85" />
                </div>
              )}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Issue Date</label>
                <input type="date" className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl outline-none focus:border-blue-500" value={certForm.issue_date} onChange={e => setCertForm({...certForm, issue_date: e.target.value})} required />
              </div>
              <button disabled={loading} className="md:col-span-2 bg-green-600 hover:bg-green-500 py-4 rounded-xl font-bold transition-all shadow-lg disabled:opacity-50">
                {loading ? 'Processing...' : 'Generate & Issue Certificate'}
              </button>
            </form>
          </div>
        ) : activeTab === 'manage_certificates' ? (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-8 rounded-3xl">
            <CertificateTable />
          </div>
        ) : activeTab === 'assessments' ? (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-8 rounded-3xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-purple-400">Manage Assessments</h2>
              {selectedCourseForQuestions && (
                <button 
                  onClick={handleCreateQuestionClick} 
                  disabled={questions.length >= 15}
                  className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${questions.length >= 15 ? 'bg-slate-700 text-slate-400 cursor-not-allowed opacity-50' : 'bg-purple-600 hover:bg-purple-500 text-white'}`}
                >
                  <FiPlus /> {questions.length >= 15 ? 'Limit Reached (15/15)' : 'Create Question'}
                </button>
              )}
            </div>
            <div className="mb-8">
              <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Select Course</label>
              <select className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl outline-none focus:border-purple-500 transition-colors" value={selectedCourseForQuestions} onChange={onCourseSelectionChange}>
                <option value="">-- Choose a Course --</option>
                {courses.filter(c => c.type === 'course').map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </div>
            
            {selectedCourseForQuestions && (
              <div className="space-y-4">
                {questions.length === 0 ? (
                  <p className="text-slate-500 text-center py-8">No questions found for this course.</p>
                ) : (
                  questions.map((q, idx) => (
                    <div key={q.id} className="bg-slate-900 border border-slate-700 p-4 rounded-xl flex justify-between items-start gap-4 hover:border-slate-600 transition-colors">
                      <div>
                        <span className="text-xs text-slate-500 font-bold uppercase mb-1 block">Q{idx + 1}</span>
                        <p className="font-medium text-slate-200 mb-3">{q.question_text}</p>
                        <div className="text-sm text-slate-400 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {q.options.map((opt: string, i: number) => (
                            <span key={i} className={`px-2 py-1 rounded-md ${opt === q.correct_answer ? 'bg-green-900/30 text-green-400 border border-green-800/50' : 'bg-slate-800 border border-transparent'}`}>
                              {String.fromCharCode(65 + i)}. {opt}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => handleEditQuestion(q)} className="p-2 bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white rounded-lg transition-colors"><FiEdit2 /></button>
                        <button onClick={() => handleDeleteQuestion(q.id)} className="p-2 bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white rounded-lg transition-colors"><FiTrash2 /></button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        ) : null}
      </div>

      {isQuestionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl w-full max-w-2xl shadow-2xl my-auto relative">
            <h3 className="text-xl font-bold mb-4">{questionForm.id ? 'Edit Question' : 'Add Question'}</h3>
            <form onSubmit={handleQuestionSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Question Text</label>
                <textarea required className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl outline-none focus:border-purple-500 transition-colors" value={questionForm.question_text} onChange={e => setQuestionForm({...questionForm, question_text: e.target.value})} rows={3} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="text-xs font-bold text-slate-500 uppercase block mb-1">Option A</label><input required className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl outline-none focus:border-purple-500 transition-colors" value={questionForm.option1} onChange={e => setQuestionForm({...questionForm, option1: e.target.value})} /></div>
                <div><label className="text-xs font-bold text-slate-500 uppercase block mb-1">Option B</label><input required className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl outline-none focus:border-purple-500 transition-colors" value={questionForm.option2} onChange={e => setQuestionForm({...questionForm, option2: e.target.value})} /></div>
                <div><label className="text-xs font-bold text-slate-500 uppercase block mb-1">Option C</label><input required className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl outline-none focus:border-purple-500 transition-colors" value={questionForm.option3} onChange={e => setQuestionForm({...questionForm, option3: e.target.value})} /></div>
                <div><label className="text-xs font-bold text-slate-500 uppercase block mb-1">Option D</label><input required className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl outline-none focus:border-purple-500 transition-colors" value={questionForm.option4} onChange={e => setQuestionForm({...questionForm, option4: e.target.value})} /></div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Correct Answer</label>
                  <select required className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl outline-none focus:border-purple-500 transition-colors" value={questionForm.correct_answer} onChange={e => setQuestionForm({...questionForm, correct_answer: e.target.value})}>
                    <option value="">-- Select --</option>
                    {questionForm.option1 && <option value={questionForm.option1}>Option A</option>}
                    {questionForm.option2 && <option value={questionForm.option2}>Option B</option>}
                    {questionForm.option3 && <option value={questionForm.option3}>Option C</option>}
                    {questionForm.option4 && <option value={questionForm.option4}>Option D</option>}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-700 mt-6">
                <button type="button" onClick={() => setIsQuestionModalOpen(false)} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-bold transition-colors">Cancel</button>
                <button type="submit" disabled={loading} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-bold transition-colors">{loading ? 'Saving...' : 'Save Question'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
