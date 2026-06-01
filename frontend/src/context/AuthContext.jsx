import { createContext, useContext, useEffect, useState } from "react";
import { getMe, loginWithGoogle } from "../api/authApi";
import { clearAuth, getStoredUser, getToken, saveAuth } from "../utils/authStorage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
 const [token, setToken] = useState(getToken());
 const [user, setUser] = useState(getStoredUser());
 const [loadingAuth, setLoadingAuth] = useState(Boolean(getToken()));

 useEffect(() => {
   async function loadUser() {
     if (!token) {
       setLoadingAuth(false);
       return;
     }

     try {
       const currentUser = await getMe();
       setUser(currentUser);
       saveAuth(token, currentUser);
     } catch {
       clearAuth();
       setToken(null);
       setUser(null);
     } finally {
       setLoadingAuth(false);
     }
   }

   loadUser();
 }, [token]);

 async function login(idToken) {
   const authResponse = await loginWithGoogle(idToken);
   saveAuth(authResponse.token, authResponse.user);
   setToken(authResponse.token);
   setUser(authResponse.user);
   return authResponse;
 }

 function logout() {
   clearAuth();
   setToken(null);
   setUser(null);
 }

 return (
   <AuthContext.Provider
     value={{
       token,
       user,
       loadingAuth,
       login,
       logout,
       isAuthenticated: Boolean(token),
     }}
   >
     {children}
   </AuthContext.Provider>
 );
}

export function useAuth() {
 return useContext(AuthContext);
}
