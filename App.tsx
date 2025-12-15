/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Zap, BarChart3, Target, MessageSquare, 
  Bell, CheckCircle2, Award, Sparkles, Send, 
  Bot, User, TrendingUp, BrainCircuit, 
  ArrowRight, ArrowLeft, ChevronRight, GraduationCap,
  Briefcase, Globe, Settings, Layout, DollarSign, 
  AlertCircle, FileText, Mic, Video, Lightbulb, Check, RefreshCw,
  UserCircle, Briefcase as ProfessionalIcon, Compass,
  ShieldCheck, Loader2, Database, Cpu
} from 'lucide-react';
import { Button } from './components/Button';
import { LandingPage } from './components/LandingPage';
import { generateCareerPathway, analyzeSkillGap, getCareerAdvice } from './services/geminiService';
import { AppView, Skill, CareerPathway, ChatMessage, LoadingState, UserProfile } from './types';

// --- Splash Screen Component ---
const SplashScreen = ({ onFinished }: { onFinished: () => void }) => {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPercent(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onFinished, 500);
          return 100;
        }
        return prev + 5;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [onFinished]);

  return (
    <div className="fixed inset-0 z-[1000] bg-[#050505] flex flex-col items-center justify-center">
      <div className="relative mb-8 animate-float">
        <div className="w-24 h-24 bg-emerald-500 rounded-[2.5rem] flex items-center justify-center text-zinc-950 shadow-[0_0_60px_rgba(16,185,129,0.6)]">
          <Target size={52} strokeWidth={2.5} />
        </div>
        <div className="absolute -inset-4 border border-emerald-500/20 rounded-[3rem] animate-pulse"></div>
      </div>
      <h1 className="text-4xl font-black tracking-tighter uppercase text-white mb-2 italic">SkillSync <span className="text-emerald-500">AI</span></h1>
      <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.5em] mb-12">Calibrating Career Matrix</p>
      
      <div className="w-64 h-1 bg-zinc-900 rounded-full overflow-hidden relative border border-white/5">
        <div 
          className="h-full bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.8)] transition-all duration-100 ease-out" 
          style={{ width: `${percent}%` }}
        ></div>
      </div>
      <div className="mt-4 font-mono text-[10px] text-emerald-500 font-bold uppercase tracking-widest">{percent}% Loaded</div>
    </div>
  );
};

