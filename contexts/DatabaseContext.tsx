import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { initializeDatabase, getPlants, Plant } from '../utils/database';

interface DatabaseContextType {
  isReady: boolean;
  isLoading: boolean;
  plants: Plant[];
  refreshPlants: () => Promise<void>;
  error: string | null;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [error, setError] = useState<string | null>(null);

  const refreshPlants = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const allPlants = await getPlants();
      setPlants(allPlants.filter(p => p && p.id != null));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to refresh plants';
      setError(message);
      console.error('SQLite error in getPlants:', err);
      setPlants([]); // Clear plants on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        setIsLoading(true);
        setError(null);
        await initializeDatabase();
        await refreshPlants();
        setIsReady(true);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to initialize database';
        setError(message);
        console.error('SQLite error in initializeDatabase:', err);
        setIsReady(false); // Don't mark ready if DB failed
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [refreshPlants]);

  return (
    <DatabaseContext.Provider
      value={{
        isReady,
        isLoading,
        plants,
        refreshPlants,
        error,
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = (): DatabaseContextType => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within DatabaseProvider');
  }
  return context;
};
