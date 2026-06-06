import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ElectionContext } from '../contexts/ElectionContext';
import { useToast } from '../contexts/ToastContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { ElectionStatus } from '../types';

const EditElectionPage: React.FC = () => {
  const { electionId } = useParams<{ electionId: string }>();
  const navigate = useNavigate();
  const { getElectionById, updateElection } = useContext(ElectionContext);
  const { addToast } = useToast();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState<ElectionStatus>(ElectionStatus.Draft);
  const [isDemo, setIsDemo] = useState(false);
  const [isEditable, setIsEditable] = useState(true);

  useEffect(() => {
    if (electionId) {
      const election = getElectionById(electionId);
      if (election) {
        setName(election.name);
        setDescription(election.description);
        setStartDate(election.startDate.substring(0, 16));
        setEndDate(election.endDate.substring(0, 16));
        setStatus(election.status);
        setIsDemo(election.isDemo);
        setIsEditable(![ElectionStatus.Active, ElectionStatus.Closed].includes(election.status));
      } else {
        navigate('/admin/dashboard');
      }
    }
  }, [electionId, getElectionById, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!electionId) return;

    updateElection(electionId, {
      name,
      description,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      status,
      isDemo,
    });

    addToast('Election updated successfully.', 'success');
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
            <h1 className="text-3xl font-bold text-slate-900">Edit Election</h1>
            <p className="text-slate-600">Update details for election: {name}</p>
        </header>

        {!isEditable && (
             <div className="p-4 bg-amber-100 text-amber-800 rounded-md">
                This election is active or closed and can no longer be edited.
            </div>
        )}

        <Card>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <FormField label="Election Name" id="name">
                    <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="w-full border-slate-300 rounded-md shadow-sm disabled:bg-slate-100" disabled={!isEditable} />
                </FormField>
                <FormField label="Description" id="description">
                    <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={4} className="w-full border-slate-300 rounded-md shadow-sm disabled:bg-slate-100" disabled={!isEditable} />
                </FormField>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <FormField label="Start Date" id="start-date">
                        <input type="datetime-local" id="start-date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full border-slate-300 rounded-md shadow-sm disabled:bg-slate-100" disabled={!isEditable} />
                    </FormField>
                     <FormField label="End Date" id="end-date">
                        <input type="datetime-local" id="end-date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full border-slate-300 rounded-md shadow-sm disabled:bg-slate-100" disabled={!isEditable} />
                    </FormField>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <FormField label="Status" id="status">
                        <select id="status" value={status} onChange={e => setStatus(e.target.value as ElectionStatus)} className="w-full border-slate-300 rounded-md shadow-sm disabled:bg-slate-100" disabled={!isEditable}>
                            {Object.values(ElectionStatus).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </FormField>
                    <div className="flex items-end pb-1">
                        <div className="flex items-center">
                            <input id="is-demo" type="checkbox" checked={isDemo} onChange={e => setIsDemo(e.target.checked)} className="h-4 w-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 disabled:bg-slate-100" disabled={!isEditable} />
                            <label htmlFor="is-demo" className="ml-2 block text-sm text-slate-900">Mark as Demo Election</label>
                        </div>
                    </div>
                </div>

                 <div className="flex justify-end space-x-3 pt-6 border-t">
                    <Button type="button" variant="secondary" onClick={() => navigate('/admin/dashboard')}>Cancel</Button>
                    <Button type="submit" disabled={!isEditable}>Save Changes</Button>
                 </div>
            </form>
        </Card>
    </div>
  );
};

export default EditElectionPage;