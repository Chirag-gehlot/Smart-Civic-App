
export enum Role {
  SuperAdmin = "Super Admin",
  OrgAdmin = "Organization Admin",
  Auditor = "Auditor",
  Voter = "Voter",
  Guest = "Public / Guest",
}

export interface User {
  id: string;
  name: string;
  role: Role;
  organization: string;
  organizations: string[];
  avatarUrl: string;
  status: 'Verified' | 'Unverified';
  mobile?: string;
}

export enum ElectionStatus {
  Draft = "Draft",
  Published = "Published",
  Active = "Active",
  Closed = "Closed",
}

export interface Candidate {
  candidate_id: string;
  full_name: string;
  photo_url: string;
  short_bio: string;
  party: string;
}

export interface VoterInfo {
  voter_id: string;
  name: string;
  email: string;
  phone: string;
}

export interface Transaction {
  tx_hash: string;
  election_id: string;
  candidate_id: string;
  voter_hashed_id: string;
  timestamp: string; // ISO
}

export interface Election {
  id: string;
  name: string;
  organization: string;
  description: string;
  status: ElectionStatus;
  startDate: string; // ISO
  endDate: string; // ISO
  candidates: Candidate[];
  voters: VoterInfo[];
  votes: Transaction[];
  isDemo: boolean;
}

export interface Block {
  block_index: number;
  timestamp: string; // ISO
  previous_hash: string;
  merkle_root: string;
  nonce: number;
  transactions: Transaction[];
  block_hash: string;
}

export interface Node {
  id: string;
  status: 'Online' | 'Offline';
  blockHeight: number;
  lastReceived: string; // ISO
}
