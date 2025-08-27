
"use client";

import { useState, useEffect } from 'react';
import L from 'leaflet';
import ReactDOMServer from 'react-dom/server';
import { LocateFixed, Filter, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from '@/lib/utils';
import { getUserLocation } from '@/app/mapa/utils/geolocation';
import Link from 'next/link';
import { collection, getDocs, query, type GeoPoint } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { CropTechnicalSheet } from '@/lib/crop-data-structure';
import dynamic from 'next/dynamic';

// --- DYNAMIC IMPORTS FOR REACT-LEAFLET COMPONENTS ---
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

const MapEventHandler = dynamic(() => import('react-leaflet').then(mod => {
    const useMapHook = mod.useMap;
    return ({ center, zoom }: { center: [number, number]; zoom: number }) => {
        const map = useMapHook();
        useEffect(() => {
            if (map) {
                map.setView(center, zoom);
            }
        }, [center, zoom, map]);
        return null;
    };
}), { ssr: false });


// --- INTERFACE CROP ---
interface Crop {
    id: string;
    name: string;
    difficulty: 'Fácil' | 'Media' | 'Difícil' | string;
    type: string;
    space: 'Maceta pequeña (1–3 L)' | 'Maceta mediana (4–10 L)' | 'Maceta grande (10+ L)' | 'Jardín';
    position: [number, number]; // [lat, lng]
    imageUrl: string;
    regionSlugs: string[]; // Para filtrar por región
}


// --- FETCH FUNCTION FROM FIRESTORE ---
async function getCropsForMap(): Promise<Crop[]> {
    const cropsCollectionRef = collection(db, 'fichas_tecnicas_cultivos');
    const q = query(cropsCollectionRef);
    const querySnapshot = await getDocs(q);

    const crops: Crop[] = [];
    querySnapshot.forEach(doc => {
        const data = doc.data() as CropTechnicalSheet;
        if (data.posicion && (data.posicion as GeoPoint).latitude) {
            const geoPoint = data.posicion as GeoPoint;
            
            let spaceRequired: Crop['space'];
            if (data.tags.includes('maceta_pequena')) {
                spaceRequired = 'Maceta pequeña (1–3 L)';
            } else if (data.tags.includes('maceta_mediana')) {
                spaceRequired = 'Maceta mediana (4–10 L)';
            } else if (data.tags.includes('maceta_grande')) {
                 spaceRequired = 'Maceta grande (10+ L)';
            } else {
                spaceRequired = 'Jardín'; // Default for those without specific pot tags
            }

            crops.push({
                id: doc.id,
                name: data.nombre,
                difficulty: data.dificultad,
                type: data.tipo_planta,
                space: spaceRequired, 
                position: [geoPoint.latitude, geoPoint.longitude],
                imageUrl: data.imagenes?.[0]?.url || 'https://placehold.co/40x40.png',
                regionSlugs: data.region.principal.map(r => r.toLowerCase()),
            });
        }
    });
    return crops;
}


// --- PUNTOS CENTRALES APROXIMADOS POR REGIÓN ---
const regionCenters: { [key: string]: [number, number] | undefined } = {
    andina: [4.8, -74.0],
    caribe: [10.5, -74.5],
    pacifica: [4.0, -77.0],
    orinoquia: [4.5, -72.0],
    amazonia: [-1.0, -70.0],
    insular: [12.5, -81.5],
    all: [4.5709, -74.2973]
};

// --- FUNCIONES AUXILIARES PARA LOS ÍCONOS PERSONALIZADOS ---
const getDifficultyClass = (difficulty: 'Fácil' | 'Media' | 'Difícil' | string) => {
    const lowerCaseDifficulty = difficulty.toLowerCase();
    if (lowerCaseDifficulty.includes('muy fácil') || lowerCaseDifficulty.includes('fácil')) return 'map-marker-easy';
    if (lowerCaseDifficulty.includes('media')) return 'map-marker-medium';
    if (lowerCaseDifficulty.includes('difícil')) return 'map-marker-hard';
    return 'map-marker-easy'; // Default to easy if no match
};


const createCropIcon = (crop: Crop) => {
    const difficultyClass = getDifficultyClass(crop.difficulty);
    const iconHtml = ReactDOMServer.renderToString(
        <div 
            className={cn("map-marker", difficultyClass)}
            style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                padding: '2px', 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
            }}
        >
            <img 
                src={crop.imageUrl} 
                alt={crop.name} 
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '50%',
                }}
            />
        </div>
    );

    return new L.DivIcon({
        html: iconHtml,
        className: 'bg-transparent border-0',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -20],
    });
};

const createSlug = (name: string) => {
  return name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
}

const spaceOptions = [
    { value: 'all', label: 'Todos los Espacios' },
    { value: 'Maceta pequeña (1–3 L)', label: 'Maceta pequeña' },
    { value: 'Maceta mediana (4–10 L)', label: 'Maceta mediana' },
    { value: 'Maceta grande (10+ L)', label: 'Maceta grande' },
    { value: 'Jardín', label: 'Jardín' },
];


