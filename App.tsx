
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect, useRef } from 'react';
import { 
  Layout, Zap, BookOpen, Users, BarChart3, Search, 
  Target, GraduationCap, Briefcase, ChevronRight, 
  MessageSquare, Settings, Bell, CheckCircle2, 
  Clock, Award, Sparkles, Send, Bot, User,
  TrendingUp, MapPin, BrainCircuit, X, Menu, Globe
} from 'lucide-react';
import { Button } from './components/Button';
import { FileUploader } from './components/FileUploader';
import { generateCareerPathway, analyzeSkillGap, getCareerAdvice } from './services/geminiService';
import { AppView, Skill, LearningModule, CareerPathway, ChatMessage, LoadingState } from './types';
import { useApiKey } from './hooks/useApiKey';
import ApiKeyDialog from './components/ApiKeyDialog';

// --- Intro Animation Component ---

const SyncIntro = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 4000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-zinc-950 flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.15)_0,transparent_70%)]"></div>
        <div className="w-full h-full bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>
      
      <div className="relative flex flex-col items-center gap-8">
        <div className="w-24 h-24 relative animate-[spinAppear_1s_ease-out]">
          <div className="absolute inset-0 bg-emerald-500/20 rounded-2xl rotate-45 animate-pulse"></div>
          <div className="absolute inset-0 flex items-center justify-center text-emerald-400">
            <BrainCircuit size={48} strokeWidth={1.5} className="animate-pulse" />
          </div>
        </div>
        
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black tracking-tighter text-white">SKILLSYNC <span className="text-emerald-400">AI</span></h1>
          <p className="text-zinc-500 font-mono text-sm tracking-[0.3em] uppercase">Aligning Potential with Industry</p>
        </div>

        <div className="w-48 h-1 bg-zinc-900 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500 animate-[drawStroke_3s_linear_forwards]"></div>
        </div>
      </div>
    </div>
  );
};

// --- Nav Button ---

