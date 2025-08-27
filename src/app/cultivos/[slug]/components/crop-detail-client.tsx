
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import type { CropTechnicalSheet, CultivationMethod } from '@/lib/crop-data-structure';
import type { Article } from '@/models/article-model';
import { doc, getDoc, collection, query, where, getDocs, documentId } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ChevronRight, Sprout, Thermometer, Droplets, Sun, Beaker, Users, ShieldAlert, BookOpen, Tractor, MapPin, Info, ExternalLink, PlusCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useAuth } from '@/context/auth-context';
import type { SampleCrop } from '@/models/crop-model';
import { AddCropDialog } from '../../components/add-crop-dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface SimplifiedItem {
    id: string;
    slug: string;
    name: string;
    imageUrl: string;
    summary?: string; // For articles
    dataAiHint?: string; // For articles
}

interface CropDetailClientProps {
  crop: CropTechnicalSheet;
  sampleCrop: SampleCrop;
  compatibleCrops: SimplifiedItem[];
  incompatibleCrops: SimplifiedItem[];
  relatedArticles: SimplifiedItem[];
}

// --- CARD COMPONENTS ---

const ItemCard = ({ item, type }: { item: SimplifiedItem; type: 'crop' | 'article' }) => (
  <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
    <Image
      src={item.imageUrl}
      alt={`Imagen para ${item.name}`}
      width={400}
      height={250}
      className="w-full h-32 object-cover"
      data-ai-hint={item.dataAiHint || 'crop field'}
    />
    <CardHeader className="flex-grow p-4">
      <CardTitle className="text-md font-nunito font-bold">{item.name}</CardTitle>
    </CardHeader>
    <CardContent className="p-4 pt-0">
      <Button asChild variant="outline" size="sm">
        <Link href={`/${type === 'crop' ? 'cultivos' : 'articulos'}/${item.slug}`}>
            {type === 'crop' ? 'Ver Ficha' : 'Leer Más'} <ExternalLink className="ml-2 h-3 w-3" />
        </Link>
      </Button>
    </CardContent>
  </Card>
);

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
        {method.pasos.sort((a, b) => (a.orden || 0) - (b.orden || 0)).map((paso, index) => (
          <li key={index} className="flex items-start gap-4">
            <div className="flex-shrink-0 bg-primary/10 text-primary font-bold rounded-full h-8 w-8 flex items-center justify-center text-lg">{(paso.orden || index + 1)}</div>
            <div className="flex-grow">
                <p className="font-nunito font-bold">{paso.titulo}</p>
                <p className="text-muted-foreground pt-1">{paso.descripcion || ''}</p>
            </div>
          </li>
        ))}
      </ol>
    </CardContent>
  </Card>
);

