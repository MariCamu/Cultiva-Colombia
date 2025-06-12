
"use client";

// import dynamic from 'next/dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
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
    imgSrc: "https://placehold.co/400x300.png",
    imgAlt: "Paisaje de la región Andina",
    imgHint: "andes mountains"
  },
  {
    name: "Amazonía",
    slug: "amazonia",
    description: "Selva tropical exuberante, hogar de una biodiversidad única y cultivos ancestrales.",
    imgSrc: "https://placehold.co/400x300.png",
    imgAlt: "Paisaje de la región Amazónica",
    imgHint: "amazon rainforest"
  },
  {
    name: "Caribe",
    slug: "caribe",
    description: "Costas soleadas, llanuras y una rica tradición agrícola adaptada al trópico.",
    imgSrc: "https://placehold.co/400x300.png",
    imgAlt: "Paisaje de la región Caribe",
    imgHint: "caribbean coast"
  },
  {
    name: "Orinoquía",
    slug: "orinoquia",
    description: "Extensas llanuras, ganadería y cultivos adaptados a sus sabanas.",
    imgSrc: "https://placehold.co/400x300.png",
    imgAlt: "Paisaje de la región Orinoquía",
    imgHint: "colombian plains"
  },
  {
    name: "Pacífica",
    slug: "pacifica",
    description: "Costa selvática y lluviosa, con una agricultura diversa y rica en productos exóticos.",
    imgSrc: "https://placehold.co/400x300.png",
    imgAlt: "Paisaje de la región Pacífica",
    imgHint: "pacific coast jungle"
  },
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {regionsData.map((region) => (
            <Card key={region.slug} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <Image
                src={region.imgSrc}
                alt={region.imgAlt}
                width={400}
                height={300}
                className="w-full h-48 object-cover"
                data-ai-hint={region.imgHint}
              />
              <CardHeader>
                <CardTitle>{region.name}</CardTitle>
                <CardDescription className="text-sm h-16 line-clamp-3">{region.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                {/* Contenido adicional si es necesario */}
              </CardContent>
              <div className="p-6 pt-2">
                <Button asChild className="w-full">
                  <Link href={`/cultivos?region=${region.slug}`}>Ver Cultivos de {region.name}</Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
