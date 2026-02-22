// import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { toast } from 'react-hot-toast';
// import { Building2, Mail, Lock } from 'lucide-react';
// import { Button, Input } from '../../components/ui/index';
// import { authService } from '../../services';
// import { useAuthStore } from '../../store/authStore';
// import { isStaff } from '../../types';

// const LoginPage = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const { setAuth } = useAuthStore();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const response = await authService.login({ email, password });
//       setAuth(response.user, response.accessToken, response.refreshToken);
//       toast.success(`Welcome back, ${response.user.firstName}!`);
//       navigate(isStaff(response.user.role) ? '/admin' : '/dashboard');
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || 'Login failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
//       <div className="w-full max-w-md">
//         <div className="bg-white rounded-2xl shadow-xl p-8">
//           <div className="text-center mb-8">
//             <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
//               <Building2 className="w-8 h-8 text-blue-600" />
//             </div>
//             <h1 className="text-2xl font-bold text-gray-900">Lab Registration System</h1>
//             <p className="text-gray-500 mt-2">Sign in to your account</p>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div className="relative">
//               <Mail className="absolute left-3 top-9 w-5 h-5 text-gray-400" />
//               <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" required />
//             </div>
//             <div className="relative">
//               <Lock className="absolute left-3 top-9 w-5 h-5 text-gray-400" />
//               <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10" required />
//             </div>
//             <Button type="submit" className="w-full py-3" isLoading={loading}>Sign In</Button>
//           </form>

//           <p className="mt-6 text-center text-gray-600">
//             Don't have an account? <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">Register here</Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;



import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { authService } from '../../services';
import { useAuthStore } from '../../store/authStore';
import { isStaff } from '../../types';

