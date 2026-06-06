import React, { useContext, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ElectionContext } from '../contexts/ElectionContext';
import { AuthContext } from '../contexts/AuthContext';
import { SiteContext } from '../contexts/SiteContext';
import { Election, ElectionStatus, User, Role } from '../types';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { useToast } from '../contexts/ToastContext';

type SortDirection = 'ascending' | 'descending';
interface SortConfig {
  key: keyof User;
  direction: SortDirection;
}

const ConfirmationModal: React.FC<{
  election: Election;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ election, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
    <Card className="max-w-md w-full p-6 m-4">
      <h2 className="text-2xl font-bold text-indigo-900">Confirm Publication</h2>
      <p className="mt-2 text-slate-600">
        Are you sure you want to publish the election: <span className="font-semibold">{election.name}</span>?
      </p>
      <p className="mt-4 text-sm text-amber-700 bg-amber-50 p-3 rounded-md border border-amber-200">
        Once published, the election will be visible to all eligible voters and can no longer be edited. It will become active on its scheduled start date.
      </p>
      <div className="mt-6 flex justify-end space-x-3">
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button onClick={onConfirm} variant="primary">Confirm Publish</Button>
      </div>
    </Card>
  </div>
);

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactElement }> = ({ title, value, icon }) => (
    <Card className="p-5 flex items-center">
        <div className="p-3 rounded-full bg-indigo-100 text-indigo-700 mr-4">
            {icon}
        </div>
        <div>
            <p className="text-sm text-slate-500">{title}</p>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
        </div>
    </Card>
);

