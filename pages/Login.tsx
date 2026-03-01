import React, { useState, useEffect } from 'react';
import { UserRole } from '../types';
import { emailService } from '../services/emailService';

const Login: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.DOCTOR);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [userOtp, setUserOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');

  useEffect(() => {
    emailService.init();
  }, []);

  const generateAndSendOtp = async () => {
    if (!email || !fullName) {
      setError('Please fill in your name and email.');
      return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);

    setLoading(true);
    try {
      await emailService.sendOTP(email, otp, fullName);
      setShowOtpInput(true);
      setError(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegistering) {
        if (!showOtpInput) {
          await generateAndSendOtp();
          return;
        }

        if (userOtp !== generatedOtp) {
          setError('Invalid OTP');
          return;
        }

        await fetch('/.netlify/functions/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, fullName, role }),
        });

        setIsRegistering(false);
        setShowOtpInput(false);
        setError('Account created. Please login.');
        return;
      }

      const res = await fetch('/.netlify/functions/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.message);
        return;
      }

      sessionStorage.setItem('isLoggedIn', 'true');
      sessionStorage.setItem('user', JSON.stringify(data.user));

      // ✅ HASH ROUTER FIX
      window.location.hash = '#/dashboard';

    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleAuth} className="bg-white p-8 rounded-xl w-96">
        <h2 className="text-xl font-bold mb-4">
          {isRegistering ? 'Register' : 'Login'}
        </h2>

        {error && <div className="text-red-600 mb-3">{error}</div>}

        {isRegistering && !showOtpInput && (
          <>
            <input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Full Name" />
            <select value={role} onChange={e => setRole(e.target.value as UserRole)}>
              <option value={UserRole.ADMIN}>Admin</option>
              <option value={UserRole.DOCTOR}>Doctor</option>
              <option value={UserRole.NURSE}>Nurse</option>
              <option value={UserRole.PATIENT}>Patient</option>
            </select>
          </>
        )}

        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />

        {showOtpInput && (
          <input value={userOtp} onChange={e => setUserOtp(e.target.value)} placeholder="OTP" />
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Please wait...' : isRegistering ? 'Register' : 'Login'}
        </button>

        <button type="button" onClick={() => setIsRegistering(!isRegistering)}>
          Toggle Register/Login
        </button>
      </form>
    </div>
  );
};

export default Login;