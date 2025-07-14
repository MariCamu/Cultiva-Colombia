
"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Button } from "@/components/ui/button";
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const InteractiveMap = dynamic(
  () => import('@/app/mapa/components/interactive-map').then(mod => mod.InteractiveMap),
  {
    ssr: false,
    loading: () => (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
            <Skeleton className="h-[600px] w-full rounded-lg" />
        </div>
        <div className="lg:col-span-1 space-y-6">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-48 w-full" />
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
