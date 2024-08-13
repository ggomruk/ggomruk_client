'use client';

import { useState, createContext, useContext, useEffect } from 'react';

interface GlobalInterface {
  symbol: string;
  theme: string;
  setTheme: (theme: string) => void;
  setSymbol: (symbol: string) => void;
}

const GlobalStateContext = createContext<GlobalInterface | undefined>(undefined);

export const GlobalStateProvider = ({ children }: { children: React.ReactNode }) => {
  const [symbol, setSymbol] = useState('btcusdt');
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedSymbol = localStorage.getItem('symbol') || 'btcusdt';
    setTheme(savedTheme);
    setSymbol(savedSymbol);
    document.documentElement.setAttribute('data-theme', savedTheme);
    localStorage.setItem('theme', savedTheme);
    localStorage.setItem('symbol', savedSymbol);
  }, []);

  return (
    <GlobalStateContext.Provider value={{ theme, setTheme, symbol, setSymbol }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (context === undefined) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider');
  }
  return context;
};
