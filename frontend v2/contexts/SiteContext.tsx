import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
  useMemo,
} from "react";
import { useAuth } from "./AuthContextNew";

interface SiteContextType {
  currentOrganization: string;
  setCurrentOrganization: (org: string) => void;
}

export const SiteContext = createContext<SiteContextType>({
  currentOrganization: "",
  setCurrentOrganization: () => {},
});

export const SiteProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [currentOrganization, setCurrentOrganization] = useState<string>("");

  useEffect(() => {
    if (user && user.organization) {
      setCurrentOrganization(user.organization);
    } else {
      setCurrentOrganization("Public");
    }
  }, [user]);

  const value = useMemo(
    () => ({
      currentOrganization,
      setCurrentOrganization,
    }),
    [currentOrganization],
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
};
