
"use client";

import 'leaflet/dist/leaflet.css';
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import ReactDOMServer from 'react-dom/server';
import { LocateFixed, Filter, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from '@/lib/utils';

// Simple SVG icons for crops, designed to be bubbly
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


interface Crop {
  id: string;
  name: string;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'Hortaliza' | 'Fruta' | 'Aromática' | 'Grano';
  space: 'Maceta pequeña' | 'Maceta grande' | 'Jardín';
  position: [number, number];
  icon: React.ElementType;
}

// Positions are now [lat, lng] for Colombia
const mapCropsData: Crop[] = [
  { id: '1', name: 'Lechuga (Andina)', difficulty: 'easy', type: 'Hortaliza', space: 'Maceta pequeña', position: [4.6, -74.08], icon: LeafIcon },
  { id: '2', name: 'Café de Altura (Eje Cafetero)', difficulty: 'hard', type: 'Fruta', space: 'Jardín', position: [4.8, -75.7], icon: CoffeeIcon },
  { id: '3', name: 'Maíz (Valle del Cauca)', difficulty: 'medium', type: 'Grano', space: 'Jardín', position: [3.4, -76.5], icon: CornIcon },
  { id: '4', name: 'Tomate Cherry (Boyacá)', difficulty: 'easy', type: 'Hortaliza', space: 'Maceta grande', position: [5.5, -73.3], icon: LeafIcon },
  { id: '5', name: 'Cilantro (Caribe)', difficulty: 'easy', type: 'Aromática', space: 'Maceta pequeña', position: [10.9, -74.7], icon: LeafIcon },
  { id: '6', name: 'Mango (Caribe)', difficulty: 'medium', type: 'Fruta', space: 'Jardín', position: [11.0, -74.2], icon: LeafIcon },
];

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
        className: '', // Important to leave this empty
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -20],
    });
};

export function InteractiveMap() {
    const [typeFilter, setTypeFilter] = useState<string>('all');
    const [spaceFilter, setSpaceFilter] = useState<string>('all');
    const [filteredCrops, setFilteredCrops] = useState<Crop[]>(mapCropsData);

    const handleFilterChange = () => {
        let crops = mapCropsData;
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
        setFilteredCrops(mapCropsData);
    };
    
    // Trigger filter on change
    useEffect(() => {
        handleFilterChange();
    }, [typeFilter, spaceFilter]);


  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Main Map Content */}
        <div className="lg:col-span-2 w-full">
            <Card className="h-[600px] w-full relative overflow-hidden shadow-lg bg-primary/5 p-0 border-0">
                <MapContainer center={[4.5709, -74.2973]} zoom={6} scrollWheelZoom={true} className="h-full w-full rounded-lg">
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {filteredCrops.map(crop => (
                        <Marker key={crop.id} position={crop.position} icon={createCropIcon(crop)}>
                            <Popup>
                                <div className="font-nunito font-bold">{crop.name}</div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
                {/* Center on my location button */}
                <Button variant="default" size="sm" className="absolute bottom-4 left-4 z-[401] shadow-lg">
                    <LocateFixed className="mr-2 h-4 w-4" />
                    Centrar en mi ubicación
                </Button>
            </Card>
        </div>

        {/* Sidebar Panel */}
        <div className="lg:col-span-1 w-full space-y-6">
            <Card className="shadow-lg bg-card">
                <CardHeader>
                    <CardTitle className="font-nunito font-bold">Leyenda del Mapa</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="h-4 w-4 rounded-full bg-green-600 border-2 border-white shadow"></div>
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
        </div>
    </div>
  );
}