const ElectionsTable: React.FC<{ elections: Election[], onPublish: (election: Election) => void; }> = ({ elections, onPublish }) => (
    <Card>
        <div className="p-5 border-b border-slate-200">
            <h3 className="text-lg font-semibold">Manage Elections</h3>
        </div>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Start Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">End Date</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                    {elections.map(e => (
                        <tr key={e.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{e.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm"><Badge status={e.status} /></td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(e.startDate).toLocaleDateString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(e.endDate).toLocaleDateString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex items-center justify-end space-x-2">
                                    {e.status === ElectionStatus.Draft && (
                                        <Button size="sm" variant="secondary" onClick={() => onPublish(e)}>Publish</Button>
                                    )}
                                    {!['Active', 'Closed'].includes(e.status) && (
                                        <Link to={`/admin/edit-election/${e.id}`}>
                                            <Button size="sm">Edit</Button>
                                        </Link>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </Card>
);

const VotersTable: React.FC<{ voters: User[]; onSort: (key: keyof User) => void; sortConfig: SortConfig | null; }> = ({ voters, onSort, sortConfig }) => {
    const SortableHeader: React.FC<{ columnKey: keyof User; title: string; className?: string }> = ({ columnKey, title, className }) => {
        const isSorted = sortConfig?.key === columnKey;
        const directionIcon = sortConfig?.direction === 'ascending' ? '▲' : '▼';
        return (
            <th className={`px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer ${className}`} onClick={() => onSort(columnKey)}>
                <div className="flex items-center">
                    {title}
                    {isSorted && <span className="ml-1 text-slate-800">{directionIcon}</span>}
                </div>
            </th>
        );
    };

    return (
        <div className="overflow-x-auto">
             <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                    <tr>
                        <SortableHeader columnKey="name" title="Name" />
                        <SortableHeader columnKey="status" title="Status" />
                        <SortableHeader columnKey="mobile" title="Mobile" />
                        <SortableHeader columnKey="organization" title="Organization" />
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                    {voters.length > 0 ? voters.map(v => (
                        <tr key={v.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{v.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm"><Badge status={v.status} /></td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{v.mobile}</td>
                             <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{v.organization}</td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={4} className="px-6 py-4 text-center text-sm text-slate-500">
                                No voters found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

const AdminDashboardPage: React.FC = () => {
    const { elections, updateElection } = useContext(ElectionContext);
    const { users, user } = useContext(AuthContext);
    const { currentOrganization } = useContext(SiteContext);
    const { addToast } = useToast();

    // State for voter table interactivity
    const [voterSearch, setVoterSearch] = useState('');
    const [orgFilter, setOrgFilter] = useState('All');
    const [sortConfig, setSortConfig] = useState<SortConfig | null>({ key: 'name', direction: 'ascending' });
    const [electionToPublish, setElectionToPublish] = useState<Election | null>(null);

    const handleConfirmPublish = () => {
        if (!electionToPublish) return;
        updateElection(electionToPublish.id, { status: ElectionStatus.Published });
        addToast(`Election "${electionToPublish.name}" has been published.`, 'success');
        setElectionToPublish(null);
    };

    const orgElections = useMemo(() => elections.filter(e => e.organization === currentOrganization), [elections, currentOrganization]);
    
    const allOrganizations = useMemo(() => ['All', ...Array.from(new Set(users.filter(u => u.role === Role.Voter).map(u => u.organization)))], [users]);

    const filteredAndSortedVoters = useMemo(() => {
        let votersToShow: User[];

        if (user?.role === Role.SuperAdmin) {
            votersToShow = users.filter(u => u.role === Role.Voter);
        } else {
            votersToShow = users.filter(u => u.role === Role.Voter && u.organizations.includes(currentOrganization));
        }

        if (user?.role === Role.SuperAdmin && orgFilter !== 'All') {
            votersToShow = votersToShow.filter(v => v.organization === orgFilter);
        }
        
        if (voterSearch) {
            const lowercasedFilter = voterSearch.toLowerCase();
            votersToShow = votersToShow.filter(v => 
                v.name.toLowerCase().includes(lowercasedFilter) ||
                v.mobile?.includes(voterSearch)
            );
        }

        if (sortConfig !== null) {
            votersToShow.sort((a, b) => {
                const aValue = a[sortConfig.key] || '';
                const bValue = b[sortConfig.key] || '';

                if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }

        return votersToShow;
    }, [users, user, currentOrganization, orgFilter, voterSearch, sortConfig]);

    const requestSort = (key: keyof User) => {
        let direction: SortDirection = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const activeElections = orgElections.filter(e => e.status === ElectionStatus.Active).length;
    const totalVotes = orgElections.reduce((sum, e) => sum + e.votes.length, 0);
    const totalVoters = useMemo(() => {
        const relevantOrgs = user?.role === Role.SuperAdmin ? allOrganizations.filter(o => o !== 'All') : [currentOrganization];
        return users.filter(u => u.role === Role.Voter && u.organizations.some(org => relevantOrgs.includes(org))).length;
    }, [users, user, currentOrganization, allOrganizations]);


    const CheckIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>;
    const UsersIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A5.995 5.995 0 0112 12.75a5.995 5.995 0 01-6.75 5.053" /></svg>;
    const VoteIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>;

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
                <p className="text-slate-600">Overview for {currentOrganization}</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Active Elections" value={activeElections} icon={CheckIcon}/>
                <StatCard title="Registered Voters" value={totalVoters} icon={UsersIcon}/>
                <StatCard title="Total Votes Cast" value={totalVotes} icon={VoteIcon}/>
            </div>

            <div className="space-y-8">
                <ElectionsTable elections={orgElections} onPublish={setElectionToPublish} />
                
                <Card>
                    <div className="p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
                        <h3 className="text-lg font-semibold">Registered Voters</h3>
                        <div className="flex flex-wrap items-center gap-4">
                            {user?.role === Role.SuperAdmin && (
                                <select 
                                    value={orgFilter} 
                                    onChange={e => setOrgFilter(e.target.value)}
                                    className="block w-full sm:w-auto border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                >
                                    {allOrganizations.map(org => <option key={org} value={org}>{org}</option>)}
                                </select>
                            )}
                            <input 
                                type="text"
                                placeholder="Search voters..."
                                value={voterSearch}
                                onChange={e => setVoterSearch(e.target.value)}
                                className="block w-full sm:w-auto border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                    </div>
                    <VotersTable 
                        voters={filteredAndSortedVoters}
                        onSort={requestSort}
                        sortConfig={sortConfig}
                    />
                </Card>
            </div>
            {electionToPublish && (
                <ConfirmationModal
                    election={electionToPublish}
                    onConfirm={handleConfirmPublish}
                    onCancel={() => setElectionToPublish(null)}
                />
            )}
        </div>
    );
};

export default AdminDashboardPage;