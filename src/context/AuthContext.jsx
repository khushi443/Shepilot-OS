import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";

const AuthContext = createContext();

// useAuth is co-located with AuthProvider on purpose: splitting it into its
// own file would change every `import { useAuth } from "../context/AuthContext"`
// call site across the app for a dev-only Fast Refresh nicety.
// eslint-disable-next-line
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoggedIn: !!currentUser,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}