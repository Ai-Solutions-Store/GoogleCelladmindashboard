import React, { useState } from 'react';
import { type DaoLaunch } from '../types';

interface AddDaoModalProps {
  onClose: () => void;
  onAdd: (newDao: Omit<DaoLaunch, 'id'>) => void;
}

const AddDaoModal: React.FC<AddDaoModalProps> = ({ onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [token, setToken] = useState('');
  const [treasury, setTreasury] = useState('');
  const [launchDate, setLaunchDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !token || !treasury || !launchDate) return;

    onAdd({
      name,
      token,
      treasury: Number(treasury),
      launchDate: new Date(launchDate).toISOString(),
      proposals: null,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="glass-modal-content p-8 w-full max-w-md m-4">
        <h2 className="text-2xl font-bold mb-6 text-slate-100">Add New DAO Launch</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-300">Name</label>
              <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 glass-input" />
            </div>
            <div>
              <label htmlFor="token" className="block text-sm font-medium text-slate-300">Token</label>
              <input type="text" id="token" value={token} onChange={(e) => setToken(e.target.value)} required className="mt-1 block w-full px-3 py-2 glass-input" />
            </div>
            <div>
              <label htmlFor="treasury" className="block text-sm font-medium text-slate-300">Treasury ($)</label>
              <input type="number" id="treasury" value={treasury} onChange={(e) => setTreasury(e.target.value)} required className="mt-1 block w-full px-3 py-2 glass-input" />
            </div>
            <div>
              <label htmlFor="launchDate" className="block text-sm font-medium text-slate-300">Launch Date</label>
              <input type="date" id="launchDate" value={launchDate} onChange={(e) => setLaunchDate(e.target.value)} required className="mt-1 block w-full px-3 py-2 glass-input" />
            </div>
          </div>
          <div className="mt-8 flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-200 bg-white/10 rounded-md hover:bg-white/20 focus:outline-none">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Add DAO
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDaoModal;