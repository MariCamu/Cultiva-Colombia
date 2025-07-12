
'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Inicio de Sesión Exitoso",
        description: "Redirigiendo al dashboard...",
      });
      router.push('/dashboard');
    } catch (error: any) {
      console.error("Error de inicio de sesión: ", error);
      toast({
        variant: 'destructive',
        title: 'Error de inicio de sesión',
        description: error.message || 'Ocurrió un error. Por favor, intenta de nuevo.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Create user document in Firestore if it's a new user
      const userRef = doc(db, 'usuarios', user.uid);
      await setDoc(userRef, {
        nombre: user.displayName || '',
        email: user.email,
        fecha_registro: serverTimestamp(),
        preferencia_tema: 'cultiva_verde_default',
      }, { merge: true }); // Use merge to not overwrite existing data if user logs in again

      toast({
          title: "Inicio de Sesión con Google Exitoso",
          description: "Redirigiendo al dashboard...",
      });
      router.push('/dashboard');
    } catch (error: any) {
        console.error("Error de inicio de sesión con Google: ", error);
        toast({
            variant: 'destructive',
            title: 'Error de inicio de sesión con Google',
            description: error.message || 'Ocurrió un error. Por favor, intenta de nuevo.',
        });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-150px)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-nunito font-bold">Iniciar Sesión</CardTitle>
          <CardDescription>Ingresa a tu cuenta para acceder a tu dashboard.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">O continuar con</span>
            </div>
          </div>
          <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading}>
            <svg role="img" viewBox="0 0 24 24" className="mr-2 h-4 w-4"><path fill="currentColor" d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.6 1.98-4.66 1.98-3.55 0-6.43-2.91-6.43-6.48s2.88-6.48 6.43-6.48c2.03 0 3.36.85 4.17 1.62l2.55-2.55C17.43 3.92 15.25 3 12.48 3c-5.22 0-9.45 4.22-9.45 9.45s4.23 9.45 9.45 9.45c5.05 0 9.12-3.45 9.12-9.22 0-.6-.08-1.18-.2-1.72h-8.92z"></path></svg>
            Google
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
                ¿No tienes una cuenta? <Link href="/signup" className="text-primary hover:underline">Regístrate aquí</Link>
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}
