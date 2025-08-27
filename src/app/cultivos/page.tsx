
"use client";

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { useEffect, useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, AlertCircle, CheckCircle, HelpCircle, LocateFixed, Star, Filter, MessageSquareText, PlusCircle, Wheat, BookHeart, Building, Home, Sprout, Search, ExternalLink } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { AddCropDialog } from './components/add-crop-dialog';
import type { SampleCrop } from '@/models/crop-model';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { collection, getDocs, query, type DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import type { CropTechnicalSheet } from '@/lib/crop-data-structure';

// --- HELPER FUNCTION ---
const createSlug = (name: string) => {
  return name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
}

// --- NUEVA FUNCIÓN PARA OBTENER DATOS DE FIRESTORE ---
async function getSampleCrops(): Promise<SampleCrop[]> {
  const cropsCollectionRef = collection(db, 'fichas_tecnicas_cultivos');
  const q = query(cropsCollectionRef);
  const querySnapshot = await getDocs(q);
  
  const crops = querySnapshot.docs.map(doc => {
    const data = doc.data() as CropTechnicalSheet;
    
    // Mapeo de dificultad de texto a número
    let difficultyScore = 3; // Default a Medio
    if (data.dificultad === 'Fácil') difficultyScore = 2;
    if (data.dificultad === 'Muy Fácil') difficultyScore = 1;
    if (data.dificultad === 'Difícil') difficultyScore = 4;
    if (data.dificultad === 'Muy Difícil') difficultyScore = 5;

    return {
      id: doc.id,
      name: data.nombre,
      description: data.descripcion,
      regionSlugs: data.region.principal.map(r => r.toLowerCase()),
      imageUrl: data.imagenes?.[0]?.url || 'https://placehold.co/300x200.png',
      dataAiHint: 'crop field',
      clima: data.clima.clase[0] as SampleCrop['clima'], // Toma el primer clima como principal
      // Los siguientes campos son placeholders ya que no están en la nueva estructura
      estimatedPrice: 'Precio moderado', 
      duration: 'Media (3–5 meses)',
      spaceRequired: 'Maceta mediana (4–10 L)',
      plantType: data.tipo_planta as SampleCrop['plantType'],
      difficulty: difficultyScore as SampleCrop['difficulty'],
      datos_programaticos: data.datos_programaticos,
      lifeCycle: data.cicloVida.map(etapa => ({ name: etapa.etapa })),
      // Estos campos no existen en la nueva estructura, se ponen como false
      pancoger: data.tags.includes('pancoger'),
      patrimonial: data.tags.includes('patrimonial'),
      sembrable_en_casa: 'sí',
      educativo: 'no',
    } as SampleCrop;
  });

  return crops;
}


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
type FilterSource = 'manual' | 'url' | 'geo' | 'none';

const regionOptions = regionBoundingBoxes.map(r => ({ value: r.slug, label: r.name }));
const climaOptions = [
    { value: 'all', label: 'Todos los Climas' },
    { value: 'frio', label: 'Frío (10–17 °C)' },
    { value: 'templado', label: 'Templado (18–23 °C)' },
    { value: 'calido', label: 'Cálido (24–30 °C)' },
    { value: 'muy calido', label: 'Muy cálido (>30 °C)' },
];
// Note: These filter options will be dynamically generated from Firestore data in a future implementation.
// For now, they are hardcoded based on the initial sample data.
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
  { value: 'Leguminosas', label: 'Leguminosas' },
  { value: 'Tubérculos', label: 'Tubérculos' },
  { value: 'Frutales', label: 'Frutales' },
  { value: 'Cereales', label: 'Cereales' },
  { value: 'Plantas aromáticas', label: 'Plantas aromáticas' },
  { value: 'Hortalizas de fruto', label: 'Hortalizas de fruto' },
  { value: 'Hortalizas de hoja', label: 'Hortalizas de hoja' },
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
        case 'Plantas aromáticas':
        case 'Hortalizas de hoja': return LeafIconSvg;
        default: return LeafIconSvg;
    }
};

const getDifficultyStyles = (difficulty: number): { badge: string, iconBg: string, iconText: string } => {
    if (difficulty <= 2) return { badge: 'bg-green-100 text-green-800 border-green-200', iconBg: 'bg-green-500', iconText: 'text-white' };
    if (difficulty <= 4) return { badge: 'bg-yellow-100 text-yellow-800 border-yellow-200', iconBg: 'bg-yellow-500', iconText: 'text-white' };
    return { badge: 'bg-red-100 text-red-800 border-red-200', iconBg: 'bg-red-600', iconText: 'text-white' };
};


