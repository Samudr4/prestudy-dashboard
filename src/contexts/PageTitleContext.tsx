
"use client";
import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect } from 'react';

type PageTitleContextType = {
  pageTitle: string;
  setPageTitle: (title: string) => void;
};

const PageTitleContext = createContext<PageTitleContextType | undefined>(undefined);

export const PageTitleProvider = ({ children }: { children: ReactNode }) => {
  const [pageTitle, setPageTitle] = useState<string>("Dashboard"); // Default title
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by only setting title on client
  const clientSetPageTitle = (title: string) => {
    if (mounted) {
      setPageTitle(title);
    }
  };

  return (
    <PageTitleContext.Provider value={{ pageTitle, setPageTitle: clientSetPageTitle }}>
      {children}
    </PageTitleContext.Provider>
  );
};

export const usePageTitle = () => {
  const context = useContext(PageTitleContext);
  if (context === undefined) {
    throw new Error('usePageTitle must be used within a PageTitleProvider');
  }
  return context;
};
