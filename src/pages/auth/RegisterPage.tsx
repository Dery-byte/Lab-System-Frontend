// import { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { toast } from 'react-hot-toast';
// import { Building2 } from 'lucide-react';
// import { Button, Input, Select } from '../../components/ui/index';
// import { authService, publicService } from '../../services';
// import { useAuthStore } from '../../store/authStore';
// import { Program, LEVEL_OPTIONS, Level } from '../../types';

// const RegisterPage = () => {
//   const [formData, setFormData] = useState({ studentId: '', email: '', password: '', firstName: '', lastName: '', phoneNumber: '', programId: 0, level: 'LEVEL_100' as Level });
//   const [programs, setPrograms] = useState<Program[]>([]);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const { setAuth } = useAuthStore();

//   useEffect(() => { publicService.getPrograms().then(setPrograms).catch(() => toast.error('Failed to load programs')); }, []);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!formData.programId) { toast.error('Please select a program'); return; }
//     setLoading(true);
//     try {
//       const response = await authService.register(formData);
//       setAuth(response.user, response.accessToken, response.refreshToken);
//       toast.success('Registration successful!');
//       navigate('/dashboard');
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || 'Registration failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
//       <div className="w-full max-w-md">
//         <div className="bg-white rounded-2xl shadow-xl p-8">
//           <div className="text-center mb-6">
//             <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
//               <Building2 className="w-8 h-8 text-blue-600" />
//             </div>
//             <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="grid grid-cols-2 gap-4">
//               <Input label="First Name" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} required />
//               <Input label="Last Name" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} required />
//             </div>
//             <Input label="Student ID" value={formData.studentId} onChange={(e) => setFormData({ ...formData, studentId: e.target.value })} required />
//             <Input label="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
//             <Input label="Password" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
//             <Select label="Program" value={formData.programId.toString()} onChange={(e) => setFormData({ ...formData, programId: parseInt(e.target.value) || 0 })}
//               options={programs.map(p => ({ value: p.id, label: p.name }))} placeholder="Select your program" required />
//             <Select label="Level" value={formData.level} onChange={(e) => setFormData({ ...formData, level: e.target.value as Level })} options={LEVEL_OPTIONS} required />
//             <Button type="submit" className="w-full" isLoading={loading}>Create Account</Button>
//           </form>

//           <p className="mt-6 text-center text-gray-600">
//             Already have an account? <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">Sign in</Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RegisterPage;


import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { authService, publicService } from '../../services';
import { useAuthStore } from '../../store/authStore';
import { Program, LEVEL_OPTIONS, Level } from '../../types';

// ─── Step config ─────────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: 'Identity',  desc: 'Your name & student ID' },
  { id: 2, label: 'Access',    desc: 'Email & password'        },
  { id: 3, label: 'Academic',  desc: 'Program & level'         },
];

// ─── Inline SVG icons ─────────────────────────────────────────────────────────

const IconUser = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const IconId = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="16" y1="10" x2="21" y2="10"/><line x1="16" y1="14" x2="21" y2="14"/>
    <circle cx="8" cy="12" r="3"/>
  </svg>
);
const IconMail = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
  </svg>
);
const IconLock = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
  </svg>
);
const IconBook = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
  </svg>
);
const IconCheck = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconArrow = ({ dir = 'right' }: { dir?: 'left' | 'right' }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: dir === 'left' ? 'rotate(180deg)' : undefined }}>
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

