
"use client";

// import dynamic from 'next/dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
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

const regionsData = [
  {
    name: "Andina",
    slug: "andina",
    description: "Montañas, valles fértiles y una gran diversidad de climas y cultivos.",
  },
  {
    name: "Amazonía",
    slug: "amazonia",
    description: "Selva tropical exuberante, hogar de una biodiversidad única y cultivos ancestrales.",
  },
  {
    name: "Caribe",
    slug: "caribe",
    description: "Costas soleadas, llanuras y una rica tradición agrícola adaptada al trópico.",
  },
  {
    name: "Orinoquía",
    slug: "orinoquia",
    description: "Extensas llanuras, ganadería y cultivos adaptados a sus sabanas.",
  },
  {
    name: "Pacífica",
    slug: "pacifica",
    description: "Costa selvática y lluviosa, con una agricultura diversa y rica en productos exóticos.",
  },
  {
    name: "Insular",
    slug: "insular",
    description: "Islas caribeñas y del Pacífico con ecosistemas únicos y cultivos tropicales.",
  }
];

export default function MapaPage() {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Mapa Interactivo de Cultivos
        </h1>
        <Card className="mt-6">
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

      <section>
        <h2 className="text-3xl font-bold tracking-tight text-foreground mb-8 text-center sm:text-left">
          Explora Cultivos por Región
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {regionsData.map((region) => (
            <Card key={region.slug} className="shadow-md hover:shadow-lg transition-shadow flex flex-col">
              <CardHeader className="p-4 flex-grow">
                <CardTitle className="text-lg font-semibold">{region.name}</CardTitle>
                <CardDescription className="text-xs pt-1 line-clamp-3">{region.description}</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <Button asChild size="sm" className="w-full">
                  <Link href={`/cultivos?region=${region.slug}`}>Explorar {region.name}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

