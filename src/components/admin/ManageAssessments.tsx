"use client";

import { useState } from 'react';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';

export default function ManageAssessments({ courses }: { courses: any[] }) {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [selectedCourseForQuestions, setSelectedCourseForQuestions] = useState('');
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [questionForm, setQuestionForm] = useState({
    id: null as number | null,
    question_text: '',
    option1: '', option2: '', option3: '', option4: '',
    correct_answer: ''
  });

  const fetchQuestions = async (courseId: string) => {
    const res = await fetch(`/api/admin/questions?course_id=${courseId}`);
    const data = await res.json();
    setQuestions(data);
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
    <>
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
    </>
  );
}
