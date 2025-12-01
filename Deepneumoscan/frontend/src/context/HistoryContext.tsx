import React, { createContext, useContext, useState, useEffect } from 'react';

export interface HistoryRecord {
  id: string;
  type: 'self-assessment' | 'xray-scan' | 'curing-assessment';
  date: string;
  result: any;
  userId: string;
}

interface HistoryContextType {
  records: HistoryRecord[];
  addRecord: (record: Omit<HistoryRecord, 'id' | 'date'>) => void;
  deleteRecord: (id: string) => void;
  getRecordsByType: (type: string) => HistoryRecord[];
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export const useHistory = () => {
  const context = useContext(HistoryContext);
  if (context === undefined) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
};

export const HistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [records, setRecords] = useState<HistoryRecord[]>([]);

  useEffect(() => {
    const savedRecords = localStorage.getItem('deepneumoscan_history');
    if (savedRecords) {
      setRecords(JSON.parse(savedRecords));
    }
  }, []);

  const addRecord = (record: Omit<HistoryRecord, 'id' | 'date'>) => {
    const newRecord: HistoryRecord = {
      ...record,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    
    const updatedRecords = [...records, newRecord];
    setRecords(updatedRecords);
    localStorage.setItem('deepneumoscan_history', JSON.stringify(updatedRecords));
  };

  const deleteRecord = (id: string) => {
    const updatedRecords = records.filter(record => record.id !== id);
    setRecords(updatedRecords);
    localStorage.setItem('deepneumoscan_history', JSON.stringify(updatedRecords));
  };

  const getRecordsByType = (type: string) => {
    return records.filter(record => record.type === type);
  };

  return (
    <HistoryContext.Provider value={{ records, addRecord, deleteRecord, getRecordsByType }}>
      {children}
    </HistoryContext.Provider>
  );
};