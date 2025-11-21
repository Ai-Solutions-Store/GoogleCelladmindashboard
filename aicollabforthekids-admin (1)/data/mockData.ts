
import { type DaoLaunch, type KickstarterProject, type StartupKpis, type AuditLog, type AntigravityApplicant } from '../types';

export const initialDaoLaunches: DaoLaunch[] = [
  { id: '1', name: 'YouAndI-AI Seed Round', token: 'YAI', treasury: 2_500_000, launchDate: '2024-09-17T00:00:00.000Z', proposals: null },
  { id: '2', name: 'Series A Funding', token: 'YAI-A', treasury: 12_000_000, launchDate: '2025-03-02T00:00:00.000Z', proposals: null },
  { id: '3', name: 'Community Governance Grant', token: 'YAI-GOV', treasury: 780_000, launchDate: '2024-12-17T00:00:00.000Z', proposals: null },
  { id: '4', name: 'Ecosystem Fund', token: 'YAI-ECO', treasury: 5_700_000, launchDate: '2025-01-18T00:00:00.000Z', proposals: null },
];

export const initialKickstarterProjects: KickstarterProject[] = [
    { id: 'ks1', name: 'Perfection App Launch', goal: 50000, pledged: 78471, backers: 980 },
    { id: 'ks2', name: 'Realness Gems Feature', goal: 25000, pledged: 42642, backers: 650 },
    { id: 'ks3', name: 'Global Launch Marketing', goal: 100000, pledged: 83193, backers: 1200 },
    { id: 'ks4', name: 'Human Verifier Program', goal: 10000, pledged: 19382, backers: 350 },
    { id: 'ks5', name: 'Truth or Dare Game Dev', goal: 15000, pledged: 23416, backers: 450 },
];

export const initialStartupKpis: StartupKpis = {
  mrr: 125000,
  cac: 120,
  churnRate: '2.5%',
  burnRate: 45000,
  runway: 18,
};

export const initialAuditLogs: AuditLog[] = [
    { 
      id: '1', 
      action: 'System Init', 
      details: 'Dashboard initialized successfully', 
      user: 'System', 
      timestamp: new Date(Date.now() - 86400000).toISOString(), 
      status: 'success',
      metadata: { actionType: 'none' }
    },
    { 
      id: '2', 
      action: 'Login Failed', 
      details: 'Multiple failed attempts from IP 192.168.1.55', 
      user: 'suspicious_user', 
      timestamp: new Date(Date.now() - 4500000).toISOString(), 
      status: 'failure',
      metadata: { targetId: 'suspicious_user', targetType: 'user', actionType: 'security' }
    },
    { 
      id: '3', 
      action: 'Sync Error', 
      details: 'Failed to sync with GitHub repository Trollz1004/AiCollabFortheKids', 
      user: 'System', 
      timestamp: new Date(Date.now() - 3600000).toISOString(), 
      status: 'failure',
      metadata: { targetId: 'Trollz1004/AiCollabFortheKids', targetType: 'repo', actionType: 'retry' }
    },
    { 
      id: '4', 
      action: 'Admin Login', 
      details: 'User joshlcoleman@gmail.com logged in', 
      user: 'joshlcoleman@gmail.com', 
      timestamp: new Date(Date.now() - 1800000).toISOString(), 
      status: 'success',
      metadata: { actionType: 'none' }
    },
];

export const initialAntigravityApplicants: AntigravityApplicant[] = [
    {
        id: 'ag1',
        name: 'Dr. Elena Vostok',
        email: 'elena.v@mit.edu',
        specialty: 'Physics Engine',
        github: 'evostok_physics',
        pitch: 'Developing a quantum-resistant physics engine for the Kids Metaverse.',
        status: 'under_review',
        score: 94,
        appliedAt: '2025-10-15T10:00:00Z'
    },
    {
        id: 'ag2',
        name: 'Marcus Thorne',
        email: 'm.thorne@dev.io',
        specialty: 'Blockchain',
        github: 'thorne_contracts',
        pitch: 'Zero-knowledge proof identity system for child safety compliance.',
        status: 'accepted',
        score: 98,
        appliedAt: '2025-10-12T14:30:00Z'
    },
    {
        id: 'ag3',
        name: 'Sarah Jenkins',
        email: 'sarah.j@ai-labs.co',
        specialty: 'AI/ML',
        github: 'sarahj_ai',
        pitch: 'Generative storytelling model specifically tuned for therapeutic content.',
        status: 'pending',
        score: 88,
        appliedAt: '2025-10-18T09:15:00Z'
    },
    {
        id: 'ag4',
        name: 'Kenji Sato',
        email: 'kenji@tokyo-dev.jp',
        specialty: 'Full Stack',
        github: 'ksato_dev',
        pitch: 'Real-time translation bridge for global kids collaboration.',
        status: 'pending',
        score: 85,
        appliedAt: '2025-10-19T16:45:00Z'
    },
    {
        id: 'ag5',
        name: 'Alex "Cipher" Moon',
        email: 'cipher@protonmail.com',
        specialty: 'Blockchain',
        github: 'cipher_moon',
        pitch: 'DAO governance tools for youth councils.',
        status: 'rejected',
        score: 62,
        appliedAt: '2025-10-01T11:20:00Z'
    }
];
