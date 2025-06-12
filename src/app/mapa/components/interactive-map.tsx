
"use client";

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L, { type LatLngExpression } from 'leaflet';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, getDocs, type QueryDocumentSnapshot, type DocumentData } from 'firebase/firestore';
import { Card } from '@/components/ui/card';

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
      bgColorClass = 'difficulty-easy'; // bg-green-500
      break;
    case 'medium':
      bgColorClass = 'difficulty-medium'; // bg-yellow-500
      break;
    case 'hard':
      bgColorClass = 'difficulty-hard'; // bg-red-500
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

export function InteractiveMap() {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const colombiaCenter: LatLngExpression = [4.5709, -74.2973];
  const initialZoom = 6;

  useEffect(() => {
    const fetchCrops = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const cropsCollection = collection(db, 'crops');
        const cropSnapshot = await getDocs(cropsCollection);
        const cropsList: Crop[] = cropSnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || 'Sin nombre',
            location: data.location || { lat: 0, lng: 0 },
            difficulty: data.difficulty || 'medium',
            regionHint: data.regionHint || '',
          } as Crop;
        });
        setCrops(cropsList);
      } catch (err) {
        console.error("Error fetching crops:", err);
        setError("No se pudieron cargar los datos de los cultivos. Por favor, inténtelo más tarde.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCrops();
  }, []);

  if (isLoading) {
    return <p className="text-center p-4">Cargando mapa y cultivos...</p>;
  }

  if (error) {
    return <p className="text-center p-4 text-red-600">{error}</p>;
  }
  
  if (crops.length === 0 && !isLoading) {
     return (
        <div className="text-center p-4">
            <p>No se encontraron cultivos para mostrar en el mapa.</p>
            <p className="text-sm text-muted-foreground mt-2">
                Asegúrate de haber agregado documentos a la colección 'crops' en Firestore con los campos 'name', 'location' (objeto con lat y lng), y 'difficulty' ('easy', 'medium', o 'hard').
            </p>
        </div>
     );
  }

  return (
    <div className="w-full">
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
                <Link href={`/cultivos/${crop.id}`} className="text-sm text-primary hover:underline">
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