export function CropDetailClient({
  crop,
  sampleCrop,
  compatibleCrops,
  incompatibleCrops,
  relatedArticles,
}: CropDetailClientProps) {
  const { user, userProfile } = useAuth();
  
  const dataTecnicos = [
      { icon: Droplets, label: "Riego", value: crop.tecnica.riego },
      { icon: Thermometer, label: "Temperatura Ideal", value: crop.tecnica.temperatura_ideal },
      { icon: Sun, label: "Luz Solar", value: crop.tecnica.luz_solar },
      { icon: Beaker, label: "pH del Suelo", value: crop.tecnica.ph_suelo },
  ];

  const mainImage = crop.imagenes?.[0];

  const userRegion = userProfile?.region;
  const isCropInUserRegion = userRegion && crop.region.principal.map(r => r.toLowerCase()).includes(userRegion.toLowerCase());

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
          <p className="text-xl text-muted-foreground font-sans italic">{crop.nombreCientifico}</p>
          <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{crop.tipo_planta}</Badge>
              <Badge variant="secondary">{crop.dificultad}</Badge>
              {crop.clima.clase.map(c => <Badge key={c} variant="secondary">{c}</Badge>)}
          </div>
          <p className="text-lg text-muted-foreground">{crop.descripcion}</p>
        </div>
        <div>
          {mainImage && (
            <Image
              src={mainImage.url}
              alt={`Imagen de ${crop.nombre}`}
              width={600}
              height={400}
              className="w-full h-auto object-cover rounded-xl shadow-lg"
              priority
            />
          )}
          {mainImage?.atribucion?.text && mainImage?.atribucion?.link && (
            <p className="text-xs text-muted-foreground text-right mt-2 pr-2">
              Foto por <a href={mainImage.atribucion.link} target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-primary">{mainImage.atribucion.text}</a>
            </p>
          )}
        </div>
      </div>
      
      {crop.metodos && crop.metodos.length > 0 && (
          <div className="space-y-6">
              <h2 className="text-3xl font-nunito font-bold text-center">Guía de Cultivo Paso a Paso</h2>
              {crop.metodos.map(method => (
                  <MethodCard key={method.nombre} method={method} />
              ))}
          </div>
      )}


      <div>
        <h2 className="text-3xl font-nunito font-bold text-center mb-6">Información Adicional</h2>
        <Accordion type="multiple" defaultValue={["item-1", "item-2", "item-3"]} className="w-full">
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
                                    {crop.cicloVida.sort((a, b) => a.orden - b.orden).map((etapa, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <div className="flex-shrink-0 bg-primary/10 text-primary font-bold rounded-full h-6 w-6 flex items-center justify-center text-xs">{etapa.orden}</div>
                                            <div>
                                                <p className="font-semibold">{etapa.etapa} <span className="text-muted-foreground font-normal">({etapa.duracion_dias_tipico} días)</span></p>
                                                <p className="text-sm text-muted-foreground">{etapa.notas}</p>
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
                <AccordionTrigger className="text-xl">Asociaciones y Regiones</AccordionTrigger>
                <AccordionContent>
                     <div className="space-y-8 mt-4">
                        {compatibleCrops.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2"><Users className="h-5 w-5 text-green-600"/>Cultivos Amigables</CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {compatibleCrops.map(c => <ItemCard key={c.id} item={c} type="crop" />)}
                                </CardContent>
                            </Card>
                        )}
                         {incompatibleCrops.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2"><ShieldAlert className="h-5 w-5 text-red-600"/>Cultivos a Evitar</CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                     {incompatibleCrops.map(c => <ItemCard key={c.id} item={c} type="crop" />)}
                                </CardContent>
                            </Card>
                        )}
                         <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2"><MapPin className="h-5 w-5 text-blue-600"/>Regiones Principales</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {crop.region.principal.map(region => <Badge key={region} variant="outline" className="bg-blue-100 text-blue-800">{region}</Badge>)}
                                </div>
                                {userRegion && !isCropInUserRegion && (
                                    <Alert variant="destructive" className="mt-4">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertTitle>¡Atención!</AlertTitle>
                                        <AlertDescription>
                                            Este cultivo no es ideal para tu región principal registrada ({userRegion}). Podría requerir cuidados especiales.
                                        </AlertDescription>
                                    </Alert>
                                )}
                                <div className="mt-4 text-sm text-muted-foreground flex items-start gap-2">
                                    <Info className="h-4 w-4 mt-0.5 flex-shrink-0"/>
                                    <p>{crop.region.nota}</p>
                                </div>
                            </CardContent>
                        </Card>
                     </div>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
                <AccordionTrigger className="text-xl">Artículos Relacionados</AccordionTrigger>
                <AccordionContent>
                     <Card className="mt-4">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2"><BookOpen className="h-5 w-5 text-amber-600"/>Artículos para Aprender Más</CardTitle>
                        </CardHeader>
                        <CardContent>
                             {relatedArticles.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                     {relatedArticles.map(a => <ItemCard key={a.id} item={a} type="article" />)}
                                </div>
                            ) : (
                                <p className="text-muted-foreground text-sm">No hay artículos relacionados para este cultivo todavía.</p>
                            )}
                        </CardContent>
                    </Card>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
      </div>

      <Card className="text-center p-6 shadow-lg bg-primary/10">
        <CardHeader>
            <CardTitle className="text-2xl font-nunito font-bold">¿Listo para empezar a cultivar?</CardTitle>
            <CardDescription>Añade este cultivo a tu dashboard personal para hacer un seguimiento detallado de su progreso.</CardDescription>
        </CardHeader>
        <CardContent>
            {sampleCrop && (
                 <AddCropDialog crop={sampleCrop}>
                    <Button size="lg">
                        <PlusCircle className="mr-2 h-5 w-5" />
                        Añadir a Mi Dashboard
                    </Button>
                 </AddCropDialog>
            )}
        </CardContent>
      </Card>
    </article>
  );
}