// --- Multi-Step Onboarding Wizard ---
const OnboardingWizard = ({ onComplete }: { onComplete: (profile: UserProfile) => void }) => {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    currentRole: '',
    education: '',
    yearsOfExp: '',
    industry: '',
    goal: '',
    experienceLevel: 'entry',
    timeAvailability: '10',
    learningStyle: 'practical',
    skillsAssessment: {}
  });

  const steps = [
    { 
      id: 'Profile',
      title: "Who are you?", 
      subtitle: "Set up your professional identity for the neural link.",
      icon: <UserCircle />,
      fields: [
        { label: 'Full Name', field: 'name', type: 'text', placeholder: 'e.g. Alex Chen' },
        { label: 'Email Address', field: 'email', type: 'email', placeholder: 'e.g. alex@example.com' }
      ]
    },
    { 
      id: 'Professional',
      title: "Current Status", 
      subtitle: "What is your starting point in the career matrix?",
      icon: <ProfessionalIcon />,
      fields: [
        { label: 'Current Role / Major', field: 'currentRole', type: 'text', placeholder: 'e.g. CS Student' },
        { label: 'Highest Education', field: 'education', type: 'select', options: ['High School', 'Bachelors', 'Masters', 'PhD', 'Self-Taught'] },
        { label: 'Experience (Years)', field: 'yearsOfExp', type: 'number', placeholder: '0' }
      ]
    },
    { 
      id: 'Goal',
      title: "Your North Star", 
      subtitle: "Define the trajectory we are optimizing for.",
      icon: <Compass />,
      fields: [
        { label: 'Target Job Title', field: 'goal', type: 'text', placeholder: 'e.g. Senior AI Architect' },
        { label: 'Target Seniority', field: 'experienceLevel', type: 'options', options: [
          { id: 'entry', label: 'Entry Level' },
          { id: 'mid', label: 'Mid Level' },
          { id: 'senior', label: 'Senior Level' }
        ]}
      ]
    }
  ];

  const currentStepData = steps[step];

  const next = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else onComplete(profile);
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 md:p-10 relative overflow-y-auto custom-scroll">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(16,185,129,0.08)_0,transparent_60%)] pointer-events-none"></div>
      
      <div className="max-w-2xl w-full glass-panel p-8 md:p-16 rounded-[4rem] relative z-10 animate-slide-up border border-white/10 shadow-2xl my-10">
        
        {/* Engaging Progress Indicator */}
        <div className="mb-16">
          <div className="flex items-center justify-between relative px-2">
            <div className="absolute top-5 left-8 right-8 h-[2px] bg-zinc-800 -z-10 rounded-full"></div>
            <div 
              className="absolute top-5 left-8 h-[2px] bg-emerald-500 -z-10 transition-all duration-700 ease-in-out shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
              style={{ width: `calc(${(step / (steps.length - 1)) * 100}% - 40px)` }}
            ></div>

            {steps.map((s, i) => (
              <div key={s.id} className="flex flex-col items-center gap-4 group">
                <div 
                  className={`w-12 h-12 rounded-[1.2rem] flex items-center justify-center transition-all duration-500 relative ${
                    i < step 
                    ? 'bg-emerald-500 text-zinc-950 shadow-[0_0_20px_rgba(16,185,129,0.4)]' 
                    : i === step 
                      ? 'bg-zinc-900 text-emerald-500 border-2 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.2)] scale-110' 
                      : 'bg-zinc-900 text-zinc-700 border border-zinc-800'
                  }`}
                >
                  {i < step ? <Check size={24} strokeWidth={3} /> : React.cloneElement(s.icon as React.ReactElement, { size: 24 })}
                  {i === step && (
                    <div className="absolute -inset-1 rounded-[1.4rem] border border-emerald-500/30 animate-pulse"></div>
                  )}
                </div>
                <div className="flex flex-col items-center">
                  <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-300 ${i === step ? 'text-emerald-500' : 'text-zinc-600'}`}>
                    {s.id}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <h2 className="text-4xl md:text-5xl font-black mb-3 text-white tracking-tighter uppercase leading-[0.9]">{currentStepData.title}</h2>
        <p className="text-zinc-500 mb-12 font-medium text-lg leading-relaxed">{currentStepData.subtitle}</p>
        
        <div className="space-y-8">
          {currentStepData.fields.map(f => (
            <div key={f.field} className="space-y-3">
              <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest ml-1">{f.label}</label>
              {f.type === 'options' ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {f.options?.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setProfile({...profile, [f.field]: opt.id})}
                      className={`p-4 rounded-2xl border text-[11px] font-black uppercase tracking-[0.2em] transition-all h-16 ${profile[f.field as keyof UserProfile] === opt.id ? 'bg-emerald-500 border-emerald-400 text-zinc-950 shadow-xl shadow-emerald-500/20' : 'bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              ) : f.type === 'select' ? (
                <div className="relative group">
                  <select 
                    value={(profile as any)[f.field]}
                    onChange={e => setProfile({...profile, [f.field]: e.target.value})}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-5 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all appearance-none cursor-pointer group-hover:border-zinc-600"
                  >
                    <option value="">Choose category</option>
                    {f.options?.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-600">
                    <ChevronRight size={20} className="rotate-90" />
                  </div>
                </div>
              ) : (
                <input 
                  type={f.type}
                  value={(profile as any)[f.field]}
                  onChange={e => setProfile({...profile, [f.field]: e.target.value})}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-5 text-white focus:ring-2 focus:ring-emerald-500 outline-none placeholder:text-zinc-700 transition-all hover:border-zinc-600"
                  placeholder={f.placeholder}
                />
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-16 flex flex-col-reverse sm:flex-row justify-between gap-4">
           {step > 0 && (
             <button onClick={() => setStep(step - 1)} className="px-10 h-16 rounded-2xl border border-zinc-800 text-zinc-500 font-black uppercase tracking-widest text-xs hover:text-white hover:border-zinc-600 transition-all">Back</button>
           )}
           <Button className="flex-1 h-16 text-xl font-black uppercase tracking-[0.2em] rounded-2xl shadow-2xl shadow-emerald-500/10" onClick={next}>
             {step === steps.length - 1 ? 'Activate Sync' : 'Proceed'} <ArrowRight size={22} className="ml-2" />
           </Button>
        </div>
      </div>
    </div>
  );
};

// --- Syncing Animation Component ---
const NeuralSyncLoader = ({ messages }: { messages: string[] }) => {
  const [currentMsgIdx, setCurrentMsgIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMsgIdx(prev => (prev + 1) % messages.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [messages]);

  return (
    <div className="flex flex-col items-center justify-center animate-fade-in text-center p-6">
      <div className="relative w-64 h-64 mb-16 group">
        {/* Outer rotating ring */}
        <div className="absolute inset-0 border-[1px] border-emerald-500/10 rounded-full scale-110"></div>
        <div className="absolute inset-0 border-t-[4px] border-emerald-500 rounded-full animate-spin"></div>
        
        {/* Middle reverse rotating ring */}
        <div className="absolute inset-4 border-[1px] border-emerald-500/20 rounded-full"></div>
        <div className="absolute inset-4 border-b-[2px] border-emerald-500/40 rounded-full animate-[spin_3s_linear_infinite_reverse]"></div>
        
        {/* Inner pulsing core */}
        <div className="absolute inset-8 bg-emerald-500/5 rounded-full flex items-center justify-center backdrop-blur-3xl border border-emerald-500/10 shadow-[0_0_100px_rgba(16,185,129,0.1)]">
          <div className="relative">
             <div className="absolute inset-0 bg-emerald-500 blur-2xl opacity-20 animate-pulse"></div>
             <Zap size={64} className="text-emerald-500 relative z-10 animate-float" />
          </div>
        </div>

        {/* Floating status icons */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 animate-bounce">
          <Database size={24} className="text-emerald-500 opacity-60" />
        </div>
        <div className="absolute top-1/2 -right-4 -translate-y-1/2 animate-[pulse_2s_infinite]">
          <Cpu size={24} className="text-emerald-400 opacity-60" />
        </div>
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 animate-float">
          <Globe size={24} className="text-blue-400 opacity-40" />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-emerald-500 font-black tracking-[1.2em] uppercase text-2xl animate-pulse pl-[1.2em]">Neural Sync</h3>
        <div className="h-6 flex items-center justify-center overflow-hidden">
          <p key={currentMsgIdx} className="text-zinc-500 font-mono text-sm uppercase tracking-[0.3em] animate-slide-up">
            {messages[currentMsgIdx]}
          </p>
        </div>
      </div>

      <div className="mt-16 w-48 h-[2px] bg-zinc-900 rounded-full overflow-hidden border border-white/5">
        <div className="h-full bg-emerald-500 animate-[loading_8s_ease-in-out_infinite]"></div>
      </div>
      <style>{`
        @keyframes loading {
          0% { width: 0%; left: 0%; }
          50% { width: 100%; left: 0%; }
          100% { width: 0%; left: 100%; }
        }
      `}</style>
    </div>
  );
};

// --- Navigation Item Component ---
const NavIcon = ({ icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick} 
    className="flex flex-col items-center justify-center flex-1 h-full gap-1 group outline-none transition-all duration-300"
  >
    <div className={`relative p-2.5 rounded-2xl transition-all duration-300 ${active ? 'text-emerald-500 scale-110' : 'text-zinc-600 group-hover:text-zinc-400 group-hover:bg-zinc-900/50'}`}>
       {React.cloneElement(icon, { size: 24, strokeWidth: active ? 2.5 : 2 })}
       {active && (
         <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
       )}
    </div>
    <span className={`text-[10px] font-black uppercase tracking-[0.15em] transition-colors ${active ? 'text-emerald-500' : 'text-zinc-600 group-hover:text-zinc-400'}`}>
      {label}
    </span>
  </button>
);

// --- App Layout with Bottom Navigation ---
const AppLayout: React.FC<{ 
  children: React.ReactNode; 
  view: AppView; 
  setView: (v: AppView) => void; 
  userProfile: UserProfile | null 
}> = ({ children, view, setView, userProfile }) => (
  <div className="flex flex-col h-screen bg-[#050505] overflow-hidden">
    {/* Minimal App Header */}
    <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 md:px-12 shrink-0 bg-black/60 backdrop-blur-2xl z-50">
       <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setView('dashboard')}>
          <div className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center text-zinc-950 shadow-[0_0_15px_rgba(16,185,129,0.3)] group-hover:scale-105 transition-transform">
             <Target size={18} strokeWidth={3} />
          </div>
          <span className="font-black text-lg tracking-tighter uppercase text-white group-hover:text-emerald-400 transition-colors">SkillSync <span className="text-emerald-500 font-mono text-[9px]">AI</span></span>
       </div>
       <div className="flex items-center gap-6">
          <div className="hidden sm:flex flex-col items-end">
             <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Global Status</span>
             <span className="text-emerald-500 font-bold text-[10px] flex items-center gap-1.5 leading-none">
               <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></div> 
               ACTIVE SYNC
             </span>
          </div>
          <button className="p-2 text-zinc-500 hover:text-white transition-colors relative">
             <Bell size={20}/>
             <span className="absolute top-1.5 right-1.5 w-1 h-1 bg-emerald-500 rounded-full"></span>
          </button>
       </div>
    </header>

    <main className="flex-1 overflow-y-auto custom-scroll relative bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.02)_0%,transparent_50%)]">
      <div className="max-w-6xl mx-auto w-full p-6 md:p-12 pb-36">
        {children}
      </div>
    </main>

    <nav className="fixed bottom-0 left-0 right-0 h-[84px] bg-zinc-950/90 backdrop-blur-3xl border-t border-white/10 flex items-center justify-around px-2 z-50 safe-bottom shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
       <NavIcon icon={<Layout />} label="Dash" active={view === 'dashboard'} onClick={() => setView('dashboard')} />
       <NavIcon icon={<BarChart3 />} label="Gap" active={view === 'skills'} onClick={() => setView('skills')} />
       <NavIcon icon={<MessageSquare />} label="Coach" active={view === 'coach'} onClick={() => setView('coach')} />
       <NavIcon icon={<Zap />} label="Path" active={view === 'pathway'} onClick={() => setView('pathway')} />
       <NavIcon icon={<Settings />} label="Config" active={view === 'settings'} onClick={() => setView('settings')} />
    </nav>
  </div>
);

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [view, setView] = useState<AppView>('landing');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState<LoadingState>({ isActive: false, message: '', error: null });
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const syncStages = [
    "Encoding professional DNA...",
    "Scanning market coordinates...",
    "Calibrating neural pathways...",
    "Synthesizing market telemetry...",
    "Synchronizing skill competency matrix...",
    "Finalizing trajectory recommendation..."
  ];

  const handleOnboardingComplete = async (profile: UserProfile) => {
    setUserProfile(profile);
    setLoading({ isActive: true, message: 'Mapping career coordinates...', error: null });
    
    try {
      // Intentional delay to show the beautiful syncing animation
      const dataPromise = analyzeSkillGap([], profile.goal);
      const delayPromise = new Promise(resolve => setTimeout(resolve, 5500));
      
      const [gaps] = await Promise.all([dataPromise, delayPromise]);
      
      setSkills(gaps);
      setLoading({ isActive: false, message: '' });
      setView('dashboard');
    } catch (e: any) {
      setLoading({ isActive: true, message: '', error: e.message || "Failed to synchronize profile." });
    }
  };

  const handleSendMessage = async (customMessage?: string) => {
    const textToSend = customMessage || inputText;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: textToSend, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await getCareerAdvice([], textToSend);
      const modelMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: response, timestamp: Date.now() };
      setMessages(prev => [...prev, modelMsg]);
    } catch (e: any) {
      setMessages(prev => [...prev, { id: 'err', role: 'model', text: "Neural link timeout. Check connectivity.", timestamp: Date.now(), isError: true }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (showSplash) return <SplashScreen onFinished={() => setShowSplash(false)} />;
  if (view === 'landing') return <LandingPage onGetStarted={() => setView('onboarding')} />;
  if (view === 'onboarding') return <OnboardingWizard onComplete={handleOnboardingComplete} />;

  return (
    <AppLayout view={view} setView={setView} userProfile={userProfile}>
      {view === 'dashboard' && (
        <div className="animate-fade-in space-y-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
            <div className="max-w-2xl">
               <h1 className="text-5xl md:text-8xl font-black mb-4 tracking-tighter uppercase text-white leading-[0.8]">Neural <span className="text-emerald-500">Link</span></h1>
               <p className="text-zinc-500 text-lg md:text-3xl font-medium leading-tight">
                 Welcome back, {userProfile?.name?.split(' ')[0] || 'User'}. Your path towards <span className="text-white font-black italic underline decoration-emerald-500/20 underline-offset-8 decoration-4">{userProfile?.goal}</span> is active.
               </p>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
               <div className="px-10 py-8 glass-panel rounded-[3rem] text-center border-emerald-500/20 shadow-2xl">
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Market Match</p>
                  <p className="text-5xl font-black text-emerald-400">82%</p>
               </div>
               <div className="px-10 py-8 glass-panel rounded-[3rem] text-center shadow-2xl border-white/5">
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Sync Streak</p>
                  <p className="text-5xl font-black text-white">4d</p>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Demand Index', val: 'Critical', icon: <TrendingUp className="text-emerald-400"/> },
              { label: 'Growth Rate', val: '+14.2%', icon: <Sparkles className="text-purple-400"/> },
              { label: 'Salary Target', val: '$132k', icon: <DollarSign className="text-blue-400"/> },
              { label: 'Stability', val: 'Very High', icon: <ShieldCheck className="text-orange-400" size={24}/> }
            ].map((stat, i) => (
              <div key={i} className="glass-panel p-10 rounded-[3.5rem] hover:border-emerald-500/30 transition-all flex flex-col gap-10 group cursor-default">
                <div className="p-5 bg-zinc-950 rounded-2xl w-fit group-hover:scale-110 transition-transform shadow-inner border border-white/5">{stat.icon}</div>
                <div>
                  <p className="text-[11px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-1">{stat.label}</p>
                  <p className="text-4xl font-black text-white">{stat.val}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
             <div className="lg:col-span-2 space-y-12">
                <div className="glass-panel p-10 md:p-14 rounded-[4.5rem] relative overflow-hidden border border-emerald-500/10">
                   <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/[0.03] blur-[150px] -z-10 rounded-full"></div>
                   <h3 className="text-3xl font-black mb-12 flex items-center gap-6 uppercase tracking-tighter text-white">
                     <div className="p-4 bg-emerald-500/10 rounded-2xl"><Zap size={36} className="text-emerald-400 fill-emerald-500/20"/></div> Priority Sync
                   </h3>
                   <div className="bg-zinc-950/60 border border-white/5 p-12 rounded-[4rem] flex flex-col md:flex-row items-center gap-16 shadow-inner">
                      <div className="flex-1 text-center md:text-left">
                         <p className="text-zinc-400 text-2xl md:text-3xl leading-snug mb-12">
                           Market analysis for <strong>{userProfile?.goal}</strong> indicates an 18% shift towards <span className="text-emerald-400 font-black italic underline decoration-emerald-500/40">Multi-Modal AI Systems</span>.
                         </p>
                         <Button size="lg" icon={<ArrowRight size={24}/>} className="px-16 h-20 text-xl font-black tracking-widest uppercase rounded-2xl shadow-2xl shadow-emerald-500/20">Recalibrate</Button>
                      </div>
                      <div className="shrink-0 w-48 h-48 relative flex items-center justify-center group/ready cursor-pointer">
                         <svg className="w-full h-full -rotate-90">
                           <circle cx="96" cy="96" r="86" className="fill-none stroke-zinc-900 stroke-[14]" />
                           <circle cx="96" cy="96" r="86" className="fill-none stroke-emerald-500 stroke-[14] shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all duration-1000" strokeDasharray="540" strokeDashoffset="150" />
                         </svg>
                         <div className="absolute flex flex-col items-center transition-transform group-hover/ready:scale-110 duration-500">
                            <span className="font-black text-6xl text-emerald-400 leading-none">72</span>
                            <span className="text-[12px] font-black text-zinc-600 uppercase tracking-[0.4em] mt-2">Ready</span>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="glass-panel p-12 md:p-16 rounded-[4.5rem]">
                   <div className="flex justify-between items-center mb-16 px-2">
                      <h3 className="text-3xl font-black uppercase tracking-tighter text-white">Skill Matrix Breakdown</h3>
                      <button className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.4em] hover:text-white transition-colors">Neural Sync</button>
                   </div>
                   <div className="space-y-14">
                      {skills.length > 0 ? skills.slice(0, 4).map((s, i) => (
                        <div key={i} className="space-y-6">
                           <div className="flex justify-between items-end px-2">
                              <span className="text-base font-black uppercase tracking-[0.2em] text-zinc-500">{s.name}</span>
                              <div className="flex items-baseline gap-3">
                                <span className="font-mono text-emerald-500 font-black text-3xl">{s.level}%</span>
                                <span className="text-[11px] font-black text-zinc-800 uppercase tracking-widest">/ Opt</span>
                              </div>
                           </div>
                           <div className="h-5 bg-zinc-950 rounded-full border border-white/5 overflow-hidden p-1.5 shadow-inner">
                              <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000 shadow-[0_0_20px_rgba(16,185,129,0.5)]" style={{width: `${s.level}%`}}></div>
                           </div>
                        </div>
                      )) : (
                        <div className="py-24 text-center">
                           <RefreshCw size={52} className="mx-auto text-zinc-800 animate-spin mb-6" />
                           <p className="text-zinc-600 font-black uppercase tracking-[0.4em] text-sm">Mapping Competency Map...</p>
                        </div>
                      )}
                   </div>
                   <Button variant="ghost" className="w-full mt-16 h-20 group rounded-3xl hover:bg-zinc-900/50 text-zinc-500 text-lg">
                      View Advanced Analytics <ChevronRight size={24} className="ml-4 group-hover:translate-x-2 transition-transform" />
                   </Button>
                </div>
             </div>

             <div className="space-y-12">
                <div className="p-12 bg-emerald-500/[0.04] border border-emerald-500/20 rounded-[4.5rem] relative overflow-hidden group shadow-2xl">
                   <div className="absolute -bottom-16 -right-16 text-emerald-500/[0.03] rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                      <MessageSquare size={280} />
                   </div>
                   <div className="flex items-center gap-6 mb-12 relative z-10">
                      <div className="p-5 bg-emerald-500 rounded-2xl text-zinc-950 shadow-2xl shadow-emerald-500/40"><MessageSquare size={32}/></div>
                      <div>
                         <p className="text-[12px] font-black text-emerald-500 uppercase tracking-[0.4em]">Coach Signal</p>
                         <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mt-1">L5 AI AGENT</p>
                      </div>
                   </div>
                   <p className="text-2xl text-zinc-300 leading-snug font-bold mb-16 italic relative z-10">
                     "Your trajectory is 32% ahead of market benchmark. Prioritize <span className="text-white font-black underline decoration-emerald-500/30 underline-offset-8 decoration-4 italic">Applied RAG Frameworks</span> this week to trigger senior match signals."
                   </p>
                   <Button variant="outline" className="w-full h-20 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10 rounded-3xl font-black uppercase tracking-widest relative z-10 text-lg shadow-xl" onClick={() => setView('coach')}>Initialize Chat</Button>
                </div>

                <div className="glass-panel p-12 rounded-[4rem] border-white/5 shadow-2xl">
                   <h3 className="text-3xl font-black mb-12 uppercase tracking-tighter text-white">Live Matches</h3>
                   <div className="space-y-10">
                      {[
                        { role: 'Senior AI Engineer', co: 'Nebula.io', match: 94 },
                        { role: 'Data Strategist', co: 'Synth Lab', match: 88 },
                        { role: 'Product Lead', co: 'Aura', match: 72 }
                      ].map((job, i) => (
                        <div key={i} className="flex items-center gap-8 p-7 bg-zinc-950/40 rounded-[2.5rem] border border-white/5 hover:border-emerald-500/40 transition-all cursor-pointer group/job shadow-inner">
                           <div className="w-16 h-16 rounded-3xl bg-zinc-900 flex items-center justify-center text-emerald-500/40 group-hover/job:text-emerald-500 transition-colors shadow-inner"><Briefcase size={32}/></div>
                           <div className="flex-1">
                              <p className="font-black text-white text-lg group-hover/job:text-emerald-400 transition-colors">{job.role}</p>
                              <p className="text-[11px] text-zinc-600 uppercase tracking-[0.3em] font-black mt-1.5">{job.co}</p>
                           </div>
                           <div className="text-right">
                              <span className="text-emerald-500 font-black text-lg">{job.match}%</span>
                              <p className="text-[9px] font-black text-zinc-800 uppercase tracking-widest mt-1">Match</p>
                           </div>
                        </div>
                      ))}
                   </div>
                   <button className="w-full mt-12 py-6 text-[11px] font-black text-zinc-600 uppercase tracking-[0.5em] hover:text-white transition-colors">Analyze Pipeline</button>
                </div>
             </div>
          </div>
        </div>
      )}

      {view === 'coach' && (
        <div className="animate-fade-in flex flex-col h-[calc(100vh-16rem)] md:h-[calc(100vh-20rem)] max-w-4xl mx-auto relative bg-zinc-950/50 rounded-[4rem] border border-white/10 overflow-hidden shadow-2xl">
          <div className="px-12 py-8 border-b border-white/10 flex items-center justify-between bg-zinc-900/40 backdrop-blur-md shrink-0">
             <div className="flex items-center gap-5">
                <div className="w-4 h-4 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
                <div>
                   <span className="text-[11px] font-black text-white uppercase tracking-[0.4em] block">Neural Coach Protocol</span>
                </div>
             </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-12 p-8 md:p-14 scrollbar-hide custom-scroll">
             <div className="flex gap-8">
                <div className="w-16 h-16 rounded-[1.5rem] bg-emerald-500 flex items-center justify-center text-zinc-950 flex-shrink-0 shadow-2xl shadow-emerald-500/40"><Bot size={32}/></div>
                <div className="bg-zinc-900/60 border border-white/10 p-10 rounded-[3.5rem] rounded-tl-none shadow-2xl backdrop-blur-md max-w-[90%]">
                   <p className="text-xl text-zinc-200 leading-snug font-semibold">
                      Connection secure, {userProfile?.name?.split(' ')[0]}. My current trajectory analysis for <strong>{userProfile?.goal || 'target bandwidth'}</strong> is synchronized. 
                   </p>
                </div>
             </div>

             {messages.map((m) => (
               <div key={m.id} className={`flex gap-8 ${m.role === 'user' ? 'flex-row-reverse' : ''} animate-slide-up`}>
                  <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center flex-shrink-0 shadow-2xl transition-transform hover:scale-110
                    ${m.role === 'user' ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/20' : 'bg-emerald-500 text-zinc-950 shadow-emerald-500/20'}`}>
                    {m.role === 'user' ? <User size={32} /> : <Bot size={32} />}
                  </div>
                  <div className={`p-10 rounded-[3.5rem] max-w-[90%] md:max-w-[80%] border shadow-2xl transition-all
                    ${m.role === 'user' 
                      ? 'bg-emerald-500 text-zinc-950 border-emerald-400 rounded-tr-none font-black text-xl leading-tight' 
                      : m.isError 
                        ? 'bg-red-500/10 border-red-500/50 rounded-tl-none text-red-200'
                        : 'bg-zinc-900/60 backdrop-blur-3xl border-zinc-800 rounded-tl-none text-zinc-200 leading-snug font-bold text-lg'}`}>
                    <p>{m.text}</p>
                  </div>
               </div>
             ))}

             {isTyping && (
               <div className="flex gap-8 animate-pulse">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0"><Bot size={32}/></div>
               </div>
             )}
             <div ref={chatEndRef} />
          </div>

          <div className="p-10 md:p-14 shrink-0 bg-black/40 backdrop-blur-3xl border-t border-white/10">
            <div className="flex gap-6 bg-zinc-900 border border-white/10 p-4 rounded-[3.5rem] items-center shadow-2xl focus-within:border-emerald-500/50 transition-all ring-emerald-500/5 focus-within:ring-[12px]">
               <input 
                type="text" 
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                placeholder="Synchronize request..." 
                className="flex-1 bg-transparent border-none text-xl focus:ring-0 px-2 py-5 placeholder:text-zinc-800 text-white font-bold"
              />
              <button 
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim() || isTyping}
                className="w-20 h-20 bg-emerald-500 text-zinc-950 rounded-[2rem] hover:bg-emerald-400 transition-all flex items-center justify-center shadow-2xl shadow-emerald-500/40 disabled:opacity-50"
              >
                <Send size={36} />
              </button>
            </div>
          </div>
        </div>
      )}

      {loading.isActive && (
        <div className="fixed inset-0 z-[1200] bg-black/99 backdrop-blur-[100px] flex flex-col items-center justify-center animate-fade-in p-12">
           {!loading.error ? (
             <NeuralSyncLoader messages={syncStages} />
           ) : (
             <div className="max-w-2xl w-full glass-panel p-20 rounded-[6rem] text-center border-red-500/20 shadow-[0_0_150px_rgba(239,68,68,0.15)]">
                <div className="w-32 h-32 bg-red-500/10 text-red-500 rounded-[3.5rem] flex items-center justify-center mx-auto mb-16 shadow-2xl border border-red-500/20"><AlertCircle size={72} /></div>
                <h3 className="text-4xl font-black text-white uppercase tracking-tighter mb-10 leading-none">Sync Interrupted</h3>
                <p className="text-zinc-600 mb-16 leading-relaxed font-bold text-2xl">{loading.error}</p>
                <div className="flex flex-col gap-6">
                   <Button size="lg" className="w-full h-24 bg-red-600 hover:bg-red-500 rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-white shadow-2xl shadow-red-950/40 text-xl" onClick={() => userProfile && handleOnboardingComplete(userProfile)} icon={<RefreshCw size={36}/>}>Retry Sync</Button>
                </div>
             </div>
           )}
        </div>
      )}
    </AppLayout>
  );
}
