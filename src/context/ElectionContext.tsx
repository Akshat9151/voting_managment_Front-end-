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

export const ElectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [elections, setElections] = useState<Election[]>([]);
  const [activeElection, setActiveElectionState] = useState<Election | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setElections([]);
      setActiveElectionState(null);
      return;
    }
    setIsLoading(true);
    httpClient.get('/elections/')
      .then((res) => {
        const items: Election[] = res.data.data?.items ?? res.data.data ?? res.data ?? [];
        setElections(items);
        // Auto-select first active or first election
        const active = items.find(e => e.status === 'ACTIVE') ?? items[0] ?? null;
        const saved = localStorage.getItem('ew_election_id');
        const savedElection = saved ? items.find(e => e.id === saved) : null;
        setActiveElectionState(savedElection ?? active);
      })
      .catch(() => {
        setElections([]);
        setActiveElectionState(null);
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
