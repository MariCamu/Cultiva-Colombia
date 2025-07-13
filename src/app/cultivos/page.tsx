
"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, AlertCircle, CheckCircle, HelpCircle, LocateFixed, Star, Filter, MessageSquareText, PlusCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';


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
  daysToHarvest: number;
}

const sampleCropsData: SampleCrop[] = [
  // This data now serves as the 'fichas_tecnicas'
  { id: 'tomate_cherry_id', name: 'Tomate Cherry', description: 'Pequeño y dulce, ideal para ensaladas y snacks. Crece bien en macetas.', regionSlug: 'andina', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'cherry tomatoes', estimatedPrice: 'Precio moderado', duration: 'Media (3–5 meses)', spaceRequired: 'Maceta mediana (4–10 L)', plantType: 'Hortalizas de fruto', difficulty: 3, daysToHarvest: 90 },
  { id: 'papa_andina', name: 'Papa (Región Andina)', description: 'Tubérculo versátil y nutritivo, base de la alimentación en la región andina.', regionSlug: 'andina', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'potato field', estimatedPrice: 'Precio bajo', duration: 'Media (3–5 meses)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Tubérculos', difficulty: 2, daysToHarvest: 120 },
  { id: 'cafe_andino', name: 'Café (Región Andina)', description: 'Reconocido mundialmente por su aroma y sabor, cultivado en las laderas montañosas.', regionSlug: 'andina', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'coffee plant', estimatedPrice: 'Precio moderado', duration: 'Larga (6 meses o más)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Frutales', difficulty: 4, daysToHarvest: 1095 },
  { id: 'yuca_amazonia', name: 'Yuca (Región Amazonía)', description: 'Raíz comestible fundamental en la dieta amazónica, adaptable a climas tropicales.', regionSlug: 'amazonia', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'cassava plant', estimatedPrice: 'Precio bajo', duration: 'Larga (6 meses o más)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Tubérculos', difficulty: 2, daysToHarvest: 240 },
  { id: 'copoazu_amazonia', name: 'Copoazú (Región Amazonía)', description: 'Fruta exótica con pulpa aromática, usada en jugos, postres y cosméticos.', regionSlug: 'amazonia', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'copoazu fruit', estimatedPrice: 'Precio moderado', duration: 'Larga (6 meses o más)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Frutales', difficulty: 3, daysToHarvest: 730 },
  { id: 'platano_caribe', name: 'Plátano (Región Caribe)', description: 'Fruta esencial en la cocina caribeña, consumida verde o madura.', regionSlug: 'caribe', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'banana tree', estimatedPrice: 'Precio bajo', duration: 'Larga (6 meses o más)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Frutales', difficulty: 2, daysToHarvest: 365 },
  { id: 'mango_caribe', name: 'Mango (Región Caribe)', description: 'Fruta tropical dulce y jugosa, con múltiples variedades en la región.', regionSlug: 'caribe', imageUrl: 'https://firebasestorage.googleapis.com/v0/b/agrinavigate.firebasestorage.app/o/composicion-de-deliciosos-mangos-exoticos.jpg?alt=media&token=b91b9d90-e67d-4a7f-9c37-fedb49fcba38', dataAiHint: 'mango fruit', estimatedPrice: 'Precio moderado', duration: 'Larga (6 meses o más)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Frutales', difficulty: 3, daysToHarvest: 1460 },
  { id: 'arroz_orinoquia', name: 'Arroz (Región Orinoquía)', description: 'Cereal básico cultivado extensamente en las llanuras inundables de la Orinoquía.', regionSlug: 'orinoquia', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'rice paddy', estimatedPrice: 'Precio bajo', duration: 'Media (3–5 meses)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Cereales', difficulty: 3, daysToHarvest: 120 },
  { id: 'marañon_orinoquia', name: 'Marañón (Región Orinoquía)', description: 'Fruto seco y pseudofruto carnoso, apreciado por su nuez y pulpa agridulce.', regionSlug: 'orinoquia', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'cashew fruit', estimatedPrice: 'Precio alto', duration: 'Larga (6 meses o más)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Frutales', difficulty: 4, daysToHarvest: 1095 },
  { id: 'chontaduro_pacifica', name: 'Chontaduro (Región Pacífica)', description: 'Fruto de palmera altamente nutritivo, parte integral de la cultura del Pacífico.', regionSlug: 'pacifica', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'chontaduro fruit', estimatedPrice: 'Precio moderado', duration: 'Larga (6 meses o más)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Frutales', difficulty: 3, daysToHarvest: 1825 },
  { id: 'borojo_pacifica', name: 'Borojó (Región Pacífica)', description: 'Fruta energética con propiedades afrodisíacas, consumida en jugos y jaleas.', regionSlug: 'pacifica', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'borojo fruit', estimatedPrice: 'Precio moderado', duration: 'Larga (6 meses o más)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Frutales', difficulty: 4, daysToHarvest: 1825 },
  { id: 'coco_insular', name: 'Coco (Región Insular)', description: 'Fruto tropical versátil, utilizado para agua, pulpa y aceite en las islas.', regionSlug: 'insular', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'coconut tree', estimatedPrice: 'Precio bajo', duration: 'Larga (6 meses o más)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Frutales', difficulty: 2, daysToHarvest: 2555 },
  { id: 'pan_de_fruta_insular', name: 'Pan de Fruta (Región Insular)', description: 'Fruto grande y almidonado, básico en la alimentación de las islas caribeñas.', regionSlug: 'insular', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'breadfruit tree', estimatedPrice: 'Precio moderado', duration: 'Larga (6 meses o más)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Frutales', difficulty: 3, daysToHarvest: 1095 },
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
type FilterSource = 'manual_specific' | 'manual_all' | 'url_region_only' | 'geo' | 'test_params' | 'none';

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

const testPlantTypeMap: { [key: string]: string | null } = {
  'comestibles': null, 
  'aromaticas': 'Plantas aromáticas',
  'coloridas': 'Hortalizas de flor', 
  'frutales': 'Frutales',
  'cualquiera': null,
};

const testSpaceMap: { [key: string]: string | null } = {
  'pequeno': 'Maceta pequeña (1–3 L)',
  'mediano': 'Maceta mediana (4–10 L)',
  'grande': 'Maceta grande o jardín (10+ L)',
};


export default function CultivosPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();

  const [geolocationStatus, setGeolocationStatus] = useState<GeolocationStatus>('idle');
  const [geolocationErrorMsg, setGeolocationErrorMsg] = useState<string | null>(null);
  const [detectedRegionSlug, setDetectedRegionSlug] = useState<string | null>(null);
  const [detectedRegionName, setDetectedRegionName] = useState<string | null>(null);

  const [manualRegionSlug, setManualRegionSlug] = useState<string | null>(null);
  const [manualRegionFilterActive, setManualRegionFilterActive] = useState(false);
  
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null);
  const [selectedSpace, setSelectedSpace] = useState<string | null>(null);
  const [selectedPlantType, setSelectedPlantType] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);

  const [isTestFilterActive, setIsTestFilterActive] = useState(false);
  const [testFilterAlertMessage, setTestFilterAlertMessage] = useState<string | null>(null);
  const [regionFromTest, setRegionFromTest] = useState<string | null>(null);
  const [isAddingCrop, setIsAddingCrop] = useState<string | null>(null);

  const handleAddCropToDashboard = async (crop: SampleCrop) => {
    if (!user) {
      toast({
        title: "Inicia Sesión",
        description: "Debes iniciar sesión para añadir cultivos a tu dashboard.",
        variant: "destructive",
      });
      router.push('/login');
      return;
    }

    setIsAddingCrop(crop.id);

    const dataToAdd = {
      ficha_cultivo_id: crop.id || '',
      nombre_cultivo_personal: crop.name || 'Cultivo Desconocido',
      fecha_plantacion: serverTimestamp(),
      imageUrl: crop.imageUrl || '',
      dataAiHint: crop.dataAiHint || null,
      daysToHarvest: crop.daysToHarvest !== undefined ? crop.daysToHarvest : null,
      nextTask: { name: 'Regar', dueInDays: 2, iconName: 'Droplets' },
      lastNote: '¡Cultivo recién añadido! Empieza a registrar tu progreso.',
    };
    
    try {
      const userCropsCollection = collection(db, 'usuarios', user.uid, 'cultivos_del_usuario');
      await addDoc(userCropsCollection, dataToAdd);
      
      toast({
        title: "¡Cultivo Añadido!",
        description: `${crop.name} ha sido añadido a tu dashboard.`,
      });
      router.push('/dashboard');
      
    } catch (error: any) {
      console.error("Error al añadir cultivo al dashboard:", error.code, error.message, error);
      toast({
        title: "Error al añadir cultivo",
        description: `Hubo un problema al guardar los datos: ${error.message}. Revisa la consola para más detalles.`,
        variant: "destructive",
      });
    } finally {
      setIsAddingCrop(null);
    }
  };


  useEffect(() => {
    const regionQueryParam = searchParams.get('region');
    const plantTypeQueryParam = searchParams.get('plantType');
    const experienceQueryParam = searchParams.get('experience');
    const learningQueryParam = searchParams.get('learning');
    const careQueryParam = searchParams.get('care');
    const spaceQueryParam = searchParams.get('space');

    const hasActiveTestParams = plantTypeQueryParam || experienceQueryParam || learningQueryParam || careQueryParam || spaceQueryParam || (regionQueryParam && (plantTypeQueryParam || experienceQueryParam || learningQueryParam || careQueryParam || spaceQueryParam));


    if (hasActiveTestParams) {
        setIsTestFilterActive(true);
        let alertMsgParts = [];

        if (regionQueryParam) {
            setRegionFromTest(regionQueryParam);
            alertMsgParts.push(`Región: ${capitalizeFirstLetter(regionQueryParam)}`);
        } else {
            setRegionFromTest(null); 
        }
        
        const plantTypeMapped = plantTypeQueryParam ? (testPlantTypeMap[plantTypeQueryParam] ?? null) : null;
        setSelectedPlantType(plantTypeMapped);
        if (plantTypeQueryParam) {
            alertMsgParts.push(`Tipo de planta: ${capitalizeFirstLetter(plantTypeQueryParam)}${plantTypeMapped ? ` (${plantTypeMapped})` : plantTypeMapped === null && plantTypeQueryParam !== 'cualquiera' && plantTypeQueryParam !== 'comestibles' ? ' (interpretado como tipo no especificado)' : ' (interpretado como todos los tipos)'}`);
        } else {
          setSelectedPlantType(null); // Reset if not from test
        }


        const spaceMapped = spaceQueryParam ? (testSpaceMap[spaceQueryParam] ?? null) : null;
        setSelectedSpace(spaceMapped);
        if (spaceQueryParam) {
             alertMsgParts.push(`Espacio: ${capitalizeFirstLetter(spaceQueryParam)}${spaceMapped ? ` (${spaceMapped})` : ' (interpretado como todos los espacios)'}`);
        } else {
          setSelectedSpace(null); // Reset if not from test
        }


        let difficultyValue: string | null = null;
        if (experienceQueryParam) {
            if (experienceQueryParam === 'principiante') {
                difficultyValue = '1';
                if (learningQueryParam === 'si' && (careQueryParam === 'diario' || careQueryParam === 'dos_tres_semana')) {
                    difficultyValue = '2'; 
                }
            } else if (experienceQueryParam === 'intermedio') {
                difficultyValue = '2'; 
                if (learningQueryParam === 'si') {
                    difficultyValue = '3';
                    if (careQueryParam === 'diario' || careQueryParam === 'dos_tres_semana') {
                       difficultyValue = '4'; 
                    }
                }
            } else if (experienceQueryParam === 'avanzado') {
                difficultyValue = '3'; 
                 if (learningQueryParam === 'si') {
                    difficultyValue = '4';
                    if (careQueryParam === 'diario' || careQueryParam === 'dos_tres_semana') {
                        difficultyValue = '5'; 
                    }
                }
            }
        }
        setSelectedDifficulty(difficultyValue);

        if (difficultyValue) {
            const diffLabel = difficultyOptions.find(opt => opt.value === difficultyValue)?.label || `Nivel ${difficultyValue}`;
            alertMsgParts.push(`Dificultad sugerida: ${diffLabel.replace(/⭐/g, '').trim()}`);
        }
        if (experienceQueryParam) alertMsgParts.push(`Experiencia: ${capitalizeFirstLetter(experienceQueryParam)}`);
        if (careQueryParam) alertMsgParts.push(`Cuidado: ${capitalizeFirstLetter(careQueryParam)}`);
        if (learningQueryParam) alertMsgParts.push(`Interés en aprender: ${capitalizeFirstLetter(learningQueryParam)}`);
        
        setTestFilterAlertMessage(`Preferencias del test aplicadas: ${alertMsgParts.join(', ')}. Puedes ajustar los filtros.`);
        
        setSelectedPrice(null);
        setSelectedDuration(null);
        
    } else {
        setIsTestFilterActive(false);
        setTestFilterAlertMessage(null);
        setRegionFromTest(null); 
    }
  }, [searchParams]);


  useEffect(() => {
    const generalRegionQueryParam = searchParams.get('region');
    const hasAnyTestParam = searchParams.get('plantType') || searchParams.get('experience') || searchParams.get('learning') || searchParams.get('care') || searchParams.get('space');

    if (!manualRegionFilterActive && !(generalRegionQueryParam && hasAnyTestParam) && !isTestFilterActive && navigator.geolocation) {
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
          if (error.code === error.PERMISSION_DENIED) message = "Permiso de ubicación denegado.";
          else if (error.code === error.POSITION_UNAVAILABLE) message = "Información de ubicación no disponible.";
          else if (error.code === error.TIMEOUT) message = "Se agotó el tiempo para obtener la ubicación.";
          setGeolocationErrorMsg(message);
          setGeolocationStatus('error');
        }
      );
    } else if (manualRegionFilterActive || generalRegionQueryParam || isTestFilterActive) {
      setGeolocationStatus('idle'); 
      setDetectedRegionSlug(null); 
      setDetectedRegionName(null);
    }
  }, [searchParams, manualRegionFilterActive, isTestFilterActive]);


  let activeRegionSlugForFiltering: string | null = null;
  let activeRegionNameForDisplay: string | null = null;
  let filterSource: FilterSource = 'none';
  const generalRegionQueryParam = searchParams.get('region');

  if (isTestFilterActive) {
    filterSource = 'test_params';
    if (manualRegionFilterActive) { 
        activeRegionSlugForFiltering = manualRegionSlug;
        activeRegionNameForDisplay = manualRegionSlug ? regionOptions.find(r => r.value === manualRegionSlug)?.label || null : "Todas las Regiones";
    } else if (regionFromTest) { 
        activeRegionSlugForFiltering = regionFromTest;
        activeRegionNameForDisplay = regionOptions.find(r => r.value === regionFromTest)?.label || capitalizeFirstLetter(regionFromTest);
    } else { 
        activeRegionSlugForFiltering = null; 
        activeRegionNameForDisplay = "Todas las Regiones";
    }
  } else if (manualRegionFilterActive) {
    activeRegionSlugForFiltering = manualRegionSlug;
    activeRegionNameForDisplay = manualRegionSlug ? regionOptions.find(r => r.value === manualRegionSlug)?.label || null : "Todas las Regiones";
    filterSource = manualRegionSlug ? 'manual_specific' : 'manual_all';
  } else if (generalRegionQueryParam && !isTestFilterActive) { 
    activeRegionSlugForFiltering = generalRegionQueryParam;
    activeRegionNameForDisplay = regionOptions.find(r => r.value === generalRegionQueryParam)?.label || capitalizeFirstLetter(generalRegionQueryParam);
    filterSource = 'url_region_only';
  } else if (detectedRegionSlug && !isTestFilterActive && !generalRegionQueryParam) { 
    activeRegionSlugForFiltering = detectedRegionSlug;
    activeRegionNameForDisplay = detectedRegionName;
    filterSource = 'geo';
  } else { 
    activeRegionSlugForFiltering = null;
    filterSource = 'none';
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
  let alertMessageForPage: React.ReactNode = null;

  if (filterSource === 'test_params') {
    pageTitle = "Cultivos Sugeridos por el Test";
    pageDescription = "Resultados basados en tus preferencias del test. Puedes refinar la búsqueda con los filtros.";
    let testRegionMessage = "";
    if (activeRegionSlugForFiltering && activeRegionNameForDisplay && activeRegionNameForDisplay !== "Todas las Regiones") {
        testRegionMessage = ` Mostrando para la región: ${activeRegionNameForDisplay}.`;
    } else if ((!activeRegionSlugForFiltering && activeRegionNameForDisplay === "Todas las Regiones") || (!activeRegionSlugForFiltering && !activeRegionNameForDisplay && !regionFromTest) ) {
         testRegionMessage = " Mostrando para todas las regiones.";
    }

    alertMessageForPage = (
      <Alert variant="default" className="bg-purple-50 border-purple-300 text-purple-700"> {/* Consider using accent color here */}
        <MessageSquareText className="h-4 w-4 text-purple-600" /> {/* Consider using accent color here */}
        <AlertTitle className="font-nunito font-semibold">Preferencias del Test Aplicadas</AlertTitle>
        <AlertDescription>
          {testFilterAlertMessage}
          {testRegionMessage}
        </AlertDescription>
      </Alert>
    );
  } else if (filterSource === 'manual_specific' && activeRegionNameForDisplay) {
    pageTitle = `Cultivos Filtrados para la Región: ${activeRegionNameForDisplay}`;
    pageDescription = `Explora los cultivos característicos de la región ${activeRegionNameForDisplay} según los filtros aplicados.`;
    alertMessageForPage = (
      <Alert variant="default" className="bg-primary/10 border-primary/30 text-primary">
        <Filter className="h-4 w-4 text-primary" />
        <AlertTitle className="font-nunito font-semibold">Filtro Manual Activo</AlertTitle>
        <AlertDescription>
          Mostrando cultivos para la región: <strong>{activeRegionNameForDisplay}</strong>.
        </AlertDescription>
      </Alert>
    );
  } else if (filterSource === 'manual_all') {
    pageTitle = "Cultivos Filtrados (Todas las Regiones)";
    pageDescription = "Mostrando cultivos de todas las regiones, según los filtros aplicados.";
     alertMessageForPage = (
      <Alert variant="default" className="bg-primary/10 border-primary/30 text-primary">
        <Filter className="h-4 w-4 text-primary" />
        <AlertTitle className="font-nunito font-semibold">Filtro Manual Activo</AlertTitle>
        <AlertDescription>
          Mostrando cultivos de <strong>Todas las Regiones</strong>.
        </AlertDescription>
      </Alert>
    );
  } else if (filterSource === 'url_region_only' && activeRegionNameForDisplay) {
    pageTitle = `Cultivos de la Región ${activeRegionNameForDisplay}`;
    pageDescription = `Explora los cultivos característicos de la región ${activeRegionNameForDisplay}.`;
    alertMessageForPage = (
      <Alert variant="default" className="bg-primary/10 border-primary/30 text-primary">
        <MapPin className="h-4 w-4 text-primary" />
        <AlertTitle className="font-nunito font-semibold">Filtro por Región</AlertTitle>
        <AlertDescription>
          Mostrando cultivos para la región: <strong>{activeRegionNameForDisplay}</strong>.
        </AlertDescription>
      </Alert>
    );
  } else if (filterSource === 'geo' && activeRegionNameForDisplay) {
    pageTitle = `Cultivos Sugeridos para tu Región: ${activeRegionNameForDisplay}`;
    pageDescription = `Basado en tu ubicación (aproximada), te sugerimos estos cultivos de la región ${activeRegionNameForDisplay}.`;
    alertMessageForPage = (
       <Alert variant="default" className="bg-green-50 border-green-300 text-green-700"> {/* Use a theme-consistent green */}
          <CheckCircle className="h-4 w-4 text-green-600" /> {/* Use a theme-consistent green */}
          <AlertTitle className="font-nunito font-semibold">Región Detectada: {activeRegionNameForDisplay}</AlertTitle>
          <AlertDescription>
            Mostrando cultivos sugeridos para tu región. La detección de región es aproximada.
          </AlertDescription>
        </Alert>
    );
  } else if (geolocationStatus === 'success' && filterSource === 'none' && !activeRegionNameForDisplay) {
     pageDescription = "No pudimos determinar una región específica para tu ubicación. Mostrando todos los cultivos.";
     alertMessageForPage = (
        <Alert>
            <HelpCircle className="h-4 w-4" />
            <AlertTitle className="font-nunito font-semibold">Ubicación Obtenida</AlertTitle>
            <AlertDescription>
            No pudimos determinar una región específica para tu ubicación. Mostrando todos los cultivos.
            </AlertDescription>
        </Alert>
     );
  }


  let regionSelectValue = 'all'; 
  if (manualRegionFilterActive) {
    regionSelectValue = manualRegionSlug || 'all';
  } else if (isTestFilterActive && regionFromTest) {
    regionSelectValue = regionFromTest;
  } else if (!isTestFilterActive && !manualRegionFilterActive && generalRegionQueryParam) { 
    regionSelectValue = generalRegionQueryParam;
  }


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-nunito font-bold tracking-tight text-foreground sm:text-4xl">
        {pageTitle}
      </h1>

      {filterSource !== 'test_params' && filterSource !== 'manual_specific' && filterSource !== 'manual_all' && filterSource !== 'url_region_only' && geolocationStatus === 'pending' && (
        <Alert>
          <LocateFixed className="h-4 w-4 animate-ping" />
          <AlertTitle className="font-nunito font-semibold">Obteniendo Ubicación</AlertTitle>
          <AlertDescription>Estamos intentando detectar tu región para mostrarte cultivos relevantes...</AlertDescription>
        </Alert>
      )}
      {filterSource !== 'test_params' && filterSource !== 'manual_specific' && filterSource !== 'manual_all' && filterSource !== 'url_region_only' && geolocationStatus === 'error' && geolocationErrorMsg && (
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
              value={regionSelectValue} 
              onValueChange={(value) => {
                setManualRegionSlug(value === 'all' ? null : value);
                setManualRegionFilterActive(true);
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
            <Select value={selectedPrice || 'all'} onValueChange={(value) => setSelectedPrice(value === 'all' ? null : value)}>
              <SelectTrigger id="priceSelect" className="font-nunito"><SelectValue placeholder="Todos los Precios" /></SelectTrigger>
              <SelectContent>
                {priceOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="durationSelect" className="text-sm font-nunito font-semibold">Duración</Label>
            <Select value={selectedDuration || 'all'} onValueChange={(value) => setSelectedDuration(value === 'all' ? null : value)}>
              <SelectTrigger id="durationSelect" className="font-nunito"><SelectValue placeholder="Todas las Duraciones" /></SelectTrigger>
              <SelectContent>
                {durationOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="spaceSelect" className="text-sm font-nunito font-semibold">Espacio Requerido</Label>
            <Select value={selectedSpace || 'all'} onValueChange={(value) => setSelectedSpace(value === 'all' ? null : value)}>
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
              onValueChange={(value) => setSelectedPlantType(value === 'all' ? null : value)}
            >
              <SelectTrigger id="plantTypeSelect" className="font-nunito"><SelectValue placeholder="Todos los Tipos" /></SelectTrigger>
              <SelectContent>
                {plantTypeOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="difficultySelect" className="text-sm font-nunito font-semibold">Dificultad</Label>
            <Select value={selectedDifficulty || 'all'} onValueChange={(value) => setSelectedDifficulty(value === 'all' ? null : value)}>
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
            {filterSource === 'geo' && activeRegionNameForDisplay && (
                <span className="block mt-1 text-xs"> (Región estimada por geolocalización)</span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {(filterSource === 'geo' && activeRegionNameForDisplay) && (
            <p className="text-sm text-muted-foreground mb-4">
              Nota: La región ({activeRegionNameForDisplay}) ha sido estimada basándose en tu ubicación y puede no ser exacta.
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
                    <CardTitle className="text-xl font-nunito font-bold">{crop.name}</CardTitle>
                    {(!activeRegionSlugForFiltering || 
                      filterSource === 'manual_all' || 
                      (filterSource === 'test_params' && (!regionFromTest || (manualRegionFilterActive && !manualRegionSlug)) )
                     ) && (
                        <Badge variant="outline" className="mt-1 w-fit font-nunito">{capitalizeFirstLetter(crop.regionSlug)}</Badge>
                    )}
                  </CardHeader>
                  <CardContent className="flex-grow space-y-3">
                    <p className="text-sm text-muted-foreground mb-3">{crop.description}</p>
                    <div className="space-y-2 pt-2 border-t">
                        <div className="flex items-center">
                            <span className="text-xs font-nunito font-semibold mr-2 w-28">Dificultad:</span>
                            <div className="flex">
                                {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className={`h-4 w-4 ${i < crop.difficulty ? 'fill-yellow-400 text-yellow-500' : 'text-gray-300'}`} />
                                ))}
                            </div>
                        </div>
                        <Badge variant="outline" className="font-nunito">Precio: {crop.estimatedPrice}</Badge>
                        <Badge variant="outline" className="font-nunito">Duración: {crop.duration}</Badge>
                        <Badge variant="outline" className="font-nunito">Espacio: {crop.spaceRequired}</Badge>
                        <Badge variant="outline" className="font-nunito">Tipo: {crop.plantType}</Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="flex-col items-start gap-2">
                     <Button 
                        onClick={() => handleAddCropToDashboard(crop)} 
                        disabled={isAddingCrop === crop.id}
                        className="w-full"
                      >
                       <PlusCircle className="mr-2 h-4 w-4" />
                       {isAddingCrop === crop.id ? 'Añadiendo...' : 'Añadir a mi Dashboard'}
                     </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
             <Alert variant="default" className="mt-4">
                <HelpCircle className="h-4 w-4" />
                <AlertTitle className="font-nunito font-semibold">No se encontraron cultivos</AlertTitle>
                <AlertDescription>
                {activeRegionSlugForFiltering && activeRegionNameForDisplay && filterSource !== 'manual_all' && filterSource !== 'none'
                    ? `No se encontraron cultivos que coincidan con los filtros aplicados para la región ${activeRegionNameForDisplay}. Prueba con otros filtros o regiones.`
                    : "No se encontraron cultivos que coincidan con los filtros aplicados. Prueba con otros filtros."}
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
