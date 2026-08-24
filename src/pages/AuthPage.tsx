import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { useLanguage, SUPPORTED_LANGUAGES } from '../context/LanguageContext';
import { GoogleLogin } from '@react-oauth/google';
import {
  Lock,
  Mail,
  ArrowRight,
  Globe,
  Smartphone
} from 'lucide-react';
import { FormInput } from '../components/ui/FormInput';
import { Button } from '../components/ui/Button';
import { VoteVictoryLogo } from '../components/ui/VoteVictoryLogo';
import { authApi } from '../services/api';
import { warmUpServer } from '../services/httpClient';
import './SplashPage.css';

export const AuthPage: React.FC = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpChallengeId, setOtpChallengeId] = useState<string | null>(null);
  const [otpDestination, setOtpDestination] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);
  const [slowRequest, setSlowRequest] = useState(false); // shows "server waking up" banner
  const slowTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { loginWithSession } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();

  const [isLoginVerification, setIsLoginVerification] = useState(false);

  // Silently wake the backend as soon as the auth page opens
  useEffect(() => {
    warmUpServer();
  }, []);

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please enter both email/phone and password.');
      return;
    }

    setError(null);
    setSuccessBanner(null);
    setSlowRequest(false);
    setIsLoading(true);
    // After 5s with no response, show the "server waking up" banner
    slowTimer.current = setTimeout(() => setSlowRequest(true), 5000);
    try {
      const identifier = email.trim();
      const session = await authApi.login(identifier, password);
      loginWithSession(session, email.trim());
      showToast('Signed in successfully.', 'success');
      navigate('/');
    } catch (err: any) {
      const isTimeout = err?.code === 'ECONNABORTED' || err?.message?.includes('timeout');
      const errorDetails = err?.response?.data?.error?.details || err?.response?.data?.details;
      if (errorDetails?.requires_otp && errorDetails?.challenge_id) {
        setOtpChallengeId(errorDetails.challenge_id);
        setOtpDestination(errorDetails.destination || email.trim());
        setIsLoginVerification(true);
        showToast(`A one-time verification code has been sent to ${errorDetails.destination || email.trim()}.`, 'info');
        return;
      }
      const msg = isTimeout
        ? 'The server took too long to respond — it may still be starting up. Please try again in a moment.'
        : (err?.response?.data?.error?.message
          || err?.response?.data?.message
          || err?.response?.data?.detail
          || err?.message
          || 'Login failed. Please check credentials.');
      setError(msg);
      showToast(msg, 'error');
    } finally {
      if (slowTimer.current) clearTimeout(slowTimer.current);
      setSlowRequest(false);
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessBanner(null);

    if (otpChallengeId) {
      // OTP Verification Step
      if (!otpCode || otpCode.length !== 6) {
        setError('Please enter a valid 6-digit verification code.');
        return;
      }

      setIsLoading(true);
      try {
        if (isLoginVerification) {
          const session = await authApi.verifyLoginOtp(otpChallengeId, otpCode, email.trim(), password);
          loginWithSession(session, email.trim());
          showToast('Account verified and signed in successfully!', 'success');
          navigate('/');
        } else {
          await authApi.verifySignupOtp(otpChallengeId, otpCode);
          showToast('Account verified! Please log in with your email and password.', 'success');
          setSuccessBanner('Account verified successfully! Please enter your password to sign in.');
          setOtpChallengeId(null);
          setOtpCode('');
          setPassword('');
          setIsSignup(false);
        }
      } catch (err: any) {
        const msg = err?.response?.data?.error?.message
          || err?.response?.data?.message
          || err?.response?.data?.detail
          || err?.message
          || 'Invalid or expired verification code.';
        setError(msg);
        showToast(msg, 'error');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    const normalizedPhone = phone.trim();
    if (!fullName.trim() || !email.trim() || !password || !normalizedPhone) {
      setError('Please complete all required fields.');
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
      const challenge = await authApi.requestSignupOtp({
        full_name: fullName.trim(),
        email: email.trim(),
        password,
        phone: normalizedPhone
      });
      setOtpChallengeId(challenge.challenge_id);
      setOtpDestination(challenge.destination);
      showToast(
        challenge.dev_code ? `Development OTP: ${challenge.dev_code}` : `Verification code sent to ${challenge.destination}.`,
        'info'
      );
    } catch (err: any) {
      const msg = err?.response?.data?.error?.message
        || err?.response?.data?.message
        || err?.response?.data?.detail
        || err?.message
        || 'Signup failed. Please try again.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (!credentialResponse?.credential) {
      showToast('Google authentication failed. No token received.', 'error');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const session = await authApi.googleAuth(credentialResponse.credential);
      loginWithSession(session, session.user?.email || 'Google User');
      showToast('Signed in with Google successfully!', 'success');
      navigate('/');
    } catch (err: any) {
      const msg = err?.response?.data?.error?.message
        || err?.response?.data?.message
        || err?.response?.data?.detail
        || err?.message
        || 'Google authentication failed.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    showToast('Google authentication failed or was closed.', 'error');
  };

  return (
    <div className="vv-auth-page relative min-h-screen flex items-center justify-center p-4 sm:p-6 overflow-x-hidden overflow-y-auto">
      {/* Animated wave background — intentionally limited to Login/Signup */}
      <svg className="vv-wave-background" viewBox="0 0 1440 900" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="vv-wave-base" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#EDEBE6" />
            <stop offset="100%" stopColor="#DDD9D0" />
          </linearGradient>
          <filter id="vv-wave-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="58" />
          </filter>
        </defs>
        <rect width="1440" height="900" fill="url(#vv-wave-base)" />
        <circle className="vv-wave-glow vv-wave-glow-one" cx="120" cy="80" r="220" fill="#B5471F" opacity="0.16">
          <animate attributeName="cx" values="120;250;120" dur="15s" repeatCount="indefinite" />
          <animate attributeName="cy" values="80;170;80" dur="15s" repeatCount="indefinite" />
        </circle>
        <circle className="vv-wave-glow vv-wave-glow-two" cx="1330" cy="790" r="250" fill="#B5471F" opacity="0.16">
          <animate attributeName="cx" values="1330;1180;1330" dur="14s" repeatCount="indefinite" />
          <animate attributeName="cy" values="790;690;790" dur="14s" repeatCount="indefinite" />
        </circle>
        <path className="vv-wave-line vv-wave-orange" d="M-40 245 C 220 120, 430 390, 700 245 S 1170 90, 1480 260">
          <animate attributeName="d" dur="9s" repeatCount="indefinite"
            values="M-40 245 C 220 120, 430 390, 700 245 S 1170 90, 1480 260;M-40 280 C 220 390, 455 100, 720 275 S 1180 410, 1480 220;M-40 245 C 220 120, 430 390, 700 245 S 1170 90, 1480 260" />
        </path>
        <path className="vv-wave-line vv-wave-gray" d="M-40 410 C 230 285, 460 520, 730 390 S 1190 270, 1480 430">
          <animate attributeName="d" dur="11s" repeatCount="indefinite"
            values="M-40 410 C 230 285, 460 520, 730 390 S 1190 270, 1480 430;M-40 370 C 230 530, 470 270, 740 430 S 1190 520, 1480 350;M-40 410 C 230 285, 460 520, 730 390 S 1190 270, 1480 430" />
        </path>
        <path className="vv-wave-line vv-wave-orange vv-wave-low" d="M-40 610 C 230 480, 470 735, 740 590 S 1190 475, 1480 640">
          <animate attributeName="d" dur="13s" repeatCount="indefinite"
            values="M-40 610 C 230 480, 470 735, 740 590 S 1190 475, 1480 640;M-40 660 C 220 760, 470 470, 760 650 S 1200 760, 1480 570;M-40 610 C 230 480, 470 735, 740 590 S 1190 475, 1480 640" />
        </path>
        <path className="vv-wave-line vv-wave-gray vv-wave-low" d="M-40 790 C 220 665, 460 875, 720 755 S 1180 660, 1480 820">
          <animate attributeName="d" dur="15s" repeatCount="indefinite"
            values="M-40 790 C 220 665, 460 875, 720 755 S 1180 660, 1480 820;M-40 745 C 220 900, 480 675, 760 790 S 1190 900, 1480 735;M-40 790 C 220 665, 460 875, 720 755 S 1180 660, 1480 820" />
        </path>
      </svg>

      {/* Centered authentication card */}
      <div className="vv-auth-card relative z-10 w-full bg-white rounded-[28px] border border-slate-200/80 shadow-[0_24px_70px_-28px_rgba(15,23,42,0.32)]">
        <div className="p-6 sm:p-9">
          <div className="vv-auth-brand text-center">
            <div className="flex items-center justify-center gap-3">
              <VoteVictoryLogo className="h-11 w-11" />
              <div className="flex flex-col items-start">
                <span className="font-heading font-extrabold text-[1.65rem] tracking-tight text-slate-900 leading-tight">
                  Vote<span className="text-amber-600">Victory</span>
                </span>
                <span className="text-[11px] font-extrabold text-amber-600 tracking-wider">
                  वोट विजय
                </span>
              </div>
            </div>
            <p className="mx-auto mt-4 max-w-xs text-sm leading-6 text-slate-500">
              {t('authTagline')}
            </p>
          </div>

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

          {successBanner && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 font-medium">
              {successBanner}
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
              {error}
            </div>
          )}

          {/* Cold-start warm-up banner — shown after 5s of no response */}
          {slowRequest && (
            <div className="mb-4 flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
              <svg className="animate-spin mt-0.5 w-3.5 h-3.5 text-amber-600 flex-shrink-0" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span><strong>Server is waking up…</strong> The backend runs on a free-tier host that sleeps when idle. This usually takes 20–60 seconds on first use. Please wait — do not refresh.</span>
            </div>
          )}

          {/* OTP Verification Form */}
          {otpChallengeId ? (
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-3 text-xs text-amber-900">
                A 6-digit verification code was sent to <strong>{otpDestination || email}</strong>. Please enter it below to complete registration.
              </div>
              <FormInput
                label="Email verification code"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder={t('auth.enter_otp', 'Enter 6-digit code')}
                inputMode="numeric"
                maxLength={6}
                required
              />
              <Button type="submit" variant="primary" className="w-full" disabled={isLoading || otpCode.length !== 6}>
                {isLoading ? 'Verifying...' : 'Verify and proceed to login'}
              </Button>
              <button
                type="button"
                className="w-full text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors"
                onClick={() => { setOtpChallengeId(null); setOtpCode(''); setOtpDestination(''); setIsLoginVerification(false); }}
              >
                Change email or go back
              </button>
            </form>
          ) : (
            <>
              {/* Google Sign In / Sign Up Button */}
              <div className="mb-4">
                <div className="w-full flex justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    text={isSignup ? 'signup_with' : 'signin_with'}
                    shape="pill"
                    size="large"
                    width="320px"
                  />
                </div>
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-2 text-[10px] text-slate-400 uppercase font-bold tracking-wider">{t('or')}</span>
                  </div>
                </div>
              </div>

              {isSignup ? (
                <form onSubmit={handleSignup} className="space-y-3.5" autoComplete="off">
                  <FormInput
                    label="Full Name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    required
                  />
                  <FormInput
                    label={t('emailOrPhone')}
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('otpContactExample')}
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
                    disabled={isLoading || !fullName || !email || !password || !phone}
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
                <form onSubmit={handlePasswordLogin} className="space-y-4" autoComplete="off">
                  <FormInput
                    label={t('emailAddress')}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('emailExample')}
                    leftIcon={<Mail className="w-4 h-4" />}
                    autoComplete="username"
                    required
                  />

                  <FormInput
                    label={t('password')}
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('enterPassword')}
                    leftIcon={<Lock className="w-4 h-4" />}
                    autoComplete="current-password"
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
                        {t('signingIn')}
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        {t('signIn')}
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    )}
                  </Button>
                </form>
              )}

              <div className="mt-5 text-center text-xs text-slate-500">
                {isSignup ? t('alreadyHaveAccount') : t('dontHaveAccount')}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignup(!isSignup);
                    setError(null);
                    setSuccessBanner(null);
                    setOtpChallengeId(null);
                  }}
                  className="font-extrabold text-amber-600 hover:text-amber-700 hover:underline cursor-pointer ml-1"
                >
                  {isSignup ? t('signIn') : t('createOneNow')}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
