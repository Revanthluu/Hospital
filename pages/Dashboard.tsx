import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { User, UserRole } from '../types';
import { AdminDashboard } from '../components/dashboards/AdminDashboard';
import { DoctorDashboard } from '../components/dashboards/DoctorDashboard';
import { NurseDashboard } from '../components/dashboards/NurseDashboard';
import { PatientDashboard } from '../components/dashboards/PatientDashboard';

export const Dashboard = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  if (!currentUser) {
    return <Navigate to="/" />;
  }

  const renderDashboard = () => {
    switch (currentUser.role) {
      case UserRole.ADMIN:
        return <AdminDashboard />;
      case UserRole.DOCTOR:
        return <DoctorDashboard user={currentUser} />;
      case UserRole.NURSE:
        return <NurseDashboard user={currentUser} />;
      case UserRole.PATIENT:
        return <PatientDashboard user={currentUser} />;
      default:
        return <Navigate to="/" />;
    }
  };

  const getTitle = () => {
    switch (currentUser.role) {
      case UserRole.ADMIN:
        return 'System Administration';
      case UserRole.DOCTOR:
        return 'Clinical Overview';
      case UserRole.NURSE:
        return 'Nurse Station';
      case UserRole.PATIENT:
        return 'Health Portal';
      default:
        return 'Dashboard';
    }
  };

  return (
    <Layout title={getTitle()}>
      {renderDashboard()}
    </Layout>
  );
};