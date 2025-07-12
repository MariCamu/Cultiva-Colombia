
'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User } from 'firebase/auth'; // We can keep the type for structure
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';

// Create a mock user for simulation purposes
const mockUser: User = {
    uid: 'mock-user-id-123',
    email: 'simulado@ejemplo.com',
    displayName: 'Agricultor Simulado',
    photoURL: null,
    emailVerified: true,
    isAnonymous: false,
    metadata: {},
    providerData: [],
    providerId: 'password',
    tenantId: null,
    delete: async () => {},
    getIdToken: async () => 'mock-token',
    getIdTokenResult: async () => ({ token: 'mock-token', claims: {}, authTime: '', expirationTime: '', issuedAtTime: '', signInProvider: null, signInSecondFactor: null }),
    reload: async () => {},
    toJSON: () => ({}),
};


interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(mockUser); // Start with the mock user
  const [loading, setLoading] = useState(false); // Set loading to false initially

  // No need for onAuthStateChanged listener in simulation
  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (user) => {
  //     setUser(user);
  //     setLoading(false);
  //   });
  //   return () => unsubscribe();
  // }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
          <div className="space-y-4 w-full max-w-md p-8">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-10 w-1/2" />
          </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// Component to protect routes
export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    // In simulation mode, we can assume the user is always logged in
    // so we don't need to redirect.
    // useEffect(() => {
    //   if (!loading && !user) {
    //     router.push('/login');
    //   }
    // }, [user, loading, router]);
  
    if (loading) { // Keep loading screen for consistency
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="space-y-4 w-full max-w-md p-8">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-10 w-1/2" />
                </div>
            </div>
        );
    }
  
    return <>{children}</>;
};
