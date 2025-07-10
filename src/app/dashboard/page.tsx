
'use client';

import { ProtectedRoute, useAuth } from '@/context/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { PlusCircle, Leaf, CalendarDays, Droplets, Sun, Wind, BookOpen, AlertTriangle, Sparkles, MessageSquarePlus, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { getCropDiseaseRemedySuggestions, type CropDiseaseRemedySuggestionsOutput } from '@/ai/flows/get-remedy-suggestions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';


// --- SIMULATED DATA ---
const userCrops = [
  {
    id: 'user_crop_1',
    name: 'Tomates Cherry',
    plantId: 'tomate_cherry_ejemplo', // To link back to a main crop database
    imageUrl: 'https://placehold.co/400x300.png',
    dataAiHint: 'cherry tomatoes',
    datePlanted: '2024-05-15',
    daysToHarvest: 60,
    progress: 45, // percentage
    nextTask: { name: 'Abonar', dueInDays: 3, icon: Droplets },
    lastNote: 'Aparecieron las primeras flores amarillas hoy.',
  },
  {
    id: 'user_crop_2',
    name: 'Lechuga Romana',
    plantId: 'lechuga_romana_ejemplo',
    imageUrl: 'https://placehold.co/400x300.png',
    dataAiHint: 'romaine lettuce',
    datePlanted: '2024-06-01',
    daysToHarvest: 50,
    progress: 30,
    nextTask: { name: 'Regar', dueInDays: 1, icon: Droplets },
    lastNote: 'Creciendo a buen ritmo, sin plagas visibles.',
  },
  {
    id: 'user_crop_3',
    name: 'Menta en Maceta',
    plantId: 'menta_ejemplo',
    imageUrl: 'https://placehold.co/400x300.png',
    dataAiHint: 'mint plant',
    datePlanted: '2024-04-20',
    daysToHarvest: 70, // Continuous harvest
    progress: 85,
    nextTask: { name: 'Cosechar', dueInDays: 0, icon: Leaf },
    lastNote: 'Lista para la primera cosecha grande.',
  }
];

const recommendedArticles = [
  { id: 1, title: 'Cómo prevenir el tizón en tomates', href: '/articulos/prevenir-tizon' },
  { id: 2, title: '5 abonos orgánicos que puedes hacer en casa', href: '/articulos/abonos-organicos' },
  { id: 3, title: 'El riego correcto para hortalizas de hoja', href: '/articulos/riego-hortalizas' },
];

function getTaskBadgeVariant(days: number) {
  if (days <= 1) return 'destructive';
  if (days <= 3) return 'secondary';
  return 'outline';
}

