import { Role, User, Election, Candidate, ElectionStatus, Block, Transaction, Node } from '../types';

export const MOCK_USERS: User[] = [
  { id: 'user-0', name: 'Guest', role: Role.Guest, organization: 'Public', organizations: ['Public'], avatarUrl: 'https://picsum.photos/seed/guest/100/100', status: 'Verified' },
  { id: 'user-1', name: 'Alice Johnson', role: Role.Voter, organization: 'City of Metropolis', organizations: ['City of Metropolis'], avatarUrl: 'https://picsum.photos/seed/alice/100/100', status: 'Verified', mobile: '8446657068' },
  { id: 'user-2', name: 'Bob Williams', role: Role.OrgAdmin, organization: 'State of Utopia', organizations: ['State of Utopia', 'City of Metropolis'], avatarUrl: 'https://picsum.photos/seed/bob/100/100', status: 'Verified', mobile: '555-0102' },
  { id: 'user-3', name: 'Charlie Brown', role: Role.SuperAdmin, organization: 'CivicTrust Corp', organizations: ['CivicTrust Corp'], avatarUrl: 'https://picsum.photos/seed/charlie/100/100', status: 'Verified', mobile: '555-0103' },
  { id: 'user-4', name: 'Diana Prince', role: Role.Auditor, organization: 'Transparency International', organizations: ['Transparency International'], avatarUrl: 'https://picsum.photos/seed/diana/100/100', status: 'Verified', mobile: '555-0104' },
  { id: 'user-5', name: 'Eve Adams', role: Role.Voter, organization: 'State of Utopia', organizations: ['State of Utopia'], avatarUrl: 'https://picsum.photos/seed/eve/100/100', status: 'Verified', mobile: '555-0105' },
  { id: 'user-6', name: 'Frank Castle', role: Role.Voter, organization: 'City of Metropolis', organizations: ['City of Metropolis'], avatarUrl: 'https://picsum.photos/seed/frank/100/100', status: 'Unverified', mobile: '555-0106' },
];

export const MOCK_CANDIDATES: Candidate[] = [
  { candidate_id: 'cand-1', full_name: 'John Doe', photo_url: 'https://picsum.photos/seed/johndoe/200/200', short_bio: 'Experienced leader focused on economic growth and community development.', party: 'Innovate Party' },
  { candidate_id: 'cand-2', full_name: 'Jane Smith', photo_url: 'https://picsum.photos/seed/janesmith/200/200', short_bio: 'Champion for environmental protection and social justice for all citizens.', party: 'Progressive Alliance' },
  { candidate_id: 'cand-3', full_name: 'Robert Paulson', photo_url: 'https://picsum.photos/seed/robertp/200/200', short_bio: 'Advocating for fiscal responsibility and transparent governance.', party: 'Liberty Union' },
  { candidate_id: 'cand-4', full_name: 'Maria Garcia', photo_url: 'https://picsum.photos/seed/mariag/200/200', short_bio: 'Dedicated to improving public education and healthcare infrastructure.', party: 'Future Forward' },
];

const now = new Date();
const MOCK_VOTERS = MOCK_USERS.filter(u => u.role === Role.Voter).map(u => ({ voter_id: u.id, name: u.name, email: `${u.name.split(' ')[0].toLowerCase()}@email.com`, phone: u.mobile || '' }));

export const MOCK_ELECTIONS: Election[] = [
  { id: 'elec-1', name: 'Metropolis Mayoral Election 2024', organization: 'City of Metropolis', description: 'Electing the next mayor for the City of Metropolis.', status: ElectionStatus.Active, startDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(), endDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(), candidates: MOCK_CANDIDATES.slice(0, 2), voters: MOCK_VOTERS, votes: [], isDemo: true },
  { id: 'elec-2', name: 'Utopia Gubernatorial Primary', organization: 'State of Utopia', description: 'Primary election for the governor of the State of Utopia.', status: ElectionStatus.Published, startDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(), endDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString(), candidates: MOCK_CANDIDATES.slice(2, 4), voters: MOCK_VOTERS, votes: [], isDemo: false },
  { id: 'elec-3', name: 'Annual Board of Directors Vote', organization: 'City of Metropolis', description: 'Annual election for the corporate Board of Directors.', status: ElectionStatus.Draft, startDate: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000).toISOString(), endDate: new Date(now.getTime() + 25 * 24 * 60 * 60 * 1000).toISOString(), candidates: MOCK_CANDIDATES, voters: MOCK_VOTERS, votes: [], isDemo: false },
  { id: 'elec-4', name: 'Utopia State Referendum', organization: 'State of Utopia', description: 'State-wide referendum on Proposition Z.', status: ElectionStatus.Closed, startDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(), endDate: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(), candidates: [{ candidate_id: 'prop-yes', full_name: 'Yes on Prop Z', photo_url: 'https://picsum.photos/seed/yes/200/200', short_bio: 'Vote YES to approve the proposition.', party: 'Pro-Prop Z' }, { candidate_id: 'prop-no', full_name: 'No on Prop Z', photo_url: 'https://picsum.photos/seed/no/200/200', short_bio: 'Vote NO to reject the proposition.', party: 'Anti-Prop Z' }], voters: MOCK_VOTERS, votes: [], isDemo: true },
];


const GENESIS_BLOCK: Block = {
  block_index: 0,
  timestamp: new Date('2023-01-01T00:00:00.000Z').toISOString(),
  previous_hash: '0',
  merkle_root: '0'.repeat(64),
  nonce: 0,
  transactions: [],
  block_hash: '0000a7d823a3f3e2e6c2b1f0b8b1a3b0f2d7e4c3d8f3e2a1b0c8d4e9f0a2b1c0',
};

const MOCK_TRANSACTIONS: Transaction[] = [
    { tx_hash: 'tx-hash-1', election_id: 'elec-4', candidate_id: 'prop-yes', voter_hashed_id: 'voter-hash-1', timestamp: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000).toISOString() },
    { tx_hash: 'tx-hash-2', election_id: 'elec-4', candidate_id: 'prop-no', voter_hashed_id: 'voter-hash-2', timestamp: new Date(now.getTime() - 24 * 24 * 60 * 60 * 1000).toISOString() },
];
MOCK_ELECTIONS.find(e => e.id === 'elec-4')!.votes = MOCK_TRANSACTIONS;

const BLOCK_1: Block = {
    block_index: 1,
    timestamp: new Date(now.getTime() - 23 * 24 * 60 * 60 * 1000).toISOString(),
    previous_hash: GENESIS_BLOCK.block_hash,
    merkle_root: 'mock-merkle-root-1',
    nonce: 12345,
    transactions: MOCK_TRANSACTIONS,
    block_hash: '0000b8e9f0a2b1c0d4e9f0a2b1c0d8f3e2a1b0c8d4e9f0a2b1c0a7d823a3f3e2',
};

export const INITIAL_LEDGER: Block[] = [GENESIS_BLOCK, BLOCK_1];

export const MOCK_NODES: Node[] = [
    { id: 'Node-Alpha-US-East', status: 'Online', blockHeight: 1, lastReceived: new Date().toISOString() },
    { id: 'Node-Beta-EU-West', status: 'Online', blockHeight: 1, lastReceived: new Date(Date.now() - 2000).toISOString() },
    { id: 'Node-Gamma-AP-South', status: 'Offline', blockHeight: 1, lastReceived: new Date(Date.now() - 5 * 60 * 1000).toISOString() },
    { id: 'Node-Delta-SA-East', status: 'Online', blockHeight: 1, lastReceived: new Date(Date.now() - 5000).toISOString() },
];
