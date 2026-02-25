
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { db, APIError } from '../services/db';
import { User } from '../types';

const Settings: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Mock settings
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setCurrentUser(user);
            setFullName(user.fullName);
            setEmail(user.email);
        }
    }, []);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (password && password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (!currentUser) return;

        setLoading(true);
        try {
            const payload: any = { fullName, email };
            if (password) payload.password = password;

            const updatedUser = await db.updateProfile(currentUser.id, payload);
            if (updatedUser) {
                const newUser = { ...currentUser, ...updatedUser };
                sessionStorage.setItem('user', JSON.stringify(newUser));
                setCurrentUser(newUser);
                setSuccess("Profile updated successfully");
                setPassword('');
                setConfirmPassword('');
            }
        } catch (err) {
            if (err instanceof APIError) {
                setError(err.message);
            } else {
                setError("Failed to update profile");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout title="System Settings">
            <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Navigation Sidebar (Mobile Sticky) */}
                    <div className="md:col-span-1 space-y-2">
                        <SettingsTab label="Account Profile" icon="fas fa-user-circle" active />
                        <SettingsTab label="Security & Privacy" icon="fas fa-shield-alt" />
                        <SettingsTab label="Notifications" icon="fas fa-bell" />
                        <SettingsTab label="System Preferences" icon="fas fa-sliders-h" />
                    </div>

                    {/* Content Area */}
                    <div className="md:col-span-2 space-y-8">
                        {/* Profile Section */}
                        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                                <h3 className="font-bold text-slate-800">Clinical Profile</h3>
                                <p className="text-xs text-slate-400 font-medium">Update your professional information and system identity.</p>
                            </div>

                            <form onSubmit={handleUpdateProfile} className="p-6 space-y-6">
                                {error && (
                                    <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-bold flex items-center gap-3 animate-head-shake">
                                        <i className="fas fa-exclamation-circle text-lg"></i>
                                        {error}
                                    </div>
                                )}
                                {success && (
                                    <div className="p-4 bg-green-50 border border-green-100 text-green-600 rounded-xl text-sm font-bold flex items-center gap-3 animate-bounce-short">
                                        <i className="fas fa-check-circle text-lg"></i>
                                        {success}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-medium"
                                            placeholder="Dr. John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Professional Email</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-medium"
                                            placeholder="clinician@hospital.com"
                                        />
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-slate-100">
                                    <h4 className="text-sm font-bold text-slate-800 mb-4">Change Secure Password</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">New Password</label>
                                            <input
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-medium"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Confirm Password</label>
                                            <input
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-medium"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-3 flex items-center gap-2 font-medium">
                                        <i className="fas fa-info-circle text-blue-500"></i>
                                        Leave blank if you do not wish to change your password.
                                    </p>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {loading ? <i className="fas fa-spinner animate-spin"></i> : <i className="fas fa-save"></i>}
                                        Save Profile Changes
                                    </button>
                                </div>
                            </form>
                        </section>

                        {/* Preferences Section */}
                        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-slate-800">Email Notifications</h3>
                                    <p className="text-xs text-slate-400 font-medium">Receive critical alerts about patient wound deterioration.</p>
                                </div>
                                <Toggle active={notifications} onToggle={() => setNotifications(!notifications)} />
                            </div>

                            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                                <div>
                                    <h3 className="font-bold text-slate-800">System High-Contrast</h3>
                                    <p className="text-xs text-slate-400 font-medium">Optimize UI for low-light clinical environments.</p>
                                </div>
                                <Toggle active={darkMode} onToggle={() => setDarkMode(!darkMode)} />
                            </div>
                        </section>

                        <div className="p-6 bg-orange-50 rounded-2xl border border-orange-100 flex items-start gap-4">
                            <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center shrink-0">
                                <i className="fas fa-exclamation-triangle"></i>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-orange-800">Security Audit Notice</h4>
                                <p className="text-xs text-orange-700 mt-1 leading-relaxed">
                                    All modifications to clinician profiles are logged for HIPAA compliance. unauthorized access or changes may lead to system suspension.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

const SettingsTab = ({ label, icon, active = false }: { label: string; icon: string; active?: boolean }) => (
    <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${active ? 'bg-blue-600 text-white shadow-xl shadow-blue-100 scale-[1.02]' : 'text-slate-500 hover:bg-white hover:text-slate-800'}`}>
        <i className={`${icon} w-5 text-center ${active ? 'text-white' : 'text-slate-400'}`}></i>
        <span>{label}</span>
        {active && <i className="fas fa-chevron-right ml-auto text-xs opacity-50"></i>}
    </button>
);

const Toggle = ({ active, onToggle }: { active: boolean; onToggle: () => void }) => (
    <button
        onClick={onToggle}
        className={`w-12 h-6 rounded-full transition-all relative ${active ? 'bg-blue-600' : 'bg-slate-200'}`}
    >
        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${active ? 'left-7 shadow-sm' : 'left-1'}`}></div>
    </button>
);

export default Settings;
