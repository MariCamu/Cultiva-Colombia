
"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, AlertCircle, CheckCircle, HelpCircle, LocateFixed, Star, Filter, MessageSquareText, PlusCircle, Wheat, BookHeart, Building, Home, Sprout } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { AddCropDialog } from './components/add-crop-dialog';
import type { SampleCrop } from '@/models/crop-model';


const sampleCropsData: SampleCrop[] = [
    { id: 'frijol_andino', name: 'Fríjol', regionSlug: 'andina', pancoger: true, patrimonial: false, sembrable_en_casa: 'sí', educativo: 'sí', description: 'Leguminosa fundamental en la dieta andina, con gran variedad de tipos y usos.', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'bean plant', estimatedPrice: 'Precio bajo', duration: 'Media (3–5 meses)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Leguminosas', difficulty: 2, daysToHarvest: 90, lifeCycle: [{ name: 'Siembra' }, { name: 'Germinación' }, { name: 'Crecimiento' }, { name: 'Floración' }, { name: 'Cosecha' }] },
    { id: 'papa_andina', name: 'Papa', regionSlug: 'andina', pancoger: true, patrimonial: true, sembrable_en_casa: 'sí', educativo: 'sí', description: 'Tubérculo versátil y nutritivo, base de la alimentación en la región andina.', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'potato field', estimatedPrice: 'Precio bajo', duration: 'Media (3–5 meses)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Tubérculos', difficulty: 2, daysToHarvest: 120, lifeCycle: [{ name: 'Siembra' }, { name: 'Brote' }, { name: 'Desarrollo' }, { name: 'Maduración' }, { name: 'Cosecha' }] },
    { id: 'maiz_caribe', name: 'Maíz', regionSlug: 'caribe', pancoger: true, patrimonial: true, sembrable_en_casa: 'sí', educativo: 'sí', description: 'Cereal esencial en la cultura caribeña, usado en arepas, bollos y más.', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'corn field', estimatedPrice: 'Precio bajo', duration: 'Media (3–5 meses)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Cereales', difficulty: 2, daysToHarvest: 100, lifeCycle: [{ name: 'Siembra' }, { name: 'Crecimiento' }, { name: 'Polinización' }, { name: 'Cosecha' }] },
    { id: 'platano_caribe', name: 'Plátano', regionSlug: 'caribe', pancoger: true, patrimonial: true, sembrable_en_casa: 'no', educativo: 'no', description: 'Fruta esencial en la cocina caribeña, consumida verde o madura.', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'banana tree', estimatedPrice: 'Precio bajo', duration: 'Larga (6 meses o más)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Frutales', difficulty: 2, daysToHarvest: 365, lifeCycle: [{ name: 'Cormo' }, { name: 'Crecimiento' }, { name: 'Floración' }, { name: 'Cosecha' }] },
    { id: 'coco_insular', name: 'Coco', regionSlug: 'insular', pancoger: false, patrimonial: true, sembrable_en_casa: 'no', educativo: 'no', description: 'Fruto tropical versátil, utilizado para agua, pulpa y aceite en las islas.', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'coconut tree', estimatedPrice: 'Precio bajo', duration: 'Larga (6 meses o más)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Frutales', difficulty: 2, daysToHarvest: 2555, lifeCycle: [{ name: 'Nuez' }, { name: 'Palma Joven' }, { name: 'Producción' }, { name: 'Cosecha' }] },
    { id: 'arbol_pan_insular', name: 'Árbol del pan', regionSlug: 'insular', pancoger: false, patrimonial: true, sembrable_en_casa: 'no', educativo: 'no', description: 'Fruto grande y almidonado, básico en la alimentación de las islas caribeñas.', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'breadfruit tree', estimatedPrice: 'Precio moderado', duration: 'Larga (6 meses o más)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Frutales', difficulty: 3, daysToHarvest: 1095, lifeCycle: [{ name: 'Semilla' }, { name: 'Plántula' }, { name: 'Crecimiento' }, { name: 'Producción' }, { name: 'Cosecha' }] },
    { id: 'arroz_orinoquia', name: 'Arroz', regionSlug: 'orinoquia', pancoger: true, patrimonial: false, sembrable_en_casa: 'sí', educativo: 'sí', description: 'Cereal básico cultivado extensamente en las llanuras inundables de la Orinoquía.', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'rice paddy', estimatedPrice: 'Precio bajo', duration: 'Media (3–5 meses)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Cereales', difficulty: 3, daysToHarvest: 120, lifeCycle: [{ name: 'Siembra' }, { name: 'Macollamiento' }, { name: 'Floración' }, { name: 'Maduración' }, { name: 'Cosecha' }] },
    { id: 'palma_africana_orinoquia', name: 'Palma Africana', regionSlug: 'orinoquia', pancoger: false, patrimonial: true, sembrable_en_casa: 'no', educativo: 'no', description: 'Cultivo agroindustrial clave para la producción de aceite en la Orinoquía.', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'oil palm plantation', estimatedPrice: 'Precio alto', duration: 'Larga (6 meses o más)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Frutales', difficulty: 4, daysToHarvest: 1095, lifeCycle: [{ name: 'Vivero' }, { name: 'Crecimiento' }, { name: 'Producción Temprana' }, { name: 'Producción Plena' }, { name: 'Cosecha' }] },
    { id: 'yuca_amazonia', name: 'Yuca', regionSlug: 'amazonia', pancoger: true, patrimonial: true, sembrable_en_casa: 'no', educativo: 'parcialmente', description: 'Raíz comestible fundamental en la dieta amazónica, adaptable a climas tropicales.', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'cassava plant', estimatedPrice: 'Precio bajo', duration: 'Larga (6 meses o más)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Tubérculos', difficulty: 2, daysToHarvest: 240, lifeCycle: [{ name: 'Estaca' }, { name: 'Brotación' }, { name: 'Engrosamiento' }, { name: 'Cosecha' }] },
    { id: 'cacao_amazonia', name: 'Cacao', regionSlug: 'amazonia', pancoger: false, patrimonial: true, sembrable_en_casa: 'no', educativo: 'sí', description: 'Fruto del que se obtiene el chocolate, de gran importancia cultural y económica.', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'cacao pods', estimatedPrice: 'Precio moderado', duration: 'Larga (6 meses o más)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Frutales', difficulty: 4, daysToHarvest: 1095, lifeCycle: [{ name: 'Semilla' }, { name: 'Plántula' }, { name: 'Crecimiento' }, { name: 'Producción' }, { name: 'Cosecha' }] },
    { id: 'name_pacifico', name: 'Ñame', regionSlug: 'pacifica', pancoger: true, patrimonial: true, sembrable_en_casa: 'parcialmente', educativo: 'parcialmente', description: 'Tubérculo importante en la gastronomía del Pacífico, similar a la papa pero más fibroso.', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'yam tuber', estimatedPrice: 'Precio bajo', duration: 'Larga (6 meses o más)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Tubérculos', difficulty: 3, daysToHarvest: 270, lifeCycle: [{ name: 'Siembra' }, { name: 'Brotación' }, { name: 'Desarrollo' }, { name: 'Maduración' }, { name: 'Cosecha' }] },
    { id: 'mango_caribe', name: 'Mango', regionSlug: 'caribe', pancoger: true, patrimonial: false, sembrable_en_casa: 'no', educativo: 'no', description: 'Fruta tropical dulce y jugosa, con múltiples variedades en la región.', imageUrl: 'https://firebasestorage.googleapis.com/v0/b/agrinavigate.firebasestorage.app/o/composicion-de-deliciosos-mangos-exoticos.jpg?alt=media&token=b91b9d90-e67d-4a7f-9c37-fedb49fcba38', dataAiHint: 'mango fruit', estimatedPrice: 'Precio moderado', duration: 'Larga (6 meses o más)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Frutales', difficulty: 3, daysToHarvest: 1460, lifeCycle: [{ name: 'Semilla' }, { name: 'Plántula' }, { name: 'Crecimiento' }, { name: 'Producción' }, { name: 'Cosecha' }] },
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

function capitalizeFirstLetter(string: string | null | undefined) {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
}

type GeolocationStatus = 'idle' | 'pending' | 'success' | 'error';
type FilterSource = 'manual' | 'url_or_geo' | 'none';

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

// SVG Icons for Crop Types
const BeanIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 100 100" width="28" height="28" {...props}><path d="M50,10 C20,25 20,75 50,90 C80,75 80,25 50,10 M40,40 Q50,50 60,40 M40,60 Q50,50 60,60" stroke="#a16207" fill="#facc15" strokeWidth="5" /></svg>
);
const CarrotIconSvg = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 100 100" width="28" height="28" {...props}><path d="M50 90 L60 30 L40 30 Z" fill="#f97316"/><path d="M50 30 L40 10 L45 30 M50 30 L60 10 L55 30" fill="#22c55e"/></svg>
);
const LeafIconSvg = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 100 100" width="28" height="28" {...props}><path d="M50 10 C 20 40, 20 70, 50 90 C 80 70, 80 40, 50 10 Z" fill="#4ade80" /><line x1="50" y1="90" x2="50" y2="25" stroke="#16a34a" strokeWidth="5" /></svg>
);
const GenericFruitIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 100 100" width="28" height="28" {...props}><circle cx="50" cy="60" r="30" fill="#ef4444"/><path d="M50 30 Q 60 10, 70 20" stroke="#166534" strokeWidth="8" fill="none"/></svg>
)

