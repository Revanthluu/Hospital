import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

  const navigate = useNavigate();

  useEffect(() => {
    emailService.init();
  }, []);

  // ================= OTP =================
  const generateAndSendOtp = async () => {
    if (!email || !fullName) {
      setError('Please fill in your name and email address first.');
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
      setError(`Verification Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ================= AUTH =================
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // ===== REGISTER =====
      if (isRegistering) {
        if (!showOtpInput) {
          await generateAndSendOtp();
          return;
        }

        if (userOtp !== generatedOtp) {
          setError('Invalid verification code.');
          return;
        }

        const res = await fetch('/.netlify/functions/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, fullName, role }),
        });

        const data = await res.json();

        if (!data.success) {
          setError(data.message);
          return;
        }

        setIsRegistering(false);
        setShowOtpInput(false);
        setGeneratedOtp('');
        setUserOtp('');
        setError('Account created successfully. Please login.');
        return;
      }

      // ===== LOGIN =====
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
      navigate('/dashboard');

    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ================= UI =================
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 relative">
      <div className="absolute top-8 left-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xl">
          <i className="fas fa-plus"></i>
        </div>
        <div>
          <h1 className="font-bold text-slate-800 text-xl">MediWound AI</h1>
          <p className="text-xs text-slate-500 font-bold uppercase">
            Hospital - Grade Diagnostics
          </p>
        </div>
      </div>

      <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-slate-100">
        <h2 className="text-2xl font-bold mb-2">
          {isRegistering ? 'Create Clinical Account' : 'Welcome Back'}
        </h2>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-6">

          {isRegistering && showOtpInput && (
            <input
              type="text"
              value={userOtp}
              onChange={(e) => setUserOtp(e.target.value)}
              maxLength={6}
              required
              placeholder="000000"
              className="w-full p-4 text-center text-2xl rounded-xl border"
            />
          )}

          {!showOtpInput && (
            <>
              {isRegistering && (
                <>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full p-4 rounded-xl border"
                  />

                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full p-4 rounded-xl border"
                  >
                    <option value={UserRole.ADMIN}>Admin</option>
                    <option value={UserRole.DOCTOR}>Doctor</option>
                    <option value={UserRole.NURSE}>Nurse</option>
                    <option value={UserRole.PATIENT}>Patient</option>
                  </select>
                </>
              )}

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-4 rounded-xl border"
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-4 rounded-xl border"
              />
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold"
          >
            {loading
              ? 'Processing...'
              : isRegistering
              ? showOtpInput
                ? 'Verify & Register'
                : 'Send Verification Email'
              : 'Login'}
          </button>
        </form>

        <button
          className="mt-4 text-sm font-bold text-slate-500"
          onClick={() => {
            setIsRegistering(!isRegistering);
            setError(null);
            setShowOtpInput(false);
            setUserOtp('');
          }}
        >
          {isRegistering
            ? 'Already have an account? Login'
            : 'New Clinician? Register'}
        </button>
      </div>
    </div>
  );
};

export default Login;