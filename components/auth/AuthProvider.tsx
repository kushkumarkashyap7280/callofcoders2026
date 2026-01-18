'use client'

import { useRouter } from "next/navigation";
import AppLoader from '@/components/ui/AppLoader';
import { createContext,useContext, useEffect, useState } from "react";

interface AuthState {
  loading: boolean;
  isAuthenticated: boolean;
  user: any;
  error: string | null;
  isAdmin: boolean;
}

const AuthContex = createContext<{authState: AuthState, setAuthState: React.Dispatch<React.SetStateAction<AuthState>>} | null>(null);

export const useAuth = () => useContext(AuthContex);




function AuthProvider({ children }: { children: React.ReactNode }) {

   const router = useRouter();
   
   const [authstate , setAuthState] = useState<AuthState>({
    loading: true,
    isAuthenticated: false,
    user: null,
    error: null,
    isAdmin: false,
  });
    
  

   useEffect(() => {
  fetch('/api/auth/verify', {
    method: 'GET',
    credentials: 'include', // Important: sends cookies
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success && data.user) {
        setAuthState({
          loading: false,
          isAuthenticated: true,
          user: data.user,
          error: null,
          isAdmin: data.user.isAdmin || false,
        })
        
      } else {
        setAuthState({
          loading: false,
          isAuthenticated: false,
          user: null,
          error: null,
          isAdmin: false,
        })
      }
    })
    .catch(() => {
      setAuthState({
        loading: false,
        isAuthenticated: false,
        user: null,
        error: 'Failed to verify authentication',
        isAdmin: false,
      })
    })
}, []) // Empty dependency array = runs once on mount

  // useEffect(() => {
 
  //   if (authstate.isAuthenticated) {
  //     console.log("Authenticated User:", authstate.user);

  //     if(authstate.isAdmin) {
  //       router.push('/admin');
  //     }else{
      
  //       if (authstate.user.username) {
  //         router.push(`/${authstate.user.username}`);
  //       } else {
  //         router.push('/');
  //       }
  //     }
  //   }
    
  // }, [authstate]);

  return (
    <AuthContex.Provider value={{authState: authstate, setAuthState}}>
      {authstate.loading ? <AppLoader /> : children}
    </AuthContex.Provider>
  )
}


export default AuthProvider
