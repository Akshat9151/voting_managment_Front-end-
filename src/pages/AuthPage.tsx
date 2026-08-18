import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { Vote, ArrowRight, ShieldCheck, CheckCircle2, Mail, Lock, UserPlus, Globe, Smartphone } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { FormInput } from '../components/ui/FormInput';
import { useLanguage, SUPPORTED_LANGUAGES } from '../context/LanguageContext';

export const AuthPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otpContact, setOtpContact] = useState('');
  const [otpStep, setOtpStep] = useState<1 | 2>(1);
  const [otpCode, setOtpCode] = useState<string[]>(Array(6).fill(''));
  const [otpExpiryAt, setOtpExpiryAt] = useState<number | null>(null);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [otpFailedAttempts, setOtpFailedAttempts] = useState(0);
  const [isOtpSending, setIsOtpSending] = useState(false);
  const [isOtpVerifying, setIsOtpVerifying] = useState(false);
  const otpInputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const { loginWithOtp } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    if (resendCountdown <= 0) return;

    const interval = window.setInterval(() => {
      setResendCountdown((prev) => {
        if (prev <= 1) {
          window.clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [resendCountdown]);

  const resetOtpState = () => {
    setOtpStep(1);
    setOtpCode(Array(6).fill(''));
    setOtpFailedAttempts(0);
    setOtpExpiryAt(null);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const nextDigits = [...otpCode];
    nextDigits[index] = value.slice(-1);
    setOtpCode(nextDigits);

    if (value && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleSendOtp = async () => {
    const normalized = otpContact.trim();
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);
    const cleanPhone = normalized.replace(/\s+/g, '');
    const isValidPhone = /^\d{10,15}$/.test(cleanPhone);

    if (!normalized || (!isValidEmail && !isValidPhone)) {
      setError(t('invalidEmail'));
      return;
    }

    setError(null);
    setIsOtpSending(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 700));
      setOtpStep(2);
      setOtpCode(Array(6).fill(''));
      setOtpExpiryAt(Date.now() + 180000);
      setOtpFailedAttempts(0);
      setResendCountdown(30);
      showToast(t('otpSentSuccess'), 'success');
    } finally {
      setIsOtpSending(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpExpiryAt || Date.now() > otpExpiryAt) {
      setError(t('otpExpired'));
      showToast(t('otpExpired'), 'error');
      resetOtpState();
      return;
    }

    const entered = otpCode.join('');
    if (entered.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    setIsOtpVerifying(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (entered !== '123456') {
        const nextAttempts = otpFailedAttempts + 1;
        setOtpFailedAttempts(nextAttempts);
        setOtpCode(Array(6).fill(''));

        if (nextAttempts >= 3) {
          setError(t('otpBlocked'));
          setResendCountdown(30);
          setOtpStep(1);
          showToast(t('otpBlocked'), 'error');
          return;
        }

        setError(t('otpWrong'));
        showToast(t('otpWrong'), 'error');
        return;
      }

      await loginWithOtp(otpContact.trim());
      showToast(t('otpVerifySuccess'), 'success');
      navigate('/');
    } finally {
      setIsOtpVerifying(false);
    }
  };

  const handleOtpResend = async () => {
    if (resendCountdown > 0) return;
    await handleSendOtp();
  };

  const handleDemoLogin = async () => {
    setError(null);
    setIsLoading(true);
    try {
      await loginWithOtp('superadmin@electwin.com', 'SUPER_ADMIN');
      showToast(t('enteredAsAdmin'), 'info');
      navigate('/');
    } catch (err: any) {
      const msg = err?.message || t('backendNotRunning');
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
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password || !normalizedPhone) {
      setError('Please complete all signup fields, including the phone number.');
      return;
    }

    const phoneIsValid = /^\+?[\d\s()-]{10,20}$/.test(normalizedPhone);
    if (!phoneIsValid) {
      setError('Please enter a valid phone number.');
      return;
    }

    setIsLoading(true);
    try {
      const baseUrl = (import.meta as any).env?.VITE_API_BASE_URL ?? 'http://localhost:8000/api/v1';
      const response = await fetch(`${baseUrl}/users/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password,
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          phone: normalizedPhone,
          organization_id: null
        })
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.message || payload?.detail || t('signUpFailed'));
      }

      showToast(t('accountCreated'), 'success');
      setIsSignup(false);
      setPassword('');
      setPhone('');
      setFirstName('');
      setLastName('');
    } catch (err: any) {
      const msg = err.message || t('signUpFailed');
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
          <>
            {isSignup ? (
              <form onSubmit={handleSignup} className="space-y-4">
                <FormInput
                  label={t('firstName')}
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder={t('enterFirstName')}
                  required
                />
                <FormInput
                  label={t('lastName')}
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder={t('enterLastName')}
                  required
                />
                <FormInput
                  label={t('emailAddress')}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('emailExample')}
                  leftIcon={<Mail className="w-4 h-4" />}
                  required
                />

                <FormInput
                  label={t('formLabelPhoneNumber')}
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t('phoneExample')}
                  leftIcon={<Smartphone className="w-4 h-4" />}
                  required
                />

                <FormInput
                  label={t('password')}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('createPassword')}
                  leftIcon={<Lock className="w-4 h-4" />}
                  required
                />

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  disabled={isLoading || !email || !password || !phone || (!firstName || !lastName)}
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
              <div className="space-y-4">
                <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                  {otpStep === 1 ? t('otpStepOne') : t('otpStepTwo')}
                </div>

                {otpStep === 1 ? (
                  <>
                    <FormInput
                      label={t('emailOrPhone')}
                      type="text"
                      value={otpContact}
                      onChange={(e) => setOtpContact(e.target.value)}
                      placeholder={t('otpContactExample')}
                      leftIcon={<Smartphone className="w-4 h-4" />}
                    />

                    <Button
                      type="button"
                      variant="primary"
                      className="w-full"
                      onClick={handleSendOtp}
                      disabled={isOtpSending || !otpContact.trim()}
                    >
                      {isOtpSending ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          {t('sendOtp')}
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          {t('sendOtp')}
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      )}
                    </Button>

                    <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] text-amber-700 font-semibold">
                      {t('otpTestingHint')}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-6 gap-2">
                      {otpCode.map((digit, index) => (
                        <input
                          key={`otp-${index}`}
                          ref={(el) => { otpInputsRef.current[index] = el; }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Backspace' && !digit && index > 0) {
                              otpInputsRef.current[index - 1]?.focus();
                            }
                          }}
                          className="h-12 rounded-xl border border-slate-300 bg-white text-center text-lg font-bold text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
                          aria-label={`${t('otpInputLabel')} ${index + 1}`}
                        />
                      ))}
                    </div>

                    <Button
                      type="button"
                      variant="primary"
                      className="w-full"
                      onClick={handleVerifyOtp}
                      disabled={isOtpVerifying || otpCode.join('').length !== 6}
                    >
                      {isOtpVerifying ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          {t('verifyOtp')}
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          {t('verifyAndLogin')}
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      )}
                    </Button>

                    <div className="flex items-center justify-between gap-2 text-[11px]">
                      <button
                        type="button"
                        onClick={handleOtpResend}
                        disabled={resendCountdown > 0}
                        className="font-bold text-sky-600 disabled:text-slate-400"
                      >
                        {resendCountdown > 0 ? `${t('otpResendIn')} ${resendCountdown}s` : t('otpResend')}
                      </button>
                      <span className="text-slate-500">{t('otpTestingHint')}</span>
                    </div>
                  </>
                )}
              </div>
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
                    onClick={handleDemoLogin}
                    disabled={isLoading}
                    className="w-full py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all disabled:opacity-50"
                  >
                    {t('quickDemoLogin')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsSignup(true)}
                    className="mt-3 w-full py-2.5 rounded-xl border border-sky-200 bg-sky-50 text-xs font-bold text-sky-700 hover:bg-sky-100 transition-all flex items-center justify-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    {t('signUpNewAccount')}
                  </button>
                </>
              )}
            </div>

            <div className="mt-5 text-center text-[10px] text-slate-400 font-semibold">
              {t('multiTenantNote')}
            </div>
          </>
        </div>
      </div>
    </div>
  );
};
