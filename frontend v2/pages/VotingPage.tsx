import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ElectionContext } from '../contexts/ElectionContext';
import { AuthContext } from '../contexts/AuthContext';
import { BlockchainContext } from '../contexts/BlockchainContext';
import { createVoteTransaction } from '../services/blockchainService';
import { Election, Candidate, Transaction } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import CountdownTimer from '../components/voting/CountdownTimer';

const ConfirmationModal: React.FC<{ candidate: Candidate, onConfirm: () => void, onCancel: () => void, isSubmitting: boolean }> = ({ candidate, onConfirm, onCancel, isSubmitting }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="max-w-md w-full p-6 m-4">
                <h2 className="text-2xl font-bold text-indigo-900">Confirm Your Vote</h2>
                <p className="mt-2 text-slate-600">You are about to cast your vote for:</p>
                <div className="my-4 p-4 bg-slate-100 rounded-lg flex items-center">
                    <img src={candidate.photo_url} alt={candidate.full_name} className="w-16 h-16 rounded-full mr-4" />
                    <div>
                        <p className="font-semibold text-lg">{candidate.full_name}</p>
                        <p className="text-sm text-slate-500">{candidate.party}</p>
                    </div>
                </div>
                <p className="text-sm text-slate-500">This action is irreversible. Once submitted, your vote will be recorded on the blockchain.</p>
                <div className="mt-6 flex justify-end space-x-3">
                    <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>Cancel</Button>
                    <Button onClick={onConfirm} disabled={isSubmitting}>
                        {isSubmitting ? 'Casting Vote...' : 'Submit Vote'}
                    </Button>
                </div>
            </Card>
        </div>
    );
};

const ReceiptView: React.FC<{ transaction: Transaction }> = ({ transaction }) => {
    return (
        <Card className="max-w-2xl mx-auto p-8 text-center animate-fade-in-up">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 className="mt-4 text-2xl font-bold text-indigo-900">Vote Cast Successfully!</h2>
            <p className="mt-2 text-slate-600">Your vote has been securely recorded on the blockchain.</p>
            <div className="mt-6 text-left bg-slate-50 p-4 rounded-lg font-mono text-sm break-all">
                <p><span className="font-semibold text-slate-800">Transaction Hash:</span></p>
                <p className="text-teal-600">{transaction.tx_hash}</p>
            </div>
            <p className="mt-4 text-xs text-slate-500">You can use this hash to verify your vote in the Blockchain Explorer.</p>
            <div className="mt-6 flex justify-center space-x-4">
                <Link to="/explorer"><Button variant="secondary">Go to Explorer</Button></Link>
                <Link to="/e-voting"><Button>Back to Elections</Button></Link>
            </div>
        </Card>
    );
};

const VotingPage: React.FC = () => {
    const { electionId } = useParams<{ electionId: string }>();
    const navigate = useNavigate();
    const { getElectionById } = useContext(ElectionContext);
    const { user } = useContext(AuthContext);
    const { addTransaction } = useContext(BlockchainContext);

    const [election, setElection] = useState<Election | null>(null);
    const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [voteReceipt, setVoteReceipt] = useState<Transaction | null>(null);

    useEffect(() => {
        if (electionId) {
            const foundElection = getElectionById(electionId);
            if (foundElection) {
                setElection(foundElection);
            } else {
                navigate('/e-voting');
            }
        }
    }, [electionId, getElectionById, navigate]);

    const handleVote = (candidate: Candidate) => {
        setSelectedCandidate(candidate);
        setShowConfirmation(true);
    };

    const confirmVote = async () => {
        if (!election || !selectedCandidate || !user) return;
        
        setIsSubmitting(true);
        const transaction = await createVoteTransaction(election.id, selectedCandidate.candidate_id, user.id);
        await addTransaction(transaction);
        
        setVoteReceipt(transaction);
        setShowConfirmation(false);
        setIsSubmitting(false);
    };

    if (!election) return <div>Loading...</div>;

    if (voteReceipt) {
        return <div className="py-12 px-4"><ReceiptView transaction={voteReceipt} /></div>;
    }

    return (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <header className="text-center mb-12">
                <h1 className="text-4xl font-bold text-indigo-900">{election.name}</h1>
                <p className="text-lg text-slate-600 mt-2">{election.description}</p>
            </header>
            
            <Card className="p-6 mb-8">
                <h2 className="text-xl font-semibold text-center text-slate-700 mb-4">Voting Closes In</h2>
                <CountdownTimer endDate={election.endDate} />
            </Card>

            <div>
                <h2 className="text-2xl font-bold text-indigo-900 mb-6 text-center">Select Your Candidate</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {election.candidates.map(candidate => (
                        <Card key={candidate.candidate_id} className="text-center p-6 transition-all hover:shadow-xl hover:border-indigo-500">
                            <img src={candidate.photo_url} alt={candidate.full_name} className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-slate-200" />
                            <h3 className="text-xl font-bold text-slate-800">{candidate.full_name}</h3>
                            <p className="text-sm font-medium text-teal-600">{candidate.party}</p>
                            <p className="text-sm text-slate-600 mt-2 h-20 overflow-hidden">{candidate.short_bio}</p>
                            <Button className="mt-4" onClick={() => handleVote(candidate)}>
                                Vote for {candidate.full_name.split(' ')[0]}
                            </Button>
                        </Card>
                    ))}
                </div>
            </div>

            {showConfirmation && selectedCandidate && (
                <ConfirmationModal 
                    candidate={selectedCandidate}
                    onConfirm={confirmVote}
                    onCancel={() => setShowConfirmation(false)}
                    isSubmitting={isSubmitting}
                />
            )}
        </div>
    );
};

export default VotingPage;