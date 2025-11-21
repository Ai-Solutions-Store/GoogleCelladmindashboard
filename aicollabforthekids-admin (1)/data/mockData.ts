
import { type DaoLaunch, type KickstarterProject, type StartupKpis, type AuditLog, type AntigravityApplicant } from '../types';

// 🚨 OPERATION PURGE COMPLETE - All fake data removed
// These exports remain for type safety during API integration
// NEVER populate with fake data - API responses ONLY

export const initialDaoLaunches: DaoLaunch[] = [];

export const initialKickstarterProjects: KickstarterProject[] = [];

export const initialStartupKpis: StartupKpis = {
  mrr: 0,
  cac: 0,
  churnRate: '0%',
  burnRate: 0,
  runway: 0,
};

export const initialAuditLogs: AuditLog[] = [];

export const initialAntigravityApplicants: AntigravityApplicant[] = [];
