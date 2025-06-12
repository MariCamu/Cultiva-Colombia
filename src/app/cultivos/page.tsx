
"use client";

import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { MapPin, AlertCircle, CheckCircle, HelpCircle, LocateFixed } from 'lucide-react';

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

// Definición aproximada de cajas delimitadoras para las regiones de Colombia
// Estas son estimaciones y pueden no ser geográficamente precisas.
const regionBoundingBoxes = [
  { slug: 'andina', name: 'Andina', bounds: { minLat: -1.5, maxLat: 11.5, minLng: -78.0, maxLng: -71.5 } },
  { slug: 'amazonia', name: 'Amazonía', bounds: { minLat: -4.25, maxLat: 1.5, minLng: -75.5, maxLng: -66.8 } },
  { slug: 'caribe', name: 'Caribe', bounds: { minLat: 7.0, maxLat: 12.5, minLng: -76.0, maxLng: -71.0 } },
  { slug: 'orinoquia', name: 'Orinoquía', bounds: { minLat: 1.0, maxLat: 7.5, minLng: -72.5, maxLng: -67.0 } },
  { slug: 'pacifica', name: 'Pacífica', bounds: { minLat: 0.5, maxLat: 8.0, minLng: -79.5, maxLng: -75.8 } },
  { slug: 'insular', name: 'Insular', bounds: { minLat: 12.0, maxLat: 16.5, minLng: -82.0, maxLng: -78.0 } }, // Cubre San Andrés y Providencia, muy aproximado
];

function getRegionFromCoordinates(lat: number, lng: number): { slug: string; name: string } | null {
  for (const region of regionBoundingBoxes) {
    if (lat >= region.bounds.minLat && lat <= region.bounds.maxLat &&
        lng >= region.bounds.minLng && lng <= region.bounds.maxLng) {
      return { slug: region.slug, name: region.name };
    }
  }
  return null;
}

function capitalizeFirstLetter(string: string | null) {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
}

type GeolocationStatus = 'idle' | 'pending' | 'success' | 'error';

export default function CultivosPage() {
  const searchParams = useSearchParams();
  const regionQueryParam = searchParams.get('region');

  const [geolocationStatus, setGeolocationStatus] = useState<GeolocationStatus>('idle');
  const [geolocationErrorMsg, setGeolocationErrorMsg] = useState<string | null>(null);
  const [detectedRegionSlug, setDetectedRegionSlug] = useState<string | null>(null);
  const [detectedRegionName, setDetectedRegionName] = useState<string | null>(null);

  useEffect(() => {
    if (!regionQueryParam && navigator.geolocation) {
      setGeolocationStatus('pending');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const regionInfo = getRegionFromCoordinates(latitude, longitude);
          if (regionInfo) {
            setDetectedRegionSlug(regionInfo.slug);
            setDetectedRegionName(regionInfo.name);
          }
          setGeolocationStatus('success');
        },
        (error) => {
          let message = "No se pudo obtener tu ubicación.";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              message = "Permiso de geolocalización denegado.";
              break;
            case error.POSITION_UNAVAILABLE:
              message = "Información de ubicación no disponible.";
              break;
            case error.TIMEOUT:
              message = "Se agotó el tiempo de espera para obtener la ubicación.";
              break;
          }
          setGeolocationErrorMsg(message);
          setGeolocationStatus('error');
        }
      );
    } else if (regionQueryParam) {
      setGeolocationStatus('idle'); 
    }
  }, [regionQueryParam]);

  const activeFilterRegionSlug = regionQueryParam || detectedRegionSlug;
  const activeFilterRegionName = regionQueryParam ? capitalizeFirstLetter(regionQueryParam) : detectedRegionName;

  const displayedCrops = activeFilterRegionSlug
    ? sampleCropsData.filter(crop => crop.regionSlug === activeFilterRegionSlug)
    : sampleCropsData;

  let pageTitle = "Todos los Cultivos";
  let pageDescription = "Descubre una variedad de cultivos de diferentes regiones de Colombia.";

  if (regionQueryParam) {
    pageTitle = `Cultivos de la Región ${capitalizeFirstLetter(regionQueryParam)}`;
    pageDescription = `Explora los cultivos característicos de la región ${capitalizeFirstLetter(regionQueryParam)}.`;
  } else if (detectedRegionName) {
    pageTitle = `Cultivos Sugeridos para tu Región: ${detectedRegionName}`;
    pageDescription = `Basado en tu ubicación (aproximada), te sugerimos estos cultivos de la región ${detectedRegionName}.`;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {pageTitle}
      </h1>

      {!regionQueryParam && geolocationStatus === 'pending' && (
        <Alert>
          <LocateFixed className="h-4 w-4 animate-ping" />
          <AlertTitle>Obteniendo Ubicación</AlertTitle>
          <AlertDescription>Estamos intentando detectar tu región para mostrarte cultivos relevantes...</AlertDescription>
        </Alert>
      )}
      {!regionQueryParam && geolocationStatus === 'error' && geolocationErrorMsg && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error de Geolocalización</AlertTitle>
          <AlertDescription>{geolocationErrorMsg} Mostrando todos los cultivos.</AlertDescription>
        </Alert>
      )}
      {!regionQueryParam && geolocationStatus === 'success' && (
        <>
          {detectedRegionName ? (
            <Alert variant="default" className="bg-green-50 border-green-300 text-green-700">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle>Región Detectada: {detectedRegionName}</AlertTitle>
              <AlertDescription>
                Mostrando cultivos sugeridos para tu región. La detección de región es aproximada.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert>
              <HelpCircle className="h-4 w-4" />
              <AlertTitle>Ubicación Obtenida</AlertTitle>
              <AlertDescription>
                No pudimos determinar una región específica para tu ubicación. Mostrando todos los cultivos.
              </AlertDescription>
            </Alert>
          )}
        </>
      )}
      
      {regionQueryParam && (
        <Alert variant="default" className="bg-accent/10 border-accent/30 text-accent-foreground">
          <MapPin className="h-4 w-4 text-accent" />
          <AlertTitle>Filtro Activo por URL</AlertTitle>
          <AlertDescription>
            Mostrando cultivos para la región: <strong>{capitalizeFirstLetter(regionQueryParam)}</strong>.
          </AlertDescription>
        </Alert>
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
                    {!activeFilterRegionSlug && <Badge variant="outline" className="mt-1 w-fit">{capitalizeFirstLetter(crop.regionSlug)}</Badge>}
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground">{crop.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
             <Alert variant="default" className="mt-4">
                <HelpCircle className="h-4 w-4" />
                <AlertTitle>No se encontraron cultivos</AlertTitle>
                <AlertDescription>
                {activeFilterRegionName 
                    ? `No se encontraron cultivos de ejemplo para la región ${activeFilterRegionName}. Puedes probar seleccionando otra región manualmente o ver todos los cultivos.`
                    : "No hay cultivos de ejemplo para mostrar."}
                </AlertDescription>
            </Alert>
          )}
          <p className="mt-6 text-sm text-muted-foreground">
            Estos son datos de ejemplo. La funcionalidad completa con información detallada y más cultivos estará disponible pronto.
             {(!regionQueryParam && geolocationStatus === 'success') && " La detección de región por geolocalización es una aproximación."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

    