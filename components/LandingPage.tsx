
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
  Check, Lock, Award, BookOpen
} from 'lucide-react';
import { Button } from './Button';

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="flex flex-col w-full bg-[#050505] overflow-x-hidden scroll-smooth">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 h-20 border-b border-white/5 bg-black/60 backdrop-blur-xl z-50 flex items-center justify-between px-6 md:px-16">
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
          <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center text-zinc-950 shadow-[0_0_20px_rgba(16,185,129,0.3)] group-hover:scale-105 transition-transform">
            <Target size={22} strokeWidth={2.5} />
          </div>
          <span className="font-black text-2xl tracking-tighter uppercase text-white">SkillSync <span className="text-emerald-500 font-mono text-sm">AI</span></span>
        </div>
        <div className="hidden lg:flex items-center gap-10">
          <a href="#problem" className="text-sm font-bold text-zinc-400 hover:text-emerald-400 transition-colors">The Problem</a>
          <a href="#solution" className="text-sm font-bold text-zinc-400 hover:text-emerald-400 transition-colors">Solution</a>
          <a href="#how-it-works" className="text-sm font-bold text-zinc-400 hover:text-emerald-400 transition-colors">How it Works</a>
          <a href="#for-whom" className="text-sm font-bold text-zinc-400 hover:text-emerald-400 transition-colors">For Whom</a>
          <Button size="sm" onClick={onGetStarted} className="px-6">Start Free</Button>
        </div>
        <div className="lg:hidden">
           <Button size="sm" onClick={onGetStarted}>Get Started</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen pt-40 pb-20 px-6 flex flex-col items-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-emerald-500/10 blur-[150px] rounded-full opacity-60"></div>
          <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-[1.1] text-white animate-slide-up">
            SkillSync <span className="text-emerald-500">AI</span>
          </h1>
          <h2 className="text-2xl md:text-4xl font-bold text-zinc-200 mb-8 tracking-tight">
            Bridge the Gap Between Learning and Getting Hired
          </h2>
          <p className="text-xl md:text-2xl text-zinc-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            AI-powered career pathways aligned with real-time job market demand. 
            Stop guessing what skills to learn. SkillSync AI shows you exactly what employers want — and how to get there faster.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <Button size="lg" onClick={onGetStarted} className="px-10 h-16 text-lg group" icon={<ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />}>
              Start Free
            </Button>
            <div className="flex gap-4 text-sm font-bold text-zinc-500">
              <span className="hover:text-white transition-colors cursor-pointer">🎓 For Universities</span>
              <span className="text-zinc-800">|</span>
              <span className="hover:text-white transition-colors cursor-pointer">🏢 For Employers</span>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section id="problem" className="py-32 px-6 border-y border-white/5 bg-zinc-950/40 relative">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-black uppercase tracking-[0.2em] mb-4">
                🔥 The Problem
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
                Education teaches theory. <br/>
                <span className="text-red-500">Employers hire skills.</span>
              </h2>
              <p className="text-xl text-zinc-400">Every year, millions of graduates struggle because of a fundamental mismatch between curriculum and career.</p>
              
              <div className="space-y-6">
                {[
                  "They don’t know which skills are actually in demand",
                  "Curriculums don’t update as fast as the job market",
                  "Job descriptions feel confusing and contradictory",
                  "Companies spend months retraining new hires"
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start group">
                    <div className="mt-1 w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 border border-red-500/20 group-hover:bg-red-500/20 transition-colors">
                      <X size={14} className="text-red-500" />
                    </div>
                    <span className="text-lg font-medium text-zinc-300">{item}</span>
                  </div>
                ))}
              </div>

              <div className="p-8 bg-zinc-900/50 rounded-3xl border border-white/5 mt-12">
                <p className="text-zinc-400 text-lg italic leading-relaxed">
                  "The result? Talented people remain unemployed while companies can’t find job-ready talent."
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/10 blur-[120px] rounded-full opacity-30"></div>
              <div className="bg-zinc-900 border border-white/10 p-10 rounded-[2.5rem] relative overflow-hidden shadow-2xl">
                <div className="flex justify-between items-center mb-10">
                   <h4 className="font-bold text-zinc-500 text-xs uppercase tracking-widest">Skill Drift Index</h4>
                   <TrendingUp className="text-red-500" />
                </div>
                <div className="space-y-8">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm font-bold text-zinc-400"><span>Theoretical Knowledge</span><span>92%</span></div>
                    <div className="h-2 bg-zinc-950 rounded-full overflow-hidden"><div className="h-full bg-zinc-600 w-[92%]"></div></div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm font-bold text-zinc-400"><span>Applied Skill Readiness</span><span>24%</span></div>
                    <div className="h-2 bg-zinc-950 rounded-full overflow-hidden"><div className="h-full bg-red-500 w-[24%]"></div></div>
                  </div>
                  <div className="pt-8 border-t border-white/5">
                     <p className="text-xs text-zinc-500 uppercase font-black tracking-widest text-center">Bridging this void is our mission.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Solution Section */}
      <section id="solution" className="py-32 px-6 bg-black relative">
        <div className="max-w-4xl mx-auto text-center mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-[0.2em] mb-8">
            ✨ The SkillSync AI Solution
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-white mb-8">Direct Connections to Employment</h2>
          <p className="text-xl text-zinc-400 leading-relaxed mb-12">
            SkillSync AI connects education directly to employment using real-time job data and AI personalization. 
            We analyze thousands of job postings daily and turn them into clear, personalized learning pathways — built specifically for your career goals.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-emerald-400 font-bold text-sm uppercase tracking-widest">
            <span>No Guesswork</span>
            <span className="text-zinc-800">•</span>
            <span>No Outdated Advice</span>
            <span className="text-zinc-800">•</span>
            <span>Just Skills That Get You Hired</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-6">
           <div className="p-10 rounded-[2.5rem] bg-zinc-900/50 border border-white/10 hover:border-emerald-500/30 transition-all group">
              <div className="w-14 h-14 bg-zinc-900 rounded-2xl flex items-center justify-center text-emerald-500 mb-8 group-hover:scale-110 transition-transform">
                <Target size={30} />
              </div>
              <h4 className="text-xl font-black text-white mb-4">Choose Your Goal</h4>
              <p className="text-zinc-500 leading-relaxed">Tell us who you want to become — Data Analyst, AI Engineer, Product Manager, Cybersecurity Specialist, and more.</p>
           </div>
           <div className="p-10 rounded-[2.5rem] bg-zinc-900/50 border border-white/10 hover:border-emerald-500/30 transition-all group">
              <div className="w-14 h-14 bg-zinc-900 rounded-2xl flex items-center justify-center text-emerald-500 mb-8 group-hover:scale-110 transition-transform">
                <RefreshCcw size={30} />
              </div>
              <h4 className="text-xl font-black text-white mb-4">Real-Time Sync</h4>
              <p className="text-zinc-500 leading-relaxed">We sync with the live job market daily to ensure your learning path is never out of date with current employer needs.</p>
           </div>
           <div className="p-10 rounded-[2.5rem] bg-zinc-900/50 border border-white/10 hover:border-emerald-500/30 transition-all group">
              <div className="w-14 h-14 bg-zinc-900 rounded-2xl flex items-center justify-center text-emerald-500 mb-8 group-hover:scale-110 transition-transform">
                <BrainCircuit size={30} />
              </div>
              <h4 className="text-xl font-black text-white mb-4">AI Personalization</h4>
              <p className="text-zinc-500 leading-relaxed">Your pathway adapts to your existing skills, learning speed, and specific career ambitions automatically.</p>
           </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-32 px-6 bg-zinc-950 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center text-center mb-24">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-[0.2em] mb-8">
               🧠 How SkillSync AI Works
             </div>
             <h2 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter">Your Roadmap to Success</h2>
          </div>

          <div className="space-y-40 relative">
            <div className="absolute left-[50%] top-0 bottom-0 w-px bg-emerald-500/10 hidden lg:block"></div>
            
            {/* Step 1 */}
            <div className="flex flex-col lg:flex-row items-center gap-16 relative">
              <div className="lg:w-1/2 space-y-6 lg:text-right">
                <div className="text-emerald-500 font-mono text-3xl font-black">1️⃣</div>
                <h3 className="text-3xl font-black text-white uppercase">Choose Your Career Goal</h3>
                <p className="text-zinc-400 text-xl leading-relaxed">Tell us who you want to become — Data Analyst, AI Engineer, Product Manager, Cybersecurity Specialist, and more.</p>
              </div>
              <div className="lg:w-1/2 p-8 bg-zinc-900 rounded-3xl border border-white/10 shadow-2xl relative z-10 w-full max-w-md mx-auto">
                <div className="space-y-4">
                  {['Data Analyst', 'AI Engineer', 'Product Manager'].map(role => (
                    <div key={role} className="p-4 bg-zinc-950 border border-white/5 rounded-xl text-emerald-400 font-bold flex justify-between items-center group cursor-pointer hover:border-emerald-500/30 transition-all">
                      {role} <ChevronRight size={18} className="text-zinc-800 group-hover:text-emerald-500 transition-colors" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-16 relative">
              <div className="lg:w-1/2 space-y-6">
                <div className="text-emerald-500 font-mono text-3xl font-black">2️⃣</div>
                <h3 className="text-3xl font-black text-white uppercase">See What the Market Wants</h3>
                <p className="text-zinc-400 text-xl leading-relaxed">We analyze live job market data to show: Most in-demand skills, Tools employers expect, Salary trends, and Job availability by region.</p>
              </div>
              <div className="lg:w-1/2 p-8 bg-zinc-900 rounded-3xl border border-white/10 shadow-2xl relative z-10 w-full max-w-md mx-auto">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">Live Demand Heat</span>
                    <TrendingUp size={20} className="text-emerald-500" />
                  </div>
                  <div className="space-y-4">
                    <div className="h-2 bg-zinc-950 rounded-full"><div className="h-full bg-emerald-500 w-[88%] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div></div>
                    <div className="h-2 bg-zinc-950 rounded-full"><div className="h-full bg-emerald-500 w-[64%] rounded-full opacity-60"></div></div>
                    <div className="h-2 bg-zinc-950 rounded-full"><div className="h-full bg-emerald-500 w-[42%] rounded-full opacity-30"></div></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col lg:flex-row items-center gap-16 relative">
              <div className="lg:w-1/2 space-y-6 lg:text-right">
                <div className="text-emerald-500 font-mono text-3xl font-black">3️⃣</div>
                <h3 className="text-3xl font-black text-white uppercase">Get Your Personalized Path</h3>
                <p className="text-zinc-400 text-xl leading-relaxed">SkillSync AI builds a step-by-step plan: Skills to learn (in the right order), Free & trusted resources, Portfolio projects, and timelines that fit your schedule.</p>
              </div>
              <div className="lg:w-1/2 space-y-4 w-full max-w-md mx-auto">
                {[
                  { icon: <Clock />, label: 'Weekly Timelines' },
                  { icon: <BookOpen />, label: 'Trusted Resources' },
                  { icon: <Layout />, label: 'Hands-on Projects' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-5 bg-zinc-900 border border-white/10 rounded-2xl relative z-10">
                     <div className="text-emerald-500">{item.icon}</div>
                     <span className="font-bold text-zinc-300">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-16 relative">
              <div className="lg:w-1/2 space-y-6">
                <div className="text-emerald-500 font-mono text-3xl font-black">4️⃣</div>
                <h3 className="text-3xl font-black text-white uppercase">Track Progress & Get Hired</h3>
                <p className="text-zinc-400 text-xl leading-relaxed">Visual skill gap analysis, progress tracking dashboard, AI guidance & career tips, and priority access to employer pipelines.</p>
              </div>
              <div className="lg:w-1/2 p-10 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-3xl relative z-10 w-full max-w-md mx-auto text-center">
                <CheckCircle2 size={80} className="text-emerald-500 mx-auto mb-6 animate-pulse" />
                <h4 className="text-xl font-black text-white uppercase tracking-widest">Hired Ready</h4>
                <p className="text-zinc-500 text-sm mt-2">Verified Skill-Verified Pipeline Access</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Whom Section */}
      <section id="for-whom" className="py-32 px-6 bg-black border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-[0.2em] mb-8">
               🎯 Who SkillSync AI Is For
             </div>
             <h2 className="text-5xl font-black text-white">Empowering Every Career Journey</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Students & Graduates', desc: 'Discover job-ready skills, build strong portfolios, and reduce time to employment.', icon: <GraduationCap size={40}/> },
              { title: 'Career Changers', desc: 'Switch careers with clarity, focus only on skills that matter, and learn efficiently.', icon: <RefreshCcw size={40}/> },
              { title: 'Universities', desc: 'Boost graduate employability and align curriculum with industry needs.', icon: <Globe size={40}/> },
              { title: 'Employers', desc: 'Access skill-verified talent, reduce training costs, and build reliable pipelines.', icon: <Briefcase size={40}/> }
            ].map((card, i) => (
              <div key={i} className="p-8 rounded-[2rem] bg-zinc-900 border border-white/10 hover:border-emerald-500/50 transition-all text-center flex flex-col items-center">
                <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-2xl mb-8">
                  {card.icon}
                </div>
                <h4 className="text-xl font-black text-white mb-4">{card.title}</h4>
                <p className="text-zinc-500 text-sm leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-40 px-6 text-center relative overflow-hidden bg-black">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-emerald-500/10 blur-[200px] rounded-full"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-[0.2em] mb-12">
             🚀 Start Building Skills That Matter
          </div>
          <h2 className="text-5xl md:text-8xl font-black text-white mb-10 tracking-tighter uppercase leading-[0.9]">
            Your career path <br/> should be <span className="text-emerald-500">Clear.</span>
          </h2>
          <p className="text-xl md:text-2xl text-zinc-400 mb-16 max-w-2xl mx-auto leading-relaxed">
            SkillSync AI helps you learn the right skills — at the right time — for the right job.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button size="lg" onClick={onGetStarted} className="px-12 h-20 text-xl font-black shadow-2xl">👉 Get Started Free</Button>
            <div className="flex gap-6">
              <Button size="lg" variant="outline" className="h-20 border-zinc-800">Partner as a University</Button>
              <Button size="lg" variant="outline" className="h-20 border-zinc-800">Hire Talent with SkillSync</Button>
            </div>
          </div>

          <div className="max-w-md mx-auto p-8 bg-zinc-900 border border-white/10 rounded-3xl">
             <h4 className="text-white font-bold mb-6 flex items-center justify-center gap-2"><Mail size={18}/> Stay Ahead of the Market</h4>
             <div className="flex flex-col gap-4">
                <input type="email" placeholder="📧 Enter your email" className="bg-zinc-950 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-white" />
                <Button className="w-full">Get Early Access</Button>
             </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 px-6 border-t border-white/5 bg-[#050505]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 mb-24">
            <div className="space-y-8">
               <div className="flex items-center gap-3">
                 <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center text-zinc-950">
                   <Target size={22} strokeWidth={2.5} />
                 </div>
                 <span className="font-black text-2xl tracking-tighter uppercase text-white">SkillSync <span className="text-emerald-500 font-mono text-sm">AI</span></span>
               </div>
               <p className="text-zinc-500 text-sm leading-relaxed">Bridging education to employment with intelligent, real-time learning pathways.</p>
            </div>
            
            <div className="space-y-6">
              <h5 className="font-black text-white uppercase text-xs tracking-widest">Main</h5>
              <div className="flex flex-col gap-4 text-sm font-bold text-zinc-500">
                <a href="#" className="hover:text-emerald-400 transition-colors">About</a>
                <a href="#" className="hover:text-emerald-400 transition-colors">Careers</a>
                <a href="#" className="hover:text-emerald-400 transition-colors">Impact</a>
              </div>
            </div>

            <div className="space-y-6">
              <h5 className="font-black text-white uppercase text-xs tracking-widest">Partner</h5>
              <div className="flex flex-col gap-4 text-sm font-bold text-zinc-500">
                <a href="#" className="hover:text-emerald-400 transition-colors">For Universities</a>
                <a href="#" className="hover:text-emerald-400 transition-colors">For Employers</a>
                <a href="#" className="hover:text-emerald-400 transition-colors">Talent Pipeline</a>
              </div>
            </div>

            <div className="space-y-6">
              <h5 className="font-black text-white uppercase text-xs tracking-widest">Legal</h5>
              <div className="flex flex-col gap-4 text-sm font-bold text-zinc-500">
                <a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-emerald-400 transition-colors">Ethical Guidelines</a>
              </div>
            </div>
          </div>
          
          <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
             <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">© 2026 SkillSync AI. All rights reserved.</p>
             <div className="flex gap-8 text-zinc-600 text-[10px] font-black uppercase tracking-widest">
                <a href="#" className="hover:text-emerald-400 transition-colors">Twitter</a>
                <a href="#" className="hover:text-emerald-400 transition-colors">LinkedIn</a>
                <a href="#" className="hover:text-emerald-400 transition-colors">GitHub</a>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