const LoginPage = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [focused, setFocused]   = useState<'email' | 'password' | null>(null);
  const [showPass, setShowPass] = useState(false);
  const navigate    = useNavigate();
  const { setAuth } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authService.login({ email, password });
      setAuth(response.user, response.accessToken, response.refreshToken);
      toast.success(`Welcome back, ${response.user.firstName}!`);
      navigate(isStaff(response.user.role) ? '/admin' : '/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,200;0,9..144,300;0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,200;1,9..144,300;1,9..144,400&family=Cabinet+Grotesk:wght@400;500;600;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes lp-rise    { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes lp-fadein  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes lp-spin    { to { transform: rotate(360deg); } }
        @keyframes lp-float   { 0%, 100% { transform: translateY(0px) rotate(0deg); } 33% { transform: translateY(-8px) rotate(1deg); } 66% { transform: translateY(4px) rotate(-0.5deg); } }
        @keyframes lp-float2  { 0%, 100% { transform: translateY(0px) rotate(0deg); } 33% { transform: translateY(6px) rotate(-1deg); } 66% { transform: translateY(-5px) rotate(0.8deg); } }
        @keyframes lp-pulse   { 0%, 100% { opacity: .6; transform: scale(1); } 50% { opacity: 1; transform: scale(1.04); } }
        @keyframes lp-shimmer { from { background-position: -200% center; } to { background-position: 200% center; } }
        @keyframes lp-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }

        .lp-root {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          font-family: 'Cabinet Grotesk', sans-serif;
          background: #0c0a09;
          overflow: hidden;
        }

        /* ── LEFT PANEL ─────────────────────────────────────────── */
        .lp-left {
          position: relative;
          background: #0c0a09;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 48px;
          overflow: hidden;
        }

        /* Atmospheric grain overlay */
        .lp-left::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
        }

        /* Glowing orbs */
        .lp-orb1 {
          position: absolute;
          width: 380px; height: 380px;
          border-radius: 50%;
          background: radial-gradient(circle, #4f3a1a 0%, transparent 70%);
          top: -80px; left: -100px;
          animation: lp-float 9s ease-in-out infinite;
          pointer-events: none;
        }
        .lp-orb2 {
          position: absolute;
          width: 260px; height: 260px;
          border-radius: 50%;
          background: radial-gradient(circle, #1a2d1a 0%, transparent 70%);
          bottom: 60px; right: -60px;
          animation: lp-float2 11s ease-in-out infinite;
          pointer-events: none;
        }
        .lp-orb3 {
          position: absolute;
          width: 180px; height: 180px;
          border-radius: 50%;
          background: radial-gradient(circle, #1a1a3a 0%, transparent 70%);
          bottom: 200px; left: 80px;
          animation: lp-float 14s ease-in-out infinite 2s;
          pointer-events: none;
        }

        /* Grid overlay */
        .lp-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
          z-index: 0;
        }

        .lp-left-content { position: relative; z-index: 1; }

        /* Logo */
        .lp-logo {
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }
        .lp-logo-mark {
          width: 36px; height: 36px;
          border: 1.5px solid rgba(255,255,255,.15);
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,.04);
          backdrop-filter: blur(8px);
        }
        .lp-logo-text {
          font-family: 'Fraunces', serif;
          font-weight: 600;
          font-size: 16px;
          color: rgba(255,255,255,.9);
          letter-spacing: -0.01em;
        }

        /* Hero text */
        .lp-hero {
          animation: lp-rise .7s cubic-bezier(.16,1,.3,1) .1s both;
        }
        .lp-hero-eyebrow {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #a8834a;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .lp-hero-eyebrow::before {
          content: '';
          display: block;
          width: 20px;
          height: 1px;
          background: #a8834a;
        }
        .lp-hero-title {
          font-family: 'Fraunces', Georgia, serif;
          font-weight: 300;
          font-style: italic;
          font-size: clamp(40px, 4.5vw, 58px);
          color: #f5f0e8;
          line-height: 1.08;
          letter-spacing: -0.03em;
          margin-bottom: 20px;
        }
        .lp-hero-title strong {
          font-weight: 600;
          font-style: normal;
          color: #fff;
        }
        .lp-hero-desc {
          font-size: 14px;
          color: rgba(255,255,255,.4);
          line-height: 1.65;
          max-width: 320px;
          font-weight: 400;
        }

        /* Stats strip */
        .lp-stats {
          display: flex;
          gap: 32px;
          animation: lp-rise .7s cubic-bezier(.16,1,.3,1) .25s both;
        }
        .lp-stat-num {
          font-family: 'Fraunces', serif;
          font-weight: 600;
          font-size: 28px;
          color: #fff;
          letter-spacing: -0.03em;
          line-height: 1;
        }
        .lp-stat-label {
          font-size: 11px;
          color: rgba(255,255,255,.3);
          margin-top: 4px;
          font-weight: 500;
          letter-spacing: 0.02em;
        }

        /* Scrolling ticker */
        .lp-ticker-wrap {
          overflow: hidden;
          padding: 12px 0;
          border-top: 1px solid rgba(255,255,255,.06);
          border-bottom: 1px solid rgba(255,255,255,.06);
          animation: lp-rise .7s cubic-bezier(.16,1,.3,1) .4s both;
        }
        .lp-ticker {
          display: flex;
          gap: 0;
          white-space: nowrap;
          animation: lp-marquee 20s linear infinite;
        }
        .lp-ticker-item {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 0 24px;
          font-size: 11px;
          font-weight: 600;
          color: rgba(255,255,255,.2);
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .lp-ticker-dot {
          width: 3px; height: 3px;
          border-radius: 50%;
          background: #a8834a;
          flex-shrink: 0;
        }

        /* ── RIGHT PANEL ────────────────────────────────────────── */
        .lp-right {
          background: #f5f4f0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 48px;
          position: relative;
          overflow: hidden;
        }

        /* Subtle background texture */
        .lp-right::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle at 80% 20%, rgba(99,102,241,.04) 0%, transparent 50%),
                            radial-gradient(circle at 20% 80%, rgba(168,131,74,.05) 0%, transparent 50%);
          pointer-events: none;
        }

        .lp-form-wrap {
          width: 100%;
          max-width: 380px;
          position: relative;
          z-index: 1;
          animation: lp-rise .65s cubic-bezier(.16,1,.3,1) .15s both;
        }

        /* Form header */
        .lp-form-header { margin-bottom: 36px; }
        .lp-form-kicker {
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #a8834a;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 7px;
        }
        .lp-form-kicker::after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, #a8834a40, transparent);
        }
        .lp-form-title {
          font-family: 'Fraunces', Georgia, serif;
          font-weight: 600;
          font-size: 32px;
          color: #18181b;
          letter-spacing: -0.025em;
          line-height: 1.1;
          margin-bottom: 6px;
        }
        .lp-form-sub {
          font-size: 13.5px;
          color: #94a3b8;
          font-weight: 400;
          line-height: 1.5;
        }

        /* Field */
        .lp-field { margin-bottom: 16px; }
        .lp-label {
          display: block;
          font-size: 11.5px;
          font-weight: 700;
          color: #64748b;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: 7px;
          font-family: 'Cabinet Grotesk', sans-serif;
        }
        .lp-input-wrap { position: relative; }
        .lp-input-icon {
          position: absolute;
          left: 13px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          transition: color .15s;
        }
        .lp-input {
          width: 100%;
          padding: 13px 13px 13px 40px;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          background: #fff;
          font-size: 14px;
          color: #0f172a;
          outline: none;
          font-family: 'Cabinet Grotesk', sans-serif;
          transition: border-color .15s, box-shadow .15s, background .15s;
          -webkit-appearance: none;
        }
        .lp-input::placeholder { color: #cbd5e1; }
        .lp-input:focus {
          border-color: #18181b;
          box-shadow: 0 0 0 3px rgba(24,24,27,.07);
          background: #fff;
        }
        .lp-input-focused-icon { color: #18181b !important; }

        .lp-pass-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          color: #94a3b8;
          display: flex;
          align-items: center;
          transition: color .12s;
          border-radius: 4px;
        }
        .lp-pass-toggle:hover { color: #18181b; }

        /* Submit button */
        .lp-btn {
          width: 100%;
          padding: 14px;
          border-radius: 10px;
          border: none;
          background: #18181b;
          color: #fff;
          font-size: 14px;
          font-weight: 700;
          font-family: 'Cabinet Grotesk', sans-serif;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 8px;
          transition: background .15s, transform .1s, box-shadow .15s;
          letter-spacing: 0.01em;
          position: relative;
          overflow: hidden;
        }
        .lp-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,.08) 0%, transparent 60%);
          pointer-events: none;
        }
        .lp-btn:hover:not(:disabled) {
          background: #27272a;
          box-shadow: 0 4px 20px rgba(0,0,0,.2);
          transform: translateY(-1px);
        }
        .lp-btn:active:not(:disabled) { transform: translateY(0); }
        .lp-btn:disabled { opacity: .55; cursor: not-allowed; }

        /* Divider */
        .lp-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 24px 0;
        }
        .lp-divider-line { flex: 1; height: 1px; background: #e8e5df; }
        .lp-divider-text { font-size: 11px; color: #94a3b8; font-weight: 600; letter-spacing: 0.04em; }

        /* Register link */
        .lp-register-link {
          text-align: center;
          font-size: 13.5px;
          color: #94a3b8;
          font-weight: 400;
        }
        .lp-register-link a {
          color: #18181b;
          font-weight: 700;
          text-decoration: none;
          border-bottom: 1.5px solid #18181b;
          padding-bottom: 1px;
          transition: border-color .12s, color .12s;
        }
        .lp-register-link a:hover { color: #a8834a; border-color: #a8834a; }

        /* Trust badges */
        .lp-trust {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-top: 28px;
          padding-top: 22px;
          border-top: 1px solid #e8e5df;
        }
        .lp-trust-item {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 10.5px;
          color: #94a3b8;
          font-weight: 600;
          letter-spacing: 0.03em;
        }
        .lp-trust-dot {
          width: 4px; height: 4px;
          border-radius: 50%;
          background: #22c55e;
          flex-shrink: 0;
        }

        /* Spinner */
        .lp-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: lp-spin .7s linear infinite;
          flex-shrink: 0;
        }

        /* Mobile */
        @media (max-width: 768px) {
          .lp-root { grid-template-columns: 1fr; }
          .lp-left { display: none; }
          .lp-right { background: #0c0a09; }
          .lp-form-title { color: #f5f0e8; }
          .lp-form-sub { color: rgba(255,255,255,.4); }
          .lp-label { color: rgba(255,255,255,.5); }
          .lp-input { background: rgba(255,255,255,.06); border-color: rgba(255,255,255,.1); color: #f5f0e8; }
          .lp-input:focus { border-color: rgba(255,255,255,.3); box-shadow: 0 0 0 3px rgba(255,255,255,.05); background: rgba(255,255,255,.08); }
          .lp-input::placeholder { color: rgba(255,255,255,.2); }
          .lp-input-icon { color: rgba(255,255,255,.3) !important; }
          .lp-divider-line { background: rgba(255,255,255,.08); }
          .lp-register-link { color: rgba(255,255,255,.4); }
          .lp-register-link a { color: #f5f0e8; border-color: rgba(255,255,255,.3); }
          .lp-trust { border-color: rgba(255,255,255,.08); }
          .lp-trust-item { color: rgba(255,255,255,.25); }
          .lp-right::before { display: none; }
        }
      `}</style>

      <div className="lp-root">

        {/* ── LEFT PANEL ───────────────────────────────────────────────────── */}
        <div className="lp-left">
          <div className="lp-orb1" />
          <div className="lp-orb2" />
          <div className="lp-orb3" />
          <div className="lp-grid" />

          {/* Logo */}
          <div className="lp-left-content">
            <div className="lp-logo">
              <div className="lp-logo-mark">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <span className="lp-logo-text">LabReg</span>
            </div>
          </div>

          {/* Hero */}
          <div className="lp-left-content lp-hero" style={{ margin: 'auto 0' }}>
            <p className="lp-hero-eyebrow">Laboratory Registration System</p>
            <h1 className="lp-hero-title">
              Where science<br />
              meets <strong>precision</strong><br />
              registration.
            </h1>
            <p className="lp-hero-desc">
              Manage lab sessions, track enrollments, and keep students organized — all from one elegant interface.
            </p>
          </div>

          {/* Stats */}
          <div className="lp-left-content" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="lp-ticker-wrap">
              <div className="lp-ticker">
                {[
                  'Lab Sessions', 'Student Registrations', 'Course Management',
                  'Real-time Updates', 'Waitlist Control', 'Admin Dashboard',
                  'Lab Sessions', 'Student Registrations', 'Course Management',
                  'Real-time Updates', 'Waitlist Control', 'Admin Dashboard',
                ].map((item, i) => (
                  <span key={i} className="lp-ticker-item">
                    <span className="lp-ticker-dot" />
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="lp-stats">
              <div>
                <div className="lp-stat-num">100%</div>
                <div className="lp-stat-label">Accurate tracking</div>
              </div>
              <div style={{ width: 1, background: 'rgba(255,255,255,.07)', alignSelf: 'stretch' }} />
              <div>
                <div className="lp-stat-num">Live</div>
                <div className="lp-stat-label">Waitlist updates</div>
              </div>
              <div style={{ width: 1, background: 'rgba(255,255,255,.07)', alignSelf: 'stretch' }} />
              <div>
                <div className="lp-stat-num">Multi</div>
                <div className="lp-stat-label">Role access</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ──────────────────────────────────────────────────── */}
        <div className="lp-right">
          <div className="lp-form-wrap">

            {/* Header */}
            <div className="lp-form-header">
              <p className="lp-form-kicker">Secure Access</p>
              <h2 className="lp-form-title">Welcome back.</h2>
              <p className="lp-form-sub">Sign in to manage your lab sessions and registrations.</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>

              {/* Email */}
              <div className="lp-field">
                <label className="lp-label" htmlFor="email">Email address</label>
                <div className="lp-input-wrap">
                  <span className="lp-input-icon" style={{ color: focused === 'email' ? '#18181b' : '#cbd5e1' }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </span>
                  <input
                    id="email" type="email" className="lp-input"
                    placeholder="you@university.edu"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused(null)}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="lp-field">
                <label className="lp-label" htmlFor="password">Password</label>
                <div className="lp-input-wrap">
                  <span className="lp-input-icon" style={{ color: focused === 'password' ? '#18181b' : '#cbd5e1' }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                  </span>
                  <input
                    id="password" type={showPass ? 'text' : 'password'} className="lp-input"
                    placeholder="••••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onFocus={() => setFocused('password')}
                    onBlur={() => setFocused(null)}
                    required
                    autoComplete="current-password"
                    style={{ paddingRight: 40 }}
                  />
                  <button type="button" className="lp-pass-toggle" onClick={() => setShowPass(p => !p)} tabIndex={-1} aria-label="Toggle password">
                    {showPass ? (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button type="submit" className="lp-btn" disabled={loading}>
                {loading ? (
                  <><div className="lp-spinner" /> Signing in…</>
                ) : (
                  <>
                    Sign In
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="lp-divider">
              <div className="lp-divider-line" />
              <span className="lp-divider-text">or</span>
              <div className="lp-divider-line" />
            </div>

            {/* Register */}
            <p className="lp-register-link">
              Don't have an account?{' '}
              <Link to="/register">Create one here</Link>
            </p>

            {/* Trust */}
            <div className="lp-trust">
              <div className="lp-trust-item">
                <span className="lp-trust-dot" />
                Secure login
              </div>
              <div className="lp-trust-item">
                <span className="lp-trust-dot" />
                Encrypted data
              </div>
              <div className="lp-trust-item">
                <span className="lp-trust-dot" />
                Role-based access
              </div>
            </div>

          </div>
        </div>

      </div>
    </>
  );
};

export default LoginPage;