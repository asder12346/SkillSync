
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Zap, BarChart3, Search, Target, MessageSquare, 
  Bell, CheckCircle2, Clock, Award, Sparkles, Send, 
  Bot, User, TrendingUp, BrainCircuit, X, Menu, 
  Globe, ArrowRight, ArrowLeft, ChevronRight, GraduationCap,
  Briefcase, Heart, BookOpen, Settings, Layout, Users, Star,
  DollarSign, ShieldCheck, Mail, RefreshCcw, AlertCircle,
  FileText, Mic, Video, Lightbulb
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
        return prev + 2;
      });
    }, 25);
    return () => clearInterval(interval);
  }, [onFinished]);

  return (
    <div className="fixed inset-0 z-[1000] bg-[#050505] flex flex-col items-center justify-center">
      <div className="relative mb-8 animate-float">
        <div className="w-24 h-24 bg-emerald-500 rounded-[2rem] flex items-center justify-center text-zinc-950 shadow-[0_0_50px_rgba(16,185,129,0.4)]">
          <Target size={52} strokeWidth={2.5} />
        </div>
        <div className="absolute -inset-4 border border-emerald-500/20 rounded-[2.5rem] animate-pulse"></div>
      </div>
      <h1 className="text-3xl font-black tracking-tighter uppercase text-white mb-2">SkillSync <span className="text-emerald-500">AI</span></h1>
      <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.4em] mb-12">Initializing Career Matrix</p>
      
      <div className="w-72 h-1.5 bg-zinc-900 rounded-full overflow-hidden relative border border-white/5">
        <div 
          className="h-full bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.6)] transition-all duration-150 ease-out" 
          style={{ width: `${percent}%` }}
        ></div>
      </div>
      <div className="mt-4 font-mono text-[10px] text-emerald-500 font-bold uppercase tracking-widest">{percent}% Synced</div>
    </div>
  );
};

// --- Types for Onboarding ---
interface OnboardingField {
  label: string;
  field: string;
  type: string;
  placeholder?: string;
  required: boolean;
  options?: any[];
  min?: number;
  max?: number;
}

interface OnboardingStep {
  id: string;
  title: string;
  subtitle: string;
  fields: OnboardingField[];
}

