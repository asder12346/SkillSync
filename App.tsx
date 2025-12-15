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
  AlertCircle, FileText, Mic, Video, Lightbulb, Check, RefreshCw
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
        return prev + 4;
      });
    }, 20);
    return () => clearInterval(interval);
  }, [onFinished]);

  return (
    <div className="fixed inset-0 z-[1000] bg-[#050505] flex flex-col items-center justify-center">
      <div className="relative mb-8 animate-float">
        <div className="w-24 h-24 bg-emerald-500 rounded-[2rem] flex items-center justify-center text-zinc-950 shadow-[0_0_60px_rgba(16,185,129,0.5)]">
          <Target size={52} strokeWidth={2.5} />
        </div>
        <div className="absolute -inset-4 border border-emerald-500/20 rounded-[2.5rem] animate-pulse"></div>
      </div>
      <h1 className="text-4xl font-black tracking-tighter uppercase text-white mb-2">SkillSync <span className="text-emerald-500">AI</span></h1>
      <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.5em] mb-12">Initializing Career Matrix</p>
      
      <div className="w-64 h-1.5 bg-zinc-900 rounded-full overflow-hidden relative border border-white/5">
        <div 
          className="h-full bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.8)] transition-all duration-100 ease-out" 
          style={{ width: `${percent}%` }}
        ></div>
      </div>
      <div className="mt-4 font-mono text-[10px] text-emerald-500 font-bold uppercase tracking-widest">{percent}% Synced</div>
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
      subtitle: "Personalize your career dashboard.",
      fields: [
        { label: 'Full Name', field: 'name', type: 'text', placeholder: 'e.g. Alex Chen' },
        { label: 'Email Address', field: 'email', type: 'email', placeholder: 'e.g. alex@example.com' }
      ]
    },
    { 
      id: 'Professional',
      title: "Current Status", 
      subtitle: "Map your starting point.",
      fields: [
        { label: 'Current Role / Major', field: 'currentRole', type: 'text', placeholder: 'e.g. Computer Science Student' },
        { label: 'Education Level', field: 'education', type: 'select', options: ['High School', 'Bachelors', 'Masters', 'PhD', 'Self-Taught'] },
        { label: 'Years of Experience', field: 'yearsOfExp', type: 'number', placeholder: '0' }
      ]
    },
    { 
      id: 'Goal',
      title: "Future Goal", 
      subtitle: "Where do you want to be?",
      fields: [
        { label: 'Target Job Title', field: 'goal', type: 'text', placeholder: 'e.g. Senior Data Scientist' },
        { label: 'Desired Career Level', field: 'experienceLevel', type: 'options', options: [
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
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-y-auto">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(16,185,129,0.08)_0,transparent_60%)]"></div>
      <div className="max-w-xl w-full glass-panel p-8 md:p-12 rounded-[3rem] relative z-10 animate-slide-up border border-white/10 shadow-2xl my-10">
        <div className="mb-10 flex gap-2">
           {steps.map((_, i) => (
             <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${i <= step ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-zinc-800'}`}></div>
           ))}
        </div>
        <h2 className="text-3xl font-black mb-2 text-white tracking-tighter uppercase">{currentStepData.title}</h2>
        <p className="text-zinc-500 mb-8 font-medium">{currentStepData.subtitle}</p>
        
        <div className="space-y-6">
          {currentStepData.fields.map(f => (
            <div key={f.field} className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">{f.label}</label>
              {f.type === 'options' ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {f.options?.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setProfile({...profile, [f.field]: opt.id})}
                      className={`p-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${profile[f.field as keyof UserProfile] === opt.id ? 'bg-emerald-500 border-emerald-400 text-zinc-950 shadow-lg' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              ) : f.type === 'select' ? (
                <select 
                  value={(profile as any)[f.field]}
                  onChange={e => setProfile({...profile, [f.field]: e.target.value})}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                >
                  <option value="">Select Option</option>
                  {f.options?.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input 
                  type={f.type}
                  value={(profile as any)[f.field]}
                  onChange={e => setProfile({...profile, [f.field]: e.target.value})}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-emerald-500 outline-none placeholder:text-zinc-700 transition-all"
                  placeholder={f.placeholder}
                />
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-12 flex justify-between gap-4">
           {step > 0 && (
             <Button variant="ghost" onClick={() => setStep(step - 1)} className="px-8">Back</Button>
           )}
           <Button className="flex-1 h-14 text-lg font-black uppercase tracking-widest" onClick={next}>{step === steps.length - 1 ? 'Start Sync' : 'Continue'}</Button>
        </div>
      </div>
    </div>
  );
};

// --- Navigation Item Component ---
const NavIcon = ({ icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
  <button onClick={onClick} className="flex flex-col items-center gap-1.5 group outline-none">
    <div className={`p-2.5 rounded-2xl transition-all duration-300 flex items-center justify-center ${active ? 'bg-emerald-500 text-zinc-950 scale-110 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'text-zinc-500 group-hover:text-zinc-300 group-hover:bg-zinc-900/50'}`}>
       {React.cloneElement(icon, { size: 22, strokeWidth: active ? 2.5 : 2 })}
    </div>
    <span className={`text-[9px] font-black uppercase tracking-widest transition-colors ${active ? 'text-emerald-500' : 'text-zinc-600 group-hover:text-zinc-400'}`}>{label}</span>
  </button>
);

// --- App Layout ---
const AppLayout: React.FC<{ 
  children: React.ReactNode; 
  view: AppView; 
  setView: (v: AppView) => void; 
  userProfile: UserProfile | null 
}> = ({ children, view, setView, userProfile }) => (
  <div className="flex flex-col h-screen bg-[#050505] overflow-hidden">
    {/* Header */}
    <header className="h-16 md:h-20 border-b border-white/5 flex items-center justify-between px-6 md:px-12 shrink-0 bg-black/40 backdrop-blur-xl z-50">
       <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setView('dashboard')}>
          <div className="w-8 h-8 md:w-9 md:h-9 bg-emerald-500 rounded-xl flex items-center justify-center text-zinc-950 shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
             <Target size={20} strokeWidth={2.5} />
          </div>
          <span className="font-black text-lg md:text-xl tracking-tighter uppercase text-white group-hover:text-emerald-400 transition-colors">SkillSync <span className="text-emerald-500 text-[10px] font-mono">AI</span></span>
       </div>
       <div className="flex items-center gap-6">
          <div className="hidden sm:flex flex-col items-end">
             <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Market Status</span>
             <span className="text-emerald-500 font-bold text-xs flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> HIGH DEMAND</span>
          </div>
          <button className="p-2 text-zinc-400 hover:text-white transition-colors relative">
             <Bell size={20}/>
             <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
          </button>
       </div>
    </header>

    {/* Content Area - Scrollable */}
    <main className="flex-1 overflow-y-auto custom-scroll relative bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.03)_0%,transparent_50%)]">
      <div className="max-w-6xl mx-auto w-full p-6 md:p-12 pb-32 md:pb-32">
        {children}
      </div>
    </main>

    {/* Bottom Navigation Bar */}
    <nav className="fixed bottom-0 left-0 right-0 h-20 md:h-24 bg-zinc-950/80 backdrop-blur-2xl border-t border-white/5 flex items-center justify-around px-2 z-50 safe-bottom">
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

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (view === 'coach') scrollToBottom();
  }, [messages, isTyping, view]);

  const handleOnboardingComplete = async (profile: UserProfile) => {
    setUserProfile(profile);
    setLoading({ isActive: true, message: 'Synchronizing with career matrix...', error: null });
    try {
      const gaps = await analyzeSkillGap([], profile.goal);
      setSkills(gaps);
      setView('dashboard');
      setLoading({ isActive: false, message: '' });
    } catch (e: any) {
      setLoading({ isActive: true, message: '', error: e.message || "Failed to sync profile." });
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
      setMessages(prev => [...prev, { id: 'err', role: 'model', text: "Failed to connect to the brain. Check internet.", timestamp: Date.now(), isError: true }]);
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
        <div className="animate-fade-in space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div className="max-w-xl">
               <h1 className="text-4xl md:text-6xl font-black mb-3 tracking-tighter uppercase text-white leading-tight">Sync <span className="text-emerald-500">Active</span> 👋</h1>
               <p className="text-zinc-500 text-lg md:text-xl font-medium leading-relaxed">
                 Hello {userProfile?.name?.split(' ')[0] || 'User'}, your trajectory towards <span className="text-white font-black underline decoration-emerald-500/30 underline-offset-4">{userProfile?.goal}</span> is active.
               </p>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
               <div className="px-8 py-6 glass-panel rounded-[2.5rem] text-center border-emerald-500/20 shadow-xl">
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Employability</p>
                  <p className="text-3xl font-black text-emerald-400">82%</p>
               </div>
               <div className="px-8 py-6 glass-panel rounded-[2.5rem] text-center shadow-xl">
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Momentum</p>
                  <p className="text-3xl font-black text-white">4d</p>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Market Demand', val: 'Critical', icon: <TrendingUp className="text-emerald-400"/> },
              { label: 'Growth Delta', val: '+14.2%', icon: <Sparkles className="text-purple-400"/> },
              { label: 'Salary Target', val: '$132k', icon: <DollarSign className="text-blue-400"/> },
              { label: 'Industry Fit', val: 'Strong', icon: <Target className="text-orange-400"/> }
            ].map((stat, i) => (
              <div key={i} className="glass-panel p-8 rounded-[2.5rem] hover:border-emerald-500/30 transition-all flex flex-col gap-6 group">
                <div className="p-3 bg-zinc-950 rounded-2xl w-fit group-hover:scale-110 transition-transform">{stat.icon}</div>
                <div>
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className="text-3xl font-black text-white">{stat.val}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
             <div className="lg:col-span-2 space-y-10">
                <div className="glass-panel p-8 md:p-12 rounded-[3.5rem] relative overflow-hidden border border-emerald-500/10">
                   <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 blur-[120px] -z-10"></div>
                   <h3 className="text-2xl font-black mb-10 flex items-center gap-4 uppercase tracking-tighter text-white">
                     <Zap size={28} className="text-emerald-400 animate-pulse-slow fill-emerald-500/20"/> Priority Sync Task
                   </h3>
                   <div className="bg-zinc-950/60 border border-white/5 p-8 rounded-[3rem] flex flex-col md:flex-row items-center gap-12">
                      <div className="flex-1 text-center md:text-left">
                         <p className="text-zinc-400 text-lg md:text-xl leading-relaxed mb-10">
                           The current job market for <strong>{userProfile?.goal}</strong> has shifted 18% towards <span className="text-emerald-400 font-bold px-2 py-0.5 bg-emerald-500/10 rounded-lg italic">Multi-Modal AI Integration</span>.
                         </p>
                         <Button size="lg" icon={<ArrowRight size={22}/>} className="px-12 h-18 text-lg font-black tracking-widest uppercase shadow-2xl">Adapt Pathway</Button>
                      </div>
                      <div className="shrink-0 w-40 h-40 relative flex items-center justify-center">
                         <svg className="w-full h-full -rotate-90">
                           <circle cx="80" cy="80" r="70" className="fill-none stroke-zinc-900 stroke-[10]" />
                           <circle cx="80" cy="80" r="70" className="fill-none stroke-emerald-500 stroke-[10] shadow-[0_0_20px_rgba(16,185,129,0.3)]" strokeDasharray="440" strokeDashoffset="120" />
                         </svg>
                         <div className="absolute flex flex-col items-center">
                            <span className="font-black text-4xl text-emerald-400">72%</span>
                            <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Ready</span>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="glass-panel p-10 rounded-[3.5rem]">
                   <h3 className="text-2xl font-black mb-12 uppercase tracking-tighter text-white">Skill Matrix Snapshot</h3>
                   <div className="space-y-10">
                      {skills.slice(0, 4).map((s, i) => (
                        <div key={i} className="space-y-4">
                           <div className="flex justify-between items-end">
                              <span className="text-sm font-black uppercase tracking-widest text-zinc-400">{s.name}</span>
                              <span className="font-mono text-emerald-500 font-black text-lg">{s.level}%</span>
                           </div>
                           <div className="h-2.5 bg-zinc-950 rounded-full border border-white/5 overflow-hidden">
                              <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(16,185,129,0.5)]" style={{width: `${s.level}%`}}></div>
                           </div>
                        </div>
                      ))}
                   </div>
                   <Button variant="ghost" className="w-full mt-10 h-14 group">
                      Expand Full Analysis <ChevronRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                   </Button>
                </div>
             </div>

             <div className="space-y-8">
                <div className="p-10 bg-emerald-500/5 border border-emerald-500/20 rounded-[3.5rem] relative overflow-hidden group">
                   <div className="flex items-center gap-4 mb-8">
                      <div className="p-3 bg-emerald-500 rounded-2xl text-zinc-950 shadow-lg shadow-emerald-500/20"><MessageSquare size={22}/></div>
                      <p className="text-xs font-black text-emerald-400 uppercase tracking-[0.2em]">Coach Insight</p>
                   </div>
                   <p className="text-lg text-zinc-300 leading-relaxed font-medium mb-10 italic">
                     "Your Python trajectory is 32% ahead of benchmark. Accelerate into <span className="text-white font-black">Applied LLM Frameworks</span> now to trigger senior-level match signals."
                   </p>
                   <Button variant="outline" className="w-full h-14 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10" onClick={() => setView('coach')}>Open Sync Chat</Button>
                </div>

                <div className="glass-panel p-10 rounded-[3.5rem] border-white/5">
                   <h3 className="text-xl font-black mb-8 uppercase tracking-tighter text-white">Live Matches</h3>
                   <div className="space-y-6">
                      {[
                        { role: 'AI Architect', co: 'Nebula', match: 94 },
                        { role: 'Data Lead', co: 'Synth', match: 88 },
                        { role: 'Product Sync', co: 'Aura', match: 72 }
                      ].map((job, i) => (
                        <div key={i} className="flex items-center gap-4 p-5 bg-zinc-950/40 rounded-3xl border border-white/5 hover:border-emerald-500/40 transition-all cursor-pointer">
                           <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center text-emerald-500/50"><Briefcase size={24}/></div>
                           <div className="flex-1">
                              <p className="font-black text-white text-sm">{job.role}</p>
                              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">{job.co}</p>
                           </div>
                           <span className="text-emerald-500 font-black text-xs">{job.match}%</span>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}

      {view === 'coach' && (
        <div className="animate-fade-in flex flex-col h-[calc(100vh-16rem)] md:h-[calc(100vh-20rem)] max-w-4xl mx-auto relative bg-zinc-950/40 rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl">
          <div className="flex-1 overflow-y-auto space-y-10 p-6 md:p-10 scrollbar-hide custom-scroll">
             <div className="flex gap-5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-zinc-950 flex-shrink-0 shadow-lg shadow-emerald-500/20"><Bot size={24}/></div>
                <div className="bg-zinc-900 border border-white/5 p-7 rounded-[2.5rem] rounded-tl-none shadow-xl">
                   <p className="text-base text-zinc-200 leading-relaxed font-medium">
                      Sync established. I've mapped over 2M job data points for <strong>{userProfile?.goal || 'Your Target'}</strong>. 
                      What trajectory shift shall we analyze today?
                   </p>
                   <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { icon: <FileText size={16}/>, text: "Resume Critique" },
                        { icon: <Briefcase size={16}/>, text: "Mock Interview" },
                        { icon: <Lightbulb size={16}/>, text: "Skill Roadmap" },
                        { icon: <Target size={16}/>, text: "Salary Sync" }
                      ].map((chip, i) => (
                        <button key={i} onClick={() => handleSendMessage(chip.text)} className="flex items-center gap-3 p-4 bg-zinc-950/60 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-all text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-white group">
                           <span className="text-emerald-500/50 group-hover:text-emerald-500 transition-colors">{chip.icon}</span> {chip.text}
                        </button>
                      ))}
                   </div>
                </div>
             </div>

             {messages.map((m) => (
               <div key={m.id} className={`flex gap-5 ${m.role === 'user' ? 'flex-row-reverse' : ''} animate-slide-up`}>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg
                    ${m.role === 'user' ? 'bg-zinc-800 text-emerald-400' : 'bg-emerald-500 text-zinc-950'}`}>
                    {m.role === 'user' ? <User size={24} /> : <Bot size={24} />}
                  </div>
                  <div className={`p-7 rounded-[2.5rem] max-w-[85%] md:max-w-[75%] border shadow-2xl transition-all
                    ${m.role === 'user' 
                      ? 'bg-emerald-500 text-zinc-950 border-emerald-400 rounded-tr-none font-black' 
                      : m.isError 
                        ? 'bg-red-500/10 border-red-500/50 rounded-tl-none text-red-200'
                        : 'bg-zinc-900/80 border-zinc-800 rounded-tl-none text-zinc-200 leading-relaxed font-medium'}`}>
                    <p>{m.text}</p>
                    <div className={`mt-3 text-[9px] uppercase font-black tracking-widest ${m.role === 'user' ? 'text-zinc-900/30' : 'text-zinc-600'}`}>
                       {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
               </div>
             ))}

             {isTyping && (
               <div className="flex gap-5 animate-pulse">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0"><Bot size={24}/></div>
                  <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-[2.5rem] rounded-tl-none flex items-center gap-2">
                     <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></div>
                     <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce delay-150"></div>
                     <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce delay-300"></div>
                  </div>
               </div>
             )}
             <div ref={chatEndRef} />
          </div>

          <div className="p-6 md:p-8 shrink-0 bg-black/40 backdrop-blur-xl border-t border-white/5">
            <div className="flex gap-4 bg-zinc-900 border border-white/10 p-2.5 rounded-[2.5rem] items-center shadow-2xl focus-within:border-emerald-500/50 transition-all">
               <button className="p-3 text-zinc-500 hover:text-emerald-400 transition-colors"><Mic size={22}/></button>
               <input 
                type="text" 
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                placeholder="Talk to your Coach..." 
                className="flex-1 bg-transparent border-none text-base focus:ring-0 px-2 py-3 placeholder:text-zinc-700 text-white font-medium"
              />
              <button 
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim() || isTyping}
                className="w-14 h-14 bg-emerald-500 text-zinc-950 rounded-[1.6rem] hover:bg-emerald-400 transition-all active:scale-90 flex items-center justify-center shadow-xl shadow-emerald-500/20 disabled:opacity-50"
              >
                <Send size={24} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Generic Placeholder for other views */}
      {(view === 'skills' || view === 'pathway' || view === 'settings') && (
        <div className="animate-fade-in flex flex-col items-center justify-center py-24 text-center space-y-12">
           <div className="p-20 rounded-[4rem] bg-emerald-500/[0.04] text-emerald-500/30 border border-emerald-500/10 shadow-2xl animate-float">
              <Sparkles size={120} />
           </div>
           <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white">Synthesizing {view}</h2>
              <p className="text-zinc-500 max-w-lg mx-auto text-xl leading-relaxed font-medium">Your personalized career roadmap for this module is being calibrated based on current market coefficients.</p>
           </div>
           <Button size="lg" variant="outline" className="px-16 h-18 text-lg font-black tracking-widest uppercase rounded-2xl border-zinc-800 hover:border-emerald-500/50" onClick={() => setView('dashboard')}>Command Center</Button>
        </div>
      )}

      {/* Global Loading Overlay */}
      {loading.isActive && (
        <div className="fixed inset-0 z-[1200] bg-black/98 backdrop-blur-3xl flex flex-col items-center justify-center animate-fade-in p-10">
           {!loading.error ? (
             <>
               <div className="relative w-36 h-36 mb-16">
                  <div className="absolute inset-0 border-[10px] border-emerald-500/10 rounded-full"></div>
                  <div className="absolute inset-0 border-[10px] border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-emerald-500"><Zap size={56} className="animate-pulse" /></div>
               </div>
               <p className="text-emerald-400 font-black tracking-[0.8em] uppercase animate-pulse text-2xl text-center">{loading.message}</p>
             </>
           ) : (
             <div className="max-w-md w-full glass-panel p-12 rounded-[4rem] text-center border-red-500/20 shadow-[0_0_80px_rgba(239,68,68,0.1)]">
                <div className="w-24 h-24 bg-red-500/10 text-red-500 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-xl"><AlertCircle size={48} /></div>
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-6">Sync Error</h3>
                <p className="text-zinc-500 mb-12 leading-relaxed font-medium text-lg">{loading.error}</p>
                <Button size="lg" className="w-full h-16 bg-red-600 hover:bg-red-500 rounded-2xl font-black uppercase tracking-widest" onClick={() => userProfile && handleOnboardingComplete(userProfile)} icon={<RefreshCw size={24}/>}>Retry Sync</Button>
                <button onClick={() => setLoading({ isActive: false, message: '', error: null })} className="mt-8 text-zinc-500 font-bold hover:text-white transition-colors text-sm uppercase tracking-[0.3em]">Cancel</button>
             </div>
           )}
        </div>
      )}
    </AppLayout>
  );
}
