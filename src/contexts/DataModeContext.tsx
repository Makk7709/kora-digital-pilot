import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { DataMode, getDataMode, getEnvDataMode, setDataModeOverride } from '../lib/data-mode';

interface DataModeContextValue {
  mode: DataMode;
  envMode: DataMode;
  isDemo: boolean;
  isReal: boolean;
  canToggle: boolean;
  toggleMode: () => void;
  resetToEnv: () => void;
}

const DataModeContext = createContext<DataModeContextValue | null>(null);

interface DataModeProviderProps {
  children: React.ReactNode;
}

export const DataModeProvider: React.FC<DataModeProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<DataMode>(() => getDataMode());

  useEffect(() => {
    setMode(getDataMode());
  }, []);

  const canToggle = Boolean(import.meta.env?.DEV);

  const toggleMode = useCallback(() => {
    if (!canToggle) return;
    setMode((current) => {
      const next: DataMode = current === 'demo' ? 'real' : 'demo';
      setDataModeOverride(next);
      return next;
    });
  }, [canToggle]);

  const resetToEnv = useCallback(() => {
    if (!canToggle) return;
    setDataModeOverride(null);
    setMode(getEnvDataMode());
  }, [canToggle]);

  const value = useMemo<DataModeContextValue>(
    () => ({
      mode,
      envMode: getEnvDataMode(),
      isDemo: mode === 'demo',
      isReal: mode === 'real',
      canToggle,
      toggleMode,
      resetToEnv,
    }),
    [mode, canToggle, toggleMode, resetToEnv],
  );

  return <DataModeContext.Provider value={value}>{children}</DataModeContext.Provider>;
};

export const useDataMode = (): DataModeContextValue => {
  const ctx = useContext(DataModeContext);
  if (!ctx) {
    return {
      mode: getDataMode(),
      envMode: getEnvDataMode(),
      isDemo: getDataMode() === 'demo',
      isReal: getDataMode() === 'real',
      canToggle: false,
      toggleMode: () => undefined,
      resetToEnv: () => undefined,
    };
  }
  return ctx;
};