// --- Multi-Step Onboarding with Real-time Validation ---
const OnboardingWizard = ({ onComplete }: { onComplete: (profile: UserProfile) => void }) => {
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  
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

  const steps: OnboardingStep[] = [
    { 
      id: 'Profile',
      title: "Tell us about yourself", 
      subtitle: "The basics to help us build your personalization engine.",
      fields: [
        { label: 'Full Name', field: 'name', type: 'text', placeholder: 'Alex Chen', required: true },
        { label: 'Email Address', field: 'email', type: 'email', placeholder: 'alex@example.com', required: true }
      ]
    },
    { 
      id: 'Background',
      title: "Professional DNA", 
      subtitle: "Detailed background allows AI to find the perfect starting point.",
      fields: [
        { label: 'Current Role / Major', field: 'currentRole', type: 'text', placeholder: 'e.g. CS Student', required: true },
        { label: 'Highest Education', field: 'education', type: 'select', options: ['High School', 'Bachelors', 'Masters', 'PhD', 'Bootcamp'], required: true },
        { label: 'Years of Experience', field: 'yearsOfExp', type: 'number', placeholder: '0', required: true },
        { label: 'Current Industry', field: 'industry', type: 'text', placeholder: 'e.g. Tech, Retail', required: true }
      ]
    },
    { 
      id: 'Ambition',
      title: "Your North Star", 
      subtitle: "What specific role are you synchronizing with?",
      fields: [
        { label: 'Target Job Title', field: 'goal', type: 'text', placeholder: 'e.g. Senior Data Scientist', required: true },
        { label: 'Career Level', field: 'experienceLevel', type: 'options', options: [
          { id: 'entry', label: 'Entry Level' },
          { id: 'mid', label: 'Mid Level' },
          { id: 'senior', label: 'Senior Level' }
        ], required: true }
      ]
    },
    { 
      id: 'Flow',
      title: "Learning Flow", 
      subtitle: "How much time can you invest in your career sync?",
      fields: [
        { label: 'Availability (Hours/Week)', field: 'timeAvailability', type: 'range', min: 2, max: 40, required: true },
        { label: 'Preferred Style', field: 'learningStyle', type: 'options', options: [
          { id: 'practical', label: 'Hands-on Projects' },
          { id: 'visual', label: 'Video Courses' },
          { id: 'reading', label: 'Documentation' }
        ], required: true }
      ]
    }
  ];

  const currentStepData = steps[step];

  const validateField = useCallback((field: string, value: any) => {
    let error = "";
    const allFields = steps.flatMap(s => s.fields);
    const fieldData = allFields.find(f => f.field === field);
    
    if (fieldData?.required && (!value || value.toString().trim() === '')) {
      error = `${fieldData.label} is required`;
    } else if (fieldData?.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      error = 'Invalid email address';
    } else if (fieldData?.type === 'number' && value && isNaN(Number(value))) {
      error = 'Must be a number';
    }
    
    setErrors(prev => ({ ...prev, [field]: error }));
    return error === "";
  }, [steps]);

  const updateField = (field: string, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    if (touched[field]) {
      validateField(field, value);
    }
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, (profile as any)[field]);
  };

  const next = () => {
    let isValid = true;
    currentStepData.fields.forEach((f: OnboardingField) => {
      const fieldValid = validateField(f.field, (profile as any)[f.field]);
      if (!fieldValid) isValid = false;
      setTouched(prev => ({ ...prev, [f.field]: true }));
    });

    if (isValid) {
      if (step < steps.length - 1) setStep(step + 1);
      else onComplete(profile);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden overflow-y-auto">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(16,185,129,0.05)_0,transparent_60%)]"></div>
      
      <div className="max-w-2xl w-full glass-panel p-8 md:p-12 rounded-[3rem] relative z-10 animate-slide-up border border-white/10 shadow-2xl my-8">
        
        <div className="mb-14 px-2">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-zinc-800 z-0"></div>
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-emerald-500 z-0 transition-all duration-700 ease-in-out" 
              style={{ width: `${(step / (steps.length - 1)) * 100}%` }}
            ></div>

            {steps.map((s, i) => (
              <div key={s.id} className="flex flex-col items-center relative z-10 group">
                <div 
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-black transition-all duration-500 ${
                    i < step 
                      ? 'bg-emerald-500 text-zinc-950 shadow-[0_0_15px_rgba(16,185,129,0.4)]' 
                      : i === step 
                        ? 'bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]' 
                        : 'bg-zinc-900 text-zinc-600 border border-white/5 group-hover:border-zinc-700'
                  }`}
                >
                  {i < step ? <CheckCircle2 size={20} /> : i + 1}
                </div>
                <div className={`absolute -bottom-8 whitespace-nowrap text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-300 ${i === step ? 'text-emerald-400' : 'text-zinc-600'}`}>
                  {s.id}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <h2 className="text-3xl md:text-4xl font-black mb-2 text-white tracking-tight">{currentStepData.title}</h2>
          <p className="text-zinc-500 mb-10 text-base md:text-lg leading-relaxed">{currentStepData.subtitle}</p>

          <div className="space-y-8">
            {currentStepData.fields.map((f: OnboardingField) => (
              <div key={f.field} className="space-y-3 relative">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-black text-zinc-500 uppercase tracking-widest">{f.label}</label>
                  {touched[f.field] && errors[f.field] && (
                    <span className="text-[10px] font-bold text-red-500 uppercase flex items-center gap-1.5 animate-fade-in">
                      <AlertCircle size={12} /> {errors[f.field]}
                    </span>
                  )}
                </div>
                
                {f.type === 'text' || f.type === 'email' || f.type === 'number' ? (
                  <input 
                    type={f.type}
                    value={(profile as any)[f.field]}
                    onChange={(e) => updateField(f.field, e.target.value)}
                    onBlur={() => handleBlur(f.field)}
                    placeholder={f.placeholder}
                    className={`w-full bg-zinc-950 border rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all duration-200 placeholder:text-zinc-700 ${
                      touched[f.field] && errors[f.field] ? 'border-red-500/50 bg-red-500/5' : 'border-zinc-800 hover:border-zinc-700'
                    }`}
                  />
                ) : f.type === 'select' ? (
                  <select 
                    value={(profile as any)[f.field]}
                    onChange={(e) => updateField(f.field, e.target.value)}
                    onBlur={() => handleBlur(f.field)}
                    className={`w-full bg-zinc-950 border rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-emerald-500 outline-none appearance-none cursor-pointer transition-all ${
                      touched[f.field] && errors[f.field] ? 'border-red-500/50 bg-red-500/5' : 'border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <option value="" disabled className="text-zinc-500">Select Option</option>
                    {f.options?.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                ) : f.type === 'options' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {f.options?.map((opt: any) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => updateField(f.field, opt.id)}
                        className={`p-4 rounded-2xl border font-bold text-sm transition-all duration-300 ${
                          profile[f.field as keyof UserProfile] === opt.id 
                            ? 'bg-emerald-500 border-emerald-400 text-zinc-950 shadow-[0_0_20px_rgba(16,185,129,0.3)]' 
                            : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                ) : f.type === 'range' ? (
                  <div className="flex flex-col gap-6 p-4 bg-zinc-950/50 rounded-2xl border border-white/5">
                    <input 
                      type="range" min={f.min} max={f.max}
                      value={(profile as any)[f.field]}
                      onChange={(e) => updateField(f.field, e.target.value)}
                      className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                    <div className="flex justify-between items-center px-2">
                       <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{f.min} HRS</span>
                       <div className="text-center">
                          <span className="text-emerald-500 font-black text-3xl">{(profile as any)[f.field]}</span>
                          <span className="ml-2 text-zinc-500 text-xs font-bold uppercase">HRS/WEEK</span>
                       </div>
                       <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{f.max} HRS</span>
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          <div className="mt-16 flex justify-between items-center pt-8 border-t border-white/5">
            <button 
              type="button"
              onClick={() => setStep(prev => prev - 1)}
              disabled={step === 0}
              className="flex items-center gap-2 text-zinc-500 font-bold hover:text-white disabled:opacity-0 transition-all px-4 py-2"
            >
              <ArrowLeft size={18} /> Back
            </button>
            <Button size="lg" onClick={next} className="px-12 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              {step === steps.length - 1 ? 'Start Your Journey' : 'Next Step'} <ChevronRight size={18} className="ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const NavItem = ({ icon, label, target, active, setView }: { icon: any, label: string, target: AppView, active: boolean, setView: (v: AppView) => void }) => (
  <button 
    onClick={() => setView(target)}
    className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl font-bold text-sm transition-all ${active ? 'bg-emerald-500/10 text-emerald-400' : 'text-zinc-500 hover:bg-zinc-900/50 hover:text-zinc-300'}`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const AppLayout: React.FC<{ 
  children: React.ReactNode; 
  view: AppView; 
  setView: (v: AppView) => void; 
  userProfile: UserProfile | null 
}> = ({ children, view, setView, userProfile }) => (
  <div className="flex h-screen overflow-hidden bg-[#050505]">
    {/* Sidebar */}
    <aside className="w-72 border-r border-white/5 bg-zinc-950 flex flex-col p-6 overflow-y-auto scrollbar-hide shrink-0">
      <div className="flex items-center gap-3 mb-12 px-2 cursor-pointer group" onClick={() => setView('landing')}>
        <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-zinc-950 shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
          <Target size={24} strokeWidth={2.5} />
        </div>
        <span className="font-black text-2xl tracking-tighter uppercase text-white">SkillSync <span className="text-emerald-500 text-xs font-mono">AI</span></span>
      </div>

      <div className="space-y-1 flex-1">
        <p className="px-4 text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-4">Core Platform</p>
        <NavItem icon={<Layout size={18}/>} label="Dashboard" target="dashboard" active={view === 'dashboard'} setView={setView} />
        <NavItem icon={<BarChart3 size={18}/>} label="Skill Gap" target="skills" active={view === 'skills'} setView={setView} />
        <NavItem icon={<Zap size={18}/>} label="Career Path" target="pathway" active={view === 'pathway'} setView={setView} />
        <NavItem icon={<TrendingUp size={18}/>} label="Job Insights" target="market" active={view === 'market'} setView={setView} />
        
        <div className="h-10"></div>
        
        <p className="px-4 text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-4">Growth Tools</p>
        <NavItem icon={<MessageSquare size={18}/>} label="Career Coach" target="coach" active={view === 'coach'} setView={setView} />
        <NavItem icon={<Briefcase size={18}/>} label="Opportunity Match" target="matching" active={view === 'matching'} setView={setView} />
        <NavItem icon={<Award size={18}/>} label="Project Portfolio" target="portfolio" active={view === 'portfolio'} setView={setView} />
      </div>

      <div className="mt-10 pt-6 border-t border-white/5">
         <NavItem icon={<Settings size={18}/>} label="Preferences" target="settings" active={view === 'settings'} setView={setView} />
         <div className="mt-6 p-4 rounded-2xl bg-zinc-900/50 border border-white/5 group hover:border-emerald-500/30 transition-all cursor-pointer">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500 transition-all group-hover:text-zinc-950 text-emerald-400"><User size={20}/></div>
               <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-white truncate">{userProfile?.name || 'User Profile'}</p>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">{userProfile?.experienceLevel} Analyst</p>
               </div>
            </div>
         </div>
      </div>
    </aside>

    {/* Main Content Area */}
    <main className="flex-1 flex flex-col bg-[#050505] relative h-full">
      <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 sticky top-0 bg-black/60 backdrop-blur-xl z-30 shrink-0">
         <h2 className="text-xs font-black text-zinc-500 uppercase tracking-[0.4em]">{view.replace('_', ' ')}</h2>
         <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-4 bg-zinc-900/50 px-4 py-2 rounded-full border border-white/5">
              <span className="text-[10px] font-black text-zinc-500 uppercase">Ready Score:</span>
              <span className="text-emerald-500 font-mono font-bold">82%</span>
            </div>
            <button className="p-2 text-zinc-400 hover:text-white relative transition-colors"><Bell size={20}/><span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span></button>
            <Button size="sm" variant="outline" className="text-xs border-emerald-500/20 hover:bg-emerald-500/10 text-emerald-400">Upgrade to Pro</Button>
         </div>
      </header>
      
      {/* Scrollable Content Wrapper */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="max-w-6xl mx-auto w-full px-6 md:px-12 py-10">
          {children}
        </div>
      </div>
    </main>
  </div>
);

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [view, setView] = useState<AppView>('landing');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [pathway, setPathway] = useState<CareerPathway | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState<LoadingState>({ isActive: false, message: '' });
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (view === 'coach') {
      scrollToBottom();
    }
  }, [messages, isTyping, view]);

  const handleOnboardingComplete = async (profile: UserProfile) => {
    setUserProfile(profile);
    setLoading({ isActive: true, message: 'Synchronizing with global job markets...' });
    try {
      const path = await generateCareerPathway(profile.goal, `${profile.currentRole}, ${profile.industry}`);
      const gaps = await analyzeSkillGap([], profile.goal);
      setPathway(path);
      setSkills(gaps);
      setView('dashboard');
    } catch (e) {
      console.error(e);
      setView('dashboard');
    } finally {
      setLoading({ isActive: false, message: '' });
    }
  };

  const handleSendMessage = async (customMessage?: string) => {
    const textToSend = customMessage || inputText;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = { 
      id: Date.now().toString(), 
      role: 'user', 
      text: textToSend, 
      timestamp: Date.now() 
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await getCareerAdvice([], textToSend);
      const modelMsg: ChatMessage = { 
        id: (Date.now() + 1).toString(), 
        role: 'model', 
        text: response, 
        timestamp: Date.now() 
      };
      setMessages(prev => [...prev, modelMsg]);
    } catch (e) {
      console.error(e);
      const errorMsg: ChatMessage = { 
        id: (Date.now() + 1).toString(), 
        role: 'model', 
        text: "I'm having trouble connecting to the matrix right now. Please try again in a moment.", 
        timestamp: Date.now() 
      };
      setMessages(prev => [...prev, errorMsg]);
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
        <div className="animate-fade-in space-y-12 pb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-black mb-3 tracking-tight">Sync Status: <span className="text-emerald-500">Active</span> 👋</h1>
              <p className="text-zinc-500 text-lg">Hello {userProfile?.name?.split(' ')[0] || 'User'}, your {userProfile?.goal} trajectory is trending <span className="text-emerald-400 font-bold">Upward</span>.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="px-8 py-5 glass-panel rounded-3xl text-center border-emerald-500/20">
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Employability</p>
                  <p className="text-3xl font-black text-emerald-400">82%</p>
               </div>
               <div className="px-8 py-5 glass-panel rounded-3xl text-center">
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Time Invested</p>
                  <p className="text-3xl font-black text-white">24h</p>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Demand', val: 'Critical', icon: <TrendingUp className="text-emerald-400"/>, desc: 'Highest in 12 months' },
              { label: 'Market Growth', val: '+14.2%', icon: <Sparkles className="text-purple-400"/>, desc: 'Trending globally' },
              { label: 'Base Comp', val: '$124k', icon: <DollarSign className="text-blue-400"/>, desc: 'Average starting' },
              { label: 'Momentum', val: '8 days', icon: <Zap className="text-orange-400"/>, desc: 'Daily streak' }
            ].map((stat, i) => (
              <div key={i} className="glass-panel p-8 rounded-[2.5rem] border border-white/5 hover:border-emerald-500/30 transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">{stat.icon}</div>
                <div className="p-3 bg-zinc-950 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform shadow-lg">{stat.icon}</div>
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                <p className="text-2xl font-black text-white">{stat.val}</p>
                <p className="mt-2 text-[10px] font-bold text-zinc-600 uppercase tracking-tight">{stat.desc}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-10">
               <div className="glass-panel p-10 rounded-[3rem] relative overflow-hidden border border-emerald-500/10">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 blur-[100px] -z-10"></div>
                  <h3 className="text-2xl font-black mb-8 flex items-center gap-3 uppercase tracking-tighter text-white">
                    <Zap size={24} className="text-emerald-400 fill-emerald-400/20"/> Priority Sync Action
                  </h3>
                  <div className="bg-zinc-950/80 border border-white/5 p-8 rounded-[2rem] flex flex-col md:flex-row items-center gap-10">
                     <div className="flex-1 text-center md:text-left">
                        <p className="text-zinc-400 text-lg leading-relaxed mb-8">
                          Market analysis indicates a sharp rise in <span className="text-emerald-400 font-black px-2 py-0.5 bg-emerald-400/10 rounded-lg">Multi-Modal AI Integration</span> demand for {userProfile?.goal} roles.
                        </p>
                        <Button size="lg" icon={<ArrowRight size={20}/>} className="px-10">Sync This Skill Now</Button>
                     </div>
                     <div className="shrink-0">
                        <div className="w-40 h-40 relative flex items-center justify-center">
                          <svg className="w-full h-full -rotate-90">
                            <circle cx="80" cy="80" r="70" className="fill-none stroke-zinc-900 stroke-[8]" />
                            <circle cx="80" cy="80" r="70" className="fill-none stroke-emerald-500 stroke-[8] transition-all duration-1000" strokeDasharray="440" strokeDashoffset="320" />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="font-black text-3xl text-emerald-400">14%</span>
                            <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">IMPACT</span>
                          </div>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="glass-panel p-10 rounded-[3rem]">
                  <h3 className="text-2xl font-black mb-10 uppercase tracking-tighter text-white">Skill Sync Velocity</h3>
                  <div className="space-y-8">
                    {skills.slice(0, 5).map((s, i) => (
                      <div key={i} className="space-y-3">
                        <div className="flex justify-between items-end">
                          <span className="text-sm font-black uppercase tracking-widest text-zinc-400">{s.name}</span>
                          <span className="font-mono text-emerald-500 font-bold">{s.level}%</span>
                        </div>
                        <div className="h-2 bg-zinc-950 rounded-full overflow-hidden border border-white/5">
                          <div 
                            className="h-full bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all duration-1000" 
                            style={{width: `${s.level}%`}}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="ghost" size="sm" className="mt-8 w-full text-zinc-500 hover:text-emerald-400">View Full Competency Map <ChevronRight size={14}/></Button>
               </div>
            </div>

            <div className="space-y-10">
               <div className="glass-panel p-10 rounded-[3rem]">
                  <h3 className="text-xl font-black mb-8 uppercase tracking-tighter text-white">Live Opportunities</h3>
                  <div className="space-y-5">
                     {[
                       { title: 'AI Research Lead', co: 'DeepScale', pay: '$185k', match: 96 },
                       { title: 'Fullstack Sync Lead', co: 'Nexus Lab', pay: '$150k', match: 89 },
                       { title: 'Lead Product Strategist', co: 'Aura', pay: '$140k', match: 72 }
                     ].map((job, i) => (
                       <div key={i} className="p-6 bg-zinc-950 border border-white/5 rounded-2xl hover:border-emerald-500/40 cursor-pointer transition-all hover:-translate-y-1">
                          <p className="font-black text-base text-white mb-1">{job.title}</p>
                          <p className="text-[10px] text-zinc-500 font-bold uppercase mb-4 tracking-widest">{job.co} • {job.pay}</p>
                          <div className="flex justify-between items-center">
                             <div className="h-1.5 w-24 bg-zinc-900 rounded-full overflow-hidden">
                               <div className="h-full bg-emerald-500" style={{width: `${job.match}%`}}></div>
                             </div>
                             <span className="text-xs font-black text-emerald-400">{job.match}% MATCH</span>
                          </div>
                       </div>
                     ))}
                  </div>
                  <Button variant="outline" size="md" className="w-full mt-10 border-zinc-800">Explore Market Board</Button>
               </div>

               <div className="p-10 bg-emerald-500/10 border border-emerald-500/20 rounded-[3rem] relative overflow-hidden group">
                  <Bot size={60} className="absolute -bottom-6 -right-6 text-emerald-500/5 rotate-12 group-hover:rotate-0 transition-transform duration-500" />
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-emerald-500 rounded-lg text-zinc-950"><MessageSquare size={16}/></div>
                    <p className="text-xs font-black text-emerald-400 uppercase tracking-widest">Career Coach Insight</p>
                  </div>
                  <p className="text-sm text-zinc-400 leading-relaxed font-medium">
                    "I noticed you're progressing quickly on system design. You should consider adding a 'Distrubuted Systems' project to your portfolio this week to unlock <span className="text-white">Senior</span> matching roles."
                  </p>
               </div>
            </div>
          </div>
        </div>
      )}

      {view === 'skills' && (
        <div className="animate-fade-in space-y-12 pb-20">
          <div className="flex justify-between items-center mb-10">
             <h1 className="text-4xl font-black tracking-tighter text-white">Skill Matrix Analysis</h1>
             <Button size="sm" variant="outline" icon={<RefreshCcw size={16}/>}>Sync Market Data</Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="glass-panel p-10 md:p-14 rounded-[3.5rem]">
               <h3 className="text-xl font-black mb-12 uppercase tracking-widest text-zinc-500">Industry Gap Heatmap</h3>
               <div className="space-y-14">
                  {skills.map((s, i) => (
                    <div key={i} className="space-y-4">
                       <div className="flex justify-between items-end">
                          <span className="font-black text-lg text-white tracking-tight">{s.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-emerald-500 font-bold">{s.level}%</span>
                            <span className="text-zinc-700 text-xs">/ {s.targetLevel}%</span>
                          </div>
                       </div>
                       <div className="h-4 bg-zinc-950 rounded-full border border-white/5 p-1 relative overflow-hidden">
                          <div className="absolute inset-y-0 left-0 bg-emerald-500/5 border-r border-emerald-500/20" style={{width: `${s.targetLevel}%`}}></div>
                          <div className="h-full bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all duration-1000" style={{width: `${s.level}%`}}></div>
                       </div>
                       <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] flex items-center gap-2">
                         <div className={`w-1.5 h-1.5 rounded-full ${s.category === 'technical' ? 'bg-blue-500' : 'bg-orange-500'}`}></div>
                         {s.category} competence required
                       </p>
                    </div>
                  ))}
               </div>
            </div>

            <div className="space-y-10">
               <div className="glass-panel p-14 rounded-[3.5rem] text-center border-emerald-500/10">
                  <div className="w-56 h-56 mx-auto mb-10 relative flex items-center justify-center">
                     <div className="absolute inset-0 border-[10px] border-zinc-900 rounded-full opacity-50"></div>
                     <div className="absolute inset-0 border-[10px] border-emerald-500 rounded-full border-t-transparent animate-[spin_4s_linear_infinite]"></div>
                     <BrainCircuit size={80} className="text-emerald-500" />
                     <div className="absolute -top-2 -right-2 p-4 bg-emerald-500 text-zinc-950 rounded-3xl shadow-xl shadow-emerald-500/20 font-black text-xl">42%</div>
                  </div>
                  <h4 className="text-3xl font-black mb-4 text-white uppercase tracking-tighter">Readiness Score</h4>
                  <p className="text-zinc-500 text-lg leading-relaxed max-w-sm mx-auto">
                    You've synthesized <span className="text-white font-bold">3 of 8</span> critical market signals. Aim for <span className="text-emerald-400 font-bold">75%</span> to trigger employer outreach.
                  </p>
               </div>

               <div className="p-10 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 border border-blue-500/20 rounded-[3rem] group">
                  <h4 className="font-black text-blue-400 mb-6 uppercase tracking-[0.2em] flex items-center gap-3">
                    <Award size={24}/> Accelerator Path
                  </h4>
                  <p className="text-zinc-400 text-base leading-relaxed mb-8">
                    Your deep understanding of <span className="text-white font-bold">{skills[0]?.name}</span> maps directly to the <span className="text-blue-400 font-bold">Google Cloud AI Engineer</span> certification path.
                  </p>
                  <Button size="lg" variant="outline" className="w-full border-blue-500/30 group-hover:bg-blue-500/20 text-blue-300">Start Fast-Track Path</Button>
               </div>
            </div>
          </div>
        </div>
      )}

      {view === 'coach' && (
        <div className="animate-fade-in flex flex-col h-[calc(100vh-14rem)] max-w-5xl mx-auto pb-6 relative">
          <div className="flex-1 overflow-y-auto space-y-10 p-6 scrollbar-hide">
             {/* Initial Coach Greeting */}
             <div className="flex gap-5">
                <div className="w-12 h-12 rounded-[1.2rem] bg-emerald-500 flex items-center justify-center text-zinc-950 flex-shrink-0 shadow-lg shadow-emerald-500/20"><Bot size={24}/></div>
                <div className="bg-zinc-900/80 border border-white/5 p-7 rounded-[2.5rem] rounded-tl-none max-w-[85%] shadow-xl backdrop-blur-md">
                   <p className="text-base text-zinc-300 leading-relaxed">
                      Sync confirmed, {userProfile?.name?.split(' ')[0]}. I've synthesized over 1.2M recent market signals for <strong>{userProfile?.goal}</strong> roles. 
                      I can help you with:
                   </p>
                   <ul className="mt-4 space-y-2 text-zinc-400 text-sm">
                      <li className="flex items-center gap-2"><Check size={14} className="text-emerald-500"/> Personalized Resume Feedback</li>
                      <li className="flex items-center gap-2"><Check size={14} className="text-emerald-500"/> Mock Interview Simulations</li>
                      <li className="flex items-center gap-2"><Check size={14} className="text-emerald-500"/> Technical Skill Explanations</li>
                      <li className="flex items-center gap-2"><Check size={14} className="text-emerald-500"/> Salary Negotiation Strategies</li>
                   </ul>
                </div>
             </div>

             {messages.map((m) => (
               <div key={m.id} className={`flex gap-5 ${m.role === 'user' ? 'flex-row-reverse' : ''} animate-slide-up`}>
                  <div className={`w-12 h-12 rounded-[1.2rem] flex items-center justify-center flex-shrink-0 transition-transform hover:scale-105 shadow-lg
                    ${m.role === 'user' ? 'bg-zinc-800 text-emerald-400' : 'bg-emerald-500 text-zinc-950 shadow-emerald-500/10'}`}>
                    {m.role === 'user' ? <User size={24} /> : <Bot size={24} />}
                  </div>
                  <div className={`p-7 rounded-[2.5rem] max-w-[85%] border shadow-xl transition-all
                    ${m.role === 'user' 
                      ? 'bg-emerald-500 text-zinc-950 border-emerald-400 rounded-tr-none font-bold' 
                      : 'bg-zinc-900/80 backdrop-blur-md border-zinc-800 rounded-tl-none text-zinc-200 leading-relaxed'}`}>
                    <p className="text-base">{m.text}</p>
                    <div className={`mt-2 text-[10px] uppercase font-black tracking-widest ${m.role === 'user' ? 'text-zinc-900/40' : 'text-zinc-600'}`}>
                       {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
               </div>
             ))}

             {isTyping && (
               <div className="flex gap-5 animate-pulse">
                  <div className="w-12 h-12 rounded-[1.2rem] bg-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0"><Bot size={24}/></div>
                  <div className="bg-zinc-900/50 border border-white/5 p-7 rounded-[2.5rem] rounded-tl-none flex items-center gap-2">
                     <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></div>
                     <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce delay-75"></div>
                     <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce delay-150"></div>
                  </div>
               </div>
             )}
             <div ref={chatEndRef} />
          </div>

          {/* Quick Suggestions */}
          <div className="px-6 mb-4 overflow-x-auto scrollbar-hide flex gap-3">
             {[
               { icon: <FileText size={14}/>, text: "Review my resume" },
               { icon: <Video size={14}/>, text: "Mock interview for "+userProfile?.goal },
               { icon: <Lightbulb size={14}/>, text: "Explain career growth" },
               { icon: <Target size={14}/>, text: "Analyze market demand" }
             ].map((suggestion, i) => (
               <button 
                 key={i} 
                 onClick={() => handleSendMessage(suggestion.text)}
                 className="whitespace-nowrap flex items-center gap-2 px-4 py-2 bg-zinc-900/50 border border-white/5 rounded-full text-xs font-bold text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-all hover:-translate-y-0.5"
               >
                 {suggestion.icon}
                 {suggestion.text}
               </button>
             ))}
          </div>

          {/* Input Area */}
          <div className="px-6">
            <div className="flex gap-4 bg-zinc-900 border border-white/10 p-3 rounded-[3rem] items-center shadow-2xl focus-within:border-emerald-500/50 transition-all focus-within:ring-4 focus-within:ring-emerald-500/5 backdrop-blur-xl">
               <button className="p-3 text-zinc-500 hover:text-emerald-400 transition-colors"><Mic size={20}/></button>
               <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask anything about your career..." 
                className="flex-1 bg-transparent border-none text-base focus:ring-0 px-2 py-4 placeholder:text-zinc-600 text-white"
              />
              <button 
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim() || isTyping}
                className="w-14 h-14 bg-emerald-500 text-zinc-950 rounded-[1.8rem] hover:bg-emerald-400 transition-all active:scale-95 flex items-center justify-center shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <Send size={24} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Placeholder Views */}
      {(view === 'pathway' || view === 'market' || view === 'portfolio' || view === 'matching' || view === 'settings') && (
        <div className="animate-fade-in flex flex-col items-center justify-center h-[60vh] text-center space-y-10">
           <div className="p-12 rounded-[3rem] bg-emerald-500/5 text-emerald-500/40 border border-emerald-500/10 shadow-2xl animate-float">
              <Sparkles size={100} />
           </div>
           <div className="space-y-4">
              <h2 className="text-4xl font-black uppercase tracking-tighter text-white">Synthesizing {view.replace('_', ' ')}</h2>
              <p className="text-zinc-500 max-w-md mx-auto text-lg leading-relaxed">Your unique profile is being mapped to live industry opportunities. This view will synchronize in the next cycle.</p>
           </div>
           <Button size="lg" variant="outline" className="px-12" onClick={() => setView('dashboard')}>Return to Dashboard</Button>
        </div>
      )}

      {/* Global Loading Overlay */}
      {loading.isActive && (
        <div className="fixed inset-0 z-[1200] bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center animate-fade-in">
           <div className="relative w-32 h-32 mb-12">
              <div className="absolute inset-0 border-8 border-emerald-500/10 rounded-full"></div>
              <div className="absolute inset-0 border-8 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-emerald-500">
                 <Zap size={48} className="animate-pulse" />
              </div>
           </div>
           <div className="space-y-4 text-center">
             <p className="text-emerald-400 font-black tracking-[0.6em] uppercase animate-pulse text-lg">{loading.message}</p>
             <p className="text-zinc-600 font-mono text-[10px] uppercase tracking-widest">Optimizing Path Coefficients...</p>
           </div>
        </div>
      )}
    </AppLayout>
  );
}
