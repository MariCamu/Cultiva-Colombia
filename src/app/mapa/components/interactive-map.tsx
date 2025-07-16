
"use client";

import { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import ReactDOMServer from 'react-dom/server';
import { LocateFixed, Filter, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from '@/lib/utils';
import { getUserLocation } from '@/app/mapa/utils/geolocation';
import Link from 'next/link';

// --- NUEVA IMPORTACIÓN DINÁMICA DE COMPONENTES DE REACT-LEAFLET ---
import dynamic from 'next/dynamic';

const DynamicMapContainer = dynamic(
  () => import('react-leaflet').then(mod => mod.MapContainer),
  { ssr: false }
);

const DynamicTileLayer = dynamic(
  () => import('react-leaflet').then(mod => mod.TileLayer),
  { ssr: false }
);

const DynamicMarker = dynamic(
  () => import('react-leaflet').then(mod => mod.Marker),
  { ssr: false }
);

const DynamicPopup = dynamic(
  () => import('react-leaflet').then(mod => mod.Popup),
  { ssr: false }
);

const DynamicMapEventHandler = dynamic(
    () => import('react-leaflet').then(mod => {
        const useMapHook = mod.useMap;
        return ({ center, zoom }: { center: [number, number]; zoom: number }) => {
            const map = useMapHook();
            useEffect(() => {
                map.setView(center, zoom);
            }, [center, zoom, map]);
            return null;
        };
    }),
    { ssr: false }
);

// --- COMPONENTES DE ÍCONOS SVG (DEFINIDOS FUERA DEL COMPONENTE PRINCIPAL) ---
const CornIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 100 100" width="30" height="30" {...props}>
    <path d="M50 10 C 40 30, 40 70, 50 90 C 60 70, 60 30, 50 10 Z" fill="#fde047" />
    <path d="M50 10 C 55 30, 45 30, 50 10" fill="#84cc16" />
    <path d="M45 15 C 40 35, 35 75, 45 95" fill="#a3e635" stroke="#84cc16" strokeWidth="2" />
    <path d="M55 15 C 60 35, 65 75, 55 95" fill="#a3e635" stroke="#84cc16" strokeWidth="2" />
  </svg>
);
const CoffeeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 100 100" width="28" height="28" {...props}>
      <path d="M30 40 Q 20 50, 30 60" stroke="#b91c1c" fill="none" strokeWidth="8" strokeLinecap="round"/>
      <path d="M70 40 Q 80 50, 70 60" stroke="#b91c1c" fill="none" strokeWidth="8" strokeLinecap="round"/>
      <circle cx="50" cy="50" r="20" fill="#ef4444" />
      <circle cx="50" cy="50" r="12" fill="#dc2626" />
    </svg>
);
const LeafIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 100 100" width="28" height="28" {...props}>
      <path d="M50 10 C 20 40, 20 70, 50 90 C 80 70, 80 40, 50 10 Z" fill="#4ade80" />
      <line x1="50" y1="90" x2="50" y2="25" stroke="#16a34a" strokeWidth="5" />
    </svg>
);


// --- INTERFACE CROP ---
interface Crop {
    id: string;
    name: string;
    difficulty: 'easy' | 'medium' | 'hard';
    type: 'Hortaliza' | 'Fruta' | 'Aromática' | 'Grano' | 'Tubérculo' | 'Leguminosa';
    space: 'Maceta pequeña' | 'Maceta grande' | 'Jardín';
    position: [number, number]; // [lat, lng]
    icon: React.ElementType;
    regionSlugs: string[]; // Para filtrar por región
}

