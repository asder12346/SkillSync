
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export interface Skill {
  name: string;
  level: number; // 0-100
  targetLevel: number;
  category: 'technical' | 'soft' | 'domain';
}

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  type: 'course' | 'project' | 'certification';
  skills: string[];
  status: 'not_started' | 'in_progress' | 'completed';
  provider?: string;
}

export interface CareerPathway {
  id: string;
  goal: string;
  marketDemand: 'high' | 'medium' | 'low';
  estimatedSalary: string;
  modules: LearningModule[];
  matchPercentage: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  isError?: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  currentRole: string;
  education: string;
  yearsOfExp: string;
  industry: string;
  goal: string;
  experienceLevel: 'entry' | 'mid' | 'senior';
  timeAvailability: string; // hours per week
  learningStyle: string;
  skillsAssessment: Record<string, number>;
}

export type AppView = 
  | 'landing' | 'pricing' | 'about' | 'auth' 
  | 'onboarding' | 'dashboard' | 'pathway' 
  | 'skills' | 'coach' | 'market' | 'portfolio' 
  | 'matching' | 'settings';

export interface LoadingState {
  isActive: boolean;
  message: string;
  error?: string | null;
}
