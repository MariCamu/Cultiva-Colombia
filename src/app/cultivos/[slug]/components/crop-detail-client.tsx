
'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import type { CropTechnicalSheet, CultivationMethod, LifeCycleStage } from '@/lib/crop-data-structure';
import type { Article } from '@/models/article-model';
import { doc, getDoc, collection, query, where, getDocs, documentId } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ChevronRight, Sprout, Thermometer, Droplets, Sun, Beaker, Users, ShieldAlert, BookOpen, Tractor, MapPin, Info, ExternalLink, PlusCircle, AlertCircle, Check, Recycle, AlertTriangle, Clock, Target, StepForward, Bug, ChevronLeftCircle, ChevronRightCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useAuth } from '@/context/auth-context';
import type { SampleCrop } from '@/models/crop-model';
import { AddCropDialog } from '../../components/add-crop-dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { Pest } from '@/models/pest-model';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

// Helper to make technical terms more human-readable
const humanizeTerm = (term: string | null | undefined) => {
    if (!term) return '';
    const formatted = term.replace(/_/g, ' ');
    // Capitalize only if it's not a single word (like 'Jardín')
    if (formatted.includes(' ') || formatted.toLowerCase() === 'jardín') {
        return formatted.replace(/\b\w/g, char => char.toUpperCase());
    }
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};


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
  commonPests: Pest[];
}

// --- CARD COMPONENTS ---

const ItemCard = ({ item }: { item: SimplifiedItem }) => (
  <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow w-56 sm:w-64 flex-shrink-0">
     {item.imageUrl.includes('placehold.co') ? (
        <div className="w-full h-32 bg-primary/10 flex items-center justify-center">
            <BookOpen className="h-12 w-12 text-primary/50" />
        </div>
    ) : (
        <Image
            src={item.imageUrl}
            alt={`Imagen para ${item.name}`}
            width={400}
            height={250}
            className="w-full h-32 object-cover"
            data-ai-hint={item.dataAiHint || 'crop field'}
        />
    )}
    <CardHeader className="flex-grow p-4">
      <CardTitle className="text-md font-nunito font-bold line-clamp-2">{item.name}</CardTitle>
    </CardHeader>
    <CardContent className="p-4 pt-0">
      <Button asChild variant="outline" size="sm">
        <Link href={`${item.slug}`}>
            Ver Más <ExternalLink className="ml-2 h-3 w-3" />
        </Link>
      </Button>
    </CardContent>
  </Card>
);

const HorizontalScroller = ({ items, title, icon: Icon }: { items: SimplifiedItem[], title: string, icon: React.ElementType }) => {
    if (items.length === 0) return null;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    <Icon className="h-5 w-5" />
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea>
                    <div className="flex space-x-4 pb-4">
                        {items.map(c => <ItemCard key={c.id} item={c} />)}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </CardContent>
        </Card>
    );
};


