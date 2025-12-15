
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { 
  Zap, ArrowRight, Target, BrainCircuit, GraduationCap, 
  Briefcase, TrendingUp, ShieldCheck, Globe, Star,
  CheckCircle2, X, Users, Heart, Shield, Mail, Search,
  ChevronRight, BarChart3, Clock, Layout, RefreshCcw,
  Check, Lock, Award, BookOpen, Sparkles
} from 'lucide-react';
import { Button } from './Button';

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="flex flex-col w-full bg-[#050505] overflow-x-hidden scroll-smooth selection:bg-emerald-500 selection:text-zinc-950">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 h-20 border-b border-white/5 bg-black/60 backdrop-blur-xl z-50 flex items-center justify-between px-6 md:px-16 animate-fade-in">
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
          <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center text-zinc-950 shadow-[0_0_20px_rgba(16,185,129,0.3)] group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
            <Target size={22} strokeWidth={2.5} />
          </div>
          <span className="font-black text-2xl tracking-tighter uppercase text-white group-hover:text-emerald-400 transition-colors duration-300">SkillSync <span className="text-emerald-500 font-mono text-sm">AI</span></span>
        </div>
        <div className="hidden lg:flex items-center gap-10">
          <a href="#problem" className="text-sm font-bold text-zinc-400 hover:text-emerald-400 transition-colors">The Problem</a>
          <a href="#solution" className="text-sm font-bold text-zinc-400 hover:text-emerald-400 transition-colors">Solution</a>
          <a href="#how-it-works" className="text-sm font-bold text-zinc-400 hover:text-emerald-400 transition-colors">How it Works</a>
          <a href="#for-whom" className="text-sm font-bold text-zinc-400 hover:text-emerald-400 transition-colors">For Whom</a>
          <Button size="sm" onClick={onGetStarted} className="px-6 hover:scale-105 transition-transform">Start Free</Button>
        </div>
        <div className="lg:hidden">
           <Button size="sm" onClick={onGetStarted}>Get Started</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen pt-40 pb-20 px-6 flex flex-col items-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-emerald-500/10 blur-[150px] rounded-full opacity-60 animate-pulse-slow"></div>
          <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
          {/* Decorative floating blobs */}
          <div className="absolute top-1/3 right-[10%] w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full animate-float"></div>
          <div className="absolute bottom-1/4 left-[10%] w-80 h-80 bg-blue-500/5 blur-[120px] rounded-full animate-float [animation-delay:2s]"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-[0.2em] mb-8 animate-fade-in">
             <Sparkles size={14} className="animate-pulse" /> Reimagining Career Growth
          </div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-[1.1] text-white animate-slide-up">
            SkillSync <span className="text-emerald-500 italic">AI</span>
          </h1>
          <h2 className="text-2xl md:text-4xl font-bold text-zinc-200 mb-8 tracking-tight animate-slide-up [animation-delay:150ms]">
            Bridge the Gap Between Learning and Getting Hired
          </h2>
          <p className="text-xl md:text-2xl text-zinc-400 mb-12 max-w-3xl mx-auto leading-relaxed animate-slide-up [animation-delay:300ms]">
            AI-powered career pathways aligned with real-time job market demand. 
            Stop guessing what skills to learn. SkillSync AI shows you exactly what employers want — and how to get there faster.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 animate-slide-up [animation-delay:450ms]">
            <Button size="lg" onClick={onGetStarted} className="px-10 h-16 text-lg group shadow-2xl shadow-emerald-500/20 active:scale-95" icon={<ArrowRight size={22} className="group-hover:translate-x-2 transition-transform duration-300" />}>
              Start Your Sync
            </Button>
            <div className="flex gap-4 text-sm font-bold text-zinc-500">
              <span className="hover:text-white transition-colors cursor-pointer border-b border-transparent hover:border-white">🎓 Universities</span>
              <span className="text-zinc-800">|</span>
              <span className="hover:text-white transition-colors cursor-pointer border-b border-transparent hover:border-white">🏢 Employers</span>
            </div>
          </div>

          <div className="flex gap-12 justify-center items-center grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-700 animate-fade-in [animation-delay:600ms]">
             <span className="font-black text-xl tracking-tighter">FORBES</span>
             <span className="font-black text-xl tracking-tighter">TECHCRUNCH</span>
             <span className="font-black text-xl tracking-tighter">WIRED</span>
             <span className="font-black text-xl tracking-tighter">VERGE</span>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section id="problem" className="py-32 px-6 border-y border-white/5 bg-zinc-950/40 relative">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8 animate-slide-up">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-black uppercase tracking-[0.2em] mb-4">
                🔥 The Friction
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
                Education teaches theory. <br/>
                <span className="text-red-500 italic">Employers hire skills.</span>
              </h2>
              <p className="text-xl text-zinc-400 leading-relaxed">Every year, millions of graduates struggle because of a fundamental mismatch between academic curriculum and industrial career demands.</p>
              
              <div className="space-y-6">
                {[
                  "Skills demand shifts faster than curriculums update",
                  "Job descriptions are vague and rapidly changing",
                  "Theory doesn't equate to applied project readiness",
                  "Companies spend billions retraining new hires yearly"
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start group hover:translate-x-2 transition-transform duration-300">
                    <div className="mt-1 w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 border border-red-500/20 group-hover:bg-red-500/30 transition-all">
                      <X size={14} className="text-red-500" />
                    </div>
                    <span className="text-lg font-medium text-zinc-300 group-hover:text-white transition-colors">{item}</span>
                  </div>
                ))}
              </div>

              <div className="p-8 bg-zinc-900/50 rounded-3xl border border-white/5 mt-12 hover:border-red-500/20 transition-colors">
                <p className="text-zinc-400 text-lg italic leading-relaxed">
                  "The result? Talented people remain unmapped while companies search blindly for verified skills."
                </p>
              </div>
            </div>
            
            <div className="relative animate-fade-in [animation-delay:300ms]">
              <div className="absolute inset-0 bg-red-500/10 blur-[120px] rounded-full opacity-30 animate-pulse"></div>
              <div className="bg-zinc-900 border border-white/10 p-10 rounded-[2.5rem] relative overflow-hidden shadow-2xl group hover:border-red-500/40 transition-all duration-500">
                <div className="flex justify-between items-center mb-10">
                   <h4 className="font-bold text-zinc-500 text-xs uppercase tracking-widest">Skill Drift Index</h4>
                   <TrendingUp className="text-red-500 group-hover:scale-125 transition-transform" />
                </div>
                <div className="space-y-8">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm font-bold text-zinc-400"><span>Theoretical Knowledge</span><span>92%</span></div>
                    <div className="h-2 bg-zinc-950 rounded-full overflow-hidden">
                       <div className="h-full bg-zinc-600 w-0 group-hover:w-[92%] transition-all duration-1000 ease-out"></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm font-bold text-zinc-400"><span>Applied Skill Readiness</span><span className="text-red-500">24%</span></div>
                    <div className="h-2 bg-zinc-950 rounded-full overflow-hidden">
                       <div className="h-full bg-red-500 w-0 group-hover:w-[24%] transition-all duration-1000 ease-out delay-300 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                    </div>
                  </div>
                  <div className="pt-8 border-t border-white/5">
                     <p className="text-xs text-zinc-500 uppercase font-black tracking-widest text-center">SkillSync closes this 68% void.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Solution Section */}
      <section id="solution" className="py-32 px-6 bg-black relative">
        <div className="max-w-4xl mx-auto text-center mb-24 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-[0.2em] mb-8">
            ✨ The SkillSync AI Calibration
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-white mb-8 tracking-tighter uppercase">Direct Employment Sync</h2>
          <p className="text-xl text-zinc-400 leading-relaxed mb-12">
            SkillSync AI connects education directly to employment using real-time job market telemetry and neural personalization. 
            We distill thousands of job vectors daily into personalized learning pathways — built for your unique DNA.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-emerald-400 font-black text-xs uppercase tracking-[0.3em]">
            <span className="bg-emerald-500/5 px-4 py-2 rounded-lg border border-emerald-500/10 hover:bg-emerald-500/10 transition-colors">Zero Guesswork</span>
            <span className="hidden sm:inline text-zinc-800 self-center">/</span>
            <span className="bg-emerald-500/5 px-4 py-2 rounded-lg border border-emerald-500/10 hover:bg-emerald-500/10 transition-colors">Neural Mapping</span>
            <span className="hidden sm:inline text-zinc-800 self-center">/</span>
            <span className="bg-emerald-500/5 px-4 py-2 rounded-lg border border-emerald-500/10 hover:bg-emerald-500/10 transition-colors">Employment Direct</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-6">
           {[
             { title: "Define Your Target", desc: "Select from hundreds of data-verified career orbits. Data Architect, Prompt Engineer, Product Strategist, and beyond.", icon: <Target size={30} /> },
             { title: "Market-Linkage Sync", desc: "Our engine syncs with global job telemetry hourly to ensure your roadmap matches the actual hiring climate.", icon: <RefreshCcw size={30} /> },
             { title: "Personalized Neural Path", desc: "Your roadmap isn't static. It adapts to your existing competency, learning velocity, and project outcomes.", icon: <BrainCircuit size={30} /> }
           ].map((item, i) => (
             <div key={i} className="p-12 rounded-[3rem] bg-zinc-900/50 border border-white/10 hover:border-emerald-500/30 hover:-translate-y-4 transition-all duration-500 group animate-fade-in" style={{ animationDelay: `${i * 150}ms` }}>
                <div className="w-16 h-16 bg-zinc-950 border border-white/5 rounded-[1.5rem] flex items-center justify-center text-emerald-500 mb-10 group-hover:scale-110 group-hover:bg-emerald-500/10 transition-all shadow-inner">
                  {item.icon}
                </div>
                <h4 className="text-2xl font-black text-white mb-6 uppercase tracking-tight">{item.title}</h4>
                <p className="text-zinc-500 leading-relaxed text-lg">{item.desc}</p>
             </div>
           ))}
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-32 px-6 bg-zinc-950 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center text-center mb-32 animate-fade-in">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-[0.2em] mb-8">
               🧠 The Workflow
             </div>
             <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter">Your Roadmap to Hired</h2>
          </div>

          <div className="space-y-40 relative">
            <div className="absolute left-[50%] top-0 bottom-0 w-px bg-emerald-500/5 hidden lg:block"></div>
            
            {/* Step 1 */}
            <div className="flex flex-col lg:flex-row items-center gap-20 relative group">
              <div className="lg:w-1/2 space-y-6 lg:text-right group-hover:-translate-x-2 transition-transform duration-500">
                <div className="text-emerald-500 font-mono text-4xl font-black opacity-20 group-hover:opacity-100 transition-opacity">01</div>
                <h3 className="text-4xl font-black text-white uppercase tracking-tighter">Choose Your Target</h3>
                <p className="text-zinc-400 text-xl leading-relaxed">Identity who you want to become. SkillSync provides the telemetry for every major modern technical role.</p>
              </div>
              <div className="lg:w-1/2 p-10 bg-zinc-900 rounded-[2.5rem] border border-white/10 shadow-2xl relative z-10 w-full max-w-md mx-auto hover:scale-105 hover:rotate-1 transition-all duration-500">
                <div className="space-y-4">
                  {['AI Solution Architect', 'Machine Learning Engineer', 'Growth Strategist'].map((role, i) => (
                    <div key={role} className="p-5 bg-zinc-950 border border-white/5 rounded-2xl text-emerald-400 font-bold flex justify-between items-center group/item cursor-pointer hover:border-emerald-500/40 transition-all" style={{ opacity: 1 - i * 0.2 }}>
                      {role} <ChevronRight size={18} className="text-zinc-800 group-hover/item:text-emerald-500 group-hover/item:translate-x-1 transition-all" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-20 relative group">
              <div className="lg:w-1/2 space-y-6 group-hover:translate-x-2 transition-transform duration-500">
                <div className="text-emerald-500 font-mono text-4xl font-black opacity-20 group-hover:opacity-100 transition-opacity">02</div>
                <h3 className="text-4xl font-black text-white uppercase tracking-tighter">Market Signal Sync</h3>
                <p className="text-zinc-400 text-xl leading-relaxed">We distill thousands of live data points to map the exact tools, salary bands, and skills hiring managers are bidding on right now.</p>
              </div>
              <div className="lg:w-1/2 p-12 bg-zinc-900 rounded-[2.5rem] border border-white/10 shadow-2xl relative z-10 w-full max-w-md mx-auto hover:scale-105 hover:-rotate-1 transition-all duration-500">
                <div className="space-y-8">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">Market Velocity</span>
                    <TrendingUp size={20} className="text-emerald-500 animate-pulse" />
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                       <div className="flex justify-between text-[10px] font-black text-zinc-500"><span>RAG AGENTS</span><span>URGENT</span></div>
                       <div className="h-2.5 bg-zinc-950 rounded-full overflow-hidden p-0.5"><div className="h-full bg-emerald-500 w-[88%] rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div></div>
                    </div>
                    <div className="space-y-2">
                       <div className="flex justify-between text-[10px] font-black text-zinc-500"><span>VECTOR DB</span><span>HIGH</span></div>
                       <div className="h-2.5 bg-zinc-950 rounded-full overflow-hidden p-0.5"><div className="h-full bg-emerald-400 w-[62%] rounded-full opacity-60"></div></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col lg:flex-row items-center gap-20 relative group">
              <div className="lg:w-1/2 space-y-6 lg:text-right group-hover:-translate-x-2 transition-transform duration-500">
                <div className="text-emerald-500 font-mono text-4xl font-black opacity-20 group-hover:opacity-100 transition-opacity">03</div>
                <h3 className="text-4xl font-black text-white uppercase tracking-tighter">AI-Personalized Roadmap</h3>
                <p className="text-zinc-400 text-xl leading-relaxed">SkillSync generates a step-by-step competency ladder. From base theory to high-value portfolio artifacts that prove your readiness.</p>
              </div>
              <div className="lg:w-1/2 space-y-4 w-full max-w-md mx-auto hover:translate-y-[-10px] transition-all duration-500">
                {[
                  { icon: <Clock size={20} />, label: 'Dynamic Sprints' },
                  { icon: <BookOpen size={20} />, label: 'Curated Resource Logic' },
                  { icon: <Layout size={20} />, label: 'Artifact Generation' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-5 p-6 bg-zinc-900 border border-white/10 rounded-[1.5rem] relative z-10 hover:border-emerald-500/40 transition-colors shadow-lg">
                     <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">{item.icon}</div>
                     <span className="font-black uppercase tracking-widest text-zinc-300 text-sm">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-20 relative group">
              <div className="lg:w-1/2 space-y-6 group-hover:translate-x-2 transition-transform duration-500">
                <div className="text-emerald-500 font-mono text-4xl font-black opacity-20 group-hover:opacity-100 transition-opacity">04</div>
                <h3 className="text-4xl font-black text-white uppercase tracking-tighter">Sync & Secure Placement</h3>
                <p className="text-zinc-400 text-xl leading-relaxed">Finalize your profile and enter verified pipelines. Employers view your skill DNA directly, bypassing traditional resume hurdles.</p>
              </div>
              <div className="lg:w-1/2 p-14 bg-gradient-to-br from-emerald-500/10 via-zinc-900 to-emerald-500/5 border border-emerald-500/30 rounded-[3rem] relative z-10 w-full max-w-md mx-auto text-center hover:scale-110 transition-all duration-700 shadow-2xl">
                <div className="relative inline-block mb-10">
                   <div className="absolute inset-0 bg-emerald-500/40 blur-2xl rounded-full animate-pulse"></div>
                   <CheckCircle2 size={100} className="text-emerald-500 relative z-10" />
                </div>
                <h4 className="text-3xl font-black text-white uppercase tracking-widest">Pipeline Active</h4>
                <p className="text-zinc-500 text-sm mt-4 font-bold uppercase tracking-widest">Verified Signal Confirmed</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Whom Section */}
      <section id="for-whom" className="py-32 px-6 bg-black border-y border-white/5 relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.03)_0,transparent_70%)]"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-24 animate-slide-up">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-[0.2em] mb-8">
               🎯 Strategic Reach
             </div>
             <h2 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter">Every Player in the Ecosystem</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Talent & Graduates', desc: 'Identify verified hiring bandwidth and build project proof that commands attention.', icon: <GraduationCap size={40}/> },
              { title: 'Career Pivoters', desc: 'Map your trajectory with clinical precision. Zero wasted learning cycles.', icon: <RefreshCcw size={40}/> },
              { title: 'Academic Orgs', desc: 'Sync your curriculum with live industry telemetry to guarantee student ROI.', icon: <Globe size={40}/> },
              { title: 'Industry Partners', desc: 'Direct access to skill-verified talent. Drastically reduce retraining overhead.', icon: <Briefcase size={40}/> }
            ].map((card, i) => (
              <div key={i} className="p-10 rounded-[2.5rem] bg-zinc-900 border border-white/5 hover:border-emerald-500/40 hover:-translate-y-4 transition-all duration-500 text-center flex flex-col items-center group animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="p-5 bg-zinc-950 text-emerald-500 rounded-2xl mb-10 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-inner border border-white/5">
                  {card.icon}
                </div>
                <h4 className="text-xl font-black text-white mb-6 uppercase tracking-tight">{card.title}</h4>
                <p className="text-zinc-500 text-base leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-48 px-6 text-center relative overflow-hidden bg-black">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-emerald-500/[0.07] blur-[200px] rounded-full animate-pulse-slow"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-[0.2em] mb-12 animate-fade-in">
             🚀 Mission Critical Recruitment Signal
          </div>
          <h2 className="text-6xl md:text-9xl font-black text-white mb-12 tracking-tighter uppercase leading-[0.85] animate-slide-up">
            Your path <br/> is <span className="text-emerald-500 italic">Verified.</span>
          </h2>
          <p className="text-2xl md:text-3xl text-zinc-400 mb-16 max-w-2xl mx-auto leading-relaxed animate-slide-up [animation-delay:200ms]">
            Calibration complete. The system is ready to map your professional trajectory to real-world bandwidth.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20 animate-slide-up [animation-delay:400ms]">
            <Button size="lg" onClick={onGetStarted} className="px-16 h-24 text-2xl font-black shadow-2xl shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all">Start Neural Sync</Button>
          </div>

          <div className="max-w-md mx-auto p-12 bg-zinc-900 border border-white/10 rounded-[3rem] animate-fade-in [animation-delay:600ms] hover:border-emerald-500/20 transition-all shadow-2xl">
             <h4 className="text-white font-black uppercase text-sm tracking-widest mb-8 flex items-center justify-center gap-3"><Mail size={18} className="text-emerald-500" /> Stay in the Loop</h4>
             <div className="flex flex-col gap-5">
                <input type="email" placeholder="ENTER YOUR EMAIL" className="bg-zinc-950 border border-white/10 rounded-2xl px-6 py-5 text-xs font-black tracking-widest focus:ring-2 focus:ring-emerald-500 outline-none text-white placeholder:text-zinc-800 transition-all" />
                <Button className="w-full h-16 uppercase tracking-[0.4em] font-black text-[10px]">Initialize Transmission</Button>
             </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 px-6 border-t border-white/5 bg-[#050505] relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 mb-24">
            <div className="space-y-8">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-zinc-950 shadow-lg">
                   <Target size={24} strokeWidth={3} />
                 </div>
                 <span className="font-black text-2xl tracking-tighter uppercase text-white">SkillSync <span className="text-emerald-500 font-mono text-sm">AI</span></span>
               </div>
               <p className="text-zinc-500 text-sm leading-relaxed font-medium">Bridging education to employment with intelligent, market-verified learning neural-paths.</p>
               <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-500 hover:text-white hover:border-emerald-500/40 transition-all cursor-pointer"><Globe size={20} /></div>
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-500 hover:text-white hover:border-emerald-500/40 transition-all cursor-pointer"><Briefcase size={20} /></div>
               </div>
            </div>
            
            <div className="space-y-8">
              <h5 className="font-black text-white uppercase text-xs tracking-[0.4em] border-b border-white/5 pb-4">Ecosystem</h5>
              <div className="flex flex-col gap-5 text-xs font-black uppercase tracking-widest text-zinc-600">
                <a href="#" className="hover:text-emerald-400 transition-colors">Career Orbits</a>
                <a href="#" className="hover:text-emerald-400 transition-colors">Market Signals</a>
                <a href="#" className="hover:text-emerald-400 transition-colors">Placement Pulse</a>
              </div>
            </div>

            <div className="space-y-8">
              <h5 className="font-black text-white uppercase text-xs tracking-[0.4em] border-b border-white/5 pb-4">Alliance</h5>
              <div className="flex flex-col gap-5 text-xs font-black uppercase tracking-widest text-zinc-600">
                <a href="#" className="hover:text-emerald-400 transition-colors">University Hub</a>
                <a href="#" className="hover:text-emerald-400 transition-colors">Employer Portal</a>
                <a href="#" className="hover:text-emerald-400 transition-colors">Direct Pipeline</a>
              </div>
            </div>

            <div className="space-y-8">
              <h5 className="font-black text-white uppercase text-xs tracking-[0.4em] border-b border-white/5 pb-4">Protocols</h5>
              <div className="flex flex-col gap-5 text-xs font-black uppercase tracking-widest text-zinc-600">
                <a href="#" className="hover:text-emerald-400 transition-colors">Privacy Neural</a>
                <a href="#" className="hover:text-emerald-400 transition-colors">Sync Terms</a>
                <a href="#" className="hover:text-emerald-400 transition-colors">Ethics Policy</a>
              </div>
            </div>
          </div>
          
          <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
             <p className="text-zinc-700 text-[10px] font-black uppercase tracking-[0.5em]">© 2026 SkillSync AI / V2.0.4. Calibration Established.</p>
             <div className="flex gap-10 text-zinc-700 text-[10px] font-black uppercase tracking-[0.5em]">
                <a href="#" className="hover:text-emerald-400 transition-colors">TWITTER</a>
                <a href="#" className="hover:text-emerald-400 transition-colors">LINKEDIN</a>
                <a href="#" className="hover:text-emerald-400 transition-colors">GITHUB</a>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
