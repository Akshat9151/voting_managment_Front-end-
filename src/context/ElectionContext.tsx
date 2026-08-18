import React, { createContext, useContext, useEffect, useState } from 'react';
import { httpClient } from '../services/httpClient';
import { useAuth } from './AuthContext';

export interface Election {
  id: string;
  title: string;
  status: string;
  election_type: string;
  organization_id: string;
  scheduled_at?: string | null;
}

interface ElectionContextType {
  elections: Election[];
  activeElection: Election | null;
  activeElectionId: string | null;
  setActiveElection: (e: Election) => void;
  isLoading: boolean;
}

const ElectionContext = createContext<ElectionContextType | undefined>(undefined);

// Fallback mock election for demo/offline mode
const MOCK_ELECTIONS: Election[] = [
  {
    id: 'gp-rampur-2026',
    title: 'Gram Panchayat Rampur – 2026',
    status: 'ACTIVE',
    election_type: 'panchayat',
    organization_id: 'default-org'
  },
  {
    id: 'municipal-2026',
    title: 'Municipal Corporation – 2026',
    status: 'PENDING',
    election_type: 'municipal',
    organization_id: 'default-org'
  }
];

export const ElectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [elections, setElections] = useState<Election[]>(MOCK_ELECTIONS);
  const [activeElection, setActiveElectionState] = useState<Election | null>(MOCK_ELECTIONS[0]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setElections(MOCK_ELECTIONS);
      setActiveElectionState(MOCK_ELECTIONS[0]);
      return;
    }
    setIsLoading(true);
    httpClient.get('/elections/')
      .then((res) => {
        const items: Election[] = res.data.data?.items ?? res.data.data ?? res.data ?? [];
        // Use backend elections if available, otherwise fall back to mock
        const finalElections = items.length > 0 ? items : MOCK_ELECTIONS;
        setElections(finalElections);
        // Auto-select first active or first election
        const active = finalElections.find(e => e.status === 'ACTIVE') ?? finalElections[0] ?? null;
        const saved = localStorage.getItem('ew_election_id');
        const savedElection = saved ? finalElections.find(e => e.id === saved) : null;
        setActiveElectionState(savedElection ?? active);
      })
      .catch(() => {
        // Use mock elections on error
        setElections(MOCK_ELECTIONS);
        setActiveElectionState(MOCK_ELECTIONS[0]);
      })
      .finally(() => setIsLoading(false));
  }, [isAuthenticated]);

  const setActiveElection = (e: Election) => {
    setActiveElectionState(e);
    localStorage.setItem('ew_election_id', e.id);
  };

  return (
    <ElectionContext.Provider value={{
      elections,
      activeElection,
      activeElectionId: activeElection?.id ?? null,
      setActiveElection,
      isLoading
    }}>
      {children}
    </ElectionContext.Provider>
  );
};

export const useElection = () => {
  const ctx = useContext(ElectionContext);
  if (!ctx) throw new Error('useElection must be used within ElectionProvider');
  return ctx;
};