const MethodCard = ({ method }: { method: CultivationMethod }) => (
  <Card className="bg-background/50">
     <Accordion type="single" collapsible defaultValue="item-1">
        {method.pasos.sort((a, b) => (a.orden || 0) - (b.orden || 0)).map((paso, index) => (
          <AccordionItem value={`item-${index + 1}`} key={index}>
            <AccordionTrigger className="text-xl px-6 py-4">
                <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 bg-primary/10 text-primary font-bold rounded-full h-10 w-10 flex items-center justify-center text-lg">{paso.orden || index + 1}</div>
                    <span className="font-nunito font-bold text-left">{paso.titulo}</span>
                </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
                 <div className="space-y-4 prose prose-sm dark:prose-invert max-w-none prose-p:font-sans">
                    <p className="text-base">{paso.descripcion}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
                        {paso.tiempo_dias && (
                             <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                                <Clock className="h-5 w-5 text-primary mt-1 flex-shrink-0"/>
                                <div>
                                    <p className="font-nunito font-semibold">Tiempo estimado</p>
                                    <p className="text-muted-foreground">{paso.tiempo_dias} días</p>
                                </div>
                            </div>
                        )}
                        {paso.indicadores && (
                            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                                <Target className="h-5 w-5 text-primary mt-1 flex-shrink-0"/>
                                <div>
                                    <p className="font-nunito font-semibold">Indicadores de éxito</p>
                                    <p className="text-muted-foreground">{paso.indicadores}</p>
                                </div>
                            </div>
                        )}
                        {paso.materiales_paso && paso.materiales_paso.length > 0 && (
                             <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                                <Recycle className="h-5 w-5 text-primary mt-1 flex-shrink-0"/>
                                <div>
                                    <p className="font-nunito font-semibold">Materiales recomendados</p>
                                    <ul className="list-disc list-inside text-muted-foreground">
                                        {paso.materiales_paso.map((mat, i) => <li key={i}>{mat}</li>)}
                                    </ul>
                                </div>
                            </div>
                        )}
                         {paso.evitar && (
                             <div className="flex items-start gap-3 p-3 bg-red-500/10 rounded-lg text-red-800 dark:text-red-300">
                                <AlertTriangle className="h-5 w-5 mt-1 flex-shrink-0"/>
                                <div>
                                    <p className="font-nunito font-semibold">¡A evitar!</p>
                                    <p>{paso.evitar}</p>
                                </div>
                            </div>
                        )}
                    </div>
                 </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
  </Card>
);

const LifeCycleCard = ({ stages }: { stages: LifeCycleStage[] }) => {
    if (!stages || stages.length === 0) return null;

    const sortedStages = stages.sort((a, b) => a.orden - b.orden);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2"><Sprout className="h-5 w-5 text-primary"/>Ciclo de Vida del Cultivo</CardTitle>
                <CardDescription>Despliega cada etapa para ver los detalles, labores y posibles alertas.</CardDescription>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full">
                    {sortedStages.map((stage, index) => (
                        <AccordionItem value={`stage-${index}`} key={index}>
                            <AccordionTrigger className="text-xl">
                                <div className="flex items-center gap-4">
                                    <div className="flex-shrink-0 bg-primary/10 text-primary font-bold rounded-full h-10 w-10 flex items-center justify-center text-lg">{stage.orden}</div>
                                    <div className="text-left">
                                        <p className="font-nunito font-bold">{stage.etapa}</p>
                                        <p className="text-sm font-sans font-normal text-muted-foreground">Duración: {stage.duracion_dias_tipico} días aprox.</p>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="space-y-4">
                               <p className="text-base text-muted-foreground">{stage.notas}</p>
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                   <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                                        <StepForward className="h-5 w-5 text-primary mt-1 flex-shrink-0"/>
                                        <div>
                                            <p className="font-nunito font-semibold">Labores Principales</p>
                                            <ul className="list-disc list-inside text-muted-foreground text-sm">
                                                {stage.labores.map((labor, i) => <li key={i}>{labor}</li>)}
                                            </ul>
                                        </div>
                                    </div>
                                    {stage.alertas_plagas && (Array.isArray(stage.alertas_plagas) ? stage.alertas_plagas.length > 0 : stage.alertas_plagas) &&
                                        <div className="flex items-start gap-3 p-3 bg-destructive/10 rounded-lg text-destructive">
                                            <AlertTriangle className="h-5 w-5 mt-1 flex-shrink-0"/>
                                            <div>
                                                <p className="font-nunito font-semibold">Alertas Comunes</p>
                                                <p className="text-sm">{Array.isArray(stage.alertas_plagas) ? stage.alertas_plagas.map(p => humanizeTerm(p)).join(', ') : humanizeTerm(stage.alertas_plagas as string)}</p>
                                            </div>
                                        </div>
                                    }
                               </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
    );
};


export function CropDetailClient({
  crop,
  sampleCrop,
  compatibleCrops,
  incompatibleCrops,
  relatedArticles,
  commonPests,
}: CropDetailClientProps) {
  const { user, userProfile } = useAuth();
  
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
        <div className="space-y-4 md:order-1">
          <h1 className="text-4xl font-nunito font-extrabold tracking-tight lg:text-5xl">{crop.nombre}</h1>
          <p className="text-xl text-muted-foreground font-sans italic">{crop.nombreCientifico}</p>
          <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{crop.tipo_planta}</Badge>
              <Badge variant="secondary">{crop.dificultad}</Badge>
              {crop.clima.clase.map(c => <Badge key={c} variant="secondary">{humanizeTerm(c)}</Badge>)}
          </div>
          <p className="text-lg text-muted-foreground">{crop.descripcion}</p>
        </div>
        <div className="md:order-2">
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
               <Tabs defaultValue={crop.metodos[0].id} className="w-full">
                <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3">
                    {crop.metodos.map(method => (
                        <TabsTrigger key={method.id} value={method.id}>{humanizeTerm(method.nombre)}</TabsTrigger>
                    ))}
                </TabsList>
                 {crop.metodos.map(method => (
                    <TabsContent key={method.id} value={method.id} className="mt-4">
                        <MethodCard method={method} />
                    </TabsContent>
                ))}
              </Tabs>
          </div>
      )}


      <div>
        <h2 className="text-3xl font-nunito font-bold text-center mb-6">Información Adicional</h2>
        <Accordion type="multiple" defaultValue={["item-1", "item-2", "item-3", "item-4"]} className="w-full">
            <AccordionItem value="item-1">
                <AccordionTrigger className="text-xl">Datos Técnicos y Ciclo de Vida</AccordionTrigger>
                <AccordionContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Datos Técnicos Clave</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="flex items-start gap-3 col-span-1 sm:col-span-2">
                                    <Droplets className="h-6 w-6 text-muted-foreground flex-shrink-0 mt-1"/>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Riego</p>
                                        <p className="font-sans text-base">{crop.tecnica.riego}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Thermometer className="h-6 w-6 text-muted-foreground flex-shrink-0 mt-1"/>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Temperatura Ideal</p>
                                        <p className="font-semibold">{crop.tecnica.temperatura_ideal}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Sun className="h-6 w-6 text-muted-foreground flex-shrink-0 mt-1"/>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Luz Solar</p>
                                        <p className="font-semibold">{crop.tecnica.luz_solar}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 col-span-1 sm:col-span-2">
                                    <Beaker className="h-6 w-6 text-muted-foreground flex-shrink-0 mt-1"/>
                                    <div>
                                        <p className="text-sm text-muted-foreground">pH del Suelo</p>
                                        <p className="font-semibold">{crop.tecnica.ph_suelo}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <LifeCycleCard stages={crop.cicloVida} />
                    </div>
                </AccordionContent>
            </AccordionItem>
            {commonPests.length > 0 && (
                 <AccordionItem value="item-4">
                    <AccordionTrigger className="text-xl">Plagas y Enfermedades Comunes</AccordionTrigger>
                    <AccordionContent>
                        <Card className="mt-4">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2"><Bug className="h-5 w-5 text-red-600"/>Amenazas Comunes</CardTitle>
                                <CardDescription>Estas son algunas de las plagas y enfermedades que afectan comúnmente a este cultivo. Haz clic para aprender a prevenirlas y tratarlas.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                {commonPests.map(pest => (
                                     <Link href={`/sanidad-vegetal/${pest.slug}`} key={pest.id} className="group">
                                        <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                                            <Image
                                                src={pest.imageUrl}
                                                alt={pest.nombreComun}
                                                width={150}
                                                height={100}
                                                className="w-full h-24 object-cover"
                                                data-ai-hint={pest.dataAiHint}
                                            />
                                            <CardHeader className="p-3">
                                                <CardTitle className="text-sm font-nunito font-bold group-hover:text-primary transition-colors">{pest.nombreComun}</CardTitle>
                                            </CardHeader>
                                        </Card>
                                    </Link>
                                ))}
                            </CardContent>
                        </Card>
                    </AccordionContent>
                </AccordionItem>
            )}
            <AccordionItem value="item-2">
                <AccordionTrigger className="text-xl">Asociaciones y Regiones</AccordionTrigger>
                <AccordionContent>
                     <div className="space-y-8 mt-4">
                        <HorizontalScroller 
                            items={compatibleCrops.map(c => ({...c, slug: `/cultivos/${c.slug}`}))}
                            title="Cultivos Amigables"
                            icon={Users}
                        />
                         <HorizontalScroller 
                            items={incompatibleCrops.map(c => ({...c, slug: `/cultivos/${c.slug}`}))}
                            title="Cultivos a Evitar"
                            icon={ShieldAlert}
                        />
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
                <AccordionTrigger className="text-xl">Artículos y Guías Relacionados</AccordionTrigger>
                <AccordionContent>
                     <HorizontalScroller 
                        items={relatedArticles}
                        title="Para Aprender Más"
                        icon={BookOpen}
                    />
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

    