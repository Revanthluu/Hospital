import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';
import { db } from '../services/db';
import { Patient, Assessment, User } from '../types';

export const Dashboard = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) setCurrentUser(JSON.parse(storedUser));

        const [pData, aData] = await Promise.all([
          db.getPatients(),
          db.getAssessments()
        ]);
        setPatients(pData);
        setAssessments(aData);
      } catch (e) {
        console.error("DB Sync Failed", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading) return (
    <Layout title="Dashboard">
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 font-bold uppercase tracking-wider text-xs">Synchronizing Clinical Data...</p>
      </div>
    </Layout>
  );

  const activePatients = patients.filter(p => p.status === 'Active');

  return (
    <Layout title="Clinical Overview">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          <h1 className="text-3xl font-extrabold text-slate-800">
            Welcome, {currentUser?.fullName.split(' ')[0] || 'Clinician'}
          </h1>
          <p className="text-sm font-semibold flex items-center gap-2 mt-2 text-blue-600">
            <i className="fas fa-chart-line text-xs"></i>
            You have accessed the system <span className="font-bold">{currentUser?.visitCount}</span> times. Last visit: <span className="font-bold">{currentUser?.lastLogin ? new Date(currentUser.lastLogin).toLocaleTimeString() : 'Just now'}</span>
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/add-assessment" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-2">
            <i className="fas fa-plus"></i>
            New Assessment
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard label="Live Patients" value={activePatients.length.toString()} change="DB ACTIVE" color="blue" subtitle="Active Care Records" icon="fas fa-hospital-user" />
        <StatCard label="Wound Logs" value={assessments.length.toString()} change="SYNCED" color="red" subtitle="Total Assessments" icon="fas fa-file-medical" />
        <StatCard label="System Trust" value="100%" change="SECURE" color="green" subtitle="Encrypted Session" icon="fas fa-shield-alt" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {assessments.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border-2 border-dashed border-slate-200 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300 text-3xl">
                <i className="fas fa-user-md"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Workspace Initialized</h3>
              <p className="text-slate-500 mb-8 max-w-xs mx-auto">Your clinical database is ready. Start your first wound assessment to begin longitudinal tracking.</p>
              <Link to="/add-assessment" className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold">New Assessment</Link>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <i className="fas fa-history text-blue-600"></i>
                Recent Clinical Activity
              </h3>
              <div className="space-y-4">
                {assessments.slice(0, 5).map(a => (
                  <div key={a.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-blue-600 font-bold">
                        {a.granulation_pct}%
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800">{a.wound_location}</h4>
                        <p className="text-xs text-slate-500 font-medium">{new Date(a.date).toLocaleString()}</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded-md text-xs font-bold uppercase bg-blue-100 text-blue-700 tracking-tight">
                      {a.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-slate-800 p-6 rounded-3xl text-white shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                <i className="fas fa-fingerprint"></i>
              </div>
              <div>
                <h3 className="font-bold text-sm">Session Analytics</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Audit Logging Active</p>
              </div>
            </div>
            <div className="space-y-4">
              <SecurityMetric label="User ID" status={currentUser?.id || 'Unknown'} />
              <SecurityMetric label="Total Visits" status={currentUser?.visitCount?.toString() || '0'} />
              <SecurityMetric label="Last Sync" status="Just Now" />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const StatCard = ({ label, value, change, subtitle, icon, color }: any) => {
  const colors: any = {
    blue: 'text-blue-600 bg-blue-50',
    red: 'text-red-600 bg-red-50',
    green: 'text-green-600 bg-green-50'
  };
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${colors[color]}`}>
          <i className={icon}></i>
        </div>
        <span className="text-xs font-bold px-2 py-1 bg-slate-50 text-slate-500 rounded-lg uppercase tracking-tight">{change}</span>
      </div>
      <h3 className="text-3xl font-extrabold text-slate-800 mb-1">{value}</h3>
      <p className="text-sm font-bold text-slate-500 mb-1">{label}</p>
      <p className="text-xs text-slate-400 font-semibold uppercase tracking-tight">{subtitle}</p>
    </div>
  );
};

const SecurityMetric = ({ label, status }: any) => (
  <div className="flex items-center justify-between">
    <span className="text-xs text-slate-400 font-medium">{label}</span>
    <span className="text-xs font-bold text-blue-400">{status}</span>
  </div>
);

// End of file
