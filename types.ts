export interface DaoLaunch {
  id: string;
  name: string;
  token: string;
  treasury: number;
  launchDate: string;
  proposals: number | null;
}

export interface StartupKpis {
  mrr: number;
  cac: number;
  churnRate: string;
  burnRate: number;
  runway: number;
}

export interface KickstarterProject {
  id: string;
  name: string;
  goal: number;
  pledged: number;
  backers: number;
}

export type View = 'dashboard' | 'dao' | 'kickstarter' | 'chat' | 'live';

// FIX: Made uri and title optional to match the GroundingChunk type from the @google/genai SDK, resolving a type incompatibility.
export interface GroundingChunk {
  web?: {
    uri?: string;
    title?: string;
  };
  maps?: {
    uri?: string;
    title?: string;
  };
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  groundingSources?: GroundingChunk[];
}