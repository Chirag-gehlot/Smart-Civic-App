import React, { createContext, useState, ReactNode, useMemo } from "react";
import { User, Role } from "../types";
import { MOCK_USERS } from "../data/mockData";

interface AuthContextType {
  user: User | null;
  users: User[];
  isNewSignup: boolean;
  login: (userId: string) => void;
  logout: () => void;
  signup: (name: string, mobile: string) => User;
  verifyUser: (userId: string) => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  users: [],
  isNewSignup: false,
  login: () => {},
  logout: () => {},
  signup: () => ({} as User),
  verifyUser: () => {},
});

const GUEST_USER = MOCK_USERS.find((u) => u.role === Role.Guest)!;

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [currentUser, setCurrentUser] = useState<User | null>(GUEST_USER);
  const [isNewSignup, setIsNewSignup] = useState(false);

  const login = (userId: string) => {
    const userToLogin = users.find((u) => u.id === userId);
    if (userToLogin) {
      setCurrentUser(userToLogin);
      setIsNewSignup(false);
    }
  };

  const logout = () => {
    setCurrentUser(GUEST_USER);
    setIsNewSignup(false);
  };

  const signup = (name: string, mobile: string): User => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      mobile,
      role: Role.Voter,
      organization: "City of Metropolis", // Default org for new users
      organizations: ["City of Metropolis"],
      avatarUrl: `https://picsum.photos/seed/${name.split(" ")[0]}/100/100`,
      status: "Verified",
    };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    setIsNewSignup(true);
    return newUser;
  };

  const verifyUser = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: "Verified" } : u))
    );
    if (currentUser?.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, status: "Verified" } : null));
    }
  };

  const value = useMemo(
    () => ({
      user: currentUser,
      users,
      isNewSignup,
      login,
      logout,
      signup,
      verifyUser,
    }),
    [currentUser, users, isNewSignup]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
