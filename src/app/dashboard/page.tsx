
'use client';

import { ProtectedRoute, useAuth } from '@/context/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { PlusCircle, Leaf, CalendarDays, Droplets, Sun, Wind, BookOpen, Sparkles, MessageSquarePlus, AlertCircle, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect } from 'react';
import { getCropDiseaseRemedySuggestions, type CropDiseaseRemedySuggestionsOutput } from '@/ai/flows/get-remedy-suggestions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';
import { CropDetailDialog } from './components/crop-detail-dialog';
import { addDays, format, isToday, isTomorrow, differenceInDays, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, type DocumentData, type QueryDocumentSnapshot, doc, deleteDoc, type Timestamp } from 'firebase/firestore';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';

export interface UserCrop {
  id: string; 
  ficha_cultivo_id: string;
  nombre_cultivo_personal: string;
  fecha_plantacion: Timestamp;
  imageUrl: string;
  dataAiHint: string;
  daysToHarvest: number;
  progress: number;
  nextTask: { name: string; dueInDays: number; iconName: 'Droplets' | 'Sun' | 'Wind' };
  lastNote: string;
}

const ICONS: { [key: string]: React.ElementType } = {
  Droplets: Droplets,
  Sun: Sun,
  Wind: Wind,
};

const recommendedArticles = [
    { id: '1', title: 'Guía de compostaje para principiantes', href: '/articulos' },
    { id: '2', title: 'Cómo regar tus tomates correctamente', href: '/articulos' },
    { id: '3', title: 'Control orgánico de pulgones', href: '/articulos' },
];

const formatHarvestTime = (days: number) => {
  if (days <= 0) return '¡Listo para cosechar!';
  if (days > 365 * 2) {
    const years = Math.floor(days / 365);
    return `~${years} años est.`;
  }
   if (days > 365) {
    const years = Math.floor(days / 365);
    const months = Math.round((days % 365) / 30);
    let result = `~${years} año`;
    if (months > 0) result += ` y ${months} mes${months > 1 ? 'es' : ''}`;
    return `${result} est.`;
  }
  if (days > 60) {
      const months = Math.floor(days/30);
      return `~${months} meses est.`;
  }
  return `${days} días est.`;
};


function getTaskBadgeVariant(days: number) {
  if (days <= 1) return 'destructive';
  if (days <= 3) return 'secondary';
  return 'outline';
}

