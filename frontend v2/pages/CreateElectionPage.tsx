import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ElectionContext } from '../contexts/ElectionContext';
import { SiteContext } from '../contexts/SiteContext';
import { useToast } from '../contexts/ToastContext';
import { MOCK_CANDIDATES, MOCK_USERS } from '../data/mockData';
import { Role } from '../types';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const CreateElectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { createElection } = useContext(ElectionContext);
  const { currentOrganization } = useContext(SiteContext);
  const { addToast } = useToast();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isDemo, setIsDemo] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !startDate || !endDate) {
        addToast('Please fill all fields', 'warning');
        return;
    }
    
    createElection({
        name,
        description,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        isDemo,
        organization: currentOrganization,
        candidates: MOCK_CANDIDATES, // Using mock data for simplicity
        voters: MOCK_USERS.filter(u => u.role === Role.Voter)
                          .map(u => ({ voter_id: u.id, name: u.name, email: '', phone: u.mobile || '' })),
    });

    addToast('Election created successfully as a draft.', 'success');
    navigate('/admin/dashboard');
  };

  const FormField: React.FC<{label: string, id: string, children: React.ReactNode}> = ({label, id, children}) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        {children}
    </div>
  );

  return (
    <div className="space-y-6">
        <header>
            <h1 className="text-3xl font-bold text-slate-900">Create New Election</h1>
            <p className="text-slate-600">Configure and schedule a new election for {currentOrganization}.</p>
        </header>

        <Card>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <FormField label="Election Name" id="name">
                    <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="w-full border-slate-300 rounded-md shadow-sm" />
                </FormField>
                <FormField label="Description" id="description">
                    <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={4} className="w-full border-slate-300 rounded-md shadow-sm" />
                </FormField>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <FormField label="Start Date" id="start-date">
                        <input type="datetime-local" id="start-date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full border-slate-300 rounded-md shadow-sm" />
                    </FormField>
                     <FormField label="End Date" id="end-date">
                        <input type="datetime-local" id="end-date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full border-slate-300 rounded-md shadow-sm" />
                    </FormField>
                </div>
                <div className="border-t pt-6">
                     <h3 className="text-lg font-medium">Configuration</h3>
                     <p className="text-sm text-slate-500 mb-4">Set up participants for this election.</p>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Upload Candidates (CSV)</label>
                            <input type="file" className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
                         </div>
                         <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Upload Voters (CSV)</label>
                            <input type="file" className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
                         </div>
                     </div>
                </div>
                 <div className="border-t pt-6">
                     <h3 className="text-lg font-medium">Settings</h3>
                      <div className="flex items-center mt-4">
                        <input id="is-demo" type="checkbox" checked={isDemo} onChange={e => setIsDemo(e.target.checked)} className="h-4 w-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500" />
                        <label htmlFor="is-demo" className="ml-2 block text-sm text-slate-900">Mark as Demo Election</label>
                    </div>
                 </div>

                 <div className="flex justify-end space-x-3 pt-6 border-t">
                    <Button type="button" variant="secondary" onClick={() => navigate('/admin/dashboard')}>Cancel</Button>
                    <Button type="submit">Create Election</Button>
                 </div>
            </form>
        </Card>
    </div>
  );
};

export default CreateElectionPage;