const NavItem = ({ icon, label, active, onClick, badge }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void, badge?: string }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group relative
      ${active ? 'bg-emerald-500/10 text-white shadow-[0_0_20px_rgba(16,185,129,0.05)]' : 'text-zinc-500 hover:bg-zinc-900/50 hover:text-zinc-300'}`}
  >
    {active && <div className="absolute left-0 w-1 h-6 bg-emerald-500 rounded-r-full" />}
    <span className={`${active ? 'text-emerald-400' : 'text-zinc-600 group-hover:text-zinc-400'}`}>
      {icon}
    </span>
    <span className="font-semibold text-sm tracking-tight flex-1 text-left">{label}</span>
    {badge && (
      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
        {badge}
      </span>
    )}
  </button>
);

// --- App Root ---

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [view, setView] = useState<AppView>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState<LoadingState>({ isActive: false, message: '' });

  // Data States
  const [goal, setGoal] = useState('');
  const [pathway, setPathway] = useState<CareerPathway | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');

  const { showApiKeyDialog, setShowApiKeyDialog, validateApiKey, handleApiKeyDialogContinue } = useApiKey();

  const handleGeneratePath = async () => {
    if (!goal) return;
    if (!(await validateApiKey())) return;

    setLoading({ isActive: true, message: 'Syncing with market data...' });
    try {
      const path = await generateCareerPathway(goal, "College graduate interested in tech");
      const analyzedSkills = await analyzeSkillGap([], goal);
      setPathway(path);
      setSkills(analyzedSkills);
      setView('pathway');
    } catch (e) {
      alert("Failed to generate pathway. Please try again.");
    } finally {
      setLoading({ isActive: false, message: '' });
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: inputText, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    try {
      const response = await getCareerAdvice([], inputText);
      const modelMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: response, timestamp: Date.now() };
      setMessages(prev => [...prev, modelMsg]);
    } catch (e) {
      console.error(e);
    }
  };

  if (showIntro) return <SyncIntro onComplete={() => setShowIntro(false)} />;

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans flex overflow-hidden">
      {showApiKeyDialog && <ApiKeyDialog onContinue={handleApiKeyDialogContinue} />}

      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-900 bg-zinc-950/40 hidden lg:flex flex-col p-6">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-zinc-950">
            <Target size={20} strokeWidth={2.5} />
          </div>
          <span className="font-black text-xl tracking-tighter">SkillSync <span className="text-emerald-500 text-xs">AI</span></span>
        </div>

        <nav className="space-y-2 flex-1">
          <NavItem icon={<Layout size={20} />} label="Overview" active={view === 'dashboard'} onClick={() => setView('dashboard')} />
          <NavItem icon={<Zap size={20} />} label="My Pathway" active={view === 'pathway'} onClick={() => setView('pathway')} badge={pathway ? "Active" : ""} />
          <NavItem icon={<BarChart3 size={20} />} label="Skill Metrics" active={view === 'skills'} onClick={() => setView('skills')} />
          <NavItem icon={<MessageSquare size={20} />} label="AI Coach" active={view === 'coach'} onClick={() => setView('coach')} />
          <NavItem icon={<Globe size={20} />} label="Job Market" active={view === 'market'} onClick={() => setView('market')} />
        </nav>

        <div className="mt-auto pt-6 border-t border-zinc-900">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-emerald-500/20">
            <p className="text-xs text-emerald-400 font-bold mb-2 flex items-center gap-1"><Sparkles size={12} /> PRO FEATURE</p>
            <p className="text-[11px] text-zinc-400 leading-relaxed mb-3">Get real-time feedback on your portfolio.</p>
            <Button size="sm" className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950">Upgrade</Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative flex flex-col">
        {/* Top Header */}
        <header className="h-20 border-b border-zinc-900 bg-black/40 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <div className="lg:hidden text-emerald-500" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu />
            </div>
            <h2 className="text-lg font-bold capitalize">{view.replace('-', ' ')}</h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 bg-zinc-900 px-3 py-1.5 rounded-full border border-zinc-800">
              <Search size={14} className="text-zinc-500" />
              <input type="text" placeholder="Search skills..." className="bg-transparent border-none text-xs focus:ring-0 w-32" />
            </div>
            <button className="p-2 text-zinc-400 hover:text-white relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full"></span>
            </button>
            <div className="w-10 h-10 rounded-full bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center">
              <User size={20} className="text-zinc-500" />
            </div>
          </div>
        </header>

        <div className="flex-1 p-8 max-w-7xl mx-auto w-full">
          
          {/* Dashboard View */}
          {view === 'dashboard' && (
            <div className="animate-fade-in space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Skill Match', val: '64%', icon: <Target className="text-emerald-400" />, delta: '+12% this week' },
                  { label: 'Courses Done', val: '12', icon: <CheckCircle2 className="text-blue-400" />, delta: '2 in progress' },
                  { label: 'Certifications', val: '3', icon: <Award className="text-purple-400" />, delta: '1 pending' },
                  { label: 'Market Demand', val: 'High', icon: <TrendingUp className="text-orange-400" />, delta: 'Top 5% of roles' }
                ].map((s, i) => (
                  <div key={i} className="bg-zinc-950 border border-zinc-900 p-5 rounded-2xl">
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2 rounded-lg bg-zinc-900">{s.icon}</div>
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Live</span>
                    </div>
                    <p className="text-zinc-500 text-xs mb-1">{s.label}</p>
                    <p className="text-2xl font-black mb-1">{s.val}</p>
                    <p className="text-[10px] text-emerald-400">{s.delta}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-zinc-950 border border-zinc-900 rounded-2xl p-8 overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <GraduationCap size={120} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Ready to level up?</h3>
                  <p className="text-zinc-400 mb-8 max-w-md">Input your target career goal and we'll generate a custom learning path aligned with real-time job market requirements.</p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <input 
                      type="text" 
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      placeholder="e.g. Senior Product Designer, Cloud Architect..." 
                      className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 transition-all"
                    />
                    <Button onClick={handleGeneratePath} isLoading={loading.isActive} className="bg-emerald-500 text-zinc-950 hover:bg-emerald-400 font-bold px-8">
                      Sync Pathway
                    </Button>
                  </div>
                </div>

                <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6">
                  <h3 className="font-bold mb-6 flex items-center justify-between">
                    Top Skills Trending
                    <ChevronRight size={16} className="text-zinc-500" />
                  </h3>
                  <div className="space-y-4">
                    {[
                      { name: 'Azure AI Search', trend: 'UP 45%', color: 'bg-emerald-500' },
                      { name: 'System Architecture', trend: 'UP 22%', color: 'bg-blue-500' },
                      { name: 'Prompt Engineering', trend: 'UP 180%', color: 'bg-purple-500' },
                      { name: 'Conflict Resolution', trend: 'STABLE', color: 'bg-zinc-700' }
                    ].map((skill, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className={`w-1 h-8 rounded-full ${skill.color}`}></div>
                        <div className="flex-1">
                          <p className="text-sm font-bold">{skill.name}</p>
                          <p className="text-[10px] text-zinc-500">{skill.trend}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pathway View */}
          {view === 'pathway' && pathway && (
            <div className="animate-fade-in max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                <div>
                  <h1 className="text-3xl font-black mb-2">{pathway.goal}</h1>
                  <p className="text-zinc-500 flex items-center gap-2">
                    <Clock size={16} /> Estimated Path: 6 Months • <TrendingUp size={16} /> Market Demand: <span className="text-emerald-400 font-bold uppercase">{pathway.marketDemand}</span>
                  </p>
                </div>
                <div className="flex items-center gap-3 bg-zinc-950 border border-zinc-900 p-4 rounded-2xl">
                   <div className="text-right">
                      <p className="text-xs text-zinc-500">Skill Match</p>
                      <p className="text-xl font-black text-emerald-400">{pathway.matchPercentage}%</p>
                   </div>
                   <div className="w-px h-10 bg-zinc-800" />
                   <div className="text-right">
                      <p className="text-xs text-zinc-500">Avg Salary</p>
                      <p className="text-xl font-black">{pathway.estimatedSalary}</p>
                   </div>
                </div>
              </div>

              <div className="space-y-6 relative">
                <div className="absolute left-[27px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-emerald-500 via-zinc-800 to-zinc-900 hidden sm:block" />
                
                {pathway.modules.map((mod, idx) => (
                  <div key={idx} className="relative pl-0 sm:pl-16 group">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-14 h-14 hidden sm:flex items-center justify-center z-10">
                       <div className={`w-10 h-10 rounded-full border-4 flex items-center justify-center bg-zinc-950 transition-colors
                         ${mod.status === 'completed' ? 'border-emerald-500 text-emerald-500' : 'border-zinc-800 text-zinc-600'}`}>
                          {mod.status === 'completed' ? <CheckCircle2 size={20} /> : <span className="text-xs font-bold">{idx + 1}</span>}
                       </div>
                    </div>

                    <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-2xl hover:border-emerald-500/30 transition-all cursor-pointer">
                      <div className="flex flex-col sm:flex-row justify-between mb-4 gap-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 px-2 py-0.5 bg-emerald-500/10 rounded mb-2 inline-block">
                            {mod.type}
                          </span>
                          <h4 className="text-lg font-bold">{mod.title}</h4>
                        </div>
                        <span className="text-xs text-zinc-500 flex items-center gap-1"><Clock size={12} /> {mod.duration}</span>
                      </div>
                      <p className="text-zinc-400 text-sm mb-6 leading-relaxed">{mod.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {mod.skills.map(s => (
                          <span key={s} className="text-[10px] bg-zinc-900 border border-zinc-800 px-2 py-1 rounded-lg text-zinc-300">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skill Metrics View */}
          {view === 'skills' && (
            <div className="animate-fade-in space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-8">
                  <h3 className="text-xl font-bold mb-8">Skill Gap Analysis</h3>
                  <div className="space-y-8">
                    {skills.map((skill, i) => (
                      <div key={i} className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{skill.name}</span>
                          <span className="text-zinc-500">{skill.level}% / <span className="text-emerald-400">{skill.targetLevel}%</span></span>
                        </div>
                        <div className="h-2 bg-zinc-900 rounded-full overflow-hidden relative">
                           <div className="absolute inset-y-0 left-0 bg-emerald-500/20" style={{ width: `${skill.targetLevel}%` }} />
                           <div className="absolute inset-y-0 left-0 bg-emerald-500 transition-all duration-1000" style={{ width: `${skill.level}%` }} />
                        </div>
                      </div>
                    ))}
                    {skills.length === 0 && (
                      <div className="text-center py-12 text-zinc-600">
                        <BarChart3 size={48} className="mx-auto mb-4 opacity-20" />
                        <p>No skill analysis available. Start a pathway first.</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                   <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6">
                      <h3 className="font-bold mb-4">Competency Radar</h3>
                      <div className="aspect-square flex items-center justify-center relative">
                        <div className="w-full h-full border border-zinc-900 rounded-full absolute" />
                        <div className="w-2/3 h-2/3 border border-zinc-900 rounded-full absolute" />
                        <div className="w-1/3 h-1/3 border border-zinc-900 rounded-full absolute" />
                        <div className="flex flex-col items-center">
                          <BrainCircuit size={48} className="text-emerald-500/20" />
                          <p className="text-[10px] text-zinc-600 mt-2">Personalized Matrix</p>
                        </div>
                      </div>
                   </div>
                   
                   <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6">
                      <h3 className="font-bold mb-2 flex items-center gap-2">
                        <Sparkles size={18} className="text-emerald-400" /> AI Recommendation
                      </h3>
                      <p className="text-sm text-zinc-400 leading-relaxed">
                        Based on your profile, focusing on <strong>System Architecture</strong> could increase your interview callbacks for {goal || 'your target role'} by up to 30% in the current market.
                      </p>
                   </div>
                </div>
              </div>
            </div>
          )}

          {/* Coach View */}
          {view === 'coach' && (
            <div className="animate-fade-in flex flex-col h-[calc(100vh-12rem)] max-w-4xl mx-auto">
              <div className="flex-1 overflow-y-auto space-y-6 p-4 scrollbar-hide">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
                    <Bot size={20} />
                  </div>
                  <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl rounded-tl-none max-w-[80%]">
                    <p className="text-sm leading-relaxed text-zinc-200">Hello! I'm your SkillSync Career AI. Whether you're prepping for an interview or deciding which course to take next, I'm here to help. What's on your mind?</p>
                  </div>
                </div>

                {messages.map((m) => (
                  <div key={m.id} className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 
                      ${m.role === 'user' ? 'bg-zinc-800 text-zinc-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                      {m.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                    </div>
                    <div className={`p-4 rounded-2xl max-w-[80%] border 
                      ${m.role === 'user' ? 'bg-emerald-500 text-zinc-950 border-emerald-400 rounded-tr-none' : 'bg-zinc-900 border-zinc-800 rounded-tl-none'}`}>
                      <p className="text-sm leading-relaxed">{m.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex gap-4 bg-zinc-950 border border-zinc-900 p-2 rounded-2xl">
                <input 
                  type="text" 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask about career paths, interview tips..." 
                  className="flex-1 bg-transparent border-none text-sm focus:ring-0 px-4"
                />
                <button 
                  onClick={handleSendMessage}
                  className="p-3 bg-emerald-500 text-zinc-950 rounded-xl hover:bg-emerald-400 transition-colors"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          )}

          {/* Fallback for other views */}
          {(view === 'market' || !view) && (
            <div className="animate-fade-in flex flex-col items-center justify-center py-20 text-center">
              <Globe size={64} className="text-zinc-800 mb-6" />
              <h3 className="text-xl font-bold mb-2">Market Intelligence Hub</h3>
              <p className="text-zinc-500 max-w-md">The Job Market feature is currently aggregating live data from Azure AI Search. Check back soon for local demand heatmaps.</p>
              <Button variant="outline" className="mt-8" onClick={() => setView('dashboard')}>Return to Dashboard</Button>
            </div>
          )}

        </div>

        {/* Loading Overlay */}
        {loading.isActive && (
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex flex-col items-center justify-center animate-fade-in">
             <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-6" />
             <p className="text-emerald-400 font-mono tracking-widest uppercase animate-pulse text-sm">{loading.message}</p>
          </div>
        )}
      </main>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/95 p-8 flex flex-col gap-6 animate-fade-in">
          <button onClick={() => setIsMobileMenuOpen(false)} className="self-end p-2"><X /></button>
          <div className="space-y-4">
             <NavItem icon={<Layout />} label="Overview" active={view === 'dashboard'} onClick={() => { setView('dashboard'); setIsMobileMenuOpen(false); }} />
             <NavItem icon={<Zap />} label="My Pathway" active={view === 'pathway'} onClick={() => { setView('pathway'); setIsMobileMenuOpen(false); }} />
             <NavItem icon={<BarChart3 />} label="Skill Metrics" active={view === 'skills'} onClick={() => { setView('skills'); setIsMobileMenuOpen(false); }} />
             <NavItem icon={<MessageSquare />} label="AI Coach" active={view === 'coach'} onClick={() => { setView('coach'); setIsMobileMenuOpen(false); }} />
          </div>
        </div>
      )}
    </div>
  );
}