function DashboardContent() {
  const { user } = useAuth();
  const { toast } = useToast();
  const displayUser = user || { displayName: 'Agricultor(a)', email: 'tu@correo.com' };

  const [userCrops, setUserCrops] = useState<UserCrop[]>([]);
  const [isCropsLoading, setIsCropsLoading] = useState(true);

  const [journalProblem, setJournalProblem] = useState('');
  const [journalCropId, setJournalCropId] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<CropDiseaseRemedySuggestionsOutput | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setIsCropsLoading(false);
      return;
    };

    setIsCropsLoading(true);
    const userCropsQuery = query(collection(db, 'usuarios', user.uid, 'cultivos_del_usuario'));

    const unsubscribe = onSnapshot(userCropsQuery, (snapshot) => {
      const cropsData = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
        const data = doc.data();
        // Robust check for required data
        if (!data.fecha_plantacion || typeof data.daysToHarvest !== 'number') {
            console.warn("Skipping crop with incomplete data:", doc.id, data);
            return null;
        }

        const plantedDate = new Date(data.fecha_plantacion.seconds * 1000);
        const daysSincePlanted = differenceInDays(new Date(), plantedDate);
        const progress = Math.min(Math.round((daysSincePlanted / data.daysToHarvest) * 100), 100);

        return {
          id: doc.id,
          ficha_cultivo_id: data.ficha_cultivo_id,
          nombre_cultivo_personal: data.nombre_cultivo_personal,
          fecha_plantacion: data.fecha_plantacion,
          imageUrl: data.imageUrl,
          dataAiHint: data.dataAiHint,
          daysToHarvest: data.daysToHarvest,
          progress,
          nextTask: data.nextTask || { name: 'Revisar', dueInDays: 1, iconName: 'Sun' },
          lastNote: data.lastNote,
        } as UserCrop;
      }).filter((crop): crop is UserCrop => crop !== null); // Filter out the null values

      setUserCrops(cropsData);
      if (cropsData.length > 0 && !journalCropId) {
        setJournalCropId(cropsData[0].id);
      }
      setIsCropsLoading(false);
    }, (error) => {
      console.error("Error fetching user crops:", error);
      setIsCropsLoading(false);
    });

    return () => unsubscribe();
  }, [user, journalCropId]);

  const handleDeleteCrop = async (cropId: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'usuarios', user.uid, 'cultivos_del_usuario', cropId));
      toast({
        title: "Cultivo Eliminado",
        description: "El cultivo ha sido eliminado de tu dashboard.",
      });
    } catch (error) {
      console.error("Error deleting crop: ", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el cultivo.",
        variant: "destructive",
      });
    }
  };


  const handleAiHelp = async () => {
    const selectedCrop = userCrops.find(c => c.id === journalCropId);
    if (!journalProblem || !selectedCrop) {
      setAiError('Por favor, selecciona un cultivo y describe el problema.');
      return;
    }
    setIsAiLoading(true);
    setAiSuggestion(null);
    setAiError(null);
    try {
       const result = await getCropDiseaseRemedySuggestions({
        cropName: selectedCrop.nombre_cultivo_personal,
        diseaseName: journalProblem,
      });
      setAiSuggestion(result);
    } catch (e) {
      console.error(e);
      setAiError('Hubo un error al consultar la IA. Inténtalo de nuevo.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const today = new Date();
  const simulatedTasks = userCrops.filter(crop => crop.fecha_plantacion).map(crop => ({
    date: addDays(today, crop.nextTask.dueInDays),
    description: `${crop.nextTask.name} ${crop.nombre_cultivo_personal}`,
    type: crop.nextTask.name.toLowerCase().includes('regar') ? 'riego' : crop.nextTask.name.toLowerCase().includes('abonar') ? 'abono' : 'cosecha'
  })).sort((a,b) => a.date.getTime() - b.date.getTime());

  const plantingDates = userCrops.filter(c => c.fecha_plantacion).map(c => new Date(c.fecha_plantacion.seconds * 1000));

  const calendarModifiers = {
    siembra: plantingDates,
    riego: simulatedTasks.filter(t => t.type === 'riego').map(t => t.date),
    abono: simulatedTasks.filter(t => t.type === 'abono').map(t => t.date),
    cosecha: simulatedTasks.filter(t => t.type === 'cosecha').map(t => t.date)
  };

  const calendarModifierStyles = {
    siembra: { backgroundColor: 'var(--green-300, #86efac)', color: 'var(--green-800, #166534)' },
    riego: { backgroundColor: 'var(--blue-300, #93c5fd)', color: 'var(--blue-800, #1e40af)' },
    abono: { backgroundColor: 'var(--yellow-300, #fde047)', color: 'var(--yellow-800, #854d0e)' },
    cosecha: { backgroundColor: 'var(--red-300, #fca5a5)', color: 'var(--red-800, #991b1b)' },
    today: { border: '2px solid hsl(var(--primary))' }
  };

  const formatRelativeDate = (date: Date) => {
    if (isToday(date)) return 'Hoy';
    if (isTomorrow(date)) return 'Mañana';
    return format(date, 'EEEE d MMM', { locale: es });
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-nunito font-bold tracking-tight text-foreground sm:text-4xl">
          Dashboard de {displayUser?.displayName || displayUser?.email}
        </h1>
        <p className="mt-2 text-lg text-muted-foreground font-sans">
          Tu centro de control para una cosecha exitosa.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        <div className="lg:col-span-2 space-y-8">
          
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
              {isCropsLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-40 w-full rounded-lg" />
                  <Skeleton className="h-40 w-full rounded-lg" />
                </div>
              ) : userCrops.length > 0 ? (
                userCrops.map(crop => {
                  const NextTaskIcon = ICONS[crop.nextTask.iconName] || Leaf;
                  return (
                    <Card key={crop.id} className="grid md:grid-cols-3 gap-4 p-4 items-center bg-card/50">
                      <div className="md:col-span-1">
                        <Image
                          src={crop.imageUrl}
                          alt={crop.nombre_cultivo_personal}
                          width={400}
                          height={300}
                          className="rounded-lg object-cover aspect-[4/3]"
                          data-ai-hint={crop.dataAiHint}
                        />
                      </div>
                      <div className="md:col-span-2 space-y-3">
                        <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-nunito font-bold text-xl">{crop.nombre_cultivo_personal}</h3>
                              {crop.fecha_plantacion && (
                                <p className="text-sm text-muted-foreground font-sans">Plantado el: {format(new Date(crop.fecha_plantacion.seconds * 1000), 'PPP', { locale: es })}</p>
                              )}
                            </div>
                            <Badge variant={getTaskBadgeVariant(crop.nextTask.dueInDays)}>
                              {crop.nextTask.dueInDays === 0 ? 'Hoy' : `En ${crop.nextTask.dueInDays} días`}
                            </Badge>
                        </div>
                        <div>
                          <Label className="text-xs font-nunito font-semibold">Progreso a cosecha ({formatHarvestTime(crop.daysToHarvest)})</Label>
                          <Progress value={crop.progress} className="h-3 mt-1" />
                        </div>
                        <p className="text-sm font-sans italic text-muted-foreground">Última nota: "{crop.lastNote}"</p>
                        <div className="flex justify-between items-center pt-2 border-t">
                          <div className="flex items-center gap-2 text-sm font-nunito font-semibold">
                            <NextTaskIcon className="h-4 w-4 text-primary" />
                            <span>Próxima tarea: {crop.nextTask.name}</span>
                          </div>
                          <div className="flex gap-2">
                            <CropDetailDialog crop={crop}>
                              <Button variant="outline" size="sm">Ver Diario</Button>
                            </CropDetailDialog>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>¿Estás seguro de eliminar este cultivo?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta acción no se puede deshacer. Se eliminará permanentemente "{crop.nombre_cultivo_personal}" y todos sus datos del diario.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteCrop(crop.id)}>Sí, eliminar</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )
                })
              ) : (
                <div className="text-center py-10 border-2 border-dashed rounded-lg">
                  <p className="text-muted-foreground mb-4">Aún no has añadido ningún cultivo.</p>
                  <Button asChild><Link href="/cultivos"><PlusCircle className="mr-2 h-4 w-4" />Explorar Cultivos</Link></Button>
                </div>
              )}
            </CardContent>
          </Card>

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
                      <Select value={journalCropId} onValueChange={setJournalCropId} disabled={userCrops.length === 0}>
                        <SelectTrigger id="journal-crop-select">
                          <SelectValue placeholder="Selecciona un cultivo..." />
                        </SelectTrigger>
                        <SelectContent>
                          {userCrops.map(crop => (
                            <SelectItem key={crop.id} value={crop.id}>{crop.nombre_cultivo_personal}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                  <Button onClick={handleAiHelp} disabled={isAiLoading || !journalCropId}>
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
                            <p className="font-sans font-semibold">Para tu problema con "{journalProblem}" en {userCrops.find(c => c.id === journalCropId)?.nombre_cultivo_personal}, aquí tienes algunas ideas:</p>
                              <ul className="list-disc pl-5 font-sans space-y-1">
                                  {aiSuggestion.remedySuggestions.map((s, i) => <li key={i}>{s}</li>)}
                              </ul>
                          </AlertDescription>
                      </Alert>
                  )}
              </CardContent>
          </Card>

        </div>

        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">Resumen Anual</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="flex justify-between font-nunito font-semibold"><span>Cultivos Cosechados:</span><span>0</span></div>
                    <div className="flex justify-between font-nunito font-semibold"><span>Kg. de Alimento:</span><span>0 kg</span></div>
                    <div className="flex justify-between font-nunito font-semibold"><span>Alertas Atendidas:</span><span>0</span></div>
                </CardContent>
            </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <CalendarDays className="h-6 w-6" />
                Calendario y Tareas
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-[auto,1fr] gap-x-6 gap-y-4 items-start p-2">
                    <Calendar
                        mode="single"
                        selected={startOfDay(today)}
                        modifiers={calendarModifiers}
                        modifiersStyles={calendarModifierStyles}
                        className="p-0"
                    />
                    
                    <div className="md:pt-1 pl-4">
                        <h4 className="font-nunito font-semibold text-sm mb-2">Leyenda:</h4>
                        <div className="space-y-1 text-xs">
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={calendarModifierStyles.siembra}></div><span>Siembra</span></div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={calendarModifierStyles.riego}></div><span>Riego</span></div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={calendarModifierStyles.abono}></div><span>Abono</span></div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={calendarModifierStyles.cosecha}></div><span>Cosecha</span></div>
                        </div>
                    </div>
                </div>
              
              <div className="border-t pt-4">
                <h4 className="font-nunito font-semibold text-sm mb-2">Próximas Tareas:</h4>
                <div className="space-y-3 mt-2">
                  {simulatedTasks.slice(0, 5).map((task, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm">
                      <div className={`mt-1 w-3 h-3 rounded-full flex-shrink-0 ${
                        task.type === 'riego' ? 'bg-blue-400' :
                        task.type === 'abono' ? 'bg-yellow-400' :
                        task.type === 'cosecha' ? 'bg-red-400' : 'bg-gray-400'
                      }`}></div>
                      <div className="flex-1">
                        <p className="font-nunito font-semibold">{task.description}</p>
                        <p className="text-xs text-muted-foreground">{formatRelativeDate(task.date)}</p>
                      </div>
                    </div>
                  ))}
                  {simulatedTasks.length === 0 && <p className="text-sm text-muted-foreground">¡Sin tareas próximas!</p>}
                </div>
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
