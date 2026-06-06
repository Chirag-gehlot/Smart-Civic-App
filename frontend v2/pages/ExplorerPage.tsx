import React, { useContext, useState, useEffect } from 'react';
import { BlockchainContext } from '../contexts/BlockchainContext';
import { Block, Node, Transaction } from '../types';
import { MOCK_NODES } from '../data/mockData';
import { verifyChain } from '../services/blockchainService';
import { useToast } from '../contexts/ToastContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import LiveBlockchainFeed from '../components/explorer/LiveBlockchainFeed';
import { sha256 } from '../utils/crypto';
import Button from '../components/ui/Button';

const BlockDetails: React.FC<{ block: Block }> = ({ block }) => (
    <Card className="p-6 font-mono text-xs">
        <h3 className="text-lg font-semibold text-indigo-900 mb-4 font-sans">Block #{block.block_index} Details</h3>
        <div className="space-y-2 break-all">
            <p><span className="font-semibold text-slate-600">Timestamp:</span> {new Date(block.timestamp).toLocaleString()}</p>
            <p><span className="font-semibold text-slate-600">Transactions:</span> {block.transactions.length}</p>
            <p><span className="font-semibold text-slate-600">Nonce:</span> {block.nonce}</p>
            <p><span className="font-semibold text-slate-600">Prev Hash:</span> <span className="text-red-600">{block.previous_hash}</span></p>
            <p><span className="font-semibold text-slate-600">Merkle Root:</span> <span className="text-purple-600">{block.merkle_root}</span></p>
            <p className="pt-2 border-t mt-2"><span className="font-semibold text-slate-600">Block Hash:</span> <span className="text-green-600 font-bold">{block.block_hash}</span></p>
        </div>
    </Card>
);

const TransactionDetails: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => (
    <Card className="p-6">
        <h3 className="text-lg font-semibold text-indigo-900 mb-4 font-sans">Transactions in Selected Block</h3>
        {transactions.length > 0 ? (
            <div className="space-y-4 max-h-96 overflow-y-auto">
                {transactions.map(tx => (
                    <div key={tx.tx_hash} className="bg-slate-50 p-3 rounded font-mono text-xs break-all">
                        <p><span className="font-semibold text-slate-600">Hash:</span> <span className="text-teal-600">{tx.tx_hash}</span></p>
                        <p><span className="font-semibold text-slate-600">Election:</span> {tx.election_id}</p>
                    </div>
                ))}
            </div>
        ) : <p className="text-slate-500">No transactions in this block.</p>}
    </Card>
);


const HashingDemo: React.FC = () => {
    const [input, setInput] = useState('Hello, Blockchain!');
    const [hash, setHash] = useState('');

    useEffect(() => {
        const calculateHash = async () => {
            const result = await sha256(input);
            setHash(result);
        };
        calculateHash();
    }, [input]);

    return (
        <Card className="p-6">
            <h3 className="text-lg font-semibold text-indigo-900 mb-4 font-sans">Hashing Demo (SHA-256)</h3>
            <textarea value={input} onChange={e => setInput(e.target.value)} className="w-full p-2 border rounded font-mono text-sm h-24" />
            <div className="mt-2 p-2 bg-slate-100 rounded font-mono text-xs break-all text-green-700">{hash}</div>
            <p className="text-xs text-slate-500 mt-2">Notice how even a tiny change in the input data drastically changes the output hash.</p>
        </Card>
    )
}

const ExplorerPage: React.FC = () => {
    const { chain } = useContext(BlockchainContext);
    const { addToast } = useToast();
    const [selectedBlock, setSelectedBlock] = useState<Block>(chain[chain.length - 1]);
    const [nodes, setNodes] = useState<Node[]>(MOCK_NODES);
    const [isVerifying, setIsVerifying] = useState(false);

    useEffect(() => {
        const updateInterval = setInterval(() => {
            setNodes(prevNodes => prevNodes.map(node => ({
                ...node,
                status: Math.random() > 0.1 ? 'Online' : 'Offline',
                blockHeight: chain.length - 1,
                lastReceived: new Date(Date.now() - Math.random() * 3000).toISOString()
            })));
        }, 2500);

        return () => clearInterval(updateInterval);
    }, [chain.length]);

    const handleVerifyChain = async () => {
        setIsVerifying(true);
        const isValid = await verifyChain(chain);
        if (isValid) {
            addToast('Chain integrity verified successfully!', 'success');
        } else {
            addToast('Chain verification failed! Potential tampering detected.', 'error');
        }
        setIsVerifying(false);
    };

    return (
        <div className="bg-slate-50 min-h-screen">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <header className="mb-8">
                    <h1 className="text-4xl font-bold text-indigo-900">Blockchain Explorer</h1>
                    <p className="text-lg text-slate-600 mt-1">Inspect the distributed ledger in real-time.</p>
                </header>
                
                {/* Block Timeline */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">Chain Visualization</h2>
                    <div className="bg-white p-4 rounded-xl shadow-sm">
                        <div className="flex overflow-x-auto space-x-2 p-2">
                            {chain.map(block => (
                                <div key={block.block_index} onClick={() => setSelectedBlock(block)} className={`flex-shrink-0 p-3 w-32 h-32 flex flex-col justify-center items-center rounded-md cursor-pointer transition-all border-2 ${selectedBlock.block_index === block.block_index ? 'bg-indigo-100 border-indigo-500' : 'bg-slate-100 border-slate-200 hover:border-indigo-400'}`}>
                                    <span className="text-xs text-slate-500">Block</span>
                                    <span className="text-2xl font-bold text-indigo-900">{block.block_index}</span>
                                    <span className="text-xs text-slate-500">{block.transactions.length} TXs</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
                
                {/* Details Section */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <BlockDetails block={selectedBlock} />
                    <TransactionDetails transactions={selectedBlock.transactions} />
                </section>

                {/* Network & Tools Section */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="md:col-span-2 lg:col-span-1">
                        <LiveBlockchainFeed />
                    </div>
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold text-indigo-900 mb-4 font-sans">Network Nodes</h3>
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {nodes.map(node => (
                                <div key={node.id} className="flex justify-between items-center text-sm">
                                    <span className="font-semibold text-slate-700">{node.id}</span>
                                    <Badge status={node.status} />
                                </div>
                            ))}
                        </div>
                    </Card>
                    <div className="md:col-span-2 lg:col-span-1 flex flex-col space-y-4">
                        <Card className="p-6">
                             <h3 className="text-lg font-semibold text-indigo-900 mb-4 font-sans">Chain Integrity</h3>
                             <p className="text-sm text-slate-600 mb-4">Verify the cryptographic links between all blocks in the chain.</p>
                             <Button onClick={handleVerifyChain} disabled={isVerifying} className="w-full">
                                {isVerifying ? 'Verifying...' : 'Verify Chain'}
                             </Button>
                        </Card>
                        <HashingDemo />
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ExplorerPage;