const mapCropsData: Crop[] = [
    { id: '1', name: 'Lechuga (Andina)', difficulty: 'easy', type: 'Hortaliza', space: 'Maceta pequeña', position: [4.6, -74.08], icon: LeafIcon, regionSlugs: ['andina'] },
    { id: '2', name: 'Fríjol (Andina)', difficulty: 'easy', type: 'Leguminosa', space: 'Maceta grande', position: [4.8, -75.7], icon: LeafIcon, regionSlugs: ['andina'] },
    { id: '3', name: 'Maíz (Valle del Cauca)', difficulty: 'medium', type: 'Grano', space: 'Jardín', position: [3.4, -76.5], icon: CornIcon, regionSlugs: ['caribe', 'andina'] },
    { id: '4', name: 'Papa (Boyacá)', difficulty: 'easy', type: 'Tubérculo', space: 'Maceta grande', position: [5.5, -73.3], icon: LeafIcon, regionSlugs: ['andina'] },
    { id: '5', name: 'Cilantro (Caribe)', difficulty: 'easy', type: 'Aromática', space: 'Maceta pequeña', position: [10.9, -74.7], icon: LeafIcon, regionSlugs: ['caribe'] },
    { id: '6', name: 'Mango (Caribe)', difficulty: 'medium', type: 'Fruta', space: 'Jardín', position: [11.0, -74.2], icon: LeafIcon, regionSlugs: ['caribe'] },
    { id: '7', name: 'Arroz (Orinoquía)', difficulty: 'medium', type: 'Grano', space: 'Jardín', position: [4.5, -72.0], icon: CornIcon, regionSlugs: ['orinoquia'] },
    { id: '8', name: 'Ñame (Pacífica)', difficulty: 'hard', type: 'Tubérculo', space: 'Jardín', position: [3.8, -77.0], icon: LeafIcon, regionSlugs: ['pacifica'] },
    { id: '9', name: 'Yuca (Amazonía)', difficulty: 'easy', type: 'Tubérculo', space: 'Jardín', position: [0.0, -70.0], icon: LeafIcon, regionSlugs: ['amazonia'] },
    { id: '10', name: 'Orégano (General)', difficulty: 'easy', type: 'Aromática', space: 'Maceta pequeña', position: [6.2, -75.5], icon: LeafIcon, regionSlugs: ['andina', 'caribe', 'pacifica', 'orinoquia', 'amazonia', 'insular'] },
    { id: '11', name: 'Hierbabuena (General)', difficulty: 'easy', type: 'Aromática', space: 'Maceta pequeña', position: [1.2, -77.2], icon: LeafIcon, regionSlugs: ['andina', 'caribe', 'pacifica', 'orinoquia', 'amazonia', 'insular'] },
    { id: '12', name: 'Guayaba (Andina)', difficulty: 'medium', type: 'Fruta', space: 'Jardín', position: [2.9, -75.2], icon: LeafIcon, regionSlugs: ['andina', 'caribe'] },
    { id: '13', name: 'Tomate Cherry (General)', difficulty: 'easy', type: 'Hortaliza', space: 'Maceta grande', position: [7.8, -72.5], icon: LeafIcon, regionSlugs: ['andina', 'caribe', 'pacifica', 'orinoquia', 'amazonia', 'insular'] },
    { id: '14', name: 'Maracuyá (Pacífica)', difficulty: 'hard', type: 'Fruta', space: 'Jardín', position: [4.9, -76.6], icon: LeafIcon, regionSlugs: ['pacifica', 'andina', 'caribe'] },
    { id: '15', name: 'Auyama (Caribe)', difficulty: 'easy', type: 'Hortaliza', space: 'Maceta grande', position: [9.3, -75.4], icon: LeafIcon, regionSlugs: ['caribe', 'andina'] },
];


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
const getDifficultyClass = (difficulty: 'easy' | 'medium' | 'hard') => {
    switch (difficulty) {
        case 'easy': return 'map-marker-easy';
        case 'medium': return 'map-marker-medium';
        case 'hard': return 'map-marker-hard';
    }
};

const createCropIcon = (crop: Crop) => {
    const IconComponent = crop.icon;
    const difficultyClass = getDifficultyClass(crop.difficulty);
    const iconHtml = ReactDOMServer.renderToString(
      <div className={cn("map-marker", difficultyClass)}>
        <IconComponent className="map-marker-icon" />
      </div>
    );

    return new L.DivIcon({
        html: iconHtml,
        className: '',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -20],
    });
};


