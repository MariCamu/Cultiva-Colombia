
"use client";

import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, AlertCircle, CheckCircle, HelpCircle, LocateFixed, Star, Filter } from 'lucide-react';
import { Label } from '@/components/ui/label';

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
  { id: 'quinua_andina', name: 'Quinua (Región Andina)', description: 'Superalimento ancestral, rico en proteínas y cultivado en alturas andinas.', regionSlug: 'andina', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'quinoa field', estimatedPrice: 'Precio moderado', duration: 'Media (3–5 meses)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Cereales', difficulty: 3 },
  // Amazonía
  { id: 'yuca_amazonia', name: 'Yuca (Región Amazonía)', description: 'Raíz comestible fundamental en la dieta amazónica, adaptable a climas tropicales.', regionSlug: 'amazonia', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'cassava plant', estimatedPrice: 'Precio bajo', duration: 'Larga (6 meses o más)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Tubérculos', difficulty: 2 },
  { id: 'copoazu_amazonia', name: 'Copoazú (Región Amazonía)', description: 'Fruta exótica con pulpa aromática, usada en jugos, postres y cosméticos.', regionSlug: 'amazonia', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'copoazu fruit', estimatedPrice: 'Precio moderado', duration: 'Larga (6 meses o más)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Frutales', difficulty: 3 },
  { id: 'platano_harton_amazonia', name: 'Plátano Hartón (Amazonía)', description: 'Variedad de plátano grande, ideal para cocinar, cultivado en suelos amazónicos.', regionSlug: 'amazonia', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'plantain tree', estimatedPrice: 'Precio bajo', duration: 'Larga (6 meses o más)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Frutales', difficulty: 2 },
  // Caribe
  { id: 'platano_caribe', name: 'Plátano (Región Caribe)', description: 'Fruta esencial en la cocina caribeña, consumida verde o madura.', regionSlug: 'caribe', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'banana tree', estimatedPrice: 'Precio bajo', duration: 'Larga (6 meses o más)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Frutales', difficulty: 2 },
  { id: 'mango_caribe', name: 'Mango (Región Caribe)', description: 'Fruta tropical dulce y jugosa, con múltiples variedades en la región.', regionSlug: 'caribe', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'mango fruit', estimatedPrice: 'Precio moderado', duration: 'Larga (6 meses o más)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Frutales', difficulty: 3 },
  { id: 'ñame_caribe', name: 'Ñame (Región Caribe)', description: 'Tubérculo importante en la gastronomía caribeña, de textura harinosa.', regionSlug: 'caribe', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'yam plant', estimatedPrice: 'Precio bajo', duration: 'Larga (6 meses o más)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Tubérculos', difficulty: 3 },
  // Orinoquía
  { id: 'arroz_orinoquia', name: 'Arroz (Región Orinoquía)', description: 'Cereal básico cultivado extensamente en las llanuras inundables de la Orinoquía.', regionSlug: 'orinoquia', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'rice paddy', estimatedPrice: 'Precio bajo', duration: 'Media (3–5 meses)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Cereales', difficulty: 3 },
  { id: 'marañon_orinoquia', name: 'Marañón (Región Orinoquía)', description: 'Fruto seco y pseudofruto carnoso, apreciado por su nuez y pulpa agridulce.', regionSlug: 'orinoquia', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'cashew fruit', estimatedPrice: 'Precio alto', duration: 'Larga (6 meses o más)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Frutales', difficulty: 4 },
  { id: 'maiz_orinoquia', name: 'Maíz (Región Orinoquía)', description: 'Cultivo tradicional en los llanos, usado para consumo humano y animal.', regionSlug: 'orinoquia', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'corn field', estimatedPrice: 'Precio bajo', duration: 'Media (3–5 meses)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Cereales', difficulty: 2 },
  // Pacífica
  { id: 'chontaduro_pacifica', name: 'Chontaduro (Región Pacífica)', description: 'Fruto de palmera altamente nutritivo, parte integral de la cultura del Pacífico.', regionSlug: 'pacifica', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'chontaduro fruit', estimatedPrice: 'Precio moderado', duration: 'Larga (6 meses o más)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Frutales', difficulty: 3 },
  { id: 'borojo_pacifica', name: 'Borojó (Región Pacífica)', description: 'Fruta energética con propiedades afrodisíacas, consumida en jugos y jaleas.', regionSlug: 'pacifica', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'borojo fruit', estimatedPrice: 'Precio moderado', duration: 'Larga (6 meses o más)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Frutales', difficulty: 4 },
  { id: 'coco_pacifico', name: 'Coco (Región Pacífica)', description: 'Palmera abundante en la costa Pacífica, su fruto es clave en la gastronomía local.', regionSlug: 'pacifica', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'coconut palm', estimatedPrice: 'Precio bajo', duration: 'Larga (6 meses o más)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Frutales', difficulty: 2 },
  // Insular
  { id: 'coco_insular', name: 'Coco (Región Insular)', description: 'Fruto tropical versátil, utilizado para agua, pulpa y aceite en las islas.', regionSlug: 'insular', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'coconut tree', estimatedPrice: 'Precio bajo', duration: 'Larga (6 meses o más)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Frutales', difficulty: 2 },
  { id: 'pan_de_fruta_insular', name: 'Pan de Fruta (Región Insular)', description: 'Fruto grande y almidonado, básico en la alimentación de las islas caribeñas.', regionSlug: 'insular', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'breadfruit tree', estimatedPrice: 'Precio moderado', duration: 'Larga (6 meses o más)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Frutales', difficulty: 3 },
  { id: 'batata_insular', name: 'Batata (Región Insular)', description: 'Tubérculo dulce similar a la papa, cultivado en las islas por su adaptabilidad.', regionSlug: 'insular', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'sweet potato', estimatedPrice: 'Precio bajo', duration: 'Media (3–5 meses)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Tubérculos', difficulty: 2 },
];

