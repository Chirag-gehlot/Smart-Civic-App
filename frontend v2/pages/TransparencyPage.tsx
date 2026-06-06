import React, { useContext, useMemo, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';
import { ElectionContext } from '../contexts/ElectionContext';
import { SiteContext } from '../contexts/SiteContext';
import { Election, ElectionStatus } from '../types';
import Card from '../components/ui/Card';

const COLORS = ['#3949AB', '#26A69A', '#5C6BC0', '#80CBC4'];

const TransparencyPage: React.FC = () => {
    const { elections } = useContext(ElectionContext);
    const { currentOrganization } = useContext(SiteContext);
    const [selectedElectionId, setSelectedElectionId] = useState('');

    const closedElections = useMemo(() => {
        return elections.filter(e => e.organization === currentOrganization && e.status === ElectionStatus.Closed);
    }, [elections, currentOrganization]);

    const selectedElection = useMemo(() => {
        const election = closedElections.find(e => e.id === selectedElectionId);
        if (election) return election;
        return closedElections.length > 0 ? closedElections[0] : null;
    }, [selectedElectionId, closedElections]);

    const resultsData = useMemo(() => {
        if (!selectedElection) return [];
        
        const voteCounts = new Map<string, number>();
        selectedElection.votes.forEach(vote => {
            voteCounts.set(vote.candidate_id, (voteCounts.get(vote.candidate_id) || 0) + 1);
        });

        return selectedElection.candidates.map(candidate => ({
            name: candidate.full_name,
            votes: voteCounts.get(candidate.candidate_id) || 0,
        }));
    }, [selectedElection]);
    
    const turnoutData = useMemo(() => {
        if (!selectedElection) return [{ name: 'Voted', value: 0 }, { name: 'Did Not Vote', value: 100 }];
        const votedCount = selectedElection.votes.length;
        const totalVoters = selectedElection.voters.length;
        const didNotVoteCount = totalVoters - votedCount;
        
        return [
            { name: 'Voted', value: votedCount },
            { name: 'Did Not Vote', value: didNotVoteCount },
        ];
    }, [selectedElection]);

    return (
        <div className="bg-slate-100">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <header className="mb-8">
                    <h1 className="text-4xl font-bold text-indigo-900">Transparency Portal</h1>
                    <p className="text-lg text-slate-600 mt-1">Reviewing final, certified election results for <span className="font-semibold">{currentOrganization}</span>.</p>
                </header>

                <Card className="p-6 mb-8">
                    <label htmlFor="election-select" className="block text-sm font-medium text-slate-700">Select an Election to View Results</label>
                    <select id="election-select" value={selectedElection?.id || ''} onChange={(e) => setSelectedElectionId(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                        {closedElections.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                    </select>
                </Card>

                {selectedElection ? (
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                        <div className="lg:col-span-3">
                            <Card className="p-6 h-[400px]">
                                <h2 className="text-xl font-semibold mb-4">Vote Distribution</h2>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={resultsData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                        <XAxis type="number" />
                                        <YAxis dataKey="name" type="category" width={150} />
                                        <Tooltip />
                                        <Bar dataKey="votes" fill="#3949AB" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>
                        </div>
                        <div className="lg:col-span-2">
                             <Card className="p-6 h-[400px]">
                                <h2 className="text-xl font-semibold mb-4">Voter Turnout</h2>
                                 <ResponsiveContainer width="100%" height="100%">
                                     <PieChart>
                                        <Pie data={turnoutData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                            {turnoutData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                     </PieChart>
                                 </ResponsiveContainer>
                            </Card>
                        </div>
                         <div className="lg:col-span-5">
                            <Card className="p-6">
                               <h2 className="text-xl font-semibold mb-4">Verifying Results</h2>
                               <p className="text-slate-600">
                                   All votes are recorded as transactions on the CivicTrust blockchain. You can independently verify these election results by visiting the <a href="#/explorer" className="text-indigo-600 hover:underline">Blockchain Explorer</a>.
                                   Cross-reference the transactions associated with the election ID <code className="text-sm bg-slate-200 p-1 rounded">{selectedElection.id}</code> to audit the vote count.
                               </p>
                            </Card>
                        </div>
                    </div>
                ) : (
                    <Card className="p-12 text-center">
                        <h2 className="text-xl font-semibold">No Closed Elections</h2>
                        <p className="text-slate-500 mt-2">There are no completed elections to display for this organization.</p>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default TransparencyPage;