
"use client";

import { useState, useEffect, useMemo } from 'react';
import { db } from '@/lib/firebase';
import type { Pest } from '@/models/pest-model';
import { collection, getDocs, query } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Search, Info, Bug, ShieldCheck, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { SampleCrop } from '@/models/crop-model';

async function getPests(): Promise<Pest[]> {
    const pestsCollectionRef = collection(db, 'plagas_y_enfermedades');
    const q = query(pestsCollectionRef);
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        slug: doc.id,
        ...data
      } as Pest;
    });
}

async function getCrops(): Promise<SampleCrop[]> {
    const cropsCollectionRef = collection(db, 'fichas_tecnicas_cultivos');
    const q = query(cropsCollectionRef);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, name: doc.data().nombre } as SampleCrop));
}


const normalizeText = (text: string) => {
    if (!text) return '';
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
};

export default function SanidadVegetalPage() {
    const [pests, setPests] = useState<Pest[]>([]);
    const [crops, setCrops] = useState<SampleCrop[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCrop, setSelectedCrop] = useState('all');

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [fetchedPests, fetchedCrops] = await Promise.all([getPests(), getCrops()]);
                setPests(fetchedPests);
                setCrops(fetchedCrops.sort((a, b) => a.name.localeCompare(b.name)));
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("No se pudieron cargar los datos. Revisa las reglas de seguridad de Firestore y la conexión a internet.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredPests = useMemo(() => {
        return pests.filter(pest => {
            const matchesCrop = selectedCrop === 'all' || pest.cultivosAfectados?.includes(selectedCrop);
            const matchesSearch = searchQuery.toLowerCase() === '' ||
                normalizeText(pest.nombreComun).includes(normalizeText(searchQuery));
            return matchesCrop && matchesSearch;
        }).sort((a, b) => a.nombreComun.localeCompare(b.nombreComun));
    }, [pests, searchQuery, selectedCrop]);
    
    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Card key={i}>
                            <Skeleton className="h-48 w-full" />
                            <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
                            <CardContent><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-5/6 mt-2" /></CardContent>
                            <CardFooter><Skeleton className="h-10 w-28" /></CardFooter>
                        </Card>
                    ))}
                </div>
            )
        }

        if (error) {
            return <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>;
        }
        
        if (pests.length === 0) {
            return (
                 <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Sección en Construcción</AlertTitle>
                    <AlertDescription>
                        Aún no se han añadido plagas o enfermedades a la base de datos. Una vez que los añadas, aparecerán aquí.
                    </AlertDescription>
                </Alert>
            );
        }

        if (filteredPests.length === 0) {
             return (
                 <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>No se encontraron resultados</AlertTitle>
                    <AlertDescription>
                        No se encontraron plagas o enfermedades que coincidan con tu búsqueda. Prueba a cambiar los filtros.
                    </AlertDescription>
                </Alert>
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPests.map(pest => (
                    <Card key={pest.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                        <Image
                            src={pest.imageUrl}
                            alt={`Imagen de ${pest.nombreComun}`}
                            width={400}
                            height={250}
                            className="w-full h-48 object-cover"
                            data-ai-hint={pest.dataAiHint}
                        />
                        <CardHeader>
                            <CardTitle className="text-xl font-nunito font-bold flex items-center gap-2">
                                <Bug className="h-5 w-5 text-primary" /> {pest.nombreComun}
                            </CardTitle>
                            <Badge variant={pest.tipo.toLowerCase().includes('insecto') ? 'destructive' : 'secondary'} className="w-fit capitalize">{pest.tipo}</Badge>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p className="text-sm text-muted-foreground line-clamp-3">{pest.descripcion}</p>
                        </CardContent>
                        <CardFooter>
                             <Button asChild variant="outline" size="sm">
                                <Link href={`/sanidad-vegetal/${pest.slug}`}>
                                    Ver Ficha Completa <ExternalLink className="ml-2 h-4 w-4" />
                                </Link>
                             </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-nunito font-bold tracking-tight text-foreground sm:text-4xl">
                    Sanidad Vegetal: Plagas y Enfermedades
                </h1>
                <p className="mt-2 max-w-2xl mx-auto text-lg text-muted-foreground">
                    Una guía para identificar, prevenir y tratar los problemas más comunes en tus cultivos de forma orgánica.
                </p>
            </div>

            <Card className="p-4 sm:p-6 shadow-lg bg-card/50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                        <label htmlFor="search-pest" className="sr-only">Buscar amenaza</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                id="search-pest"
                                type="text"
                                placeholder="Buscar por nombre (ej: Pulgón, Mildiu...)"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 h-11"
                            />
                        </div>
                    </div>
                    <div>
                         <label htmlFor="crop-filter" className="sr-only">Filtrar por cultivo afectado</label>
                         <Select value={selectedCrop} onValueChange={setSelectedCrop} disabled={isLoading || crops.length === 0}>
                            <SelectTrigger id="crop-filter" className="h-11">
                                <SelectValue placeholder="Filtrar por cultivo afectado..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los Cultivos</SelectItem>
                                {crops.map(crop => (
                                    <SelectItem key={crop.id} value={crop.id}>{crop.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </Card>
            
            <div className="mt-6">
                {renderContent()}
            </div>

        </div>
    );
}
