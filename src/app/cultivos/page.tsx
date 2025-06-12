
"use client";

import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { MapPin, AlertCircle, CheckCircle, HelpCircle, LocateFixed, Star } from 'lucide-react';

interface SampleCrop {
  id: string;
  name: string;
  description: string;
  regionSlug: string;
  imageUrl: string;
  dataAiHint: string;
  estimatedPrice: 'Precio bajo' | 'Precio moderado' | 'Precio alto';
  duration: 'Corta (1–2 meses)' | 'Media (3–5 meses)' | 'Larga (6 meses o más)';
  spaceRequired: 'Maceta pequeña (1–3 L)' | 'Maceta mediana (4–10 L)' | 'Maceta grande o jardín (10+ L)';
  plantType: 'Hortalizas de hoja' | 'Hortalizas de raíz' | 'Hortalizas de fruto' | 'Hortalizas de flor' | 'Leguminosas' | 'Cereales' | 'Plantas aromáticas' | 'Plantas de bulbo' | 'Frutales' | 'Tubérculos' | 'Otro';
  difficulty: 1 | 2 | 3 | 4 | 5;
}

const sampleCropsData: SampleCrop[] = [
  // Andina
  { id: 'papa_andina', name: 'Papa (Región Andina)', description: 'Tubérculo versátil y nutritivo, base de la alimentación en la región andina.', regionSlug: 'andina', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'potato field', estimatedPrice: 'Precio bajo', duration: 'Media (3–5 meses)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Tubérculos', difficulty: 2 },
  { id: 'cafe_andino', name: 'Café (Región Andina)', description: 'Reconocido mundialmente por su aroma y sabor, cultivado en las laderas montañosas.', regionSlug: 'andina', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'coffee plant', estimatedPrice: 'Precio moderado', duration: 'Larga (6 meses o más)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Frutales', difficulty: 4 },
  // Amazonía
  { id: 'yuca_amazonia', name: 'Yuca (Región Amazonía)', description: 'Raíz comestible fundamental en la dieta amazónica, adaptable a climas tropicales.', regionSlug: 'amazonia', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'cassava plant', estimatedPrice: 'Precio bajo', duration: 'Larga (6 meses o más)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Tubérculos', difficulty: 2 },
  { id: 'copoazu_amazonia', name: 'Copoazú (Región Amazonía)', description: 'Fruta exótica con pulpa aromática, usada en jugos, postres y cosméticos.', regionSlug: 'amazonia', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'copoazu fruit', estimatedPrice: 'Precio moderado', duration: 'Larga (6 meses o más)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Frutales', difficulty: 3 },
  // Caribe
  { id: 'platano_caribe', name: 'Plátano (Región Caribe)', description: 'Fruta esencial en la cocina caribeña, consumida verde o madura.', regionSlug: 'caribe', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'banana tree', estimatedPrice: 'Precio bajo', duration: 'Larga (6 meses o más)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Frutales', difficulty: 2 },
  { id: 'mango_caribe', name: 'Mango (Región Caribe)', description: 'Fruta tropical dulce y jugosa, con múltiples variedades en la región.', regionSlug: 'caribe', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'mango fruit', estimatedPrice: 'Precio moderado', duration: 'Larga (6 meses o más)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Frutales', difficulty: 3 },
  // Orinoquía
  { id: 'arroz_orinoquia', name: 'Arroz (Región Orinoquía)', description: 'Cereal básico cultivado extensamente en las llanuras inundables de la Orinoquía.', regionSlug: 'orinoquia', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'rice paddy', estimatedPrice: 'Precio bajo', duration: 'Media (3–5 meses)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Cereales', difficulty: 3 },
  { id: 'marañon_orinoquia', name: 'Marañón (Región Orinoquía)', description: 'Fruto seco y pseudofruto carnoso, apreciado por su nuez y pulpa agridulce.', regionSlug: 'orinoquia', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'cashew fruit', estimatedPrice: 'Precio alto', duration: 'Larga (6 meses o más)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Frutales', difficulty: 4 },
  // Pacífica
  { id: 'chontaduro_pacifica', name: 'Chontaduro (Región Pacífica)', description: 'Fruto de palmera altamente nutritivo, parte integral de la cultura del Pacífico.', regionSlug: 'pacifica', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'chontaduro fruit', estimatedPrice: 'Precio moderado', duration: 'Larga (6 meses o más)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Frutales', difficulty: 3 },
  { id: 'borojo_pacifica', name: 'Borojó (Región Pacífica)', description: 'Fruta energética con propiedades afrodisíacas, consumida en jugos y jaleas.', regionSlug: 'pacifica', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'borojo fruit', estimatedPrice: 'Precio moderado', duration: 'Larga (6 meses o más)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Frutales', difficulty: 4 },
  // Insular
  { id: 'coco_insular', name: 'Coco (Región Insular)', description: 'Fruto tropical versátil, utilizado para agua, pulpa y aceite en las islas.', regionSlug: 'insular', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'coconut tree', estimatedPrice: 'Precio bajo', duration: 'Larga (6 meses o más)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Frutales', difficulty: 2 },
  { id: 'pan_de_fruta_insular', name: 'Pan de Fruta (Región Insular)', description: 'Fruto grande y almidonado, básico en la alimentación de las islas caribeñas.', regionSlug: 'insular', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'breadfruit tree', estimatedPrice: 'Precio moderado', duration: 'Larga (6 meses o más)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Frutales', difficulty: 3 },
];

