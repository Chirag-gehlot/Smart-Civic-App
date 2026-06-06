import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const VerificationPage: React.FC = () => {
  const { user, verifyUser } = useContext(AuthContext);
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [photoId, setPhotoId] = useState<File | null>(null);
  const [addressProof, setAddressProof] = useState<File | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (user && user.status === 'Verified') {
      navigate('/e-voting');
    }
  }, [user, navigate]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoId || !addressProof) {
      addToast('Please upload both documents.', 'warning');
      return;
    }
    setIsVerifying(true);
    addToast('Submitting documents for verification...', 'info');
    setTimeout(() => {
      if (user) {
        verifyUser(user.id);
        addToast('Verification successful! You can now access all features.', 'success');
        setIsVerifying(false);
        navigate('/e-voting', { replace: true });
      } else {
        addToast('An error occurred. Please log in again.', 'error');
        setIsVerifying(false);
      }
    }, 2500);
  };
  
  const FileInput: React.FC<{label: string, file: File | null, setFile: (file: File | null) => void, id: string}> = ({ label, file, setFile, id }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-700">{label}</label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
                <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <div className="flex text-sm text-slate-600">
                    <label htmlFor={id} className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                        <span>Upload a file</span>
                        <input id={id} name={id} type="file" className="sr-only" onChange={e => setFile(e.target.files ? e.target.files[0] : null)} />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                </div>
                {file ? <p className="text-xs text-slate-500">{file.name}</p> : <p className="text-xs text-slate-500">PNG, JPG, PDF up to 10MB</p>}
            </div>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
            Identity Verification
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            To ensure the integrity of the voting process, please upload the following documents.
          </p>
        </div>
        <Card className="p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <FileInput label="Photo ID (e.g., Driver's License)" file={photoId} setFile={setPhotoId} id="photo-id" />
            <FileInput label="Proof of Address (e.g., Utility Bill)" file={addressProof} setFile={setAddressProof} id="address-proof" />
            <div>
              <Button type="submit" className="w-full" disabled={isVerifying || !photoId || !addressProof}>
                {isVerifying ? 'Verifying...' : 'Submit for Verification'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default VerificationPage;