// --- COMPONENTE PRINCIPAL INTERACTIVEMAP ---
export function InteractiveMap() {
    const [allCrops, setAllCrops] = useState<Crop[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [typeFilter, setTypeFilter] = useState<string>('all');
    const [spaceFilter, setSpaceFilter] = useState<string>('all');
    const [activeRegionFilter, setActiveRegionFilter] = useState<string>('all');
    
    const [mapCenter, setMapCenter] = useState<[number, number]>(regionCenters.all as [number, number]);
    const [mapZoom, setMapZoom] = useState<number>(6);

    useEffect(() => {
        const fetchCrops = async () => {
            setIsLoading(true);
            try {
                const cropsFromDb = await getCropsForMap();
                setAllCrops(cropsFromDb);
            } catch (error) {
                console.error("Error fetching map crops:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCrops();
    }, []);

    const filteredCrops = allCrops.filter(crop => {
        const typeMatch = typeFilter === 'all' || crop.type === typeFilter;
        const spaceMatch = spaceFilter === 'all' || crop.space === spaceFilter;
        const regionMatch = activeRegionFilter === 'all' || crop.regionSlugs.includes(activeRegionFilter);
        return typeMatch && spaceMatch && regionMatch;
    });

    const resetFilters = () => {
        setTypeFilter('all');
        setSpaceFilter('all');
        handleRegionQuickAccess('all');
    };

    const handleRegionQuickAccess = (regionSlug: string) => {
        setActiveRegionFilter(regionSlug);
        setMapCenter(regionCenters[regionSlug] as [number, number] || regionCenters.all as [number, number]);
        setMapZoom(regionSlug === 'all' ? 6 : 8);
    };

    const handleLocateMe = async () => {
        try {
            const location = await getUserLocation();
            setMapCenter([location.lat, location.lon]);
            setMapZoom(12);
            setActiveRegionFilter('all'); 
            setTypeFilter('all');
            setSpaceFilter('all');
        } catch (error: any) {
            console.error("Error al obtener ubicación:", error);
            alert(`No se pudo obtener tu ubicación: ${error.message}. Por favor, activa los permisos de geolocalización.`);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-3 lg:col-span-2 w-full">
                <Card className="h-[60vh] md:h-[70vh] lg:h-[600px] w-full relative overflow-hidden shadow-lg bg-primary/5 p-0 border-0">
                    <MapContainer
                        center={mapCenter}
                        zoom={mapZoom}
                        scrollWheelZoom={true}
                        className="h-full w-full rounded-lg z-0"
                    >
                        <MapEventHandler center={mapCenter} zoom={mapZoom} />
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {filteredCrops.map(crop => (
                            <Marker key={crop.id} position={crop.position} icon={createCropIcon(crop)}>
                                <Popup>
                                    <div className="font-nunito font-bold">{crop.name}</div>
                                    <div>Dificultad: {crop.difficulty}</div>
                                    <div>Tipo: {crop.type}</div>
                                    <div className="mt-2">
                                        <Button asChild variant="link" size="sm" className="p-0 h-auto font-semibold">
                                            <Link href={`/cultivos/${createSlug(crop.name)}`}>
                                                Ver ficha
                                            </Link>
                                        </Button>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                    
                    <Button
                        onClick={handleLocateMe}
                        variant="default"
                        size="sm"
                        className="absolute bottom-4 left-4 z-[401] shadow-lg"
                    >
                        <LocateFixed className="mr-2 h-4 w-4" />
                        Centrar en mi ubicación
                    </Button>
                </Card>
            </div>

            <div className="md:col-span-3 lg:col-span-1 w-full space-y-6">
                <Card className="shadow-lg bg-card">
                    <CardHeader>
                        <CardTitle className="font-nunito font-bold">Leyenda del Mapa</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="h-4 w-4 rounded-full bg-green-500 border-2 border-white shadow"></div>
                            <span className="text-sm font-medium text-muted-foreground">Fácil</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-4 w-4 rounded-full bg-yellow-500 border-2 border-white shadow"></div>
                            <span className="text-sm font-medium text-muted-foreground">Media</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-4 w-4 rounded-full bg-red-600 border-2 border-white shadow"></div>
                            <span className="text-sm font-medium text-muted-foreground">Difícil</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-lg bg-card">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-nunito font-bold">
                            <Filter className="h-5 w-5" />
                            Filtros
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label htmlFor="type-filter" className="text-sm font-nunito font-semibold">Filtrar por Tipo de Cultivo</label>
                            <Select value={typeFilter} onValueChange={setTypeFilter}>
                                <SelectTrigger id="type-filter"><SelectValue placeholder="Todos los tipos" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos los tipos</SelectItem>
                                    {[...new Set(allCrops.map(c => c.type))].sort().map(type => (
                                        <SelectItem key={type} value={type}>{type}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label htmlFor="space-filter" className="text-sm font-nunito font-semibold">Filtrar por Espacio</label>
                            <Select value={spaceFilter} onValueChange={setSpaceFilter}>
                                <SelectTrigger id="space-filter"><SelectValue placeholder="Todos los espacios" /></SelectTrigger>
                                <SelectContent>
                                    {spaceOptions.map(opt => (
                                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col gap-2 pt-2">
                           <Button onClick={resetFilters} variant="ghost" className="w-full text-destructive hover:text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Limpiar Filtros
                           </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-lg bg-card">
                    <CardHeader>
                        <CardTitle className="font-nunito font-bold">Acceso Rápido por Región</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-3">
                        <Button
                            onClick={() => handleRegionQuickAccess('all')}
                            variant={activeRegionFilter === 'all' ? 'default' : 'outline'}
                            size="sm"
                        >
                            Todas
                        </Button>
                        {Object.keys(regionCenters).filter(slug => slug !== 'all').map(slug => (
                            <Button
                                key={slug}
                                onClick={() => handleRegionQuickAccess(slug)}
                                variant={activeRegionFilter === slug ? 'default' : 'outline'}
                                size="sm"
                            >
                                {slug.charAt(0).toUpperCase() + slug.slice(1)}
                            </Button>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
