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
  Smartphone,
  Eye,
  EyeOff,
  ArrowLeft,
  KeyRound,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

import { FormInput } from '../components/ui/FormInput';
import { Button } from '../components/ui/Button';
import { VoteVictoryLogo } from '../components/ui/VoteVictoryLogo';
import { authApi } from '../services/api';
import { warmUpServer } from '../services/httpClient';
import './SplashPage.css';

export const AuthPage: React.FC = () => {
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const isSignup = authMode === 'signup';
  const isForgot = authMode === 'forgot';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpChallengeId, setOtpChallengeId] = useState<string | null>(null);

  // Forgot Password State
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [showForgotNewPassword, setShowForgotNewPassword] = useState(false);
  const [forgotChallengeId, setForgotChallengeId] = useState<string | null>(null);
  const [forgotStep, setForgotStep] = useState<'email' | 'otp'>('email');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);
  const [slowRequest, setSlowRequest] = useState(false);
  const slowTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { loginWithSession } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();

  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [isLoginVerification, setIsLoginVerification] = useState(false);

  // Silently wake the backend as soon as the auth page opens
  useEffect(() => {
    warmUpServer();
  }, []);

const isValidEmail = (val: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(val.trim());
};

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const identifier = (loginMethod === 'phone' ? phone : email).trim();
    if (!identifier || !password) {
      setError(loginMethod === 'phone' ? 'Please enter both phone number and password.' : 'Please enter both email and password.');
      return;
    }

    if (loginMethod === 'email' && !isValidEmail(email)) {
      const msg = 'Please enter a valid, complete email address (e.g. yourname@gmail.com).';
      setError(msg);
      showToast(msg, 'error');
      return;
    }


    setError(null);
    setSuccessBanner(null);
    setSlowRequest(false);
    setIsLoading(true);
    slowTimer.current = setTimeout(() => setSlowRequest(true), 5000);
    try {
      const session = await authApi.login(identifier, password);
      loginWithSession(session, identifier);
      showToast('Signed in successfully.', 'success');
      navigate('/');
    } catch (err: any) {
      const isTimeout = err?.code === 'ECONNABORTED' || err?.message?.includes('timeout');
      const errorDetails = err?.response?.data?.error?.details || err?.response?.data?.details;
      if (errorDetails?.requires_otp && errorDetails?.challenge_id) {
        setOtpChallengeId(errorDetails.challenge_id);
        setIsLoginVerification(true);
        showToast('A one-time verification code has been sent to activate your account.', 'info');
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

    const identifier = (loginMethod === 'phone' ? phone : email).trim();

    if (otpChallengeId) {
      // OTP Verification Step
      if (!otpCode || otpCode.length !== 6) {
        setError('Please enter a valid 6-digit verification code.');
        return;
      }

      setIsLoading(true);
      try {
        if (isLoginVerification) {
          const session = await authApi.verifyLoginOtp(otpChallengeId, otpCode, identifier, password);
          loginWithSession(session, identifier);
          showToast('Account verified and signed in successfully!', 'success');
          navigate('/');
        } else {
          const session = await authApi.verifySignupOtp(otpChallengeId, otpCode);
          loginWithSession(session, identifier);
          showToast('Account created and signed in successfully! Welcome to VoteVictory.', 'success');
          navigate('/');
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

    if (!fullName.trim() || !identifier || !password) {
      setError('Please complete all required fields.');
      return;
    }

    if (loginMethod === 'email' && !isValidEmail(email)) {
      const msg = 'Please enter a valid, complete email address (e.g. yourname@gmail.com).';
      setError(msg);
      showToast(msg, 'error');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }


    setIsLoading(true);
    try {
      const isPhone = loginMethod === 'phone';
      const cleanEmail = isPhone ? `${phone.replace(/\D/g, '')}@campaign.votevictory.internal` : email.trim();
      const challenge = await authApi.requestSignupOtp({
        full_name: fullName.trim(),
        email: cleanEmail,
        phone: isPhone ? phone.trim() : undefined,
        password
      });
      setOtpChallengeId(challenge.challenge_id);
      showToast(
        challenge.dev_code ? `Development OTP: ${challenge.dev_code}` : (isPhone ? 'Verification code sent to your phone.' : 'Verification code sent to your email.'),
        'info'
      );
    } catch (err: any) {
      const msg = err?.response?.data?.error?.message
        || err?.response?.data?.message
        || err?.response?.data?.detail
        || err?.message
        || 'Signup failed. Please check details and try again.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim() || !isValidEmail(forgotEmail)) {
      const msg = 'Please enter a valid, complete registered email address (e.g. yourname@gmail.com).';
      setError(msg);
      showToast(msg, 'error');
      return;
    }


    setIsLoading(true);
    setError(null);
    setSuccessBanner(null);
    try {
      const challenge = await authApi.requestForgotPasswordOtp(forgotEmail.trim());
      setForgotChallengeId(challenge.challenge_id);
      setForgotStep('otp');
      showToast(
        challenge.dev_code ? `Dev OTP: ${challenge.dev_code}` : 'Password reset code sent to your email. Please check your inbox.',
        'info'
      );
    } catch (err: any) {
      const msg = err?.response?.data?.error?.message
        || err?.response?.data?.message
        || err?.response?.data?.detail
        || err?.message
        || 'Failed to send password reset code. Please check email address.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotChallengeId) {
      setError('Invalid or expired password reset session.');
      return;
    }
    if (!forgotOtp || forgotOtp.length !== 6) {
      setError('Please enter the valid 6-digit verification code.');
      return;
    }
    if (!forgotNewPassword || forgotNewPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await authApi.resetPassword({
        challenge_id: forgotChallengeId,
        code: forgotOtp.trim(),
        new_password: forgotNewPassword
      });
      showToast('Password updated successfully! Please sign in with your new password.', 'success');
      setSuccessBanner('Password updated successfully! Please enter your new password to sign in.');
      setEmail(forgotEmail);
      setPassword('');
      setForgotChallengeId(null);
      setForgotOtp('');
      setForgotNewPassword('');
      setForgotStep('email');
      setAuthMode('login');
    } catch (err: any) {
      const msg = err?.response?.data?.error?.message
        || err?.response?.data?.message
        || err?.response?.data?.detail
        || err?.message
        || 'Password reset failed. Please verify the code and try again.';
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
      {/* Animated wave background */}
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

          <div className="flex items-start justify-between mb-3 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold text-slate-900 leading-tight">
                  {isForgot ? 'Password Recovery' : (isSignup ? t('createAccount') : t('signIn'))}
                </h3>
                {isSignup && (
                  <div className="relative group inline-flex items-center">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-[10px] font-bold text-amber-700 cursor-pointer shadow-2xs hover:bg-amber-500/15 transition-all">
                      <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                      <span>Workspace</span>
                    </span>
                    {/* Hover popup tooltip */}
                    <div className="absolute left-0 bottom-full mb-2 hidden group-hover:flex flex-col w-56 p-2.5 rounded-xl bg-slate-900 text-white text-[11px] leading-snug shadow-xl z-50 pointer-events-none transition-all">
                      <span className="font-bold text-amber-400">Create your workspace</span>
                      <span className="text-slate-300 text-[10px] mt-0.5">First signup becomes Super Admin and can manage campaign teams.</span>
                      <div className="absolute left-4 top-full w-2 h-2 bg-slate-900 rotate-45 -mt-1" />
                    </div>
                  </div>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5 mb-0">
                {isForgot
                  ? (forgotStep === 'email' ? 'Enter registered email for OTP' : 'Enter 6-digit OTP and new password')
                  : (isSignup ? t('registerVerifiedAccount') : t('enterCredentials'))}
              </p>
            </div>
            {/* Compact language selector */}
            <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 shadow-2xs hover:bg-slate-100 transition-colors flex-shrink-0">
              <Globe className="w-3 h-3 text-slate-500 flex-shrink-0" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="vv-auth-lang-select bg-transparent text-[11px] font-semibold text-slate-700 outline-none cursor-pointer border-0"
                aria-label="Select language"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>{lang.native}</option>
                ))}
              </select>
            </div>

          </div>


          {successBanner && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{successBanner}</span>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
              {error}
            </div>
          )}

          {/* Cold-start warm-up banner */}
          {slowRequest && (
            <div className="mb-4 flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
              <svg className="animate-spin mt-0.5 w-3.5 h-3.5 text-amber-600 flex-shrink-0" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span><strong>Server is waking up…</strong> Please wait a few seconds.</span>
            </div>
          )}

          {/* ── FORGOT PASSWORD VIEW ── */}
          {isForgot ? (
            <div className="space-y-4">
              {forgotStep === 'email' ? (
                <form onSubmit={handleForgotPasswordRequest} className="space-y-4" autoComplete="off">
                  <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-900 flex items-start gap-2">
                    <KeyRound className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <span>Enter your registered email address. We will send an instant 6-digit OTP code to reset your password.</span>
                  </div>

                  <FormInput
                    label={t('emailAddress')}
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="Enter your registered email address"
                    leftIcon={<Mail className="w-4 h-4" />}
                    autoComplete="email"
                    required
                  />


                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full"
                    disabled={isLoading || !forgotEmail.trim()}
                  >
                    {isLoading ? 'Sending OTP code...' : 'Send Reset Code'}
                  </Button>

                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('login');
                      setError(null);
                      setSuccessBanner(null);
                    }}
                    className="w-full text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors flex items-center justify-center gap-1.5 py-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Sign In</span>
                  </button>
                </form>
              ) : (
                <form onSubmit={handleResetPasswordSubmit} className="space-y-3.5" autoComplete="off">
                  <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-900">
                    A 6-digit verification code was sent to <strong>{forgotEmail}</strong>. Enter it below with your new password.
                  </div>

                  <FormInput
                    label="Verification Code (OTP)"
                    value={forgotOtp}
                    onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="Enter 6-digit verification code"
                    inputMode="numeric"
                    maxLength={6}
                    required
                  />

                  <FormInput
                    label="New Password"
                    type={showForgotNewPassword ? 'text' : 'password'}
                    value={forgotNewPassword}
                    onChange={(e) => setForgotNewPassword(e.target.value)}
                    placeholder="Enter your new password (min. 6 characters)"
                    leftIcon={<Lock className="w-4 h-4" />}

                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowForgotNewPassword(!showForgotNewPassword)}
                        className="text-slate-400 hover:text-slate-600 focus:outline-none transition-colors p-1"
                        aria-label={showForgotNewPassword ? 'Hide password' : 'Show password'}
                      >
                        {showForgotNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    }
                    autoComplete="new-password"
                    required
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full"
                    disabled={isLoading || forgotOtp.length !== 6 || forgotNewPassword.length < 6}
                  >
                    {isLoading ? 'Resetting Password...' : 'Save New Password & Sign In'}
                  </Button>

                  <div className="flex justify-between items-center text-xs pt-1">
                    <button
                      type="button"
                      onClick={() => { setForgotStep('email'); setForgotOtp(''); }}
                      className="font-bold text-amber-600 hover:underline"
                    >
                      Change Email / Resend
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('login');
                        setError(null);
                      }}
                      className="text-slate-500 hover:text-slate-700"
                    >
                      Back to Sign In
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : otpChallengeId ? (
            /* ── SIGNUP / LOGIN OTP VERIFICATION VIEW ── */
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-3 text-xs text-amber-900">
                {t('emailVerificationSent', 'A 6-digit verification code was sent to {{email}}. Please enter it below to complete registration.').replace('{{email}}', email || phone)}
              </div>
              <FormInput
                label={t('emailVerificationCode', 'Verification code')}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit verification code"
                inputMode="numeric"
                maxLength={6}
                required
              />

              <Button type="submit" variant="primary" className="w-full" disabled={isLoading || otpCode.length !== 6}>
                {isLoading ? t('verifying', 'Verifying...') : t('verifyAndProceed', 'Verify and proceed to login')}
              </Button>
              <button
                type="button"
                className="w-full text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors"
                onClick={() => { setOtpChallengeId(null); setOtpCode(''); setIsLoginVerification(false); }}
              >
                {t('changeEmailGoBack', 'Change email or go back')}
              </button>
            </form>
          ) : (
            /* ── SIGNIN / SIGNUP FORM ── */
            <>
              {/* Google Sign In / Sign Up Button */}
              <div className="mb-4">
                <div className="w-full flex justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    useOneTap={false}
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
                    <span className="bg-white px-2 text-[10px] text-slate-400 uppercase font-bold tracking-wider">{t('or', 'OR')}</span>
                  </div>
                </div>
              </div>



              {/* Email / Phone Method Selector */}
              <div className="flex rounded-xl bg-slate-100 p-1 mb-4">
                <button
                  type="button"
                  onClick={() => { setLoginMethod('email'); setError(null); }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    loginMethod === 'email' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {t('email', 'Email')}
                </button>
                <button
                  type="button"
                  onClick={() => { setLoginMethod('phone'); setError(null); }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    loginMethod === 'phone' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>{t('phone', 'Phone')}</span>
                </button>
              </div>

              {isSignup ? (
                <form onSubmit={handleSignup} className="space-y-3.5" autoComplete="off">
                  <FormInput
                    label={t('fullName', 'Full Name')}
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={t('enterFullName', 'Enter your full name')}
                    autoComplete="name"
                    required
                  />

                  {loginMethod === 'email' ? (
                    <FormInput
                      label={t('emailAddress')}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      leftIcon={<Mail className="w-4 h-4" />}
                      autoComplete="email"
                      required
                    />
                  ) : (
                    <FormInput
                      label={t('formLabelPhoneNumber')}
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter your phone number (e.g. +91 98765 43210)"
                      leftIcon={<Smartphone className="w-4 h-4" />}
                      autoComplete="tel"
                      required
                    />
                  )}

                  <FormInput
                    label={t('password')}
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password (min. 6 characters)"
                    leftIcon={<Lock className="w-4 h-4" />}

                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-slate-400 hover:text-slate-600 focus:outline-none transition-colors p-1"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    }
                    autoComplete="new-password"
                    required
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full"
                    disabled={isLoading || !fullName || (loginMethod === 'email' ? !email : !phone) || !password}
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
                <form onSubmit={handlePasswordLogin} className="space-y-3.5" autoComplete="off">
                  {loginMethod === 'email' ? (
                    <FormInput
                      label={t('emailAddress')}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      leftIcon={<Mail className="w-4 h-4" />}
                      autoComplete="email"
                      required
                    />


                  ) : (
                    <FormInput
                      label={t('formLabelPhoneNumber')}
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter your phone number (e.g. +91 98765 43210)"
                      leftIcon={<Smartphone className="w-4 h-4" />}
                      autoComplete="tel"
                      required
                    />
                  )}

                  <div>
                    <FormInput
                      label={t('password')}
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      leftIcon={<Lock className="w-4 h-4" />}

                      rightIcon={
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-slate-400 hover:text-slate-600 focus:outline-none transition-colors p-1"
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      }
                      autoComplete="current-password"
                      required
                    />
                    <div className="flex justify-end mt-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('forgot');
                          setForgotStep('email');
                          setForgotEmail(email || '');
                          setError(null);
                          setSuccessBanner(null);
                        }}
                        className="text-xs font-bold text-amber-600 hover:text-amber-700 hover:underline cursor-pointer"
                      >
                        {t('forgotPassword', 'Forgot Password?')}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full"
                    disabled={isLoading || (loginMethod === 'email' ? !email : !phone) || !password}
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
                    setAuthMode(isSignup ? 'login' : 'signup');
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
