
"use client";

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L, { type LatLngExpression } from 'leaflet';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, getDocs, type QueryDocumentSnapshot, type DocumentData } from 'firebase/firestore';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, AlertTriangle } from 'lucide-react';

interface Crop {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  difficulty: 'easy' | 'medium' | 'hard';
  regionHint?: string;
}

const createDifficultyIcon = (difficulty: 'easy' | 'medium' | 'hard') => {
  let bgColorClass = '';
  switch (difficulty) {
    case 'easy':
      bgColorClass = 'difficulty-easy';
      break;
    case 'medium':
      bgColorClass = 'difficulty-medium';
      break;
    case 'hard':
      bgColorClass = 'difficulty-hard';
      break;
    default:
      bgColorClass = 'bg-gray-400';
  }
  return L.divIcon({
    className: `difficulty-marker-icon ${bgColorClass}`,
    iconSize: [20, 20],
    html: ``, 
  });
};

const sampleCropsData: Crop[] = [
  {
    id: 'lechuga_cundinamarca_sample', 
    name: 'Lechuga',
    location: { lat: 5.0671, lng: -74.0000 },
    difficulty: 'easy',
    regionHint: 'Cundinamarca (Andina)'
  },
  {
    id: 'cafe_colombiano_sample',
    name: 'Café Colombiano (Ejemplo)',
    location: { lat: 4.0, lng: -73.0 },
    difficulty: 'medium',
    regionHint: 'Andino'
  },
  {
    id: 'platano_uraba_sample',
    name: 'Plátano del Urabá (Ejemplo)',
    location: { lat: 7.8, lng: -76.6 },
    difficulty: 'easy',
    regionHint: 'Caribe'
  },
  {
    id: 'quinua_narino_sample',
    name: 'Quinua de Nariño (Ejemplo)',
    location: { lat: 1.0, lng: -77.5 },
    difficulty: 'hard',
    regionHint: 'Andino (Sur)'
  },
  {
    id: 'cacao_araucano_sample',
    name: 'Cacao Araucano (Ejemplo)',
    location: { lat: 6.7, lng: -71.5 },
    difficulty: 'medium',
    regionHint: 'Orinoquía'
  },
  {
    id: 'yuca_amazonica_sample',
    name: 'Yuca Amazónica (Ejemplo)',
    location: { lat: -1.0, lng: -70.0 },
    difficulty: 'easy',
    regionHint: 'Amazonas'
  }
];


export function InteractiveMap() {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSampleData, setIsSampleData] = useState(false);
  
  const colombiaCenter: LatLngExpression = [4.5709, -74.2973];
  const initialZoom = 6;

  useEffect(() => {
    const fetchCrops = async () => {
      setIsLoading(true); 
      setError(null);
      setIsSampleData(false);
      try {
        if (!db) {
          throw new Error("La base de datos Firestore no está inicializada. Asegúrate de configurar tus credenciales en src/lib/firebase.ts.");
        }
        const cropsCollection = collection(db, 'crops');
        const cropSnapshot = await getDocs(cropsCollection);
        
        if (cropSnapshot.empty) {
          console.log("Firestore 'crops' collection is empty, using sample data.");
          setCrops(sampleCropsData);
          setIsSampleData(true);
        } else {
          const cropsList: Crop[] = cropSnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
            const data = doc.data();
            const location = data.location && typeof data.location.lat === 'number' && typeof data.location.lng === 'number' 
                             ? data.location 
                             : { lat: 0, lng: 0 }; 
            return {
              id: doc.id,
              name: data.name || 'Sin nombre',
              location: location,
              difficulty: data.difficulty || 'medium',
              regionHint: data.regionHint || '',
            } as Crop;
          });
          setCrops(cropsList);
          setIsSampleData(false);
        }
      } catch (err) {
        console.error("Error fetching crops from Firestore:", err);
        setError(err instanceof Error ? err.message : "No se pudieron cargar los datos de los cultivos desde Firestore.");
        console.log("Falling back to sample data due to Firestore error.");
        setCrops(sampleCropsData); 
        setIsSampleData(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCrops();
  }, []);

  if (isLoading) {
    return <p className="text-center p-4">Cargando mapa y cultivos...</p>;
  }

  return (
    <div className="w-full">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error de Carga</AlertTitle>
          <AlertDescription>
            {error} Se están mostrando datos de ejemplo en el mapa.
          </AlertDescription>
        </Alert>
      )}
      {isSampleData && !error && (
        <Alert variant="default" className="mb-4">
          <Info className="h-4 w-4" />
          <AlertTitle>Mostrando Datos de Ejemplo</AlertTitle>
          <AlertDescription>
            No se encontraron cultivos en tu base de datos Firestore. El mapa muestra datos de demostración.
            Para ver tus propios datos, agrega documentos a la colección 'crops' en Firestore.
          </AlertDescription>
        </Alert>
      )}

      <MapContainer center={colombiaCenter} zoom={initialZoom} scrollWheelZoom={true} className="leaflet-container">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {crops.map((crop) => (
          crop.location && typeof crop.location.lat === 'number' && typeof crop.location.lng === 'number' &&
          <Marker
            key={crop.id}
            position={[crop.location.lat, crop.location.lng]}
            icon={createDifficultyIcon(crop.difficulty)}
          >
            <Popup>
              <div className="font-sans">
                <h3 className="font-bold text-base mb-1">{crop.name}</h3>
                {crop.regionHint && <p className="text-xs text-muted-foreground mb-1">Región (aprox.): {crop.regionHint}</p>}
                <p className="text-xs capitalize mb-2">Dificultad: <span className={`font-semibold ${
                  crop.difficulty === 'easy' ? 'text-green-600' :
                  crop.difficulty === 'medium' ? 'text-yellow-600' : 'text-red-600'
                }`}>{crop.difficulty}</span></p>
                <Link href={`/cultivos/${crop.id.replace('_sample', '')}`} className="text-sm text-primary hover:underline">
                  Ver detalles
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <Card className="map-legend">
        <h4 className="text-lg font-semibold mb-2 text-foreground">Leyenda de Dificultad:</h4>
        <div className="space-y-1">
          <div className="map-legend-item">
            <span className="map-legend-color difficulty-easy"></span>
            <span className="text-sm text-muted-foreground">Fácil</span>
          </div>
          <div className="map-legend-item">
            <span className="map-legend-color difficulty-medium"></span>
            <span className="text-sm text-muted-foreground">Medio</span>
          </div>
          <div className="map-legend-item">
            <span className="map-legend-color difficulty-hard"></span>
            <span className="text-sm text-muted-foreground">Difícil</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
