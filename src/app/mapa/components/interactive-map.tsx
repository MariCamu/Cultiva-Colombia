
"use client";

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L, { type LatLngExpression } from 'leaflet';
import Link from 'next/link';
import { collection, getDocs, type QueryDocumentSnapshot, type DocumentData } from 'firebase/firestore';
import { db } from '../../lib/firebase';
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
    location: { lat: 5.0671, lng: -74.0 },
    difficulty: 'easy',
    regionHint: 'Cundinamarca (Andina)',
  },
];

export function InteractiveMap() {
  const [mounted, setMounted] = useState(false);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSampleData, setIsSampleData] = useState(false);

  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);

  const colombiaCenter: LatLngExpression = [4.5709, -74.2973];
  const initialZoom = 6;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    return () => {
      if (mapInstance) {
        mapInstance.remove();
      }
      const container = document.querySelector('.leaflet-container') as any;
      if (container && container._leaflet_id) {
        container._leaflet_id = null;
      }
    };
  }, [mapInstance]);

  useEffect(() => {
    const fetchCrops = async () => {
      setIsLoading(true);
      setError(null);
      setIsSampleData(false);
      try {
        if (!db) throw new Error('Firestore no inicializada');
        const snapshot = await getDocs(collection(db, 'crops'));
        if (snapshot.empty) {
          setCrops(sampleCropsData);
          setIsSampleData(true);
        } else {
          const list = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
            const data = doc.data();
            const location = data.location && typeof data.location.lat === 'number' && typeof data.location.lng === 'number'
              ? data.location
              : { lat: 0, lng: 0 };
            return {
              id: doc.id,
              name: data.name || 'Sin nombre',
              location,
              difficulty: data.difficulty || 'medium',
              regionHint: data.regionHint || '',
            } as Crop;
          });
          setCrops(list);
        }
      } catch (err) {
        console.error(err);
        setError('Error cargando cultivos, mostrando datos de ejemplo.');
        setCrops(sampleCropsData);
        setIsSampleData(true);
      } finally {
        setIsLoading(false);
      }
    };
    if (mounted) fetchCrops();
  }, [mounted]);

  if (!mounted) return null;
  if (isLoading) return <p className="text-center p-4">Cargando mapa y cultivos...</p>;

  return (
    <div className="w-full">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error de Carga</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {isSampleData && !error && (
        <Alert variant="default" className="mb-4">
          <Info className="h-4 w-4" />
          <AlertTitle>Mostrando Ejemplo</AlertTitle>
          <AlertDescription>No se encontraron cultivos en Firestore.</AlertDescription>
        </Alert>
      )}

      <MapContainer
        key={`map-${colombiaCenter[0]}-${colombiaCenter[1]}-${initialZoom}`}
        whenCreated={setMapInstance}
        center={colombiaCenter}
        zoom={initialZoom}
        scrollWheelZoom={true}
        className="leaflet-container"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {crops.map((crop) => (
          <Marker
            key={crop.id}
            position={[crop.location.lat, crop.location.lng]}
            icon={createDifficultyIcon(crop.difficulty)}
          >
            <Popup>
              <div className="font-sans">
                <h3 className="font-bold text-base mb-1">{crop.name}</h3>
                {crop.regionHint && <p className="text-xs text-muted-foreground mb-1">Región (aprox.): {crop.regionHint}</p>}
                <p className="text-xs capitalize mb-2">
                  Dificultad:{' '}
                  <span className={`font-semibold ${
                    crop.difficulty === 'easy' ? 'text-green-600' :
                    crop.difficulty === 'medium' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {crop.difficulty}
                  </span>
                </p>
                <Link href="/cultivos" className="text-sm text-primary hover:underline">
                  Ver detalles
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <Card className="map-legend mt-4">
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
