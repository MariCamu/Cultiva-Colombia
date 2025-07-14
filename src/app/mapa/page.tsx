
"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const InteractiveMap = dynamic(
  () => import('@/app/mapa/components/interactive-map').then(mod => mod.InteractiveMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full space-y-4">
        <Skeleton className="h-[500px] w-full rounded-lg" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
            {Array.from({ length: 7 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
            ))}
        </div>
      </div>
    )
  }
);

const regions = [
  { name: "Todas las Regiones", slug: "todas" },
  { name: "Andina", slug: "andina" },
  { name: "Caribe", slug: "caribe" },
  { name: "Pacífica", slug: "pacifica" },
  { name: "Orinoquía", slug: "orinoquia" },
  { name: "Amazonía", slug: "amazonia" },
  { name: "Insular", slug: "insular" },
];

export default function MapaPage() {
  const [activeRegion, setActiveRegion] = useState('todas');
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-nunito font-bold tracking-tight text-foreground sm:text-4xl">
          Mapa Interactivo de Cultivos
        </h1>
        <p className="mt-2 max-w-2xl text-lg text-muted-foreground">
          Explora los cultivos ideales para cada zona agroclimática. Haz clic en un ícono para ver su ficha técnica. Los colores representan la dificultad de cultivo.
        </p>
      </div>

      <InteractiveMap />
      
      <section>
        <h2 className="text-2xl font-nunito font-bold tracking-tight text-foreground mb-4">
          Acceso Rápido por Región
        </h2>
        <div className="flex flex-wrap gap-2">
          {regions.map((region) => (
            <Button
              key={region.slug}
              onClick={() => setActiveRegion(region.slug)}
              variant={activeRegion === region.slug ? 'default' : 'outline'}
              className={cn(
                "rounded-full transition-all duration-200",
                activeRegion === region.slug ? "bg-primary text-primary-foreground" : "text-foreground"
              )}
            >
              {region.name}
            </Button>
          ))}
        </div>
      </section>
    </div>
  );
}
