import React, { useEffect, useState, useRef } from 'react';
import { User, Assessment, Patient } from '../../types';
import {
  DashboardHeader,
  ClinicalStat,
  SectionHeader
} from './SharedDashboardComponents';
import { useNavigate } from 'react-router-dom';

export const PatientDashboard: React.FC<{ user: User }> = ({ user }) => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const journeyRef = useRef<HTMLDivElement>(null);

  // ================= SAFE DEMO DATA =================
  useEffect(() => {
    // Simulated patient profile (NO BACKEND)
    const demoPatient: Patient = {
      id: user.id,
      mrn: 'MRN-0001',
      firstName: user.fullName.split(' ')[0],
      lastName: user.fullName.split(' ')[1] || '',
      dob: '1995-01-01',
      gender: 'Unknown',
      admissionDate: '2024-01-01',
      ward: 'General',
      room: '101',
      diagnosis: 'Wound Recovery',
      status: 'Active',
    };

    setPatient(demoPatient);
    setAssessments([]); // no assessments yet
    setLoading(false);
  }, [user]);
  // ==================================================

  const handleContactCare = () => {
    alert('Care team has been notified.');
  };

  const handleAction = (label: string) => {
    if (label === 'Download Records') navigate('/reports');
    else alert(`${label} feature coming soon.`);
  };

  if (loading) {
    return (
      <div className="p-12 text-center font-black text-slate-300 uppercase tracking-widest animate-pulse">
        Accessing Secure Health Records...
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="p-20 text-center">
        <h3 className="text-xl font-bold">Patient profile not linked yet</h3>
        <button
          onClick={handleContactCare}
          className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold"
        >
          Contact Care Team
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-12">
      <DashboardHeader
        title={`Hello, ${patient.firstName}`}
        subtitle="Your Personal Recovery Dashboard"
        icon="fas fa-heart"
        currentUser={user}
        colorClass="bg-emerald-600"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ClinicalStat
          label="Recovery Status"
          value={patient.status}
          icon="fas fa-shield-heart"
          color="emerald"
          trend="STABLE"
        />
        <ClinicalStat
          label="Clinical ID"
          value={patient.mrn}
          icon="fas fa-fingerprint"
          color="indigo"
        />
        <ClinicalStat
          label="Data Snapshots"
          value={assessments.length}
          icon="fas fa-camera-retro"
          color="blue"
          onClick={() =>
            journeyRef.current?.scrollIntoView({ behavior: 'smooth' })
          }
        />
      </div>

      <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
        <SectionHeader
          title="Your Healing Journey"
          icon="fas fa-route"
          colorClass="bg-emerald-50 text-emerald-500"
        />

        {assessments.length === 0 && (
          <div className="p-16 text-center text-slate-400 font-bold text-xs uppercase tracking-widest">
            No assessments available yet
          </div>
        )}
      </div>

      <div className="bg-emerald-900 p-10 rounded-[3rem] text-white shadow-2xl">
        <h3 className="text-xs font-black uppercase tracking-widest mb-8 text-white/50">
          Secure Patient Actions
        </h3>
        <div className="space-y-4">
          <PatientAction
            icon="fas fa-file-medical"
            label="Download Records"
            onClick={() => handleAction('Download Records')}
          />
          <PatientAction
            icon="fas fa-comment-medical"
            label="Secure Messaging"
            onClick={() => handleAction('Secure Messaging')}
          />
          <PatientAction
            icon="fas fa-calendar-check"
            label="Request Consultation"
            onClick={() => handleAction('Request Consultation')}
          />
        </div>
      </div>
    </div>
  );
};

const PatientAction = ({
  icon,
  label,
  onClick,
}: {
  icon: string;
  label: string;
  onClick?: () => void;
}) => (
  <div
    onClick={onClick}
    className="flex items-center gap-4 p-5 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 cursor-pointer"
  >
    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
      <i className={icon}></i>
    </div>
    <span className="text-[10px] font-black uppercase tracking-widest">
      {label}
    </span>
  </div>
);