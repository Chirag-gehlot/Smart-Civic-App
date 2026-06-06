import React, { createContext, useState, ReactNode } from "react";
import { Election } from "../types";

interface ElectionContextType {
  elections: Election[];
  setElections: React.Dispatch<React.SetStateAction<Election[]>>;
}

export const ElectionContext = createContext<ElectionContextType>({
  elections: [],
  setElections: () => {}, // noop
});

interface Props {
  children: ReactNode;
}

export const ElectionProvider: React.FC<Props> = ({ children }) => {
  const [elections, setElections] = useState<Election[]>([]);

  return (
    <ElectionContext.Provider value={{ elections, setElections }}>
      {children}
    </ElectionContext.Provider>
  );
};
