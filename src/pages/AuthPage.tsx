import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { Vote, ArrowRight, ShieldCheck, CheckCircle2, Mail, Lock, Globe, Smartphone, UserPlus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { FormInput } from '../components/ui/FormInput';
import { useLanguage, SUPPORTED_LANGUAGES } from '../context/LanguageContext';
import { authApi } from '../services/api';

export const AuthPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otpChallengeId, setOtpChallengeId] = useState<string | null>(null);
  const [otpCode, setOtpCode] = useState('');

  const { loginWithSession } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setError(null);
    setIsLoading(true);
    try {
      if (!otpChallengeId) {
        const challenge = await authApi.requestLoginOtp(email.trim(), password);
        setOtpChallengeId(challenge.challenge_id);
        showToast(
          challenge.dev_code ? `Development OTP: ${challenge.dev_code}` : `Verification code sent to ${challenge.destination}.`,
          'success'
        );
        return;
      }
      const session = await authApi.verifyLoginOtp(otpChallengeId, otpCode, email.trim(), password);
      loginWithSession(session, email);
      showToast('Signed in successfully.', 'success');
      navigate('/');
    } catch (err: any) {
      const msg = err?.response?.data?.error?.message
        || err?.response?.data?.message
        || err?.response?.data?.detail
        || err?.message
        || 'Login failed. Please check credentials.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const normalizedPhone = phone.trim();
    if (!organizationName.trim() || !firstName.trim() || !lastName.trim() || !email.trim() || !password || !normalizedPhone) {
      setError('Please complete all workspace and owner fields.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    const phoneIsValid = /^\+?[\d\s()-]{10,20}$/.test(normalizedPhone);
    if (!phoneIsValid) {
      setError('Please enter a valid phone number.');
      return;
    }

    setIsLoading(true);
    try {
      if (!otpChallengeId) {
        const challenge = await authApi.requestSignupOtp({
          organization_name: organizationName.trim(),
          email: email.trim(),
          password,
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          phone: normalizedPhone
        });
        setOtpChallengeId(challenge.challenge_id);
        showToast(
          challenge.dev_code ? `Development OTP: ${challenge.dev_code}` : `Verification code sent to ${challenge.destination}.`,
          'success'
        );
        return;
      }
      const session = await authApi.verifySignupOtp(otpChallengeId, otpCode);
      loginWithSession(session, email);
      showToast('Workspace created. You are signed in as Super Admin.', 'success');
      setOtpChallengeId(null);
      setOtpCode('');
      navigate('/');
    } catch (err: any) {
      const isConflict = err?.response?.status === 409;
      const msg = isConflict
        ? 'This email is already registered. Please sign in with your existing account.'
        : err?.response?.data?.error?.message
          || err?.response?.data?.message
          || err?.response?.data?.detail
          || err?.message
          || t('signUpFailed');
      if (isConflict) {
        setIsSignup(false);
        setPassword('');
      }
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
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
              {t('masterCampaignOS')}
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold leading-tight mb-2">
              {t('realTimeElection')}
            </h2>
            <p className="text-sm text-white/80 leading-relaxed mb-6">
              {t('voterDataVolunteer')}
            </p>
          </div>

          <div className="space-y-3">
            {[
              { icon: ShieldCheck, text: t('roleBasedAccess') },
              { icon: CheckCircle2, text: t('multiTenantOrg') },
              { icon: CheckCircle2, text: t('realtimeDashboard') }
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2.5 text-sm font-semibold text-white/90">
                <Icon className="w-4 h-4 text-sky-300 flex-shrink-0" />
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* Right Form */}
        <div className="p-6 sm:p-8 flex flex-col justify-center">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 mb-1">
                {isSignup ? t('createAccount') : t('signIn')}
              </h3>
              <p className="text-xs text-slate-500 mb-0">
                {isSignup ? t('registerVerifiedAccount') : t('enterCredentials')}
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2 py-1.5">
              <Globe className="w-3.5 h-3.5 text-slate-600" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="bg-transparent text-[10px] font-bold text-slate-700 outline-none"
                aria-label="Select language"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>{lang.native}</option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
              {error}
            </div>
          )}

          {/* Regular Login/Signup Form */}
          {otpChallengeId ? (
            <form onSubmit={isSignup ? handleSignup : handlePasswordLogin} className="space-y-4">
              <div className="rounded-xl border border-sky-200 bg-sky-50 px-3 py-3 text-xs text-sky-800">
                A 6-digit verification code was sent to <strong>{email}</strong>.
              </div>
              <FormInput
                label="Email verification code"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="123456"
                inputMode="numeric"
                maxLength={6}
                required
              />
              <Button type="submit" variant="primary" className="w-full" disabled={isLoading || otpCode.length !== 6}>
                {isLoading ? 'Verifying...' : 'Verify and continue'}
              </Button>
              <button type="button" className="w-full text-xs font-bold text-slate-500" onClick={() => { setOtpChallengeId(null); setOtpCode(''); }}>
                Change email or go back
              </button>
            </form>
          ) : <>
            {isSignup ? (
              <form onSubmit={handleSignup} className="space-y-4" autoComplete="off">
                <div className="rounded-xl border border-sky-200 bg-sky-50 px-3 py-2.5 text-xs text-sky-800">
                  <p className="font-bold">Create your organization workspace</p>
                  <p className="mt-0.5 text-sky-700">You become its first Super Admin and can then create Admins and Volunteers.</p>
                </div>
                <FormInput
                  label="Organization / Campaign Name"
                  type="text"
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  placeholder="e.g. Rampur Election Campaign"
                  required
                />
                <FormInput
                  label={t('firstName')}
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder={t('enterFirstName')}
                  autoComplete="off"
                  required
                />
                <FormInput
                  label={t('lastName')}
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder={t('enterLastName')}
                  autoComplete="off"
                  required
                />
                <FormInput
                  label={t('emailAddress')}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('emailExample')}
                  leftIcon={<Mail className="w-4 h-4" />}
                  autoComplete="off"
                  required
                />

                <FormInput
                  label={t('formLabelPhoneNumber')}
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t('phoneExample')}
                  leftIcon={<Smartphone className="w-4 h-4" />}
                  autoComplete="off"
                  required
                />

                <FormInput
                  label={t('password')}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('createPassword')}
                  leftIcon={<Lock className="w-4 h-4" />}
                  autoComplete="new-password"
                  required
                />

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  disabled={isLoading || !organizationName || !email || !password || !phone || (!firstName || !lastName)}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {t('creatingAccount')}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      {t('createAccount')}
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handlePasswordLogin} className="space-y-4">
                    <FormInput
                      label={t('emailAddress')}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@yourorganization.com"
                      leftIcon={<Mail className="w-4 h-4" />}
                      required
                    />

                    <FormInput
                      label={t('password')}
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      leftIcon={<Lock className="w-4 h-4" />}
                      required
                    />

                    <Button
                      type="submit"
                      variant="primary"
                      className="w-full"
                      disabled={isLoading || !email || !password}
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Signing in...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          Sign In with Password
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      )}
                    </Button>
                  </form>
            )}

            <div className="mt-6 text-center">
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-2">{t('or')}</div>
              {isSignup ? (
                <button
                  type="button"
                  onClick={() => setIsSignup(false)}
                  className="w-full py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all"
                >
                  {t('alreadyHaveAccountLogin')}
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setError(null);
                      setIsSignup(true);
                    }}
                    className="w-full py-2.5 rounded-xl border border-sky-300 bg-sky-50 text-xs font-bold text-sky-700 hover:bg-sky-100 transition-all flex items-center justify-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    Create Workspace / Super Admin Account
                  </button>
                </>
              )}
            </div>

            <div className="mt-5 text-center text-[10px] text-slate-400 font-semibold">
              {t('multiTenantNote')}
            </div>
          </>}
        </div>
      </div>
    </div>
  );
};
