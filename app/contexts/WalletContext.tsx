"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface WalletInfo {
  address: string;
  publicKey: string;
  balance: number;
}

interface WalletContextType {
  walletInfo: WalletInfo | null;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
}

export const WalletContext = createContext<WalletContextType>({
  walletInfo: null,
  isConnected: false,
  connect: async () => {},
  disconnect: () => {},
});

interface WalletProviderProps {
  children: ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Load wallet info from localStorage on mount
  useEffect(() => {
    const savedWallet = localStorage.getItem("walletInfo");
    if (savedWallet) {
      const parsed = JSON.parse(savedWallet);
      setWalletInfo(parsed);
      setIsConnected(true);
    }
  }, []);

  const connect = async () => {
    // Implementation of connect function
  };

  const disconnect = () => {
    // Implementation of disconnect function
  };

  return (
    <WalletContext.Provider
      value={{ walletInfo, isConnected, connect, disconnect }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
