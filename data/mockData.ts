import { type DaoLaunch, type KickstarterProject, type StartupKpis } from '../types';

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