import React, { createContext, useState, useContext, ReactNode } from "react";

export interface UserData {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
}

// Create a context with initial data
const UserContext = createContext<{
  user: UserData | null;
  setUser: React.Dispatch<React.SetStateAction<UserData | null>>;
}>({
  user: null,
  setUser: () => null,
});

export const useUser = () => {
  return useContext(UserContext);
};

// Context provider component
export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserData | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
