"use client";

import { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import ReactDOMServer from 'react-dom/server';
import { LocateFixed, Filter, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from '@/lib/utils';
import { getUserLocation } from '@/app/mapa/utils/geolocation'; // Importación corregida para tu ruta

// --- NUEVA IMPORTACIÓN DINÁMICA DE COMPONENTES DE REACT-LEAFLET ---
// Esto es CRUCIAL para evitar el error "Map container is already initialized" en Next.js
import dynamic from 'next/dynamic';

const DynamicMapContainer = dynamic(
  () => import('react-leaflet').then(mod => mod.MapContainer),
  { ssr: false } // ¡MUY IMPORTANTE! Asegura que solo se renderice en el cliente
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

// Componente auxiliar para manejar el mapa (usa useMap de react-leaflet)
// También importado dinámicamente si se usa useMap dentro
const DynamicMapEventHandler = dynamic(
    () => import('react-leaflet').then(mod => {
        const useMapHook = mod.useMap; // Capturamos el hook
        return ({ center, zoom }: { center: [number, number]; zoom: number }) => {
            const map = useMapHook(); // Usamos el hook capturado
            useEffect(() => {
                map.setView(center, zoom);
            }, [center, zoom, map]);
            return null;
        };
    }),
    { ssr: false }
);

// --- COMPONENTES DE ÍCONOS SVG (DEFINIDOS FUERA DEL COMPONENTE PRINCIPAL) ---
// Estos son los íconos visuales de tus cultivos en el mapa
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
// --- FIN COMPONENTES DE ÍCONOS SVG ---


// --- INTERFACE CROP ---
interface Crop {
    id: string;
    name: string;
    difficulty: 'easy' | 'medium' | 'hard';
    type: 'Hortaliza' | 'Fruta' | 'Aromática' | 'Grano';
    space: 'Maceta pequeña' | 'Maceta grande' | 'Jardín';
    position: [number, number]; // [lat, lng]
    icon: React.ElementType;
    regionSlug: string; // Para filtrar por región
}

// --- DATOS DE CULTIVOS DE EJEMPLO PARA EL MAPA ---
// Asegúrate de que estos regionSlug coincidan con los de regionCenters para que el filtro funcione
const mapCropsData: Crop[] = [
    { id: '1', name: 'Lechuga (Andina)', difficulty: 'easy', type: 'Hortaliza', space: 'Maceta pequeña', position: [4.6, -74.08], icon: LeafIcon, regionSlug: 'andina' },
    { id: '2', name: 'Café de Altura (Eje Cafetero)', difficulty: 'hard', type: 'Fruta', space: 'Jardín', position: [4.8, -75.7], icon: CoffeeIcon, regionSlug: 'andina' },
    { id: '3', name: 'Maíz (Valle del Cauca)', difficulty: 'medium', type: 'Grano', space: 'Jardín', position: [3.4, -76.5], icon: CornIcon, regionSlug: 'andina' },
    { id: '4', name: 'Tomate Cherry (Boyacá)', difficulty: 'easy', type: 'Hortaliza', space: 'Maceta grande', position: [5.5, -73.3], icon: LeafIcon, regionSlug: 'andina' },
    { id: '5', name: 'Cilantro (Caribe)', difficulty: 'easy', type: 'Aromática', space: 'Maceta pequeña', position: [10.9, -74.7], icon: LeafIcon, regionSlug: 'caribe' },
    { id: '6', name: 'Mango (Caribe)', difficulty: 'medium', type: 'Fruta', space: 'Jardín', position: [11.0, -74.2], icon: LeafIcon, regionSlug: 'caribe' },
    { id: '7', name: 'Arroz (Orinoquía)', difficulty: 'medium', type: 'Grano', space: 'Jardín', position: [4.5, -72.0], icon: CornIcon, regionSlug: 'orinoquia' },
    { id: '8', name: 'Chontaduro (Pacífica)', difficulty: 'hard', type: 'Fruta', space: 'Jardín', position: [3.8, -77.0], icon: LeafIcon, regionSlug: 'pacifica' },
    { id: '9', name: 'Yuca (Amazonía)', difficulty: 'easy', type: 'Hortaliza', space: 'Jardín', position: [0.0, -70.0], icon: LeafIcon, regionSlug: 'amazonia' },
    // **Asegúrate de expandir esta lista con más cultivos y sus regionSlug para un mapa más completo**
];

// --- PUNTOS CENTRALES APROXIMADOS POR REGIÓN ---
// Se usa para centrar el mapa al hacer clic en los botones de acceso rápido
const regionCenters: { [key: string]: [number, number] | undefined } = {
    andina: [4.8, -74.0],
    caribe: [10.5, -74.5],
    pacifica: [4.0, -77.0],
    orinoquia: [4.5, -72.0],
    amazonia: [-1.0, -70.0],
    insular: [12.5, -81.5], // Para San Andrés y Providencia
    all: [4.5709, -74.2973] // Centro de Colombia (zoom por defecto)
};

// --- FUNCIONES AUXILIARES PARA LOS ÍCONOS PERSONALIZADOS ---
// Estas funciones crean los marcadores visuales en el mapa
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
        className: '', // Importante dejar esto vacío para que tus estilos CSS personalizados funcionen
        iconSize: [40, 40], // Tamaño del contenedor del icono
        iconAnchor: [20, 20], // Punto de anclaje del icono
        popupAnchor: [0, -20], // Punto de anclaje del popup
    });
};