const regionBoundingBoxes = [
  { slug: 'insular', name: 'Insular', bounds: { minLat: 12.0, maxLat: 16.5, minLng: -82.0, maxLng: -78.0 } },
  { slug: 'caribe', name: 'Caribe', bounds: { minLat: 7.0, maxLat: 12.5, minLng: -76.0, maxLng: -71.0 } },
  { slug: 'pacifica', name: 'Pacífica', bounds: { minLat: 0.5, maxLat: 8.0, minLng: -79.5, maxLng: -75.8 } },
  { slug: 'amazonia', name: 'Amazonía', bounds: { minLat: -4.25, maxLat: 1.5, minLng: -75.5, maxLng: -66.8 } },
  { slug: 'orinoquia', name: 'Orinoquía', bounds: { minLat: 1.0, maxLat: 7.5, minLng: -72.5, maxLng: -67.0 } },
  { slug: 'andina', name: 'Andina', bounds: { minLat: -1.5, maxLat: 11.5, minLng: -78.0, maxLng: -71.5 } },
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

// Opciones para los selectores de filtro
const regionOptions = regionBoundingBoxes.map(r => ({ value: r.slug, label: r.name }));
const priceOptions = [
  { value: 'all', label: 'Todos los Precios' },
  { value: 'Precio bajo', label: 'Precio bajo' },
  { value: 'Precio moderado', label: 'Precio moderado' },
  { value: 'Precio alto', label: 'Precio alto' },
];
const durationOptions = [
  { value: 'all', label: 'Todas las Duraciones' },
  { value: 'Corta (1–2 meses)', label: 'Corta (1–2 meses)' },
  { value: 'Media (3–5 meses)', label: 'Media (3–5 meses)' },
  { value: 'Larga (6 meses o más)', label: 'Larga (6 meses o más)' },
];
const spaceOptions = [
  { value: 'all', label: 'Todos los Espacios' },
  { value: 'Maceta pequeña (1–3 L)', label: 'Maceta pequeña (1–3 L)' },
  { value: 'Maceta mediana (4–10 L)', label: 'Maceta mediana (4–10 L)' },
  { value: 'Maceta grande o jardín (10+ L)', label: 'Maceta grande o jardín (10+ L)' },
];
const plantTypeOptions = [
  { value: 'all', label: 'Todos los Tipos' },
  ...Array.from(new Set(sampleCropsData.map(c => c.plantType))).sort().map(pt => ({ value: pt, label: pt }))
];
const difficultyOptions = [
  { value: 'all', label: 'Todas las Dificultades' },
  { value: '1', label: '⭐ (Muy Fácil)' },
  { value: '2', label: '⭐⭐ (Fácil)' },
  { value: '3', label: '⭐⭐⭐ (Medio)' },
  { value: '4', label: '⭐⭐⭐⭐ (Difícil)' },
  { value: '5', label: '⭐⭐⭐⭐⭐ (Muy Difícil)' },
];


export default function CultivosPage() {
  const searchParams = useSearchParams();
  const regionQueryParam = searchParams.get('region');

  const [geolocationStatus, setGeolocationStatus] = useState<GeolocationStatus>('idle');
  const [geolocationErrorMsg, setGeolocationErrorMsg] = useState<string | null>(null);
  const [detectedRegionSlug, setDetectedRegionSlug] = useState<string | null>(null);
  const [detectedRegionName, setDetectedRegionName] = useState<string | null>(null);

  const [manualRegionSlug, setManualRegionSlug] = useState<string | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<string | null>('all');
  const [selectedDuration, setSelectedDuration] = useState<string | null>('all');
  const [selectedSpace, setSelectedSpace] = useState<string | null>('all');
  const [selectedPlantType, setSelectedPlantType] = useState<string | null>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>('all');


  useEffect(() => {
    // Solo intentar geolocalización si no hay filtro manual de región Y no hay filtro de región por URL
    if (!manualRegionSlug && !regionQueryParam && navigator.geolocation) {
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
          // ... (código de manejo de errores de geolocalización existente)
          setGeolocationErrorMsg(message);
          setGeolocationStatus('error');
        }
      );
    } else if (regionQueryParam || manualRegionSlug) {
      setGeolocationStatus('idle'); // No necesitamos geolocalización si hay filtro manual o por URL
    }
  }, [regionQueryParam, manualRegionSlug]);

  // Determinar la región activa para filtrar y mostrar
  let activeRegionSlugForFiltering: string | null = null;
  let activeRegionNameForDisplay: string | null = null;
  let filterSource: 'manual' | 'url' | 'geo' | 'none' = 'none';

  if (manualRegionSlug && manualRegionSlug !== 'all') {
    activeRegionSlugForFiltering = manualRegionSlug;
    activeRegionNameForDisplay = regionOptions.find(r => r.value === manualRegionSlug)?.label || null;
    filterSource = 'manual';
  } else if (regionQueryParam) {
    activeRegionSlugForFiltering = regionQueryParam;
    activeRegionNameForDisplay = capitalizeFirstLetter(regionQueryParam);
    filterSource = 'url';
  } else if (detectedRegionSlug) {
    activeRegionSlugForFiltering = detectedRegionSlug;
    activeRegionNameForDisplay = detectedRegionName;
    filterSource = 'geo';
  }

  const displayedCrops = sampleCropsData.filter(crop => {
    let matches = true;
    if (activeRegionSlugForFiltering && crop.regionSlug !== activeRegionSlugForFiltering) {
      matches = false;
    }
    if (selectedPrice && selectedPrice !== 'all' && crop.estimatedPrice !== selectedPrice) {
      matches = false;
    }
    if (selectedDuration && selectedDuration !== 'all' && crop.duration !== selectedDuration) {
      matches = false;
    }
    if (selectedSpace && selectedSpace !== 'all' && crop.spaceRequired !== selectedSpace) {
      matches = false;
    }
    if (selectedPlantType && selectedPlantType !== 'all' && crop.plantType !== selectedPlantType) {
      matches = false;
    }
    if (selectedDifficulty && selectedDifficulty !== 'all' && crop.difficulty.toString() !== selectedDifficulty) {
      matches = false;
    }
    return matches;
  });

  let pageTitle = "Todos los Cultivos";
  let pageDescription = "Descubre una variedad de cultivos de diferentes regiones de Colombia.";
  let filterAlertMessage: React.ReactNode = null;

  if (filterSource === 'manual' && activeRegionNameForDisplay) {
    pageTitle = `Cultivos Filtrados para la Región: ${activeRegionNameForDisplay}`;
    pageDescription = `Explora los cultivos característicos de la región ${activeRegionNameForDisplay} según los filtros aplicados.`;
    filterAlertMessage = (
      <Alert variant="default" className="bg-accent/10 border-accent/30 text-accent-foreground">
        <Filter className="h-4 w-4 text-accent" />
        <AlertTitle>Filtro Manual Activo</AlertTitle>
        <AlertDescription>
          Mostrando cultivos para la región: <strong>{activeRegionNameForDisplay}</strong>. Puedes ajustar otros filtros abajo.
        </AlertDescription>
      </Alert>
    );
  } else if (filterSource === 'url' && activeRegionNameForDisplay) {
    pageTitle = `Cultivos de la Región ${activeRegionNameForDisplay}`;
    pageDescription = `Explora los cultivos característicos de la región ${activeRegionNameForDisplay}.`;
    filterAlertMessage = (
      <Alert variant="default" className="bg-accent/10 border-accent/30 text-accent-foreground">
        <MapPin className="h-4 w-4 text-accent" />
        <AlertTitle>Filtro Activo por URL</AlertTitle>
        <AlertDescription>
          Mostrando cultivos para la región: <strong>{activeRegionNameForDisplay}</strong>.
        </AlertDescription>
      </Alert>
    );
  } else if (filterSource === 'geo' && activeRegionNameForDisplay) {
    pageTitle = `Cultivos Sugeridos para tu Región: ${activeRegionNameForDisplay}`;
    pageDescription = `Basado en tu ubicación (aproximada), te sugerimos estos cultivos de la región ${activeRegionNameForDisplay}.`;
    filterAlertMessage = (
       <Alert variant="default" className="bg-green-50 border-green-300 text-green-700">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle>Región Detectada: {activeRegionNameForDisplay}</AlertTitle>
          <AlertDescription>
            Mostrando cultivos sugeridos para tu región. La detección de región es aproximada.
          </AlertDescription>
        </Alert>
    );
  } else if (geolocationStatus === 'success' && !activeRegionNameForDisplay && filterSource !== 'manual' && filterSource !== 'url') {
     pageDescription = "No pudimos determinar una región específica para tu ubicación. Mostrando todos los cultivos.";
     filterAlertMessage = (
        <Alert>
            <HelpCircle className="h-4 w-4" />
            <AlertTitle>Ubicación Obtenida</AlertTitle>
            <AlertDescription>
            No pudimos determinar una región específica para tu ubicación. Mostrando todos los cultivos. La detección de región por geolocalización es una aproximación.
            </AlertDescription>
        </Alert>
     );
  }


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {pageTitle}
      </h1>

      {/* Alertas de Geolocalización y Filtros */}
      {filterSource !== 'manual' && filterSource !== 'url' && geolocationStatus === 'pending' && (
        <Alert>
          <LocateFixed className="h-4 w-4 animate-ping" />
          <AlertTitle>Obteniendo Ubicación</AlertTitle>
          <AlertDescription>Estamos intentando detectar tu región para mostrarte cultivos relevantes...</AlertDescription>
        </Alert>
      )}
      {filterSource !== 'manual' && filterSource !== 'url' && geolocationStatus === 'error' && geolocationErrorMsg && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error de Geolocalización</AlertTitle>
          <AlertDescription>{geolocationErrorMsg} Mostrando todos los cultivos.</AlertDescription>
        </Alert>
      )}
      {filterAlertMessage}
      
      {/* Sección de Filtros Manuales */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtrar Cultivos
          </CardTitle>
          <CardDescription>Ajusta los filtros para encontrar los cultivos que mejor se adapten a tus necesidades.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="manualRegionSelect" className="text-sm font-medium">Región</Label>
            <Select value={manualRegionSlug || 'all'} onValueChange={(value) => setManualRegionSlug(value === 'all' ? null : value)}>
              <SelectTrigger id="manualRegionSelect">
                <SelectValue placeholder="Seleccionar Región" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las Regiones</SelectItem>
                {regionOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="priceSelect" className="text-sm font-medium">Precio Estimado</Label>
            <Select value={selectedPrice || 'all'} onValueChange={(value) => setSelectedPrice(value === 'all' ? null : value)}>
              <SelectTrigger id="priceSelect"><SelectValue /></SelectTrigger>
              <SelectContent>
                {priceOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="durationSelect" className="text-sm font-medium">Duración</Label>
            <Select value={selectedDuration || 'all'} onValueChange={(value) => setSelectedDuration(value === 'all' ? null : value)}>
              <SelectTrigger id="durationSelect"><SelectValue /></SelectTrigger>
              <SelectContent>
                {durationOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="spaceSelect" className="text-sm font-medium">Espacio Requerido</Label>
            <Select value={selectedSpace || 'all'} onValueChange={(value) => setSelectedSpace(value === 'all' ? null : value)}>
              <SelectTrigger id="spaceSelect"><SelectValue /></SelectTrigger>
              <SelectContent>
                {spaceOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="plantTypeSelect" className="text-sm font-medium">Tipo de Planta</Label>
            <Select value={selectedPlantType || 'all'} onValueChange={(value) => setSelectedPlantType(value === 'all' ? null : value)}>
              <SelectTrigger id="plantTypeSelect"><SelectValue /></SelectTrigger>
              <SelectContent>
                {plantTypeOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="difficultySelect" className="text-sm font-medium">Dificultad</Label>
            <Select value={selectedDifficulty || 'all'} onValueChange={(value) => setSelectedDifficulty(value === 'all' ? null : value)}>
              <SelectTrigger id="difficultySelect"><SelectValue /></SelectTrigger>
              <SelectContent>
                {difficultyOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
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
          {(filterSource === 'geo' && activeRegionNameForDisplay) && (
            <p className="text-sm text-muted-foreground mb-4">
              Nota: La región ({activeRegionNameForDisplay}) ha sido estimada basándose en tu ubicación y puede no ser exacta. Esta funcionalidad es una aproximación.
            </p>
          )}
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
                    {(!activeRegionSlugForFiltering || (activeRegionSlugForFiltering && activeRegionSlugForFiltering !== crop.regionSlug)) && 
                     (!manualRegionSlug || manualRegionSlug === 'all') &&
                      <Badge variant="outline" className="mt-1 w-fit">{capitalizeFirstLetter(crop.regionSlug)}</Badge>
                    }
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
                {activeRegionNameForDisplay 
                    ? `No se encontraron cultivos que coincidan con los filtros aplicados para la región ${activeRegionNameForDisplay}. Prueba con otros filtros o regiones.`
                    : "No se encontraron cultivos que coincidan con los filtros aplicados. Prueba con otros filtros."}
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