// --- COMPONENTE PRINCIPAL INTERACTIVEMAP ---
export function InteractiveMap() {
    const [typeFilter, setTypeFilter] = useState<string>('all');
    const [spaceFilter, setSpaceFilter] = useState<string>('all');
    const [activeRegionFilter, setActiveRegionFilter] = useState<string>('all');
    const [filteredCrops, setFilteredCrops] = useState<Crop[]>(mapCropsData);
    const [mapCenter, setMapCenter] = useState<[number, number]>(regionCenters.all as [number, number]);
    const [mapZoom, setMapZoom] = useState<number>(6);

    const [mapLoaded, setMapLoaded] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setMapLoaded(true);
        }
    }, []);

    const handleFilterChange = () => {
        let crops = mapCropsData;

        if (activeRegionFilter !== 'all') {
            crops = crops.filter(c => c.regionSlugs.includes(activeRegionFilter));
        }
        if (typeFilter !== 'all') {
            crops = crops.filter(c => c.type === typeFilter);
        }
        if (spaceFilter !== 'all') {
            crops = crops.filter(c => c.space === spaceFilter);
        }
        setFilteredCrops(crops);
    };

    const resetFilters = () => {
        setTypeFilter('all');
        setSpaceFilter('all');
        setActiveRegionFilter('all');
        setFilteredCrops(mapCropsData);
        setMapCenter(regionCenters.all as [number, number]);
        setMapZoom(6);
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
            setFilteredCrops(mapCropsData);
            
        } catch (error: any) {
            console.error("Error al obtener ubicación:", error);
            alert(`No se pudo obtener tu ubicación: ${error.message}. Por favor, activa los permisos de geolocalización.`);
        }
    };

    useEffect(() => {
        handleFilterChange();
    }, [typeFilter, spaceFilter, activeRegionFilter]);


    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Contenido Principal del Mapa */}
            <div className="lg:col-span-2 w-full">
                <Card className="h-[600px] w-full relative overflow-hidden shadow-lg bg-primary/5 p-0 border-0">
                    {mapLoaded ? (
                        <DynamicMapContainer
                            center={mapCenter}
                            zoom={mapZoom}
                            scrollWheelZoom={true}
                            className="h-full w-full rounded-lg"
                        >
                            <DynamicMapEventHandler center={mapCenter} zoom={mapZoom} />
                            
                            <DynamicTileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            {filteredCrops.map(crop => (
                                <DynamicMarker key={crop.id} position={crop.position} icon={createCropIcon(crop)}>
                                    <DynamicPopup>
                                        <div className="font-nunito font-bold">{crop.name}</div>
                                        <div>Dificultad: {crop.difficulty}</div>
                                        <div>Tipo: {crop.type}</div>
                                        <div className="mt-2">
                                            <Button asChild variant="link" size="sm" className="p-0 h-auto font-semibold">
                                                <Link href={`/cultivos?q=${encodeURIComponent(crop.name.split(' (')[0])}`}>
                                                    Ver ficha
                                                </Link>
                                            </Button>
                                        </div>
                                    </DynamicPopup>
                                </DynamicMarker>
                            ))}
                        </DynamicMapContainer>
                    ) : (
                        <div className="flex items-center justify-center h-full w-full bg-gray-100 rounded-lg text-gray-500">
                            Cargando mapa...
                        </div>
                    )}
                    
                    <Button
                        onClick={handleLocateMe}
                        variant="default"
                        size="sm"
                        className="absolute bottom-4 left-4 z-[401] shadow-lg bg-green-500 hover:bg-green-600 text-white"
                    >
                        <LocateFixed className="mr-2 h-4 w-4" />
                        Centrar en mi ubicación
                    </Button>
                </Card>
            </div>

            {/* Panel Lateral (Leyenda y Filtros) */}
            <div className="lg:col-span-1 w-full space-y-6">
                <Card className="shadow-lg bg-card">
                    <CardHeader>
                        <CardTitle className="font-nunito font-bold">Leyenda del Mapa</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="h-4 w-4 rounded-full bg-[#70964F] border-2 border-white shadow"></div>
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
                                    <SelectItem value="Hortaliza">Hortalizas</SelectItem>
                                    <SelectItem value="Fruta">Frutas</SelectItem>
                                    <SelectItem value="Aromática">Aromáticas</SelectItem>
                                    <SelectItem value="Grano">Granos</SelectItem>
                                    <SelectItem value="Tubérculo">Tubérculos</SelectItem>
                                    <SelectItem value="Leguminosa">Leguminosas</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label htmlFor="space-filter" className="text-sm font-nunito font-semibold">Filtrar por Espacio</label>
                            <Select value={spaceFilter} onValueChange={setSpaceFilter}>
                                <SelectTrigger id="space-filter"><SelectValue placeholder="Todos los espacios" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos los espacios</SelectItem>
                                    <SelectItem value="Maceta pequeña">Maceta pequeña</SelectItem>
                                    <SelectItem value="Maceta grande">Maceta grande</SelectItem>
                                    <SelectItem value="Jardín">Jardín</SelectItem>
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
                            className={cn(
                                "rounded-full",
                                activeRegionFilter === 'all' ? "bg-[#70964F] text-white hover:bg-[#608040]" : "bg-transparent border border-[#70964F] text-[#70964F] hover:bg-[#EDF2E8]"
                            )}
                        >
                            Todas las Regiones
                        </Button>
                        {Object.keys(regionCenters).filter(slug => slug !== 'all').map(slug => (
                            <Button
                                key={slug}
                                onClick={() => handleRegionQuickAccess(slug)}
                                className={cn(
                                    "rounded-full",
                                    activeRegionFilter === slug ? "bg-[#70964F] text-white hover:bg-[#608040]" : "bg-transparent border border-[#70964F] text-[#70964F] hover:bg-[#EDF2E8]"
                                )}
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