// --- COMPONENTE PRINCIPAL INTERACTIVEMAP ---
export function InteractiveMap() {
    // Estados para los filtros y el mapa
    const [typeFilter, setTypeFilter] = useState<string>('all');
    const [spaceFilter, setSpaceFilter] = useState<string>('all');
    const [activeRegionFilter, setActiveRegionFilter] = useState<string>('all');
    const [filteredCrops, setFilteredCrops] = useState<Crop[]>(mapCropsData);
    const [mapCenter, setMapCenter] = useState<[number, number]>(regionCenters.all as [number, number]);
    const [mapZoom, setMapZoom] = useState<number>(6);

    // NUEVO: Estado para controlar la inicialización del mapa en el cliente
    const [mapLoaded, setMapLoaded] = useState(false);

    // useEffect para asegurar que el mapa solo se monta cuando 'window' está disponible
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setMapLoaded(true);
        }
    }, []);

    // Función para aplicar los filtros
    const handleFilterChange = () => {
        let crops = mapCropsData;

        if (activeRegionFilter !== 'all') {
            crops = crops.filter(c => c.regionSlug === activeRegionFilter);
        }
        if (typeFilter !== 'all') {
            crops = crops.filter(c => c.type === typeFilter);
        }
        if (spaceFilter !== 'all') {
            crops = crops.filter(c => c.space === spaceFilter);
        }
        setFilteredCrops(crops);
    };

    // Función para resetear todos los filtros
    const resetFilters = () => {
        setTypeFilter('all');
        setSpaceFilter('all');
        setActiveRegionFilter('all');
        setFilteredCrops(mapCropsData);
        setMapCenter(regionCenters.all as [number, number]);
        setMapZoom(6);
    };

    // Función para manejar los clics en los botones de acceso rápido por región
    const handleRegionQuickAccess = (regionSlug: string) => {
        setActiveRegionFilter(regionSlug);
        setMapCenter(regionCenters[regionSlug] as [number, number] || regionCenters.all as [number, number]);
        setMapZoom(regionSlug === 'all' ? 6 : 8); // Zoom más cercano para regiones específicas
    };

    // Función para centrar el mapa en la ubicación del usuario
    const handleLocateMe = async () => {
        try {
            const location = await getUserLocation(); // Llama a tu función de geolocalización
            setMapCenter([location.lat, location.lon]);
            setMapZoom(12); // Zoom más cercano a la ubicación del usuario
            // Opcional: Puedes activar un filtro de región si detectas una región específica
            // activeRegionFilter(getRegionFromCoordinates(location.lat, location.lon)?.slug || 'all');
            
            // Si quieres limpiar los filtros al geolocalizar
            setActiveRegionFilter('all'); 
            setTypeFilter('all');
            setSpaceFilter('all');
            setFilteredCrops(mapCropsData);
            
        } catch (error: any) { // 'error: any' para manejar el tipo de error en TypeScript
            console.error("Error al obtener ubicación:", error);
            alert(`No se pudo obtener tu ubicación: ${error.message}. Por favor, activa los permisos de geolocalización.`);
        }
    };

    // useEffect para re-filtrar los cultivos cada vez que cambian los filtros
    useEffect(() => {
        handleFilterChange();
    }, [typeFilter, spaceFilter, activeRegionFilter]);


    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Contenido Principal del Mapa */}
            <div className="lg:col-span-2 w-full">
                <Card className="h-[600px] w-full relative overflow-hidden shadow-lg bg-primary/5 p-0 border-0">
                    {/* Renderizamos el mapa CONDICIONALMENTE solo cuando mapLoaded es true */}
                    {mapLoaded ? (
                        <DynamicMapContainer
                            center={mapCenter} // Centro del mapa dinámico
                            zoom={mapZoom}     // Zoom del mapa dinámico
                            scrollWheelZoom={true}
                            className="h-full w-full rounded-lg"
                        >
                            {/* Componente para manejar eventos del mapa y centrado */}
                            <DynamicMapEventHandler center={mapCenter} zoom={mapZoom} />
                            
                            <DynamicTileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            {/* Mapea los cultivos filtrados a marcadores en el mapa */}
                            {filteredCrops.map(crop => (
                                <DynamicMarker key={crop.id} position={crop.position} icon={createCropIcon(crop)}>
                                    <DynamicPopup>
                                        <div className="font-nunito font-bold">{crop.name}</div>
                                        <div>Dificultad: {crop.difficulty}</div>
                                        <div>Tipo: {crop.type}</div>
                                        {/* Puedes añadir un enlace a la ficha técnica aquí */}
                                    </DynamicPopup>
                                </DynamicMarker>
                            ))}
                        </DynamicMapContainer>
                    ) : (
                        // Placeholder mientras el mapa se carga en el cliente
                        <div className="flex items-center justify-center h-full w-full bg-gray-100 rounded-lg text-gray-500">
                            Cargando mapa...
                        </div>
                    )}
                    
                    {/* Botón para centrar en mi ubicación */}
                    <Button
                        onClick={handleLocateMe}
                        variant="default"
                        size="sm"
                        className="absolute bottom-4 left-4 z-[401] shadow-lg bg-green-500 hover:bg-green-600 text-white" // Usa tus colores de paleta
                    >
                        <LocateFixed className="mr-2 h-4 w-4" />
                        Centrar en mi ubicación
                    </Button>
                </Card>
            </div>

            {/* Panel Lateral (Leyenda y Filtros) */}
            <div className="lg:col-span-1 w-full space-y-6">
                {/* Tarjeta de Leyenda */}
                <Card className="shadow-lg bg-card">
                    <CardHeader>
                        <CardTitle className="font-nunito font-bold">Leyenda del Mapa</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="h-4 w-4 rounded-full bg-[#70964F] border-2 border-white shadow"></div> {/* Tu verde fácil */}
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

                {/* Tarjeta de Filtros */}
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

                {/* Acceso Rápido por Región */}
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
                                {slug.charAt(0).toUpperCase() + slug.slice(1)} {/* Capitaliza el nombre de la región */}
                            </Button>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

// --- ESTILOS CSS PARA LOS MARCADORES PERSONALIZADOS ---
// ¡AÑADE ESTOS ESTILOS A TU ARCHIVO CSS GLOBAL (ej. globals.css)!
// Estos son necesarios para que los íconos de los cultivos se vean correctamente en el mapa.
/*
.map-marker {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  width: 40px; /* iconSize de L.DivIcon */
/* height: 40px; /* iconSize de L.DivIcon */
/* transition: all 0.2s ease-in-out;
  cursor: pointer;
}

.map-marker-icon {
  width: 25px; /* Tamaño del SVG dentro del círculo */
/* height: 25px;
}

.map-marker-easy {
  background-color: #a3e635; /* Un verde más claro para el fondo del círculo */
/* border-color: #84cc16;
}

.map-marker-medium {
  background-color: #fcd34d; /* Amarillo más claro */
/* border-color: #fbbf24;
}

.map-marker-hard {
  background-color: #ef4444; /* Rojo más claro */
/* border-color: #dc2626;
}

.map-marker:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
  z-index: 1000; /* Para que aparezca encima al hacer hover */
/*}
*/