const regionBoundingBoxes = [
  { slug: 'insular', name: 'Insular', bounds: { minLat: 12.0, maxLat: 16.5, minLng: -82.0, maxLng: -78.0 } },
  { slug: 'caribe', name: 'Caribe', bounds: { minLat: 7.0, maxLat: 12.5, minLng: -76.0, maxLng: -71.0 } },
  { slug: 'pacifica', name: 'Pacífica', bounds: { minLat: 0.5, maxLat: 8.0, minLng: -79.5, maxLng: -75.8 } },
  { slug: 'amazonia', name: 'Amazonía', bounds: { minLat: -4.25, maxLat: 1.5, minLng: -75.5, maxLng: -66.8 } },
  { slug: 'orinoquia', name: 'Orinoquía', bounds: { minLat: 1.0, maxLat: 7.5, minLng: -72.5, maxLng: -67.0 } },
  { slug: 'andina', name: 'Andina', bounds: { minLat: -1.5, maxLat: 11.5, minLng: -78.0, maxLng: -71.5 } }, // Se evalúa al final por su tamaño
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
  let geolocationNote = "";

  if (regionQueryParam) {
    pageTitle = `Cultivos de la Región ${capitalizeFirstLetter(regionQueryParam)}`;
    pageDescription = `Explora los cultivos característicos de la región ${capitalizeFirstLetter(regionQueryParam)}.`;
  } else if (detectedRegionName) {
    pageTitle = `Cultivos Sugeridos para tu Región: ${detectedRegionName}`;
    pageDescription = `Basado en tu ubicación (aproximada), te sugerimos estos cultivos de la región ${detectedRegionName}.`;
    geolocationNote = `Nota: La región (${detectedRegionName}) ha sido estimada basándose en tu ubicación y puede no ser exacta. Esta funcionalidad es una aproximación.`;
  } else if (geolocationStatus === 'success' && !detectedRegionName) {
     pageDescription = "No pudimos determinar una región específica para tu ubicación. Mostrando todos los cultivos.";
     geolocationNote = "Nota: La detección de región por geolocalización es una aproximación.";
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
                No pudimos determinar una región específica para tu ubicación. Mostrando todos los cultivos. La detección de región por geolocalización es una aproximación.
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
          {geolocationNote && <p className="text-sm text-muted-foreground mb-4">{geolocationNote}</p>}
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
                  <CardContent className="flex-grow space-y-3">
                    <p className="text-sm text-muted-foreground mb-3">{crop.description}</p>
                    <div className="space-y-2 pt-2 border-t">
                        <div className="flex items-center">
                            <span className="text-xs font-semibold mr-2 w-28">Dificultad:</span>
                            <div className="flex">
                                {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className={`h-4 w-4 ${i < crop.difficulty ? 'fill-yellow-400 text-yellow-500' : 'text-gray-300'}`} />
                                ))}
                            </div>
                        </div>
                        <Badge variant="outline">Precio: {crop.estimatedPrice}</Badge>
                        <Badge variant="outline">Duración: {crop.duration}</Badge>
                        <Badge variant="outline">Espacio: {crop.spaceRequired}</Badge>
                        <Badge variant="outline">Tipo: {crop.plantType}</Badge>
                    </div>
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
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