const RegisterPage = () => {
  const [step, setStep]         = useState(1);
  const [showPass, setShowPass] = useState(false);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading]   = useState(false);
  const [animDir, setAnimDir]   = useState<'forward' | 'back'>('forward');

  const [formData, setFormData] = useState({
    studentId:   '',
    email:       '',
    password:    '',
    firstName:   '',
    lastName:    '',
    phoneNumber: '',
    programId:   0,
    level:       'LEVEL_100' as Level,
  });

  const navigate    = useNavigate();
  const { setAuth } = useAuthStore();

  useEffect(() => {
    publicService.getPrograms()
      .then(setPrograms)
      .catch(() => toast.error('Failed to load programs'));
  }, []);

  const fd = (field: string, value: string | number) =>
    setFormData(prev => ({ ...prev, [field]: value }));

  const goNext = () => {
    if (step === 1 && (!formData.firstName || !formData.lastName || !formData.studentId)) {
      toast.error('Please fill in all identity fields'); return;
    }
    if (step === 2 && (!formData.email || !formData.password)) {
      toast.error('Please fill in email and password'); return;
    }
    setAnimDir('forward');
    setStep(s => Math.min(s + 1, 3));
  };
  const goBack = () => { setAnimDir('back'); setStep(s => Math.max(s - 1, 1)); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.programId) { toast.error('Please select a program'); return; }
    setLoading(true);
    try {
      const response = await authService.register(formData);
      setAuth(response.user, response.accessToken, response.refreshToken);
      toast.success('Welcome aboard!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const progress = ((step - 1) / (STEPS.length - 1)) * 100;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,200;0,9..144,300;0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,200;1,9..144,300;1,9..144,400;1,9..144,600&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&family=Cabinet+Grotesk:wght@400;500;600;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes rp-rise    { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes rp-fall    { from { opacity: 0; transform: translateY(-16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes rp-fadein  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes rp-spin    { to { transform: rotate(360deg); } }
        @keyframes rp-progress { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @keyframes rp-float   { 0%,100%{ transform:translateY(0) rotate(0deg); } 50%{ transform:translateY(-12px) rotate(1.5deg); } }
        @keyframes rp-float2  { 0%,100%{ transform:translateY(0) rotate(0deg); } 50%{ transform:translateY(10px) rotate(-1deg); } }
        @keyframes rp-pulse-ring { 0%{ transform:scale(1); opacity:.6; } 100%{ transform:scale(1.6); opacity:0; } }
        @keyframes rp-step-pop { from { transform: scale(.8); opacity:0; } to { transform: scale(1); opacity:1; } }
        @keyframes rp-card-in  { from { opacity: 0; transform: translateX(40px) scale(.97); } to { opacity: 1; transform: translateX(0) scale(1); } }
        @keyframes rp-card-back { from { opacity: 0; transform: translateX(-40px) scale(.97); } to { opacity: 1; transform: translateX(0) scale(1); } }

        .rp-root {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 400px 1fr;
          font-family: 'Cabinet Grotesk', sans-serif;
          background: #faf9f7;
        }

        /* ── SIDEBAR ──────────────────────────────────────────────── */
        .rp-sidebar {
          background: #0f0e0c;
          position: sticky;
          top: 0;
          height: 100vh;
          display: flex;
          flex-direction: column;
          padding: 48px 44px;
          overflow: hidden;
        }

        /* Layered background */
        .rp-sidebar-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }
        .rp-orb-a {
          position: absolute;
          width: 320px; height: 320px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(168,131,74,.18) 0%, transparent 65%);
          top: -60px; right: -80px;
          animation: rp-float 10s ease-in-out infinite;
        }
        .rp-orb-b {
          position: absolute;
          width: 240px; height: 240px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(30,60,30,.4) 0%, transparent 70%);
          bottom: 40px; left: -60px;
          animation: rp-float2 13s ease-in-out infinite;
        }
        .rp-orb-c {
          position: absolute;
          width: 150px; height: 150px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(50,50,100,.35) 0%, transparent 70%);
          bottom: 200px; right: 30px;
          animation: rp-float 16s ease-in-out infinite 3s;
        }
        /* Fine grid */
        .rp-sidebar-bg::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,.022) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.022) 1px, transparent 1px);
          background-size: 48px 48px;
        }

        /* Logo mark */
        .rp-logo {
          display: inline-flex; align-items: center; gap: 10px;
          position: relative; z-index: 1;
          animation: rp-fadein .6s ease both;
        }
        .rp-logo-icon {
          width: 34px; height: 34px; border-radius: 8px;
          border: 1px solid rgba(255,255,255,.12);
          background: rgba(255,255,255,.04);
          display: flex; align-items: center; justify-content: center;
        }
        .rp-logo-name {
          font-family: 'Fraunces', serif;
          font-weight: 600; font-size: 15px;
          color: rgba(255,255,255,.85);
          letter-spacing: -0.01em;
        }

        /* Sidebar headline */
        .rp-sidebar-headline {
          flex: 1; display: flex; flex-direction: column; justify-content: center;
          position: relative; z-index: 1;
        }
        .rp-eyebrow {
          font-size: 9.5px; font-weight: 700; letter-spacing: 0.14em;
          text-transform: uppercase; color: #a8834a;
          margin-bottom: 14px;
          display: flex; align-items: center; gap: 8px;
        }
        .rp-eyebrow::before { content:''; display:block; width:16px; height:1px; background:#a8834a; }

        .rp-sidebar-title {
          font-family: 'Fraunces', Georgia, serif;
          font-weight: 300;
          font-style: italic;
          font-size: clamp(34px, 3.2vw, 46px);
          line-height: 1.1;
          letter-spacing: -0.03em;
          color: #f0ebe0;
          margin-bottom: 18px;
        }
        .rp-sidebar-title em {
          font-style: normal;
          font-weight: 600;
          color: #fff;
        }
        .rp-sidebar-sub {
          font-size: 13px;
          color: rgba(255,255,255,.32);
          line-height: 1.7;
          font-weight: 400;
          max-width: 260px;
        }

        /* Step indicators (sidebar) */
        .rp-step-list {
          position: relative; z-index: 1;
          display: flex;
          flex-direction: column;
          gap: 0;
          animation: rp-fadein .6s ease .2s both;
        }
        .rp-step-row {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 12px 0;
          position: relative;
        }
        .rp-step-row:not(:last-child)::after {
          content: '';
          position: absolute;
          left: 13px;
          top: 36px;
          width: 1px;
          height: calc(100% - 12px);
          background: rgba(255,255,255,.08);
        }
        .rp-step-circle {
          width: 28px; height: 28px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; position: relative;
          font-size: 11px; font-weight: 700;
          font-family: 'DM Mono', monospace;
          transition: all .3s cubic-bezier(.16,1,.3,1);
        }
        .rp-step-done {
          background: #a8834a;
          color: #fff;
          box-shadow: 0 0 0 4px rgba(168,131,74,.15);
        }
        .rp-step-active {
          background: rgba(255,255,255,.1);
          border: 1.5px solid rgba(255,255,255,.25);
          color: #fff;
        }
        .rp-step-active::after {
          content: '';
          position: absolute;
          inset: -5px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,.1);
          animation: rp-pulse-ring 2s ease-out infinite;
        }
        .rp-step-todo {
          background: transparent;
          border: 1px solid rgba(255,255,255,.1);
          color: rgba(255,255,255,.25);
        }
        .rp-step-text { padding-top: 3px; }
        .rp-step-name {
          font-size: 13px; font-weight: 700;
          transition: color .3s;
        }
        .rp-step-name-done   { color: #a8834a; }
        .rp-step-name-active { color: #fff; }
        .rp-step-name-todo   { color: rgba(255,255,255,.25); }
        .rp-step-desc {
          font-size: 11px; color: rgba(255,255,255,.22); margin-top: 2px; font-weight: 400;
        }

        /* ── MAIN ─────────────────────────────────────────────────── */
        .rp-main {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          padding: 0;
          position: relative;
        }

        /* Top bar */
        .rp-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 56px;
          border-bottom: 1px solid #ece9e3;
          animation: rp-fadein .5s ease both;
        }
        .rp-topbar-step {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          color: #94a3b8;
          letter-spacing: 0.08em;
        }
        .rp-progress-bar {
          flex: 1;
          height: 2px;
          background: #e8e5df;
          border-radius: 999px;
          margin: 0 20px;
          overflow: hidden;
        }
        .rp-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #a8834a, #c4a870);
          border-radius: 999px;
          transition: width .5s cubic-bezier(.16,1,.3,1);
        }
        .rp-topbar-login {
          font-size: 13px;
          color: #94a3b8;
          font-weight: 500;
        }
        .rp-topbar-login a {
          color: #18181b;
          font-weight: 700;
          text-decoration: none;
          border-bottom: 1.5px solid #18181b;
          padding-bottom: 1px;
          transition: color .12s, border-color .12s;
        }
        .rp-topbar-login a:hover { color: #a8834a; border-color: #a8834a; }

        /* Form area */
        .rp-form-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 56px;
          max-width: 560px;
        }

        /* Step heading */
        .rp-step-heading { margin-bottom: 36px; animation: rp-rise .5s ease both; }
        .rp-step-num {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          color: #a8834a;
          letter-spacing: 0.14em;
          font-weight: 500;
          margin-bottom: 10px;
          display: flex; align-items: center; gap: 8px;
        }
        .rp-step-num::before { content: ''; display: block; width: 20px; height: 1px; background: #a8834a; }
        .rp-step-h {
          font-family: 'Fraunces', Georgia, serif;
          font-weight: 600;
          font-size: 30px;
          color: #18181b;
          letter-spacing: -0.025em;
          line-height: 1.1;
          margin-bottom: 6px;
        }
        .rp-step-p { font-size: 13.5px; color: #94a3b8; line-height: 1.55; font-weight: 400; }

        /* Form card */
        .rp-card {
          background: #fff;
          border: 1px solid #e8e5df;
          border-radius: 16px;
          padding: 28px;
          box-shadow: 0 2px 20px rgba(0,0,0,.04);
          margin-bottom: 20px;
        }
        .rp-card-forward { animation: rp-card-in .4s cubic-bezier(.16,1,.3,1) both; }
        .rp-card-back    { animation: rp-card-back .4s cubic-bezier(.16,1,.3,1) both; }

        /* Grid helpers */
        .rp-g2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

        /* Fields */
        .rp-field { display: flex; flex-direction: column; gap: 6px; }
        .rp-field + .rp-field { margin-top: 14px; }
        .rp-label {
          font-size: 11px; font-weight: 700; letter-spacing: 0.07em;
          text-transform: uppercase; color: #64748b;
          font-family: 'Cabinet Grotesk', sans-serif;
          display: flex; align-items: center; gap: 5px;
        }
        .rp-label-icon { color: #cbd5e1; display: flex; }
        .rp-input-wrap { position: relative; }
        .rp-iicon {
          position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
          pointer-events: none; transition: color .15s; display: flex; align-items: center;
        }
        .rp-input {
          width: 100%; padding: 12px 12px 12px 38px;
          border: 1.5px solid #e2e8f0; border-radius: 9px;
          background: #fafaf9; color: #0f172a;
          font-size: 14px; font-family: 'Cabinet Grotesk', sans-serif;
          outline: none; transition: all .15s; -webkit-appearance: none;
        }
        .rp-input::placeholder { color: #c8cdd6; }
        .rp-input:focus {
          border-color: #18181b;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(24,24,27,.06);
        }
        .rp-input:focus + .rp-iicon-overlay,
        .rp-input-wrap:focus-within .rp-iicon { color: #18181b; }
        .rp-iicon { color: #c8cdd6; }

        .rp-select-wrap { position: relative; }
        .rp-select {
          width: 100%; padding: 12px 36px 12px 38px;
          border: 1.5px solid #e2e8f0; border-radius: 9px;
          background: #fafaf9; color: #0f172a;
          font-size: 14px; font-family: 'Cabinet Grotesk', sans-serif;
          outline: none; cursor: pointer; appearance: none;
          transition: all .15s; -webkit-appearance: none;
        }
        .rp-select:focus {
          border-color: #18181b;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(24,24,27,.06);
        }
        .rp-select-caret {
          position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
          pointer-events: none; color: #94a3b8;
        }

        /* Pass toggle */
        .rp-pass-btn {
          position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer; padding: 4px;
          color: #94a3b8; display: flex; align-items: center; border-radius: 4px;
          transition: color .12s;
        }
        .rp-pass-btn:hover { color: #18181b; }

        /* Password strength */
        .rp-strength {
          display: flex; gap: 4px; margin-top: 7px;
        }
        .rp-strength-bar {
          flex: 1; height: 3px; border-radius: 999px;
          transition: background .3s;
        }
        .rp-strength-label {
          font-size: 10.5px; font-weight: 600; letter-spacing: 0.04em; margin-top: 5px;
          font-family: 'Cabinet Grotesk', sans-serif;
        }

        /* Navigation */
        .rp-nav {
          display: flex; align-items: center; justify-content: space-between; gap: 12px;
        }
        .rp-btn-back {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 11px 18px; border-radius: 9px;
          border: 1.5px solid #e2e8f0; background: transparent;
          color: #64748b; font-size: 13.5px; font-weight: 600;
          font-family: 'Cabinet Grotesk', sans-serif;
          cursor: pointer; transition: all .12s;
        }
        .rp-btn-back:hover { border-color: #18181b; color: #18181b; background: #f8f7f5; }

        .rp-btn-next {
          flex: 1;
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          padding: 13px 24px; border-radius: 9px; border: none;
          background: #18181b; color: #fff;
          font-size: 14px; font-weight: 700;
          font-family: 'Cabinet Grotesk', sans-serif;
          cursor: pointer; transition: background .15s, transform .1s, box-shadow .15s;
          position: relative; overflow: hidden; letter-spacing: 0.01em;
        }
        .rp-btn-next::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,.08) 0%, transparent 60%);
          pointer-events: none;
        }
        .rp-btn-next:hover:not(:disabled) {
          background: #27272a;
          box-shadow: 0 4px 20px rgba(0,0,0,.2);
          transform: translateY(-1px);
        }
        .rp-btn-next:active:not(:disabled) { transform: translateY(0); }
        .rp-btn-next:disabled { opacity: .5; cursor: not-allowed; }

        /* Spinner */
        .rp-spinner {
          width: 15px; height: 15px;
          border: 2px solid rgba(255,255,255,.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: rp-spin .7s linear infinite; flex-shrink: 0;
        }

        /* Summary card (step 3) */
        .rp-summary {
          background: #f8f7f5;
          border: 1px solid #e8e5df;
          border-radius: 10px;
          padding: 14px 16px;
          margin-bottom: 16px;
          display: flex; gap: 10px; align-items: flex-start;
        }
        .rp-summary-icon {
          width: 28px; height: 28px; border-radius: 7px;
          background: #18181b; display: flex; align-items: center;
          justify-content: center; flex-shrink: 0; margin-top: 1px;
        }
        .rp-summary-lines { flex: 1; min-width: 0; }
        .rp-summary-name {
          font-family: 'Fraunces', serif;
          font-size: 14.5px; font-weight: 600; color: #18181b;
        }
        .rp-summary-detail { font-size: 11.5px; color: #94a3b8; margin-top: 2px; font-weight: 500; }
        .rp-summary-badge {
          padding: '2px 8px';
          border-radius: 5px;
          background: #f0fdf4;
          border: '1px solid #bbf7d0';
          font-size: 10px; font-weight: 700; color: #15803d;
          display: flex; align-items: center; gap: 4px;
          flex-shrink: 0;
        }

        /* Mobile */
        @media (max-width: 900px) {
          .rp-root { grid-template-columns: 1fr; }
          .rp-sidebar { display: none; }
          .rp-form-area { padding: 32px 24px; max-width: 100%; }
          .rp-topbar { padding: 20px 24px; }
        }
      `}</style>

      <div className="rp-root">

        {/* ── SIDEBAR ──────────────────────────────────────────────────────── */}
        <aside className="rp-sidebar">
          <div className="rp-sidebar-bg">
            <div className="rp-orb-a" />
            <div className="rp-orb-b" />
            <div className="rp-orb-c" />
          </div>

          {/* Logo */}
          <div className="rp-logo">
            <div className="rp-logo-icon">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <span className="rp-logo-name">LabReg</span>
          </div>

          {/* Headline */}
          <div className="rp-sidebar-headline">
            <p className="rp-eyebrow">Student Registration</p>
            <h2 className="rp-sidebar-title">
              Join the<br/>
              <em>lab</em> that<br/>
              defines your<br/>
              <em>future.</em>
            </h2>
            <p className="rp-sidebar-sub">
              Complete three quick steps to access your lab sessions, track your registrations, and stay ahead of the waitlist.
            </p>
          </div>

          {/* Steps */}
          <div className="rp-step-list">
            {STEPS.map((s) => {
              const done   = step > s.id;
              const active = step === s.id;
              return (
                <div key={s.id} className="rp-step-row">
                  <div className={`rp-step-circle ${done ? 'rp-step-done' : active ? 'rp-step-active' : 'rp-step-todo'}`}>
                    {done ? <IconCheck /> : (
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11 }}>{s.id}</span>
                    )}
                  </div>
                  <div className="rp-step-text">
                    <div className={`rp-step-name ${done ? 'rp-step-name-done' : active ? 'rp-step-name-active' : 'rp-step-name-todo'}`}>
                      {s.label}
                    </div>
                    <div className="rp-step-desc">{s.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* ── MAIN ─────────────────────────────────────────────────────────── */}
        <main className="rp-main">

          {/* Top bar */}
          <div className="rp-topbar">
            <span className="rp-topbar-step">Step {step} of {STEPS.length}</span>
            <div className="rp-progress-bar">
              <div className="rp-progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <span className="rp-topbar-login">
              Have an account? <Link to="/login">Sign in</Link>
            </span>
          </div>

          {/* Form area */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flex: 1, justifyContent: 'flex-start' }}>
            <div className="rp-form-area">

              {/* ── STEP 1: Identity ─────────────────────────────────────── */}
              {step === 1 && (
                <>
                  <div className="rp-step-heading">
                    <p className="rp-step-num">01 — Identity</p>
                    <h3 className="rp-step-h">Tell us who you are.</h3>
                    <p className="rp-step-p">Your name and student ID help us link your account to the academic registry.</p>
                  </div>

                  <div className={`rp-card ${animDir === 'forward' ? 'rp-card-forward' : 'rp-card-back'}`}>
                    <div className="rp-g2">
                      <div className="rp-field">
                        <label className="rp-label">
                          <span className="rp-label-icon"><IconUser /></span>
                          First Name
                        </label>
                        <div className="rp-input-wrap">
                          <span className="rp-iicon"><IconUser /></span>
                          <input className="rp-input" type="text" placeholder="Kwame" value={formData.firstName}
                            onChange={e => fd('firstName', e.target.value)} required autoComplete="given-name" />
                        </div>
                      </div>
                      <div className="rp-field">
                        <label className="rp-label">Last Name</label>
                        <div className="rp-input-wrap">
                          <span className="rp-iicon"><IconUser /></span>
                          <input className="rp-input" type="text" placeholder="Mensah" value={formData.lastName}
                            onChange={e => fd('lastName', e.target.value)} required autoComplete="family-name" />
                        </div>
                      </div>
                    </div>

                    <div className="rp-field" style={{ marginTop: 14 }}>
                      <label className="rp-label">
                        <span className="rp-label-icon"><IconId /></span>
                        Student ID
                      </label>
                      <div className="rp-input-wrap">
                        <span className="rp-iicon"><IconId /></span>
                        <input className="rp-input" type="text" placeholder="UG/0000/00" value={formData.studentId}
                          onChange={e => fd('studentId', e.target.value)} required
                          style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, letterSpacing: '0.06em' }} />
                      </div>
                    </div>
                  </div>

                  <div className="rp-nav">
                    <button type="button" className="rp-btn-next" onClick={goNext}>
                      Continue <IconArrow />
                    </button>
                  </div>
                </>
              )}

              {/* ── STEP 2: Access ───────────────────────────────────────── */}
              {step === 2 && (
                <>
                  <div className="rp-step-heading">
                    <p className="rp-step-num">02 — Access</p>
                    <h3 className="rp-step-h">Set up your credentials.</h3>
                    <p className="rp-step-p">Your email and password secure your personal lab registration portal.</p>
                  </div>

                  <div className={`rp-card ${animDir === 'forward' ? 'rp-card-forward' : 'rp-card-back'}`}>
                    <div className="rp-field">
                      <label className="rp-label">
                        <span className="rp-label-icon"><IconMail /></span>
                        University Email
                      </label>
                      <div className="rp-input-wrap">
                        <span className="rp-iicon"><IconMail /></span>
                        <input className="rp-input" type="email" placeholder="kwame@ug.edu.gh" value={formData.email}
                          onChange={e => fd('email', e.target.value)} required autoComplete="email" />
                      </div>
                    </div>

                    <div className="rp-field" style={{ marginTop: 14 }}>
                      <label className="rp-label">
                        <span className="rp-label-icon"><IconLock /></span>
                        Password
                      </label>
                      <div className="rp-input-wrap">
                        <span className="rp-iicon"><IconLock /></span>
                        <input className="rp-input" type={showPass ? 'text' : 'password'} placeholder="Min. 8 characters"
                          value={formData.password} onChange={e => fd('password', e.target.value)}
                          required autoComplete="new-password" style={{ paddingRight: 38 }} />
                        <button type="button" className="rp-pass-btn" onClick={() => setShowPass(p => !p)} tabIndex={-1}>
                          {showPass ? (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                              <line x1="1" y1="1" x2="23" y2="23"/>
                            </svg>
                          ) : (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                            </svg>
                          )}
                        </button>
                      </div>

                      {/* Password strength meter */}
                      {formData.password.length > 0 && (() => {
                        const len = formData.password.length;
                        const hasUpper = /[A-Z]/.test(formData.password);
                        const hasNum   = /[0-9]/.test(formData.password);
                        const hasSpec  = /[^A-Za-z0-9]/.test(formData.password);
                        const score    = (len >= 8 ? 1 : 0) + (hasUpper ? 1 : 0) + (hasNum ? 1 : 0) + (hasSpec ? 1 : 0);
                        const colors   = ['#ef4444', '#f97316', '#eab308', '#22c55e'];
                        const labels   = ['Too weak', 'Weak', 'Good', 'Strong'];
                        const filled   = Math.max(score, 1);
                        return (
                          <div style={{ marginTop: 8 }}>
                            <div className="rp-strength">
                              {[0,1,2,3].map(i => (
                                <div key={i} className="rp-strength-bar"
                                  style={{ background: i < filled ? colors[score - 1] : '#e2e8f0' }} />
                              ))}
                            </div>
                            <p className="rp-strength-label" style={{ color: colors[score - 1] }}>
                              {labels[score - 1]}
                            </p>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  <div className="rp-nav">
                    <button type="button" className="rp-btn-back" onClick={goBack}>
                      <IconArrow dir="left" /> Back
                    </button>
                    <button type="button" className="rp-btn-next" onClick={goNext}>
                      Continue <IconArrow />
                    </button>
                  </div>
                </>
              )}

              {/* ── STEP 3: Academic ─────────────────────────────────────── */}
              {step === 3 && (
                <>
                  <div className="rp-step-heading">
                    <p className="rp-step-num">03 — Academic</p>
                    <h3 className="rp-step-h">Your academic profile.</h3>
                    <p className="rp-step-p">Select your program and current level to register for the right lab sessions.</p>
                  </div>

                  {/* Summary of previous steps */}
                  <div className="rp-summary">
                    <div className="rp-summary-icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                      </svg>
                    </div>
                    <div className="rp-summary-lines">
                      <div className="rp-summary-name">{formData.firstName} {formData.lastName}</div>
                      <div className="rp-summary-detail">{formData.studentId} · {formData.email}</div>
                    </div>
                    <span style={{
                      padding: '3px 9px', borderRadius: 6,
                      background: '#f0fdf4', border: '1px solid #bbf7d0',
                      fontSize: 10, fontWeight: 700, color: '#15803d',
                      display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0,
                    }}>
                      <IconCheck /> Verified
                    </span>
                  </div>

                  <div className={`rp-card ${animDir === 'forward' ? 'rp-card-forward' : 'rp-card-back'}`}>
                    <div className="rp-field">
                      <label className="rp-label">
                        <span className="rp-label-icon"><IconBook /></span>
                        Programme
                      </label>
                      <div className="rp-select-wrap">
                        <span className="rp-iicon"><IconBook /></span>
                        <select className="rp-select" value={formData.programId}
                          onChange={e => fd('programId', parseInt(e.target.value) || 0)} required>
                          <option value={0}>Select your programme…</option>
                          {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                        <span className="rp-select-caret">
                          <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
                          </svg>
                        </span>
                      </div>
                    </div>

                    <div className="rp-field" style={{ marginTop: 14 }}>
                      <label className="rp-label">Current Level</label>
                      <div className="rp-select-wrap">
                        <span className="rp-iicon">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                          </svg>
                        </span>
                        <select className="rp-select" value={formData.level}
                          onChange={e => fd('level', e.target.value)} required>
                          {LEVEL_OPTIONS.map((opt: { value: string; label: string }) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                        <span className="rp-select-caret">
                          <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="rp-nav">
                    <button type="button" className="rp-btn-back" onClick={goBack}>
                      <IconArrow dir="left" /> Back
                    </button>
                    <button type="submit" className="rp-btn-next" disabled={loading}>
                      {loading ? (
                        <><div className="rp-spinner" /> Creating account…</>
                      ) : (
                        <>Create Account <IconArrow /></>
                      )}
                    </button>
                  </div>
                </>
              )}

            </div>
          </form>
        </main>

      </div>
    </>
  );
};

export default RegisterPage;