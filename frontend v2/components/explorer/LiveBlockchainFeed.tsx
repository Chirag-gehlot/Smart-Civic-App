import React, { useState, useEffect, useContext } from 'react';
import { BlockchainContext } from '../../contexts/BlockchainContext';
import { Block } from '../../types';

const LiveBlockchainFeed: React.FC = () => {
  const { chain } = useContext(BlockchainContext);
  const [highlightedBlock, setHighlightedBlock] = useState<Block | null>(null);

  useEffect(() => {
    if (chain.length > 0) {
      const latestBlock = chain[chain.length - 1];
      if (latestBlock.block_index > 0) {
        setHighlightedBlock(latestBlock);
        const timer = setTimeout(() => setHighlightedBlock(null), 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [chain]);

  return (
    <div className="bg-slate-800 text-white p-4 rounded-lg shadow-inner relative h-48 overflow-y-auto">
        <h4 className="text-lg font-semibold mb-2 text-teal-400">Live Feed</h4>
        <div className="absolute top-4 right-4 flex items-center">
            <span className="relative flex h-3 w-3">
                <span className="animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="ml-2 text-sm text-green-300">LIVE</span>
        </div>
        
        {highlightedBlock ? (
            <div className="bg-indigo-500/20 p-3 rounded-md border border-teal-500 animate-fade-in">
              <p className="font-mono text-sm">
                <span className="text-green-400">New Block Mined!</span>
              </p>
              <p className="font-mono text-xs text-gray-300">
                Index: <span className="text-yellow-400">{highlightedBlock.block_index}</span> | TXs: <span className="text-yellow-400">{highlightedBlock.transactions.length}</span>
              </p>
              <p className="font-mono text-xs text-gray-300 truncate">
                Hash: <span className="text-teal-400">{highlightedBlock.block_hash}</span>
              </p>
            </div>
        ) : (
            <div className="text-center text-gray-400 pt-8">
                <p>Waiting for new blocks...</p>
            </div>
        )}
    </div>
  );
};

export default LiveBlockchainFeed;