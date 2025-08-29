
'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const regionOptions = [
    { value: 'andina', label: 'Andina' },
    { value: 'caribe', label: 'Caribe' },
    { value: 'pacifica', label: 'Pacífica' },
    { value: 'orinoquia', label: 'Orinoquía' },
    { value: 'amazonia', label: 'Amazonía' },
    { value: 'insular', label: 'Insular' },
];

export default function SignupPage() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [region, setRegion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSignup = async (event: FormEvent) => {
    event.preventDefault();
    if (!region) {
        toast({ variant: 'destructive', title: 'Campo Requerido', description: 'Por favor, selecciona tu región.' });
        return;
    }
    setIsLoading(true);
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update Firebase Auth profile
      await updateProfile(user, { displayName: displayName });

      // Create user document in Firestore
      const userRef = doc(db, 'usuarios', user.uid);
      await setDoc(userRef, {
        nombre: displayName,
        email: user.email,
        region: region,
        fecha_registro: serverTimestamp(),
        preferencia_tema: 'cultiva_verde_default',
        harvestedCropsCount: 0,
        totalHarvestWeight: 0,
      });
      
      toast({
          title: "Registro Exitoso",
          description: "¡Bienvenido! Redirigiendo al dashboard...",
      });
      router.push('/dashboard');

    } catch (error: any) {
        console.error("Error de registro:", error);
        toast({
            variant: 'destructive',
            title: 'Error de Registro',
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
          <CardTitle className="text-2xl font-nunito font-bold">Crear Cuenta</CardTitle>
          <CardDescription>Únete a nuestra comunidad para empezar a cultivar.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Nombre</Label>
              <Input
                id="displayName"
                type="text"
                placeholder="Tu nombre"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
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
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="region">¿En qué región vives?</Label>
              <Select value={region} onValueChange={setRegion} required>
                <SelectTrigger id="region">
                    <SelectValue placeholder="Selecciona tu región principal" />
                </SelectTrigger>
                <SelectContent>
                    {regionOptions.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                        </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
                ¿Ya tienes una cuenta? <Link href="/login" className="text-primary hover:underline">Inicia sesión aquí</Link>
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}
