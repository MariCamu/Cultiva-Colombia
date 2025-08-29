
'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter, usePathname } from 'next/navigation';
import { doc, onSnapshot, type DocumentData } from 'firebase/firestore';

interface UserProfile {
    nombre: string;
    email: string;
    region?: string;
    // Add other profile fields here
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const userDocRef = doc(db, 'usuarios', user.uid);
        const unsubProfile = onSnapshot(userDocRef, (docSnap) => {
            if (docSnap.exists()) {
                setUserProfile(docSnap.data() as UserProfile);
            } else {
                setUserProfile(null);
            }
             setLoading(false);
        });
        return () => unsubProfile(); // Unsubscribe from profile listener on cleanup
      } else {
        // User is signed out
        setUserProfile(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

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
    <AuthContext.Provider value={{ user, userProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
      if (!loading && !user) {
        // Redirect to login page if not authenticated and not already on a public page
        if (pathname !== '/login' && pathname !== '/signup') {
            router.push('/login');
        }
      }
    }, [user, loading, router, pathname]);
  
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
    
    if (!user) {
        return null;
    }
  
    return <>{children}</>;
};
