
'use client';

import { ProtectedRoute, useAuth } from '@/context/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { PlusCircle, Leaf } from 'lucide-react';
import Link from 'next/link';

function DashboardContent() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-nunito font-bold tracking-tight text-foreground sm:text-4xl">
        Bienvenido a tu Dashboard, {user?.displayName || user?.email}
      </h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-primary" />
            Mis Cultivos Guardados
          </CardTitle>
          <CardDescription>
            Aquí verás los cultivos que has guardado para un fácil acceso.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground mb-4">
              Aún no has guardado ningún cultivo.
            </p>
            <Button asChild>
              <Link href="/cultivos">
                <PlusCircle className="mr-2 h-4 w-4" />
                Explorar Cultivos
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Add more dashboard components here in the future */}
    </div>
  );
}

export default function DashboardPage() {
    return (
        <ProtectedRoute>
            <DashboardContent />
        </ProtectedRoute>
    );
}
