
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import { 
  Zap, BarChart3, Search, Target, MessageSquare, 
  Bell, CheckCircle2, Clock, Award, Sparkles, Send, 
  Bot, User, TrendingUp, BrainCircuit, X, Menu, 
  Globe, ArrowRight, ArrowLeft, ChevronRight, GraduationCap,
  Briefcase, Heart, BookOpen, Settings, Layout, Users, Star,
  DollarSign, ShieldCheck, Mail
} from 'lucide-react';
import { Button } from './components/Button';
import { LandingPage } from './components/LandingPage';
import { generateCareerPathway, analyzeSkillGap, getCareerAdvice } from './services/geminiService';
import { AppView, Skill, CareerPathway, ChatMessage, LoadingState, UserProfile } from './types';

// --- Multi-Step Onboarding ---
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
      id: 'profile',
      title: "Tell us about yourself", 
      subtitle: "The basics to help us build your profile.",
      fields: [
        { label: 'Full Name', field: 'name', type: 'text', placeholder: 'Alex Chen' },
        { label: 'Email Address', field: 'email', type: 'email', placeholder: 'alex@example.com' }
      ]
    },
    { 
      id: 'background',
      title: "Your Professional Background", 
      subtitle: "More detail helps the AI align your path perfectly.",
      fields: [
        { label: 'Current Role or Major', field: 'currentRole', type: 'text', placeholder: 'e.g. Computer Science Student' },
        { label: 'Highest Education', field: 'education', type: 'select', options: ['High School', 'Bachelors', 'Masters', 'PhD', 'Bootcamp'] },
        { label: 'Years of Experience', field: 'yearsOfExp', type: 'number', placeholder: '0' },
        { label: 'Current Industry', field: 'industry', type: 'text', placeholder: 'e.g. Healthcare, Retail' }
      ]
    },
    { 
      id: 'goal',
      title: "Dream Career", 
      subtitle: "What position are we aiming for?",
      fields: [
        { label: 'Target Job Title', field: 'goal', type: 'text', placeholder: 'e.g. Senior Frontend Engineer' },
        { label: 'Career Level', field: 'experienceLevel', type: 'options', options: [
          { id: 'entry', label: 'Entry Level' },
          { id: 'mid', label: 'Mid Level' },
          { id: 'senior', label: 'Senior Level' }
        ]}
      ]
    },
    { 
      id: 'preferences',
      title: "Learning Style", 
      subtitle: "How do you learn best?",
      fields: [
        { label: 'Availability (Hours/Week)', field: 'timeAvailability', type: 'range', min: 2, max: 40 },
        { label: 'Preferred Style', field: 'learningStyle', type: 'options', options: [
          { id: 'practical', label: 'Hands-on Projects' },
          { id: 'visual', label: 'Video Courses' },
          { id: 'reading', label: 'Documentation & Books' }
        ]}
      ]
    }
  ];

  const currentStepData = steps[step];

  const updateField = (field: string, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const next = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else onComplete(profile);
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(16,185,129,0.05)_0,transparent_60%)]"></div>
      
      <div className="max-w-2xl w-full glass-panel p-10 rounded-[2.5rem] relative z-10 animate-slide-up border border-white/10 shadow-2xl">
        <div className="flex justify-between items-center mb-10">
          <div className="flex gap-2">
            {steps.map((_, i) => (
              <div key={i} className={`h-1.5 w-12 rounded-full transition-all duration-500 ${i <= step ? 'bg-emerald-500' : 'bg-zinc-800'}`}></div>
            ))}
          </div>
          <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">Step {step + 1} of {steps.length}</span>
        </div>

        <h2 className="text-4xl font-black mb-2 text-white">{currentStepData.title}</h2>
        <p className="text-zinc-500 mb-10 text-lg">{currentStepData.subtitle}</p>

        <div className="space-y-8 min-h-[300px]">
          {currentStepData.fields.map((f: any) => (
            <div key={f.field} className="space-y-3">
              <label className="text-sm font-bold text-zinc-400 uppercase tracking-wider">{f.label}</label>
              
              {f.type === 'text' || f.type === 'email' || f.type === 'number' ? (
                <input 
                  type={f.type}
                  value={(profile as any)[f.field]}
                  onChange={(e) => updateField(f.field, e.target.value)}
                  placeholder={f.placeholder}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                />
              ) : f.type === 'select' ? (
                <select 
                  value={(profile as any)[f.field]}
                  onChange={(e) => updateField(f.field, e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-emerald-500 outline-none appearance-none cursor-pointer"
                >
                  <option value="">Select Option</option>
                  {f.options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              ) : f.type === 'options' ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {f.options.map((opt: any) => (
                    <button
                      key={opt.id}
                      onClick={() => updateField(f.field, opt.id)}
                      className={`p-4 rounded-xl border font-bold text-sm transition-all ${profile[f.field as keyof UserProfile] === opt.id ? 'bg-emerald-500 border-emerald-400 text-zinc-950' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              ) : f.type === 'range' ? (
                <div className="flex items-center gap-6">
                   <input 
                    type="range" min={f.min} max={f.max}
                    value={(profile as any)[f.field]}
                    onChange={(e) => updateField(f.field, e.target.value)}
                    className="flex-1 accent-emerald-500"
                  />
                  <span className="font-mono font-bold text-emerald-500 text-xl">{(profile as any)[f.field]} hrs</span>
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-between items-center pt-8 border-t border-white/5">
          <button 
            onClick={() => setStep(prev => prev - 1)}
            disabled={step === 0}
            className="flex items-center gap-2 text-zinc-500 font-bold hover:text-white disabled:opacity-0 transition-all"
          >
            <ArrowLeft size={18} /> Back
          </button>
          <Button size="lg" onClick={next} className="px-12">
            {step === steps.length - 1 ? 'Generate My Pathway' : 'Continue'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [view, setView] = useState<AppView>('landing');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [pathway, setPathway] = useState<CareerPathway | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState<LoadingState>({ isActive: false, message: '' });
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');

  const handleOnboardingComplete = async (profile: UserProfile) => {
    setUserProfile(profile);
    setLoading({ isActive: true, message: 'Syncing with global job market...' });
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

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: inputText, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = inputText;
    setInputText('');

    try {
      const response = await getCareerAdvice([], currentInput);
      const modelMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: response, timestamp: Date.now() };
      setMessages(prev => [...prev, modelMsg]);
    } catch (e) {
      console.error(e);
    }
  };

  const NavItem = ({ icon, label, target, active }: { icon: any, label: string, target: AppView, active: boolean }) => (
    <button 
      onClick={() => setView(target)}
      className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl font-bold text-sm transition-all ${active ? 'bg-emerald-500/10 text-emerald-400' : 'text-zinc-500 hover:bg-zinc-900/50 hover:text-zinc-300'}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  // Layout for authenticated app
  const AppLayout = ({ children }: { children: React.ReactNode }) => (
    <div className="flex h-screen overflow-hidden bg-[#050505]">
      {/* Sidebar */}
      <aside className="w-72 border-r border-white/5 bg-zinc-950 flex flex-col p-6 overflow-y-auto scrollbar-hide">
        <div className="flex items-center gap-3 mb-10 px-2 cursor-pointer" onClick={() => setView('landing')}>
          <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center text-zinc-950 shadow-lg shadow-emerald-500/20">
            <Target size={22} strokeWidth={2.5} />
          </div>
          <span className="font-black text-xl tracking-tighter uppercase text-white">SkillSync <span className="text-emerald-500 text-xs">AI</span></span>
        </div>

        <div className="space-y-1 flex-1">
          <p className="px-4 text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-4">Product</p>
          <NavItem icon={<Layout size={18}/>} label="Dashboard" target="dashboard" active={view === 'dashboard'} />
          <NavItem icon={<BarChart3 size={18}/>} label="Skill Gap" target="skills" active={view === 'skills'} />
          <NavItem icon={<Zap size={18}/>} label="Pathway" target="pathway" active={view === 'pathway'} />
          <NavItem icon={<TrendingUp size={18}/>} label="Market Insights" target="market" active={view === 'market'} />
          
          <div className="h-10"></div>
          
          <p className="px-4 text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-4">Support</p>
          <NavItem icon={<MessageSquare size={18}/>} label="AI Coach" target="coach" active={view === 'coach'} />
          <NavItem icon={<Briefcase size={18}/>} label="Job Matching" target="matching" active={view === 'matching'} />
          <NavItem icon={<Award size={18}/>} label="Portfolio" target="portfolio" active={view === 'portfolio'} />
        </div>

        <div className="mt-10 pt-6 border-t border-white/5">
           <NavItem icon={<Settings size={18}/>} label="Settings" target="settings" active={view === 'settings'} />
           <div className="mt-6 p-4 rounded-2xl bg-zinc-900/50 border border-white/5">
              <div className="flex items-center gap-3 mb-2">
                 <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center"><User size={16} className="text-emerald-400"/></div>
                 <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate">{userProfile?.name || 'User'}</p>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{userProfile?.experienceLevel}</p>
                 </div>
              </div>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-[#050505] overflow-y-auto scrollbar-hide">
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 sticky top-0 bg-black/60 backdrop-blur-xl z-30">
           <h2 className="text-sm font-black text-zinc-500 uppercase tracking-[0.3em]">{view}</h2>
           <div className="flex items-center gap-6">
              <button className="p-2 text-zinc-400 hover:text-white relative"><Bell size={20}/><span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full"></span></button>
              <Button size="sm" variant="outline" className="text-xs">Upgrade to Pro</Button>
           </div>
        </header>
        <div className="p-10 max-w-6xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );

  if (view === 'landing') return <LandingPage onGetStarted={() => setView('onboarding')} />;
  if (view === 'onboarding') return <OnboardingWizard onComplete={handleOnboardingComplete} />;

  return (
    <AppLayout>
      {view === 'dashboard' && (
        <div className="animate-fade-in space-y-10">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-black mb-2">Hello, {userProfile?.name.split(' ')[0]} 👋</h1>
              <p className="text-zinc-500">You are <span className="text-emerald-400 font-bold">65% synced</span> with your {userProfile?.goal} goal.</p>
            </div>
            <div className="flex gap-4">
               <div className="px-6 py-4 glass-panel rounded-2xl text-center">
                  <p className="text-[10px] font-black text-zinc-500 uppercase mb-1">Market Match</p>
                  <p className="text-2xl font-black text-emerald-400">82%</p>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'Demand', val: 'High', icon: <TrendingUp className="text-emerald-400"/> },
              { label: 'Growth', val: '+12%', icon: <Sparkles className="text-purple-400"/> },
              { label: 'Target', val: '$115k', icon: <DollarSign className="text-blue-400"/> },
              { label: 'Streak', val: '8 days', icon: <Zap className="text-orange-400"/> }
            ].map((stat, i) => (
              <div key={i} className="glass-panel p-6 rounded-[2rem] border border-white/5 hover:border-emerald-500/30 transition-all group">
                <div className="p-2 bg-zinc-950 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">{stat.icon}</div>
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-2xl font-black">{stat.val}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
               <div className="glass-panel p-8 rounded-[2.5rem] relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[80px]"></div>
                  <h3 className="text-xl font-black mb-6 flex items-center gap-2 uppercase tracking-tighter"><Zap size={20} className="text-emerald-400"/> Next Best Action</h3>
                  <div className="bg-zinc-950 border border-white/10 p-6 rounded-2xl flex flex-col md:flex-row items-center gap-8">
                     <div className="flex-1">
                        <p className="text-zinc-400 leading-relaxed mb-6">Based on current market demand, learning <span className="text-white font-bold underline decoration-emerald-500">Advanced Prompt Engineering</span> would increase your employability score by 14%.</p>
                        <Button size="sm" icon={<ArrowRight size={16}/>}>Start Module</Button>
                     </div>
                     <div className="w-32 h-32 relative flex items-center justify-center">
                        <div className="absolute inset-0 border-4 border-zinc-900 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
                        <span className="font-black text-xl text-emerald-400">14%</span>
                     </div>
                  </div>
               </div>

               <div className="glass-panel p-8 rounded-[2.5rem]">
                  <h3 className="text-xl font-black mb-8 uppercase tracking-tighter">Skill Velocity</h3>
                  <div className="space-y-6">
                    {skills.slice(0, 4).map((s, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-zinc-500"><span>{s.name}</span><span>{s.level}%</span></div>
                        <div className="h-1.5 bg-zinc-950 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.3)]" style={{width: `${s.level}%`}}></div>
                        </div>
                      </div>
                    ))}
                  </div>
               </div>
            </div>

            <div className="space-y-8">
               <div className="glass-panel p-8 rounded-[2.5rem]">
                  <h3 className="text-xl font-black mb-6 uppercase tracking-tighter">Live Jobs</h3>
                  <div className="space-y-4">
                     {[
                       { title: 'AI Engineer', co: 'Nebula AI', pay: '$145k', match: 92 },
                       { title: 'Frontend Lead', co: 'SyncStack', pay: '$130k', match: 88 },
                       { title: 'Product Manager', co: 'Veritas', pay: '$120k', match: 74 }
                     ].map((job, i) => (
                       <div key={i} className="p-4 bg-zinc-950/50 border border-white/5 rounded-2xl hover:border-emerald-500/30 cursor-pointer transition-all">
                          <p className="font-bold text-sm text-white">{job.title}</p>
                          <div className="flex justify-between items-center mt-2">
                             <span className="text-[10px] text-zinc-500 font-black uppercase">{job.co} • {job.pay}</span>
                             <span className="text-[10px] font-black text-emerald-400">{job.match}% match</span>
                          </div>
                       </div>
                     ))}
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-6">View All Matching Roles</Button>
               </div>

               <div className="p-8 bg-emerald-500/10 border border-emerald-500/20 rounded-[2.5rem] relative overflow-hidden">
                  <Bot size={48} className="absolute -bottom-4 -right-4 text-emerald-500/10 rotate-12" />
                  <p className="text-xs font-black text-emerald-400 uppercase mb-2 tracking-widest">Coach Advice</p>
                  <p className="text-sm text-zinc-400 leading-relaxed">"Focus on building a portfolio project with multi-modal AI this weekend. It's the most searched skill for {userProfile?.goal} this month."</p>
               </div>
            </div>
          </div>
        </div>
      )}

      {view === 'skills' && (
        <div className="animate-fade-in space-y-12">
          <div className="flex justify-between items-center mb-8">
             <h1 className="text-4xl font-black uppercase tracking-tighter">Skill Gap Analysis</h1>
             <Button size="sm" icon={<RefreshCcw size={16}/>}>Refresh Analysis</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="glass-panel p-10 rounded-[2.5rem]">
               <h3 className="text-xl font-black mb-10 uppercase tracking-widest text-zinc-500">Competency Matrix</h3>
               <div className="space-y-12">
                  {skills.map((s, i) => (
                    <div key={i} className="space-y-4">
                       <div className="flex justify-between items-end">
                          <span className="font-black text-lg text-white">{s.name}</span>
                          <span className="font-mono text-emerald-500">{s.level}% / <span className="text-zinc-600">{s.targetLevel}%</span></span>
                       </div>
                       <div className="h-4 bg-zinc-950 rounded-full border border-white/5 p-1 relative overflow-hidden">
                          <div className="absolute inset-y-0 left-0 bg-emerald-500/10" style={{width: `${s.targetLevel}%`}}></div>
                          <div className="h-full bg-emerald-500 rounded-full shadow-lg" style={{width: `${s.level}%`}}></div>
                       </div>
                       <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">{s.category} competency</p>
                    </div>
                  ))}
               </div>
            </div>

            <div className="space-y-8">
               <div className="glass-panel p-10 rounded-[2.5rem] text-center">
                  <div className="w-48 h-48 mx-auto mb-8 relative flex items-center justify-center">
                     <div className="absolute inset-0 border-8 border-zinc-900 rounded-full"></div>
                     <div className="absolute inset-0 border-8 border-emerald-500 rounded-full border-t-transparent animate-[spin_3s_linear_infinite]"></div>
                     <BrainCircuit size={60} className="text-emerald-500/40" />
                  </div>
                  <h4 className="text-2xl font-black mb-2 uppercase tracking-tighter">Ready for Hire?</h4>
                  <p className="text-zinc-500 text-sm leading-relaxed">You have mastered <strong>3 of 8</strong> core industry requirements. Current readiness at <strong>42%</strong>. Aim for 75% for auto-pipeline referral.</p>
               </div>

               <div className="p-10 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-[2.5rem]">
                  <h4 className="font-black text-indigo-400 mb-4 uppercase tracking-widest flex items-center gap-2"><Award size={20}/> Fast-Track Available</h4>
                  <p className="text-sm text-zinc-400 leading-relaxed mb-6">Based on your proficiency in <strong>{skills[0]?.name}</strong>, you qualify for an expedited AWS certification path.</p>
                  <Button size="sm" variant="outline" className="border-indigo-500/30 hover:bg-indigo-500/20 text-indigo-300">View Certification Details</Button>
               </div>
            </div>
          </div>
        </div>
      )}

      {view === 'coach' && (
        <div className="animate-fade-in flex flex-col h-[calc(100vh-12rem)] max-w-4xl mx-auto">
          <div className="flex-1 overflow-y-auto space-y-6 p-4 scrollbar-hide">
             <div className="flex gap-4">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0"><Bot size={20}/></div>
                <div className="bg-zinc-900/50 border border-white/10 p-5 rounded-[2rem] rounded-tl-none max-w-[80%]">
                   <p className="text-sm text-zinc-300 leading-relaxed">
                      Hello {userProfile?.name}! I've synced with the latest industry data for <strong>{userProfile?.goal}</strong> roles. 
                      Would you like a mock interview, resume feedback, or advice on your next project?
                   </p>
                </div>
             </div>

             {messages.map((m) => (
               <div key={m.id} className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 
                    ${m.role === 'user' ? 'bg-zinc-800 text-zinc-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                    {m.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                  </div>
                  <div className={`p-5 rounded-[2rem] max-w-[80%] border shadow-sm
                    ${m.role === 'user' ? 'bg-emerald-500 text-zinc-950 border-emerald-400 rounded-tr-none font-bold' : 'bg-zinc-900 border-zinc-800 rounded-tl-none text-zinc-200 leading-relaxed'}`}>
                    <p className="text-sm">{m.text}</p>
                  </div>
               </div>
             ))}
          </div>

          <div className="mt-8 flex gap-4 bg-zinc-900/50 border border-white/5 p-3 rounded-[2rem] items-center">
             <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask me anything about your career..." 
              className="flex-1 bg-transparent border-none text-sm focus:ring-0 px-6 py-4"
            />
            <button 
              onClick={handleSendMessage}
              className="w-14 h-14 bg-emerald-500 text-zinc-950 rounded-2xl hover:bg-emerald-400 transition-all active:scale-95 flex items-center justify-center"
            >
              <Send size={24} />
            </button>
          </div>
        </div>
      )}

      {/* Placeholder Views */}
      {(view === 'pathway' || view === 'market' || view === 'portfolio' || view === 'matching' || view === 'settings') && (
        <div className="animate-fade-in flex flex-col items-center justify-center h-[60vh] text-center space-y-6">
           <div className="p-8 rounded-full bg-emerald-500/5 text-emerald-500/30 border border-emerald-500/10">
              <BrainCircuit size={80} />
           </div>
           <div>
              <h2 className="text-2xl font-black uppercase tracking-widest text-white">{view.replace('_', ' ')} Screen</h2>
              <p className="text-zinc-500 max-w-sm mx-auto mt-2">The AI is currently processing this view for your personalized profile. Available in the next sync update.</p>
           </div>
           <Button variant="outline" onClick={() => setView('dashboard')}>Return to Dashboard</Button>
        </div>
      )}

      {/* Loading Overlay */}
      {loading.isActive && (
        <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-2xl flex flex-col items-center justify-center animate-fade-in">
           <div className="relative w-24 h-24 mb-10">
              <div className="absolute inset-0 border-4 border-emerald-500/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-emerald-500">
                 <Zap size={32} className="animate-pulse" />
              </div>
           </div>
           <p className="text-emerald-400 font-black tracking-[0.4em] uppercase animate-pulse text-sm text-center px-10">{loading.message}</p>
        </div>
      )}
    </AppLayout>
  );
}