const getCropTypeIcon = (plantType: string) => {
    switch (plantType) {
        case 'Leguminosas': return BeanIcon;
        case 'Tubérculos':
        case 'Hortalizas de raíz': return CarrotIconSvg;
        case 'Frutales':
        case 'Hortalizas de fruto': return GenericFruitIcon;
        case 'Cereales': return Wheat;
        default: return LeafIconSvg;
    }
};

const getDifficultyStyles = (difficulty: number): { badge: string, iconBg: string, iconText: string } => {
    if (difficulty <= 2) return { badge: 'bg-green-100 text-green-800 border-green-200', iconBg: 'bg-green-500', iconText: 'text-white' };
    if (difficulty <= 4) return { badge: 'bg-yellow-100 text-yellow-800 border-yellow-200', iconBg: 'bg-yellow-500', iconText: 'text-white' };
    return { badge: 'bg-red-100 text-red-800 border-red-200', iconBg: 'bg-red-600', iconText: 'text-white' };
};


export default function CultivosPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();

  const [geolocationStatus, setGeolocationStatus] = useState<GeolocationStatus>('idle');
  const [geolocationErrorMsg, setGeolocationErrorMsg] = useState<string | null>(null);
  
  const [activeRegionSlug, setActiveRegionSlug] = useState<string | null>(searchParams.get('region'));
  const [activeRegionName, setActiveRegionName] = useState<string | null>(null);

  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null);
  const [selectedSpace, setSelectedSpace] = useState<string | null>(null);
  const [selectedPlantType, setSelectedPlantType] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  
  const [filterSource, setFilterSource] = useState<FilterSource>('none');
  const [userHasInteracted, setUserHasInteracted] = useState(false);


  useEffect(() => {
    const regionParam = searchParams.get('region');
    const qParam = searchParams.get('q');

    if (userHasInteracted) {
      setFilterSource('manual');
      return;
    }

    if (regionParam) {
      setFilterSource('url_or_geo');
      setActiveRegionSlug(regionParam);
      const regionName = regionOptions.find(r => r.value === regionParam)?.label || capitalizeFirstLetter(regionParam);
      setActiveRegionName(regionName);
      return;
    }

    if (!qParam) {
      if (navigator.geolocation) {
        setGeolocationStatus('pending');
        navigator.geolocation.getCurrentPosition(
          (position) => {
            if (userHasInteracted) return; // Double check to avoid race conditions
            const { latitude, longitude } = position.coords;
            const regionInfo = getRegionFromCoordinates(latitude, longitude);
            if (regionInfo) {
              setFilterSource('url_or_geo');
              setActiveRegionSlug(regionInfo.slug);
              setActiveRegionName(regionInfo.name);
            } else {
               setFilterSource('none');
               setActiveRegionSlug(null);
               setActiveRegionName(null);
            }
            setGeolocationStatus('success');
          },
          (error) => {
            if (userHasInteracted) return;
            let message = "No se pudo obtener tu ubicación.";
            if (error.code === error.PERMISSION_DENIED) message = "Permiso de ubicación denegado.";
            setGeolocationErrorMsg(message);
            setGeolocationStatus('error');
            setFilterSource('none');
            setActiveRegionSlug(null);
            setActiveRegionName(null);
          }
        );
      } else {
        setFilterSource('none');
        setActiveRegionSlug(null);
        setActiveRegionName(null);
      }
    }
  }, [searchParams, userHasInteracted]);

  const displayedCrops = sampleCropsData.filter(crop => {
    const qParam = searchParams.get('q');
    
    if (qParam && !crop.name.toLowerCase().includes(qParam.toLowerCase())) {
        return false;
    }
    if (activeRegionSlug && crop.regionSlug !== activeRegionSlug) {
      return false;
    }
    if (selectedPrice && selectedPrice !== 'all' && crop.estimatedPrice !== selectedPrice) {
      return false;
    }
    if (selectedDuration && selectedDuration !== 'all' && crop.duration !== selectedDuration) {
      return false;
    }
    if (selectedSpace && selectedSpace !== 'all' && crop.spaceRequired !== selectedSpace) {
      return false;
    }
    if (selectedPlantType && selectedPlantType !== 'all' && crop.plantType !== selectedPlantType) {
      return false;
    }
    if (selectedDifficulty && selectedDifficulty !== 'all' && crop.difficulty.toString() !== selectedDifficulty) {
      return false;
    }
    return true;
  });

  let pageTitle = "Todos los Cultivos";
  let pageDescription = "Descubre una variedad de cultivos de diferentes regiones de Colombia.";
  let alertMessageForPage: React.ReactNode = null;

  if (searchParams.get('q')) {
      pageTitle = `Resultados para: "${searchParams.get('q')}"`;
      pageDescription = `Mostrando todos los cultivos que coinciden con tu búsqueda.`;
  } else if (filterSource === 'manual') {
      if (activeRegionSlug) {
          pageTitle = `Cultivos para la Región: ${activeRegionName}`;
          pageDescription = `Explora los cultivos característicos de la región ${activeRegionName} según los filtros aplicados.`;
      } else {
          pageTitle = "Cultivos Filtrados";
          pageDescription = "Mostrando cultivos de todas las regiones, según los filtros aplicados.";
      }
  } else if (filterSource === 'url_or_geo' && activeRegionName) {
      const isFromUrl = searchParams.get('region');
      if (isFromUrl) {
          pageTitle = `Cultivos de la Región ${activeRegionName}`;
          pageDescription = `Explora los cultivos característicos de la región ${activeRegionName}.`;
          alertMessageForPage = (
              <Alert variant="default" className="bg-primary/10 border-primary/30 text-primary">
                  <MapPin className="h-4 w-4 text-primary" />
                  <AlertTitle className="font-nunito font-semibold">Filtro por Región</AlertTitle>
                  <AlertDescription>Mostrando cultivos para la región: <strong>{activeRegionName}</strong>.</AlertDescription>
              </Alert>
          );
      } else {
          pageTitle = `Sugeridos para tu Región: ${activeRegionName}`;
          pageDescription = `Basado en tu ubicación (aproximada), te sugerimos estos cultivos de la región ${activeRegionName}.`;
          alertMessageForPage = (
              <Alert variant="default" className="bg-primary/10 border-primary/30 text-primary">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <AlertTitle className="font-nunito font-semibold">Región Detectada: {activeRegionName}</AlertTitle>
                  <AlertDescription>Mostrando cultivos sugeridos para tu región. La detección es aproximada.</AlertDescription>
              </Alert>
          );
      }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-nunito font-bold tracking-tight text-foreground sm:text-4xl">
        {pageTitle}
      </h1>

      {geolocationStatus === 'pending' && !userHasInteracted && !searchParams.get('region') && (
        <Alert>
          <LocateFixed className="h-4 w-4 animate-ping" />
          <AlertTitle className="font-nunito font-semibold">Obteniendo Ubicación</AlertTitle>
          <AlertDescription>Intentando detectar tu región para mostrarte cultivos relevantes...</AlertDescription>
        </Alert>
      )}
      {geolocationStatus === 'error' && !userHasInteracted && !searchParams.get('region') && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="font-nunito font-semibold">Error de Geolocalización</AlertTitle>
          <AlertDescription>{geolocationErrorMsg} Mostrando todos los cultivos.</AlertDescription>
        </Alert>
      )}
      {alertMessageForPage}
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2 font-nunito font-bold">
            <Filter className="h-5 w-5" />
            Filtrar Cultivos
          </CardTitle>
          <CardDescription>Ajusta los filtros para encontrar los cultivos que mejor se adapten a tus necesidades.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="manualRegionSelect" className="text-sm font-nunito font-semibold">Región</Label>
            <Select 
              value={activeRegionSlug || 'all'} 
              onValueChange={(value) => {
                setUserHasInteracted(true);
                const newRegionSlug = value === 'all' ? null : value;
                setActiveRegionSlug(newRegionSlug);
                const regionName = newRegionSlug ? regionOptions.find(opt => opt.value === newRegionSlug)?.label || null : 'Todas las Regiones';
                setActiveRegionName(regionName);
                
                const newParams = new URLSearchParams(searchParams.toString());
                if (newRegionSlug) {
                  newParams.set('region', newRegionSlug);
                } else {
                  newParams.delete('region');
                }
                router.push(`/cultivos?${newParams.toString()}`);
              }}
            >
              <SelectTrigger id="manualRegionSelect" className="font-nunito">
                <SelectValue placeholder="Seleccionar Región" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las Regiones</SelectItem>
                {regionOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="priceSelect" className="text-sm font-nunito font-semibold">Precio Estimado</Label>
            <Select value={selectedPrice || 'all'} onValueChange={(value) => { setUserHasInteracted(true); setSelectedPrice(value === 'all' ? null : value); }}>
              <SelectTrigger id="priceSelect" className="font-nunito"><SelectValue placeholder="Todos los Precios" /></SelectTrigger>
              <SelectContent>
                {priceOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="durationSelect" className="text-sm font-nunito font-semibold">Duración</Label>
            <Select value={selectedDuration || 'all'} onValueChange={(value) => { setUserHasInteracted(true); setSelectedDuration(value === 'all' ? null : value); }}>
              <SelectTrigger id="durationSelect" className="font-nunito"><SelectValue placeholder="Todas las Duraciones" /></SelectTrigger>
              <SelectContent>
                {durationOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="spaceSelect" className="text-sm font-nunito font-semibold">Espacio Requerido</Label>
            <Select value={selectedSpace || 'all'} onValueChange={(value) => { setUserHasInteracted(true); setSelectedSpace(value === 'all' ? null : value); }}>
              <SelectTrigger id="spaceSelect" className="font-nunito"><SelectValue placeholder="Todos los Espacios" /></SelectTrigger>
              <SelectContent>
                {spaceOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="plantTypeSelect" className="text-sm font-nunito font-semibold">Tipo de Planta</Label>
            <Select 
              value={selectedPlantType || 'all'} 
              onValueChange={(value) => { setUserHasInteracted(true); setSelectedPlantType(value === 'all' ? null : value); }}
            >
              <SelectTrigger id="plantTypeSelect" className="font-nunito"><SelectValue placeholder="Todos los Tipos" /></SelectTrigger>
              <SelectContent>
                {plantTypeOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="difficultySelect" className="text-sm font-nunito font-semibold">Dificultad</Label>
            <Select value={selectedDifficulty || 'all'} onValueChange={(value) => { setUserHasInteracted(true); setSelectedDifficulty(value === 'all' ? null : value); }}>
              <SelectTrigger id="difficultySelect" className="font-nunito"><SelectValue placeholder="Todas las Dificultades" /></SelectTrigger>
              <SelectContent>
                {difficultyOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-nunito font-bold">
            Fichas Técnicas de Cultivos
          </CardTitle>
          <CardDescription>
            {pageDescription}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {displayedCrops.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedCrops.map((crop) => {
                 const TypeIcon = getCropTypeIcon(crop.plantType);
                 const difficultyStyles = getDifficultyStyles(crop.difficulty);
                 const difficultyText = crop.difficulty <= 2 ? 'Fácil' : crop.difficulty <=4 ? 'Media' : 'Difícil';
                 return (
                    <Card key={crop.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow flex flex-col">
                        <CardHeader>
                            <div className="flex items-center gap-4">
                                <div className={cn("p-3 rounded-full", difficultyStyles.iconBg)}>
                                    <TypeIcon className={cn("h-6 w-6", difficultyStyles.iconText)} />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-nunito font-bold">{crop.name}</CardTitle>
                                    <Badge variant="outline" className={cn("mt-1 w-fit font-nunito", difficultyStyles.badge)}>
                                      Dificultad: {difficultyText}
                                    </Badge>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-grow space-y-3 pt-0">
                           <Image
                              src={crop.imageUrl}
                              alt={crop.name}
                              width={300}
                              height={200}
                              className="w-full h-40 object-cover rounded-md"
                              data-ai-hint={crop.dataAiHint}
                            />
                           <p className="text-sm text-muted-foreground pt-2">{crop.description}</p>
                           <div className="flex flex-wrap gap-2 pt-2 border-t">
                               {crop.pancoger && <Badge variant="secondary" className="bg-sky-100 text-sky-800"><Sprout className="mr-1 h-3 w-3" />Pancoger</Badge>}
                               {crop.patrimonial && <Badge variant="secondary" className="bg-amber-100 text-amber-800"><Building className="mr-1 h-3 w-3" />Patrimonial</Badge>}
                               {crop.sembrable_en_casa !== 'no' && <Badge variant="secondary" className="bg-teal-100 text-teal-800"><Home className="mr-1 h-3 w-3" />Para Casa</Badge>}
                               {crop.educativo !== 'no' && <Badge variant="secondary" className="bg-indigo-100 text-indigo-800"><BookHeart className="mr-1 h-3 w-3" />Educativo</Badge>}
                           </div>
                        </CardContent>
                        <CardFooter>
                           <AddCropDialog crop={crop}>
                             <Button className="w-full">
                               <PlusCircle className="mr-2 h-4 w-4" />
                               Añadir a mi Dashboard
                             </Button>
                           </AddCropDialog>
                        </CardFooter>
                    </Card>
                 );
              })}
            </div>
          ) : (
             <Alert variant="default" className="mt-4">
                <HelpCircle className="h-4 w-4" />
                <AlertTitle className="font-nunito font-semibold">No se encontraron cultivos</AlertTitle>
                <AlertDescription>
                 No se encontraron cultivos que coincidan con los filtros aplicados. Prueba con otros filtros.
                </AlertDescription>
            </Alert>
          )}
          <p className="mt-6 text-sm text-muted-foreground">
            Estos son datos de ejemplo. La funcionalidad completa estará disponible pronto.
          </p>
        </CardContent>
      </Card>

    </div>
  );
}

    
