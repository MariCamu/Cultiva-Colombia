
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import type { Pest } from '@/models/pest-model';
import { doc, getDoc, collection, query, where, getDocs, documentId } from 'firebase/firestore';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ChevronRight, Bug, ShieldCheck, Leaf, Microscope, ExternalLink, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface PestPageProps {
  params: {
    slug: string;
  };
}

interface SimplifiedCropItem {
    id: string;
    slug: string;
    name: string;
    imageUrl: string;
}

async function getPest(slug: string): Promise<Pest | null> {
  const docRef = doc(db, 'plagas_y_enfermedades', slug);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }
  
  const data = docSnap.data();
  return {
    id: docSnap.id,
    slug: docSnap.id,
    ...data
  } as Pest;
}

async function getAffectedCrops(cropSlugs: string[]): Promise<SimplifiedCropItem[]> {
  if (!cropSlugs || cropSlugs.length === 0) return [];
  const cropsRef = collection(db, 'fichas_tecnicas_cultivos');
  const q = query(cropsRef, where(documentId(), 'in', cropSlugs));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      slug: doc.id,
      name: data.nombre,
      imageUrl: data.imagenes?.[0]?.url || 'https://placehold.co/300x200',
    };
  });
}


export default function PestPage({ params }: PestPageProps) {
  const [pest, setPest] = useState<Pest | null>(null);
  const [affectedCrops, setAffectedCrops] = useState<SimplifiedCropItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPestData = async () => {
      setIsLoading(true);
      const fetchedPest = await getPest(params.slug);
      
      if (!fetchedPest) {
        notFound();
      } else {
        setPest(fetchedPest);
        if (fetchedPest.cultivosAfectados && fetchedPest.cultivosAfectados.length > 0) {
            const crops = await getAffectedCrops(fetchedPest.cultivosAfectados);
            setAffectedCrops(crops);
        }
      }
      setIsLoading(false);
    };

    fetchPestData();
  }, [params.slug]);

  if (isLoading) {
    return (
        <article className="max-w-4xl mx-auto space-y-8">
            <Skeleton className="h-8 w-48 mb-4" />
            <Skeleton className="h-12 w-3/4 mb-6" />
            <Skeleton className="h-6 w-full mb-8" />
            <Skeleton className="w-full h-[400px] rounded-xl mb-8" />
            <div className="space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-5/6" />
                <Skeleton className="h-6 w-full" />
            </div>
        </article>
    );
  }

  if (!pest) {
    return null; // notFound() is called in useEffect, this is for type safety
  }

  return (
    <article className="max-w-4xl mx-auto space-y-8">
        {/* Breadcrumbs & Back Button */}
        <div>
            <nav className="hidden md:flex items-center text-sm font-nunito font-medium text-muted-foreground mb-4">
                <Link href="/sanidad-vegetal" className="hover:text-primary">Sanidad Vegetal</Link>
                <ChevronRight className="h-4 w-4 mx-1" />
                <span className="text-foreground truncate">{pest.nombreComun}</span>
            </nav>
            <Button asChild variant="ghost" className="md:hidden mb-4 -ml-4">
            <Link href="/sanidad-vegetal">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a Sanidad Vegetal
            </Link>
            </Button>
        </div>
      
        {/* Header */}
        <div className="space-y-4">
            <h1 className="text-4xl font-nunito font-extrabold tracking-tight lg:text-5xl">{pest.nombreComun}</h1>
            {pest.nombreCientifico && <p className="text-xl text-muted-foreground font-sans italic">{pest.nombreCientifico}</p>}
            <Badge variant={pest.tipo.toLowerCase().includes('insecto') || pest.tipo.toLowerCase().includes('ácaro') ? 'destructive' : 'secondary'} className="text-base capitalize">{pest.tipo}</Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <Image
                src={pest.imageUrl}
                alt={`Imagen de ${pest.nombreComun}`}
                width={600}
                height={400}
                className="w-full h-auto object-cover rounded-xl shadow-lg"
                data-ai-hint={pest.dataAiHint}
                priority
            />
             <div className="space-y-6">
                <Card className="bg-card/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Microscope className="h-5 w-5 text-primary" />Descripción</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{pest.descripcion}</p>
                    </CardContent>
                </Card>
                <Card className="bg-destructive/5 border-destructive/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-destructive"><AlertTriangle className="h-5 w-5" />Daños Comunes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{pest.danos}</p>
                    </CardContent>
                </Card>
             </div>
        </div>

        {/* Prevention & Solution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-green-600" />Prevención</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        {Array.isArray(pest.prevencion) ? pest.prevencion.map((tip, index) => <li key={index}>{tip}</li>) : <li>{pest.prevencion}</li>}
                    </ul>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Bug className="h-5 w-5 text-red-600" />Solución Recomendada</CardTitle>
                </CardHeader>
                <CardContent>
                   <p className="text-muted-foreground">{pest.solucion}</p>
                </CardContent>
            </Card>
        </div>

        {/* Affected Crops */}
        {affectedCrops.length > 0 && (
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Leaf className="h-5 w-5 text-primary" />Cultivos Afectados Comúnmente</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {affectedCrops.map(crop => (
                        <Link href={`/cultivos/${crop.slug}`} key={crop.id} className="group">
                             <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                                <Image
                                    src={crop.imageUrl}
                                    alt={crop.name}
                                    width={150}
                                    height={100}
                                    className="w-full h-24 object-cover"
                                />
                                <CardHeader className="p-3">
                                    <CardTitle className="text-sm font-nunito font-bold group-hover:text-primary transition-colors">{crop.name}</CardTitle>
                                </CardHeader>
                            </Card>
                        </Link>
                    ))}
                </CardContent>
            </Card>
        )}
    </article>
  );
}
