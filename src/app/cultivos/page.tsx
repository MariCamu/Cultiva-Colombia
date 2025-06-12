
"use client";

import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';

interface SampleCrop {
  id: string;
  name: string;
  description: string;
  regionSlug: string;
  imageUrl: string;
  dataAiHint: string;
}

const sampleCropsData: SampleCrop[] = [
  // Andina
  { id: 'papa_andina', name: 'Papa (Región Andina)', description: 'Tubérculo versátil y nutritivo, base de la alimentación en la región andina.', regionSlug: 'andina', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'potato field' },
  { id: 'cafe_andino', name: 'Café (Región Andina)', description: 'Reconocido mundialmente por su aroma y sabor, cultivado en las laderas montañosas.', regionSlug: 'andina', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'coffee plant' },
  // Amazonía
  { id: 'yuca_amazonia', name: 'Yuca (Región Amazonía)', description: 'Raíz comestible fundamental en la dieta amazónica, adaptable a climas tropicales.', regionSlug: 'amazonia', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'cassava plant' },
  { id: 'copoazu_amazonia', name: 'Copoazú (Región Amazonía)', description: 'Fruta exótica con pulpa aromática, usada en jugos, postres y cosméticos.', regionSlug: 'amazonia', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'copoazu fruit' },
  // Caribe
  { id: 'platano_caribe', name: 'Plátano (Región Caribe)', description: 'Fruta esencial en la cocina caribeña, consumida verde o madura.', regionSlug: 'caribe', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'banana tree' },
  { id: 'mango_caribe', name: 'Mango (Región Caribe)', description: 'Fruta tropical dulce y jugosa, con múltiples variedades en la región.', regionSlug: 'caribe', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'mango fruit' },
  // Orinoquía
  { id: 'arroz_orinoquia', name: 'Arroz (Región Orinoquía)', description: 'Cereal básico cultivado extensamente en las llanuras inundables de la Orinoquía.', regionSlug: 'orinoquia', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'rice paddy' },
  { id: 'marañon_orinoquia', name: 'Marañón (Región Orinoquía)', description: 'Fruto seco y pseudofruto carnoso, apreciado por su nuez y pulpa agridulce.', regionSlug: 'orinoquia', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'cashew fruit' },
  // Pacífica
  { id: 'chontaduro_pacifica', name: 'Chontaduro (Región Pacífica)', description: 'Fruto de palmera altamente nutritivo, parte integral de la cultura del Pacífico.', regionSlug: 'pacifica', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'chontaduro fruit' },
  { id: 'borojo_pacifica', name: 'Borojó (Región Pacífica)', description: 'Fruta energética con propiedades afrodisíacas, consumida en jugos y jaleas.', regionSlug: 'pacifica', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'borojo fruit' },
  // Insular
  { id: 'coco_insular', name: 'Coco (Región Insular)', description: 'Fruto tropical versátil, utilizado para agua, pulpa y aceite en las islas.', regionSlug: 'insular', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'coconut tree' },
  { id: 'pan_de_fruta_insular', name: 'Pan de Fruta (Región Insular)', description: 'Fruto grande y almidonado, básico en la alimentación de las islas caribeñas.', regionSlug: 'insular', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'breadfruit tree' },
];

function capitalizeFirstLetter(string: string | null) {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function CultivosPage() {
  const searchParams = useSearchParams();
  const regionQueryParam = searchParams.get('region');
  const capitalizedRegion = capitalizeFirstLetter(regionQueryParam);

  const displayedCrops = regionQueryParam
    ? sampleCropsData.filter(crop => crop.regionSlug === regionQueryParam)
    : sampleCropsData;

  const pageTitle = regionQueryParam 
    ? `Cultivos de la Región ${capitalizedRegion}` 
    : "Todos los Cultivos";
  
  const pageDescription = regionQueryParam
    ? `Explora los cultivos característicos de la región ${capitalizedRegion}.`
    : "Descubre una variedad de cultivos de diferentes regiones de Colombia.";

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {pageTitle}
      </h1>

      {regionQueryParam && (
        <h2 className="text-xl font-semibold text-accent">
          Filtrando por: {capitalizedRegion}
        </h2>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>
            Fichas Detalladas de Cultivos
          </CardTitle>
          <CardDescription>
            {pageDescription}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {displayedCrops.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedCrops.map((crop) => (
                <Card key={crop.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow flex flex-col">
                  <Image
                    src={crop.imageUrl}
                    alt={crop.name}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover"
                    data-ai-hint={crop.dataAiHint}
                  />
                  <CardHeader>
                    <CardTitle className="text-xl">{crop.name}</CardTitle>
                    {regionQueryParam ? null : <Badge variant="outline" className="mt-1 w-fit">{capitalizeFirstLetter(crop.regionSlug)}</Badge>}
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground">{crop.description}</p>
                  </CardContent>
                  {/* Futuro enlace a detalles del cultivo:
                  <CardFooter>
                    <Button asChild variant="link" className="p-0 h-auto text-primary">
                      <Link href={`/cultivos/${crop.id}`}>Ver detalles</Link>
                    </Button>
                  </CardFooter>
                  */}
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">
              {regionQueryParam 
                ? `No se encontraron cultivos de ejemplo para la región ${capitalizedRegion}.`
                : "No hay cultivos de ejemplo para mostrar."}
            </p>
          )}
          <p className="mt-6 text-sm text-muted-foreground">
            Estos son datos de ejemplo. La funcionalidad completa con información detallada y más cultivos estará disponible pronto.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
