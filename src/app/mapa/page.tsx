
"use client";

// import dynamic from 'next/dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Skeleton } from '@/components/ui/skeleton';

// const InteractiveMap = dynamic(
//   () => import('@/app/mapa/components/interactive-map').then(mod => mod.InteractiveMap),
//   { 
//     ssr: false,
//     loading: () => (
//       <div className="space-y-4">
//         <Skeleton className="h-[500px] w-full rounded-lg" />
//         <Skeleton className="h-[120px] w-full rounded-lg" />
//       </div>
//     )
//   }
// );

export default function MapaPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Mapa Interactivo de Cultivos
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Explora los Cultivos de Colombia</CardTitle>
          <CardDescription>
            Navegue por el mapa para descubrir diversos cultivos disponibles en Colombia. 
            Los marcadores indican la ubicación aproximada y su color representa el nivel de dificultad de cultivo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* <InteractiveMap /> */}
          <p className="text-muted-foreground">
            El mapa interactivo está actualmente en desarrollo. ¡Vuelve pronto para explorarlo!
          </p>
        </CardContent>
      </Card>
      
    </div>
  );
}
