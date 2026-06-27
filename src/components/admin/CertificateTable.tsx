"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { FiSearch, FiCalendar, FiFilter, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export function CertificateTable() {
  const [downloadingCertId, setDownloadingCertId] = useState<string | null>(null);

  // Data states
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [programFilter, setProgramFilter] = useState('all');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;

  // Programs state for dynamic filter
  const [programs, setPrograms] = useState<{ id: number; title: string }[]>([]);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  // Reset page on filter changes (excluding page itself)
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, dateFilter, programFilter]);

  // Fetch Programs for Filter
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const res = await fetch('/api/admin/courses?limit=100');
        const data = await res.json();
        if (Array.isArray(data)) {
          setPrograms(data);
        }
      } catch (e) {
        console.error('Failed to fetch programs:', e);
      }
    };
    fetchPrograms();
  }, []);

  // Fetch Data
  const fetchCertificates = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search: debouncedSearch,
        date: dateFilter,
        program: programFilter,
        page: currentPage.toString(),
        limit: limit.toString()
      });
      const res = await fetch(`/api/admin/certificates?${params}`);
      const data = await res.json();
      setCertificates(data.certificates || []);
      setTotalPages(data.totalPages || 1);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, dateFilter, programFilter, currentPage]);

  useEffect(() => {
    fetchCertificates();
  }, [fetchCertificates]);

  const clearFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setDateFilter('all');
    setProgramFilter('all');
    setCurrentPage(1);
  };

  const handleExport = () => {
    const params = new URLSearchParams({
      search: debouncedSearch,
      date: dateFilter,
      program: programFilter,
    });
    const exportUrl = `/api/admin/certificates/export?${params}`;
    window.open(exportUrl, '_blank');
  };

  const activeCert = certificates.find(c => c.cert_id === downloadingCertId);

  useEffect(() => {
    if (downloadingCertId) {
      const link = document.createElement('a');
      link.href = `/api/certificates/download?id=${downloadingCertId}`;
      link.download = `Certificate_${downloadingCertId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setTimeout(() => {
        setDownloadingCertId(null);
      }, 1000);
    }
  }, [downloadingCertId]);

  return (
    <div className="relative w-full space-y-6">

      {/* Header and Filter Bar */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-green-400">Certificate Management</h2>
        
        <div className="flex flex-wrap items-center gap-3 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
          <div className="relative flex-1 min-w-[250px]">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search Name, Reg ID, or Cert ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-sm text-slate-200 rounded-lg pl-10 pr-4 py-2.5 outline-none focus:border-green-500 transition-colors"
            />
          </div>

          <div className="relative">
            <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
            <select 
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
              className="appearance-none bg-slate-900 border border-slate-700 text-sm text-slate-200 rounded-lg pl-10 pr-8 py-2.5 outline-none focus:border-green-500 transition-colors cursor-pointer"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="last7days">Last 7 Days</option>
              <option value="thismonth">This Month</option>
            </select>
          </div>

          <div className="relative">
            <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
            <select 
              value={programFilter}
              onChange={e => setProgramFilter(e.target.value)}
              className="appearance-none bg-slate-900 border border-slate-700 text-sm text-slate-200 rounded-lg pl-10 pr-8 py-2.5 outline-none focus:border-green-500 transition-colors cursor-pointer"
            >
              <option value="all">All Programs</option>
              {programs.map(program => (
                <option key={program.id} value={program.title}>
                  {program.title}
                </option>
              ))}
            </select>
          </div>

          <button 
            onClick={clearFilters}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
          >
            <FiX /> Clear
          </button>
          
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-green-600 hover:bg-green-500 rounded-lg transition-colors shadow-lg shadow-green-900/20"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            Export CSV
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto bg-slate-900/50 rounded-2xl border border-slate-800 relative min-h-[400px]">
        {loading && (
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900">
              <th className="p-4 text-slate-400 font-bold uppercase text-xs tracking-wider">Student Name</th>
              <th className="p-4 text-slate-400 font-bold uppercase text-xs tracking-wider">Registration ID</th>
              <th className="p-4 text-slate-400 font-bold uppercase text-xs tracking-wider">Certificate ID</th>
              <th className="p-4 text-slate-400 font-bold uppercase text-xs tracking-wider">Program/Course</th>
              <th className="p-4 text-slate-400 font-bold uppercase text-xs tracking-wider">Issue Date</th>
              <th className="p-4 text-slate-400 font-bold uppercase text-xs tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {certificates.map(cert => (
              <tr key={cert.cert_id} className="border-b border-slate-800/50 hover:bg-slate-800/80 transition-colors">
                <td className="p-4 text-sm text-slate-200 font-medium whitespace-nowrap">
                  {cert.student_name || 'Ghost Account'}
                </td>
                <td className="p-4 text-sm text-slate-400 whitespace-nowrap">
                  {cert.reg_id}
                </td>
                <td className="p-4 font-mono text-xs text-blue-400 whitespace-nowrap">
                  {cert.cert_id}
                </td>
                <td className="p-4 text-sm text-slate-300">
                  {cert.course_title || 'N/A'}
                  <span className="ml-2 text-[10px] uppercase bg-slate-800 px-2 py-0.5 rounded text-slate-400">
                    {cert.type}
                  </span>
                </td>
                <td className="p-4 text-sm text-slate-400 whitespace-nowrap">
                  {new Date(cert.issue_date).toLocaleDateString()}
                </td>
                <td className="p-4 text-sm text-right whitespace-nowrap">
                  <button 
                    onClick={() => setDownloadingCertId(cert.cert_id)}
                    disabled={downloadingCertId === cert.cert_id}
                    className="bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-2 border border-blue-500/20 disabled:opacity-50"
                  >
                    {downloadingCertId === cert.cert_id ? (
                      <svg className="w-3.5 h-3.5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                    ) : (
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                    )}
                    {downloadingCertId === cert.cert_id ? 'Downloading...' : 'Print'}
                  </button>
                </td>
              </tr>
            ))}
            {!loading && certificates.length === 0 && (
              <tr>
                <td colSpan={6} className="p-16 text-center text-slate-500">
                  <div className="flex flex-col items-center gap-3">
                    <FiSearch className="w-8 h-8 opacity-20" />
                    <p>No certificates found matching your filters.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 0 && (
        <div className="flex items-center justify-between bg-slate-900/50 p-4 rounded-xl border border-slate-800">
          <p className="text-sm text-slate-400">
            Showing Page <span className="font-bold text-white">{currentPage}</span> of <span className="font-bold text-white">{totalPages}</span>
          </p>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1 || loading}
              className="flex items-center gap-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:hover:bg-slate-800 text-sm font-semibold text-slate-300 rounded-lg transition-colors border border-slate-700"
            >
              <FiChevronLeft className="w-4 h-4" /> Previous
            </button>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || loading}
              className="flex items-center gap-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:hover:bg-slate-800 text-sm font-semibold text-slate-300 rounded-lg transition-colors border border-slate-700"
            >
              Next <FiChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