function DashboardContent() {
  const { user } = useAuth();
  const displayUser = user || { displayName: 'Agricultor(a)', email: 'tu@correo.com' };
  
  const [journalProblem, setJournalProblem] = useState('');
  const [journalCrop, setJournalCrop] = useState(userCrops[0]?.name || '');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<CropDiseaseRemedySuggestionsOutput | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  const handleAiHelp = async () => {
    if (!journalProblem || !journalCrop) {
      setAiError('Por favor, selecciona un cultivo y describe el problema.');
      return;
    }
    setIsAiLoading(true);
    setAiSuggestion(null);
    setAiError(null);
    try {
      const result = await getCropDiseaseRemedySuggestions({ cropName: journalCrop, diseaseName: journalProblem });
      setAiSuggestion(result);
    } catch (e) {
      console.error(e);
      setAiError('Hubo un error al consultar la IA. Inténtalo de nuevo.');
    } finally {
      setIsAiLoading(false);
    }
  };


  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-nunito font-bold tracking-tight text-foreground sm:text-4xl">
          Dashboard de {displayUser?.displayName || displayUser?.email}
        </h1>
        <p className="mt-2 text-lg text-muted-foreground font-sans">
          Tu centro de control para una cosecha exitosa.
        </p>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Main Content) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* My Crops Section */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Leaf className="h-7 w-7 text-primary" />
                Mis Cultivos Activos
              </CardTitle>
              <CardDescription>
                Registro y seguimiento del progreso de tus plantas.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {userCrops.length > 0 ? (
                userCrops.map(crop => (
                  <Card key={crop.id} className="grid md:grid-cols-3 gap-4 p-4 items-center bg-card/50">
                    <div className="md:col-span-1">
                      <Image
                        src={crop.imageUrl}
                        alt={crop.name}
                        width={400}
                        height={300}
                        className="rounded-lg object-cover aspect-[4/3]"
                        data-ai-hint={crop.dataAiHint}
                      />
                    </div>
                    <div className="md:col-span-2 space-y-3">
                      <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-nunito font-bold text-xl">{crop.name}</h3>
                            <p className="text-sm text-muted-foreground font-sans">Plantado el: {new Date(crop.datePlanted).toLocaleDateString()}</p>
                          </div>
                          <Badge variant={getTaskBadgeVariant(crop.nextTask.dueInDays)}>
                            {crop.nextTask.dueInDays === 0 ? 'Hoy' : `En ${crop.nextTask.dueInDays} días`}
                          </Badge>
                      </div>
                      <div>
                        <Label className="text-xs font-nunito font-semibold">Progreso a cosecha ({crop.daysToHarvest} días est.)</Label>
                        <Progress value={crop.progress} className="h-3 mt-1" />
                      </div>
                      <p className="text-sm font-sans italic text-muted-foreground">Última nota: "{crop.lastNote}"</p>
                      <div className="flex justify-between items-center pt-2 border-t">
                        <div className="flex items-center gap-2 text-sm font-nunito font-semibold">
                          <crop.nextTask.icon className="h-4 w-4 text-primary" />
                          <span>Próxima tarea: {crop.nextTask.name}</span>
                        </div>
                        <Button variant="outline" size="sm">Ver Diario</Button>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-10 border-2 border-dashed rounded-lg">
                  <p className="text-muted-foreground mb-4">Aún no has añadido ningún cultivo.</p>
                  <Button asChild><Link href="/cultivos"><PlusCircle className="mr-2 h-4 w-4" />Explorar Cultivos</Link></Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Journal Section */}
          <Card className="shadow-lg">
              <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                      <MessageSquarePlus className="h-7 w-7 text-primary" />
                      Mi Diario de Cultivo (con Ayuda IA)
                  </CardTitle>
                  <CardDescription>
                      Registra un problema o duda sobre uno de tus cultivos y obtén una sugerencia de la IA.
                  </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                  <div>
                      <Label htmlFor="journal-crop-select" className="font-nunito font-semibold">Selecciona el cultivo:</Label>
                      {/* This would be a Select component in a real app */}
                      <div className="p-2 border rounded-md bg-background mt-1 text-sm">{journalCrop || 'Ningún cultivo seleccionado'}</div>
                  </div>
                  <div>
                      <Label htmlFor="journal-problem" className="font-nunito font-semibold">Describe el problema u observación:</Label>
                      <Textarea 
                          id="journal-problem"
                          placeholder="Ej: 'Las hojas de abajo se están poniendo amarillas y tienen manchas marrones...'"
                          value={journalProblem}
                          onChange={(e) => setJournalProblem(e.target.value)}
                      />
                  </div>
                  <Button onClick={handleAiHelp} disabled={isAiLoading}>
                      {isAiLoading ? <Sparkles className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                      Pedir Ayuda a la IA
                  </Button>
                  {aiError && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{aiError}</AlertDescription></Alert>}
                  {isAiLoading && <div className="space-y-2 pt-2"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-16 w-full" /></div>}
                  {aiSuggestion && (
                      <Alert variant="default" className="bg-primary/10 border-primary/20">
                          <Sparkles className="h-4 w-4 text-primary" />
                          <AlertTitle className="font-nunito font-bold text-primary">Sugerencia de la IA</AlertTitle>
                          <AlertDescription className="text-primary/90 space-y-2">
                            <p className="font-sans font-semibold">Para tu problema con "{journalProblem}" en {journalCrop}, aquí tienes algunas ideas:</p>
                              <ul className="list-disc pl-5 font-sans space-y-1">
                                  {aiSuggestion.remedySuggestions.map((s, i) => <li key={i}>{s}</li>)}
                              </ul>
                          </AlertDescription>
                      </Alert>
                  )}
              </CardContent>
          </Card>

        </div>

        {/* Right Column (Widgets) */}
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">Resumen Anual</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="flex justify-between font-nunito font-semibold"><span>Cultivos Cosechados:</span><span>5</span></div>
                    <div className="flex justify-between font-nunito font-semibold"><span>Kg. de Alimento:</span><span>12.5 kg</span></div>
                    <div className="flex justify-between font-nunito font-semibold"><span>Alertas Atendidas:</span><span>32</span></div>
                </CardContent>
            </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <CalendarDays className="h-6 w-6" />
                Calendario de Actividades
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={new Date()}
                className="p-0"
                disabled={(date) => date < new Date("1900-01-01")}
                initialFocus
                // In a real app, you would pass events to highlight days
              />
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div><span>Siembra</span></div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div><span>Riego</span></div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-yellow-500"></div><span>Abono</span></div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500"></div><span>Cosecha</span></div>
              </div>
            </CardContent>
          </Card>

           <Card>
                <CardHeader>
                    <CardTitle className="text-xl">Pronóstico del Tiempo</CardTitle>
                    <CardDescription>Ubicación: (Simulada)</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-around text-center">
                    <div className="flex flex-col items-center gap-1">
                        <Sun className="h-10 w-10 text-yellow-500"/>
                        <p className="font-nunito font-bold text-2xl">24°C</p>
                        <p className="text-sm text-muted-foreground">Hoy</p>
                    </div>
                     <div className="flex flex-col items-center gap-1 text-muted-foreground">
                        <Droplets className="h-8 w-8"/>
                        <p className="font-nunito font-semibold">10%</p>
                        <p className="text-xs">Lluvia</p>
                    </div>
                     <div className="flex flex-col items-center gap-1 text-muted-foreground">
                        <Wind className="h-8 w-8"/>
                        <p className="font-nunito font-semibold">5 km/h</p>
                        <p className="text-xs">Viento</p>
                    </div>
                </CardContent>
            </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <BookOpen className="h-6 w-6" />
                Recursos Personalizados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {recommendedArticles.map(article => (
                  <li key={article.id}>
                    <Link href={article.href} className="text-primary font-nunito font-semibold hover:underline">
                      {article.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
    return (
        <ProtectedRoute>
            <DashboardContent />
        </ProtectedRoute>
    );
}
