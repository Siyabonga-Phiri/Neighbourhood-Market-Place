import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData);

    localStorage.setItem("user", JSON.stringify(userData));

    if (userData.token) {
      localStorage.setItem("token", userData.token);
    }
  };

  const getCurrentUser = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) return null;

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch current user");
      }

      const userData = await response.json();

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      return userData;
    } catch (error) {
      console.error(error);

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);

      return null;
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    if (localStorage.getItem("token")) {
      getCurrentUser();
    }
  }, []);

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        getCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}