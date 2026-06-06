
import { sha256 } from '../utils/crypto';
import { Transaction, Block } from '../types';

export const createVoteTransaction = async (electionId: string, candidateId: string, voterId: string): Promise<Transaction> => {
  const timestamp = new Date().toISOString();
  const voter_hashed_id = await sha256(voterId + timestamp);
  const payload = { election_id: electionId, candidate_id: candidateId, voter_hashed_id, timestamp };
  const tx_hash = await sha256(JSON.stringify(payload));

  return { ...payload, tx_hash };
};

export const calculateMerkleRoot = async (transactions: Transaction[]): Promise<string> => {
  if (transactions.length === 0) {
    return '0'.repeat(64);
  }
  const txHashes = transactions.map(tx => tx.tx_hash);
  // A simplified Merkle root calculation for demonstration
  let combinedHashes = txHashes.join('');
  return await sha256(combinedHashes);
};

export const createNewBlock = async (transactions: Transaction[], previousBlock: Block): Promise<Block> => {
  const block_index = previousBlock.block_index + 1;
  const timestamp = new Date().toISOString();
  const previous_hash = previousBlock.block_hash;
  const merkle_root = await calculateMerkleRoot(transactions);
  
  // Proof-of-work simulation (simple nonce finding)
  let nonce = 0;
  let block_hash = '';
  while (!block_hash.startsWith('0000')) {
    nonce++;
    block_hash = await sha256(block_index + timestamp + previous_hash + merkle_root + nonce + JSON.stringify(transactions));
  }

  return {
    block_index,
    timestamp,
    previous_hash,
    merkle_root,
    nonce,
    transactions,
    block_hash,
  };
};

export const verifyChain = async (chain: Block[]): Promise<boolean> => {
  for (let i = 1; i < chain.length; i++) {
    const currentBlock = chain[i];
    const previousBlock = chain[i - 1];

    // Verify previous hash link
    if (currentBlock.previous_hash !== previousBlock.block_hash) {
      return false;
    }

    // Verify block hash integrity
    const recomputedHash = await sha256(
      currentBlock.block_index +
      currentBlock.timestamp +
      currentBlock.previous_hash +
      currentBlock.merkle_root +
      currentBlock.nonce +
      JSON.stringify(currentBlock.transactions)
    );

    if (currentBlock.block_hash !== recomputedHash) {
      return false;
    }
  }
  return true;
};
