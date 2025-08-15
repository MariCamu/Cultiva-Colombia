
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/lib/firebase';
import type { CropTechnicalSheet, CultivationMethod } from '@/lib/crop-data-structure';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ChevronRight, Sprout, Thermometer, Droplets, Sun, Beaker, Users, ShieldAlert, BookOpen, Tractor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';


interface CropDetailPageProps {
  params: {
    slug: string;
  };
}

async function getCropBySlug(slug: string): Promise<CropTechnicalSheet | null> {
  const cropsCollectionRef = collection(db, 'fichas_tecnicas_cultivos');
  const q = query(cropsCollectionRef, where('slug', '==', slug));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return null;
  }

  const doc = querySnapshot.docs[0];
  const data = doc.data() as CropTechnicalSheet;

  return {
    id: doc.id,
    ...data,
  };
}

const MethodCard = ({ method }: { method: CultivationMethod }) => (
  <Card className="bg-background/50">
    <CardHeader>
      <CardTitle className="text-xl flex items-center gap-3">
        <Tractor className="h-6 w-6 text-primary" />
        {method.nombre}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <ol className="space-y-4">
        {method.pasos.map((paso, index) => (
          <li key={index} className="flex items-start gap-4">
            <div className="flex-shrink-0 bg-primary/10 text-primary font-bold rounded-full h-8 w-8 flex items-center justify-center text-lg">{index + 1}</div>
            <p className="text-muted-foreground pt-1">{paso.descripcion}</p>
          </li>
        ))}
      </ol>
    </CardContent>
  </Card>
);


export default function CropDetailPage({ params }: CropDetailPageProps) {
  const [crop, setCrop] = useState<CropTechnicalSheet | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCrop = async () => {
      setIsLoading(true);
      const fetchedCrop = await getCropBySlug(params.slug);
      if (!fetchedCrop) {
        notFound();
      } else {
        setCrop(fetchedCrop);
      }
      setIsLoading(false);
    };

    fetchCrop();
  }, [params.slug]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <Skeleton className="h-10 w-48 mb-4" />
        <Skeleton className="h-12 w-3/4 mb-6" />
        <Skeleton className="w-full h-[400px] rounded-xl mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!crop) {
    return null; // notFound() is called in useEffect
  }
  
  const dataTecnicos = [
      { icon: Droplets, label: "Riego", value: crop.datos_tecnicos.riego },
      { icon: Thermometer, label: "Temperatura Ideal", value: crop.datos_tecnicos.temperatura_ideal },
      { icon: Sun, label: "Luz Solar", value: crop.datos_tecnicos.luz_solar },
      { icon: Beaker, label: "pH del Suelo", value: crop.datos_tecnicos.ph_suelo },
  ]

  return (
    <article className="max-w-5xl mx-auto space-y-10">
      <nav className="hidden md:flex items-center text-sm font-medium text-muted-foreground mb-4">
        <Link href="/cultivos" className="hover:text-primary">Cultivos</Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <span className="text-foreground truncate">{crop.nombre}</span>
      </nav>
      <Button asChild variant="ghost" className="md:hidden mb-4 -ml-4">
        <Link href="/cultivos">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a todos los cultivos
        </Link>
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="space-y-4">
          <h1 className="text-4xl font-nunito font-extrabold tracking-tight lg:text-5xl">{crop.nombre}</h1>
          <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{crop.tipo_planta}</Badge>
              <Badge variant="secondary">{crop.dificultad}</Badge>
              <Badge variant="secondary">{crop.clima}</Badge>
          </div>
          <p className="text-lg text-muted-foreground">{crop.descripcion_general}</p>
        </div>
        <Image
          src={crop.imagen_url}
          alt={`Imagen de ${crop.nombre}`}
          width={600}
          height={400}
          className="w-full h-auto object-cover rounded-xl shadow-lg"
          priority
        />
      </div>
      
      {crop.metodos_cultivo && crop.metodos_cultivo.length > 0 && (
          <div className="space-y-6">
              <h2 className="text-3xl font-nunito font-bold text-center">Guía de Cultivo Paso a Paso</h2>
              {crop.metodos_cultivo.map(method => (
                  <MethodCard key={method.nombre} method={method} />
              ))}
          </div>
      )}


      <div>
        <h2 className="text-3xl font-nunito font-bold text-center mb-6">Información Adicional</h2>
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
                <AccordionTrigger className="text-xl">Datos Técnicos y Ciclo de Vida</AccordionTrigger>
                <AccordionContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2"><Sprout className="h-5 w-5 text-primary"/>Ciclo de Vida</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3">
                                    {crop.ciclo_vida.map((etapa, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <div className="flex-shrink-0 bg-primary/10 text-primary font-bold rounded-full h-6 w-6 flex items-center justify-center text-xs">{i+1}</div>
                                            <div>
                                                <p className="font-semibold">{etapa.etapa} <span className="text-muted-foreground font-normal">({etapa.duracion})</span></p>
                                                <p className="text-sm text-muted-foreground">{etapa.descripcion}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle className="text-lg">Datos Técnicos</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 gap-6">
                                {dataTecnicos.map(item => (
                                    <div key={item.label} className="flex items-center gap-3">
                                        <item.icon className="h-6 w-6 text-muted-foreground"/>
                                        <div>
                                            <p className="text-sm text-muted-foreground">{item.label}</p>
                                            <p className="font-semibold">{item.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
                <AccordionTrigger className="text-xl">Asociaciones y Artículos</AccordionTrigger>
                <AccordionContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2"><Users className="h-5 w-5 text-green-600"/>Cultivos Amigables</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {crop.compatibilidades.map(compat => <Badge key={compat} variant="outline" className="bg-green-100 text-green-800">{compat}</Badge>)}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2"><ShieldAlert className="h-5 w-5 text-red-600"/>Cultivos a Evitar</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {crop.incompatibilidades.map(incompat => <Badge key={incompat} variant="outline" className="bg-red-100 text-red-800">{incompat}</Badge>)}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2"><BookOpen className="h-5 w-5 text-amber-600"/>Artículos Relacionados</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {crop.articulos_relacionados_ids.map(id => (
                                        <li key={id}>
                                            <Link href={`/articulos/${id.replace(/_/g, '-')}`} className="text-primary hover:underline text-sm font-semibold">
                                                {id.replace(/_/g, ' ').replace('articulo ', '')}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
      </div>

    </article>
  );
}
