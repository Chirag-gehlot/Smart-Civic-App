
import React, { createContext, useState, ReactNode, useContext, useCallback } from 'react';
import { Block, Transaction } from '../types';
import { INITIAL_LEDGER } from '../data/mockData';
import { createNewBlock } from '../services/blockchainService';
import { ElectionContext } from './ElectionContext';
import { useToast } from './ToastContext';

interface BlockchainContextType {
  chain: Block[];
  addTransaction: (transaction: Transaction) => Promise<void>;
  getLatestBlock: () => Block;
}

export const BlockchainContext = createContext<BlockchainContextType>({
  chain: [],
  addTransaction: async () => {},
  getLatestBlock: () => INITIAL_LEDGER[INITIAL_LEDGER.length - 1],
});

export const BlockchainProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [chain, setChain] = useState<Block[]>(INITIAL_LEDGER);
  const { addVoteToElection } = useContext(ElectionContext);
  const { addToast } = useToast();

  const getLatestBlock = useCallback(() => {
    return chain[chain.length - 1];
  }, [chain]);

  const addTransaction = useCallback(async (transaction: Transaction) => {
    // In a real scenario, transactions would be pooled before mining.
    // Here we simulate mining a new block for each transaction instantly.
    addToast('Mining new block...', 'info');
    const latestBlock = getLatestBlock();
    const newBlock = await createNewBlock([transaction], latestBlock);
    
    setChain(prevChain => [...prevChain, newBlock]);
    addVoteToElection(transaction.election_id, transaction);
    addToast('Block successfully added to the chain!', 'success');

  }, [getLatestBlock, addVoteToElection, addToast]);

  const value = {
    chain,
    addTransaction,
    getLatestBlock,
  };

  return <BlockchainContext.Provider value={value}>{children}</BlockchainContext.Provider>;
};