export default function CultivosPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  
  // State for fetched crops from Firestore
  const [allCrops, setAllCrops] = useState<SampleCrop[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [geolocationStatus, setGeolocationStatus] = useState<GeolocationStatus>('idle');
  const [geolocationErrorMsg, setGeolocationErrorMsg] = useState<string | null>(null);
  
  const [activeRegionSlug, setActiveRegionSlug] = useState<string | null>(searchParams.get('region'));
  const [activeRegionName, setActiveRegionName] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedClima, setSelectedClima] = useState<string | null>(searchParams.get('clima'));
  const [selectedPrice, setSelectedPrice] = useState<string | null>(searchParams.get('price'));
  const [selectedDuration, setSelectedDuration] = useState<string | null>(searchParams.get('duration'));
  const [selectedSpace, setSelectedSpace] = useState<string | null>(searchParams.get('space'));
  const [selectedPlantType, setSelectedPlantType] = useState<string | null>(searchParams.get('plantType'));
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(searchParams.get('difficulty'));
  
  const [filterSource, setFilterSource] = useState<FilterSource>('none');
  const [userHasInteracted, setUserHasInteracted] = useState(false);

  useEffect(() => {
    const fetchCrops = async () => {
        setIsLoading(true);
        try {
            const cropsFromDb = await getSampleCrops();
            setAllCrops(cropsFromDb);
        } catch (error) {
            console.error("Error fetching crops from Firestore:", error);
        } finally {
            setIsLoading(false);
        }
    };
    fetchCrops();
  }, []);

  // Update URL from state changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    
    // Helper to set or delete params
    const updateParam = (key: string, value: string | null) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    };
    
    updateParam('q', searchQuery || null);
    updateParam('region', activeRegionSlug);
    updateParam('clima', selectedClima);
    updateParam('price', selectedPrice);
    updateParam('duration', selectedDuration);
    updateParam('space', selectedSpace);
    updateParam('plantType', selectedPlantType);
    updateParam('difficulty', selectedDifficulty);

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });

  }, [searchQuery, activeRegionSlug, selectedClima, selectedPrice, selectedDuration, selectedSpace, selectedPlantType, selectedDifficulty, router, pathname]);
  

  useEffect(() => {
    const regionParam = searchParams.get('region');
    const qParam = searchParams.get('q');
    
    if (userHasInteracted) {
      if(qParam !== null) setFilterSource('url');
      else setFilterSource('manual');
      return;
    }

    if (regionParam) {
      setFilterSource('url');
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
            if (userHasInteracted) return;
            const { latitude, longitude } = position.coords;
            const regionInfo = getRegionFromCoordinates(latitude, longitude);
            if (regionInfo) {
              setFilterSource('geo');
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
  }, [userHasInteracted]);

  const displayedCrops = allCrops.filter(crop => {
    if (searchQuery && !crop.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (activeRegionSlug && !crop.regionSlugs.includes(activeRegionSlug)) {
      return false;
    }
     if (selectedClima && crop.clima.toLowerCase() !== selectedClima.toLowerCase()) {
      return false;
    }
    if (selectedPrice && crop.estimatedPrice !== selectedPrice) {
      return false;
    }
    if (selectedDuration && crop.duration !== selectedDuration) {
      return false;
    }
    if (selectedSpace && crop.spaceRequired !== selectedSpace) {
      return false;
    }
    if (selectedPlantType && crop.plantType !== selectedPlantType) {
      return false;
    }
    if (selectedDifficulty && crop.difficulty.toString() !== selectedDifficulty) {
      return false;
    }
    return true;
  });

  let pageTitle = "Todos los Cultivos";
  let pageDescription = "Descubre una variedad de cultivos de diferentes regiones de Colombia.";
  let alertMessageForPage: React.ReactNode = null;

  if (searchQuery) {
      pageTitle = `Resultados para: "${searchQuery}"`;
      pageDescription = `Mostrando cultivos que coinciden con "${searchQuery}".`;
  } else if (filterSource === 'manual') {
      if (activeRegionSlug) {
          pageTitle = `Cultivos para la Región: ${activeRegionName}`;
          pageDescription = `Explora los cultivos característicos de la región ${activeRegionName} según los filtros aplicados.`;
      } else {
          pageTitle = "Cultivos Filtrados";
          pageDescription = "Mostrando cultivos de todas las regiones, según los filtros aplicados.";
      }
  } else if (filterSource === 'url' && activeRegionName) {
      pageTitle = `Cultivos de la Región ${activeRegionName}`;
      pageDescription = `Explora los cultivos característicos de la región ${activeRegionName}.`;
      alertMessageForPage = (
          <Alert variant="default" className="bg-primary/10 border-primary/30 text-primary">
              <MapPin className="h-4 w-4 text-primary" />
              <AlertTitle className="font-nunito font-semibold">Filtro por Región</AlertTitle>
              <AlertDescription>Mostrando cultivos para la región: <strong>{activeRegionName}</strong>.</AlertDescription>
          </Alert>
      );
  } else if (filterSource === 'geo' && activeRegionName) {
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

  const handleFilterInteraction = () => {
    if (!userHasInteracted) {
        setUserHasInteracted(true);
    }
    setSearchQuery(''); // Reset search query when a filter is changed
  };

  const updateFilterState = (setter: React.Dispatch<React.SetStateAction<string | null>>, value: string) => {
      handleFilterInteraction();
      setter(value === 'all' ? null : value);
  };

  const handleRegionChange = (value: string) => {
      setUserHasInteracted(true);
      const newRegionSlug = value === 'all' ? null : value;
      setActiveRegionSlug(newRegionSlug);
      const regionName = newRegionSlug ? regionOptions.find(opt => opt.value === newRegionSlug)?.label || null : 'Todas las Regiones';
      setActiveRegionName(regionName);
  };
  
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-40 w-full rounded-md mb-4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6 mt-2" />
              </CardContent>
              <CardFooter className="flex-col gap-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      );
    }

    if (displayedCrops.length === 0) {
      return (
        <Alert variant="default" className="mt-4">
          <HelpCircle className="h-4 w-4" />
          <AlertTitle className="font-nunito font-semibold">No se encontraron cultivos</AlertTitle>
          <AlertDescription>
            No se encontraron cultivos que coincidan con los filtros o la búsqueda. A medida que añadas datos a Firestore, aparecerán aquí.
          </AlertDescription>
        </Alert>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayedCrops.map((crop) => {
           const TypeIcon = getCropTypeIcon(crop.plantType);
           const difficultyStyles = getDifficultyStyles(crop.difficulty);
           const difficultyText = crop.difficulty <= 2 ? 'Fácil' : crop.difficulty <=4 ? 'Media' : 'Difícil';
           const slug = createSlug(crop.name);
           
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
                  <CardFooter className="flex-col items-start gap-2">
                      <Button asChild className="w-full">
                          <Link href={`/cultivos/${slug}`}>
                              Ver Ficha Completa <ExternalLink className="ml-2 h-4 w-4" />
                          </Link>
                      </Button>
                     <AddCropDialog crop={crop}>
                       <Button className="w-full" variant="outline">
                         <PlusCircle className="mr-2 h-4 w-4" />
                         Añadir a mi Dashboard
                       </Button>
                     </AddCropDialog>
                  </CardFooter>
              </Card>
           );
        })}
      </div>
    );
  };

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
            Filtrar y Buscar Cultivos
          </CardTitle>
          <CardDescription>Ajusta los filtros para encontrar los cultivos que mejor se adapten a tus necesidades.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="md:col-span-2 lg:col-span-3">
             <Label htmlFor="search-input" className="text-sm font-nunito font-semibold">Buscar por nombre</Label>
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="search-input"
                  placeholder="Ej: Tomate, Papa, Maíz..."
                  value={searchQuery}
                  onChange={(e) => {
                    if (!userHasInteracted) setUserHasInteracted(true);
                    setSearchQuery(e.target.value);
                  }}
                  className="pl-10"
                />
             </div>
          </div>
          <div>
            <Label htmlFor="manualRegionSelect" className="text-sm font-nunito font-semibold">Región</Label>
            <Select 
              value={activeRegionSlug || 'all'} 
              onValueChange={handleRegionChange}
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
            <Label htmlFor="climaSelect" className="text-sm font-nunito font-semibold">Clima (Temperatura)</Label>
            <Select value={selectedClima || 'all'} onValueChange={(v) => updateFilterState(setSelectedClima, v)}>
              <SelectTrigger id="climaSelect" className="font-nunito"><SelectValue placeholder="Todos los Climas" /></SelectTrigger>
              <SelectContent>
                {climaOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="priceSelect" className="text-sm font-nunito font-semibold">Precio Estimado</Label>
            <Select value={selectedPrice || 'all'} onValueChange={(v) => updateFilterState(setSelectedPrice, v)}>
              <SelectTrigger id="priceSelect" className="font-nunito"><SelectValue placeholder="Todos los Precios" /></SelectTrigger>
              <SelectContent>
                {priceOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="durationSelect" className="text-sm font-nunito font-semibold">Duración</Label>
            <Select value={selectedDuration || 'all'} onValueChange={(v) => updateFilterState(setSelectedDuration, v)}>
              <SelectTrigger id="durationSelect" className="font-nunito"><SelectValue placeholder="Todas las Duraciones" /></SelectTrigger>
              <SelectContent>
                {durationOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="spaceSelect" className="text-sm font-nunito font-semibold">Espacio Requerido</Label>
            <Select value={selectedSpace || 'all'} onValueChange={(v) => updateFilterState(setSelectedSpace, v)}>
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
              onValueChange={(v) => updateFilterState(setSelectedPlantType, v)}
            >
              <SelectTrigger id="plantTypeSelect" className="font-nunito"><SelectValue placeholder="Todos los Tipos" /></SelectTrigger>
              <SelectContent>
                {plantTypeOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="difficultySelect" className="text-sm font-nunito font-semibold">Dificultad</Label>
            <Select value={selectedDifficulty || 'all'} onValueChange={(v) => updateFilterState(setSelectedDifficulty, v)}>
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
          {renderContent()}
        </CardContent>
      </Card>

    </div>
  );
}
