
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import type { CropTechnicalSheet, CultivationMethod, LifeCycleStage } from '@/lib/crop-data-structure';
import type { Article } from '@/models/article-model';
import { doc, getDoc, collection, query, where, getDocs, documentId } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ChevronRight, Sprout, Thermometer, Droplets, Sun, Beaker, Users, ShieldAlert, BookOpen, Tractor, MapPin, Info, ExternalLink, PlusCircle, AlertCircle, Check, Recycle, AlertTriangle, Clock, Target, StepForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useAuth } from '@/context/auth-context';
import type { SampleCrop } from '@/models/crop-model';
import { AddCropDialog } from '../../components/add-crop-dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Helper to make technical terms more human-readable
const humanizeTerm = (term: string | null | undefined) => {
    if (!term) return '';
    const formatted = term.replace(/_/g, ' ');
    // Capitalize only if it's not a single word (like 'Jardín')
    if (formatted.includes(' ')) {
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

const LifeCycleTimeline = ({ stages }: { stages: LifeCycleStage[] }) => {
    if (!stages || stages.length === 0) return null;

    const sortedStages = stages.sort((a, b) => a.orden - b.orden);

    return (
        <TooltipProvider>
        <Card>
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2"><Sprout className="h-5 w-5 text-primary"/>Ciclo de Vida</CardTitle>
                <CardDescription>Pasa el mouse sobre cada etapa para ver los detalles.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="relative w-full py-4">
                    {/* Timeline bar */}
                    <div className="absolute left-0 top-1/2 w-full h-0.5 bg-border -translate-y-1/2"></div>
                    
                    <div className="relative flex justify-between">
                        {sortedStages.map((stage, index) => (
                            <Tooltip key={index}>
                                <TooltipTrigger asChild>
                                    <div className="relative z-10 flex flex-col items-center">
                                        <div className="h-5 w-5 bg-primary rounded-full border-2 border-background shadow-md flex items-center justify-center cursor-pointer hover:scale-125 transition-transform">
                                           <span className="text-xs font-bold text-primary-foreground">{stage.orden}</span>
                                        </div>
                                        <p className="text-xs mt-2 font-semibold text-center absolute top-full pt-1">{stage.etapa}</p>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent side="bottom" className="max-w-xs p-4">
                                    <div className="space-y-2">
                                        <p className="font-nunito font-bold text-base">{stage.orden}. {stage.etapa}</p>
                                        <p className="text-sm text-muted-foreground"><strong className="text-foreground">Duración:</strong> {stage.duracion_dias_tipico} días</p>
                                        <p className="text-sm text-muted-foreground"><strong className="text-foreground">Notas:</strong> {stage.notas}</p>
                                        <p className="text-sm text-muted-foreground"><strong className="text-foreground">Labores:</strong> {stage.labores.join(', ')}</p>
                                        {stage.alertas_plagas && (Array.isArray(stage.alertas_plagas) ? stage.alertas_plagas.length > 0 : stage.alertas_plagas) &&
                                            <p className="text-sm text-destructive"><strong className="text-destructive">Alertas:</strong> {Array.isArray(stage.alertas_plagas) ? stage.alertas_plagas.map(p => humanizeTerm(p)).join(', ') : humanizeTerm(stage.alertas_plagas as string)}</p>
                                        }
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
        </TooltipProvider>
    );
};


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
               <Tabs defaultValue={crop.metodos[0].id} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
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
        <Accordion type="multiple" defaultValue={["item-1", "item-2", "item-3"]} className="w-full">
            <AccordionItem value="item-1">
                <AccordionTrigger className="text-xl">Ciclo de Vida y Datos Técnicos</AccordionTrigger>
                <AccordionContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                        <LifeCycleTimeline stages={crop.cicloVida} />
                        <Card>
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
