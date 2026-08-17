import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { Vote, ArrowRight, ShieldCheck, CheckCircle2, Phone, User, Users } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { FormInput } from '../components/ui/FormInput';
import { UserRole } from '../types';

export const AuthPage: React.FC = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [role, setRole] = useState<UserRole>('superadmin');
  const [phone, setPhone] = useState('+91 98290 14285');
  const [name, setName] = useState('Rameshwar Patel');
  const [panchayat, setPanchayat] = useState('Gram Panchayat Rampur');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(phone, role);
      showToast(`Welcome to ElectWin War Room as ${role.toUpperCase()}!`, 'success');
      navigate('/');
    } catch {
      showToast('Authentication failed. Continuing in demo mode.', 'info');
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoMode = async () => {
    await login('+91 98290 14285', 'superadmin');
    showToast('Entered ElectWin in Live Interactive Demo Mode!', 'info');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-3 sm:p-6">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-modal border border-slate-200 overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left Hero Graphic */}
        <div className="bg-gradient-to-br from-sky-600 to-violet-700 p-8 text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center backdrop-blur-md">
                <Vote className="w-6 h-6 text-white" />
              </div>
              <span className="font-heading font-extrabold text-2xl tracking-tight">
                Elect<span className="text-sky-300">Win</span>
              </span>
            </div>

            <div className="inline-block px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-bold mb-4 backdrop-blur-xs">
              🇮🇳 Master Campaign OS & War Room
            </div>

            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold leading-tight mb-3">
              Win Your Gram Panchayat & Ward Elections
            </h2>
            <p className="text-sm text-sky-100 leading-relaxed mb-6">
              Complete digital election platform for Sarpanch & Panch candidates: voter roll sync, camera OCR, WhatsApp broadcast, and design studio.
            </p>

            <div className="space-y-2.5 text-xs text-sky-50">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>Single-account role switching (*Super Admin &gt; Admin &gt; Volunteer*)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>50+ Official Election Commission symbols &amp; flex posters</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>Smart WhatsApp with automatic SMS fallback routing</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/15 text-xs text-sky-200">
            Gram Panchayat Rampur Election War Room • 2026
          </div>
        </div>

        {/* Right Form Card */}
        <div className="p-6 sm:p-10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-heading font-extrabold text-xl text-slate-900">
                  {isSignup ? 'Register Campaign Account' : 'Campaign War Room Login'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isSignup ? 'Create your official candidate headquarters' : 'Sign in to access real-time ground analytics'}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Select Hierarchy Role
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'superadmin', label: 'Super Admin', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
                    { id: 'admin', label: 'Admin', icon: <Users className="w-3.5 h-3.5" /> },
                    { id: 'volunteer', label: 'Volunteer', icon: <User className="w-3.5 h-3.5" /> }
                  ].map((r) => (
                    <button
                      type="button"
                      key={r.id}
                      onClick={() => setRole(r.id as UserRole)}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                        role === r.id
                          ? 'border-sky-500 bg-sky-50 text-sky-900 shadow-xs'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {r.icon}
                      <span>{r.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {isSignup && (
                <>
                  <FormInput
                    label="Candidate / Manager Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <FormInput
                    label="Gram Panchayat / Ward Area"
                    value={panchayat}
                    onChange={(e) => setPanchayat(e.target.value)}
                    required
                  />
                </>
              )}

              <FormInput
                label="Registered Mobile Number"
                leftIcon={<Phone className="w-4 h-4" />}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                required
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={isLoading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                {isSignup ? 'Create Campaign & Launch' : 'Enter War Room'}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setIsSignup(prev => !prev)}
                className="text-xs font-bold text-sky-600 hover:text-sky-800 cursor-pointer"
              >
                {isSignup ? 'Already have a campaign account? Log in' : "Don't have an account? Sign up candidate"}
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 mt-6">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={handleDemoMode}
              className="w-full text-slate-600"
            >
              Continue Demo without Login
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
