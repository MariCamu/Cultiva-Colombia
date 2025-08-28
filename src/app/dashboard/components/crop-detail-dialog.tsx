
"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Calendar, Droplet, Sun, Zap, NotebookText, Camera, Trash2, FlaskConical, Sprout, ShieldCheck, ShieldAlert, List, CloudRain, Info, ExternalLink } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import type { UserCrop } from '../page';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/context/auth-context';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy, doc, deleteDoc, type Timestamp, type DocumentData, getDoc, updateDoc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { fetchWeatherForecast } from '@/services/weatherService';
import { willItRainSoon, type WeatherData } from '@/lib/weather-utils';
import type { CropTechnicalSheet, LifeCycleStage } from '@/lib/crop-data-structure';
import { differenceInDays, startOfDay } from 'date-fns';
import Link from 'next/link';

// Helper to make technical terms more human-readable
const humanizeTerm = (term: string | null | undefined) => {
    if (!term) return '';
    return term.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
};

interface LogEntry {
  id: string;
  type: 'note' | 'water' | 'fertilize' | 'photo' | 'planted';
  date: Timestamp;
  content: string;
  imageUrl?: string;
  dataAiHint?: string;
  icon: React.ElementType;
}

const getLogEntryColor = (type: string) => {
    switch(type) {
        case 'note': return 'bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400';
        case 'water': return 'bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-400';
        case 'photo': return 'bg-secondary border-border';
        case 'fertilize': return 'bg-yellow-800/10 border-yellow-800/20 text-yellow-800 dark:text-yellow-500';
        case 'planted': return 'bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400';
        default: return 'bg-muted/50 border-border';
    }
}

const getLogEntryIcon = (type: string) => {
    switch(type) {
        case 'note': return NotebookText;
        case 'water': return Droplet;
        case 'photo': return Camera;
        case 'fertilize': return Zap;
        case 'planted': return Sprout;
        default: return NotebookText;
    }
}

const formatRemainingDays = (days: number) => {
  if (days <= 0) return '¡Listo para cosechar!';
  if (days > 365 * 2) {
    const years = Math.floor(days / 365);
    return `aprox. ${years} años`;
  }
   if (days > 365) {
    const years = Math.floor(days / 365);
    const months = Math.round((days % 365) / 30);
    let result = `aprox. ${years} año`;
    if (months > 0) result += ` y ${months} mes${months > 1 ? 'es' : ''}`;
    return result;
  }
  if (days > 60) {
      const months = Math.floor(days/30);
      return `aprox. ${months} meses`;
  }
  return `${days} día${days > 1 ? 's' : ''}`;
};

function WeatherRecommendation() {
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherForecast(latitude, longitude)
          .then(async (weatherData) => {
            if (willItRainSoon(weatherData.hourly, 30)) { // 30% threshold
              setShowRecommendation(true);
            }
          })
          .catch(console.error)
          .finally(() => setIsLoading(false));
      },
      (error) => {
        console.warn("Could not get location for weather recommendation:", error.message);
        setIsLoading(false);
      }
    );
  }, []);

  if (isLoading || !showRecommendation) {
    return null;
  }

  return (
    <Alert className="mb-4 bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-300">
      <CloudRain className="h-4 w-4" />
      <AlertTitle className="font-nunito font-bold">¡Atención para tu cultivo!</AlertTitle>
      <AlertDescription>
        Es probable que llueva en tu ubicación en las próximas horas. Considera <strong>no regar</strong> hoy para evitar el exceso de humedad.
      </AlertDescription>
    </Alert>
  );
}


export function CropDetailDialog({ crop, children }: { crop: UserCrop; children: React.ReactNode }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
  const [isLogLoading, setIsLogLoading] = useState(true);
  const [technicalSheet, setTechnicalSheet] = useState<CropTechnicalSheet | null>(null);
  const [isSheetLoading, setIsSheetLoading] = useState(true);
  const [currentLifeCycleStage, setCurrentLifeCycleStage] = useState<LifeCycleStage | null>(null);

  
  const [newNote, setNewNote] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const plantedDate = crop.fecha_plantacion ? new Date((crop.fecha_plantacion as Timestamp).seconds * 1000) : new Date();
  const daysSincePlanted = Math.max(0, differenceInDays(new Date(), plantedDate));
  const remainingDays = Math.max(0, crop.daysToHarvest - daysSincePlanted);
  const progress = crop.daysToHarvest > 0 ? Math.min(Math.round((daysSincePlanted / crop.daysToHarvest) * 100), 100) : 0;

  useEffect(() => {
    if (!user || !crop.id || !crop.ficha_cultivo_id) return;
    
    // Fetch technical sheet
    const fetchTechnicalSheet = async () => {
      setIsSheetLoading(true);
      const sheetRef = doc(db, 'fichas_tecnicas_cultivos', crop.ficha_cultivo_id);
      const docSnap = await getDoc(sheetRef);
      if (docSnap.exists()) {
        const sheetData = docSnap.data() as CropTechnicalSheet;
        setTechnicalSheet(sheetData);

        // ** LÓGICA CORREGIDA PARA DETERMINAR LA ETAPA ACTUAL **
        let daysAccumulated = 0;
        let foundStage = false;
        const sortedStages = sheetData.cicloVida.sort((a, b) => a.orden - b.orden);

        for (const stage of sortedStages) {
            const stageDuration = stage.duracion_dias_tipico || 0;
            // Si los días desde la siembra son MENORES que el final de esta etapa,
            // entonces estamos en esta etapa.
            if (daysSincePlanted < daysAccumulated + stageDuration) {
                setCurrentLifeCycleStage(stage);
                foundStage = true;
                break;
            }
            daysAccumulated += stageDuration;
        }

        // Si después del bucle no se encontró una etapa (porque daysSincePlanted es mayor que todo el ciclo),
        // se asigna la última etapa. O si solo hay una etapa.
        if (!foundStage && sortedStages.length > 0) {
            setCurrentLifeCycleStage(sortedStages[sortedStages.length - 1]);
        }


      } else {
        console.error("No such technical sheet!", crop.ficha_cultivo_id);
      }
      setIsSheetLoading(false);
    };
    fetchTechnicalSheet();

    // Fetch log entries (journal)
    setIsLogLoading(true);
    const logCollectionRef = collection(db, 'usuarios', user.uid, 'cultivos_del_usuario', crop.id, 'diario');
    const q = query(logCollectionRef, orderBy('date', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const entries = snapshot.docs.map(doc => {
        const data = doc.data() as DocumentData;
        return {
          id: doc.id,
          ...data,
          icon: getLogEntryIcon(data.type),
        } as LogEntry;
      });

      const validEntries = entries.filter(e => e.date && typeof e.date.seconds === 'number');
      validEntries.sort((a,b) => b.date.seconds - a.date.seconds);

      setLogEntries(validEntries);
      setIsLogLoading(false);
    }, (error) => {
        console.error("Error fetching log entries:", error);
        toast({ title: "Error", description: "No se pudo cargar el diario.", variant: "destructive" });
        setIsLogLoading(false);
    });

    return () => unsubscribe();
  }, [crop.id, crop.ficha_cultivo_id, user, toast, daysSincePlanted]);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const addLogEntry = async (type: 'note' | 'water' | 'fertilize' | 'photo' | 'planted', initialContent?: string) => {
    if (!user) return;
    
    let content = "";
    let isPhotoEntry = false;
    let isInitialEntry = type === 'planted';

    if (isInitialEntry) {
        content = initialContent || "¡La aventura comienza! Cultivo plantado.";
    } else {
        switch(type) {
            case 'note':
                if (!newNote.trim()) {
                    toast({ title: "Nota vacía", description: "Por favor escribe algo en la nota.", variant: "destructive" });
                    return;
                }
                setIsAddingNote(true);
                content = newNote;
                break;
            case 'water':
                content = "Riego registrado.";
                break;
            case 'fertilize':
                content = "Abonado registrado.";
                break;
            case 'photo':
                if (!imageFile) {
                    toast({ title: "Sin imagen", description: "Por favor selecciona una imagen para subir.", variant: "destructive" });
                    return;
                }
                setIsUploading(true);
                content = newNote || "Foto de progreso añadida.";
                isPhotoEntry = true;
                break;
        }
    }
    
    const logData: Omit<LogEntry, 'id' | 'icon' | 'date'> & { date: any } = {
        type,
        date: serverTimestamp(),
        content,
    };
    
    if (isPhotoEntry) {
        logData.imageUrl = imagePreview || undefined;
    }

    try {
        const logCollectionRef = collection(db, 'usuarios', user.uid, 'cultivos_del_usuario', crop.id, 'diario');
        await addDoc(logCollectionRef, logData);

        // Update last note and reset watering task if applicable
        const cropRef = doc(db, 'usuarios', user.uid, 'cultivos_del_usuario', crop.id);
        const updateData: { lastNote: string, 'nextTask.dueInDays'?: number } = {
            lastNote: content,
        };
        
        if (type === 'water') {
            const wateringFrequency = crop.datos_programaticos?.frecuencia_riego_dias || 7;
            const plantedDate = startOfDay(new Date(crop.fecha_plantacion.seconds * 1000));
            const daysSincePlantedToday = differenceInDays(startOfDay(new Date()), plantedDate);
            updateData['nextTask.dueInDays'] = daysSincePlantedToday + wateringFrequency;
        }
        
        await updateDoc(cropRef, updateData);

        if (!isInitialEntry) {
            toast({ title: "Diario actualizado", description: "Se ha añadido una nueva entrada."});
        }
    } catch (error) {
        console.error("Error adding log entry: ", error);
        toast({ title: "Error", description: "No se pudo guardar la entrada.", variant: "destructive" });
    } finally {
        setNewNote("");
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        setIsAddingNote(false);
        setIsUploading(false);
    }
  };

  const removeLogEntry = async (id: string) => {
    if (!user) return;
    
    try {
        const logDocRef = doc(db, 'usuarios', user.uid, 'cultivos_del_usuario', crop.id, 'diario', id);
        await deleteDoc(logDocRef);
        toast({ title: "Entrada eliminada" });
    } catch (error) {
        console.error("Error deleting log entry:", error);
        toast({ title: "Error", description: "No se pudo eliminar la entrada.", variant: "destructive" });
    }
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-0 flex-shrink-0">
          <DialogTitle className="text-3xl font-nunito font-bold">{crop.nombre_cultivo_personal}</DialogTitle>
          <DialogDescription>
            Detalles y seguimiento de tu cultivo.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-grow overflow-y-auto px-6 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Info Column (stacked on mobile) */}
                <div className="md:col-span-1 flex flex-col gap-6">
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-lg">
                        <Image
                            src={crop.imageUrl}
                            alt={`Imagen de ${crop.nombre_cultivo_personal}`}
                            fill
                            className="object-cover"
                            data-ai-hint={crop.dataAiHint}
                        />
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl">Ficha Rápida</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            {crop.fecha_plantacion && (
                                <p><strong>Fecha de Siembra:</strong> {plantedDate.toLocaleDateString()}</p>
                            )}
                            <p><strong>Cosecha Estimada en:</strong> {formatRemainingDays(remainingDays)}</p>
                            <div>
                                <p className="mb-1"><strong>Progreso General:</strong></p>
                                <Progress value={progress} />
                            </div>
                        </CardContent>
                        <CardFooter>
                           <Button asChild variant="outline" size="sm" className="w-full">
                                <Link href={`/cultivos/${crop.ficha_cultivo_id}`}>
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    Ver Ficha Técnica Completa
                                </Link>
                           </Button>
                        </CardFooter>
                    </Card>
                </div>

                {/* Tabs Column (stacked on mobile) */}
                <div className="md:col-span-2 flex flex-col">
                    <Tabs defaultValue="journal" className="flex flex-col h-full">
                        <TabsList className="w-full flex-shrink-0">
                            <TabsTrigger value="journal" className="flex-1">Diario de Cultivo</TabsTrigger>
                            <TabsTrigger value="datasheet" className="flex-1">Ficha Técnica</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="journal" className="flex-grow mt-4">
                            <Card className="h-full flex flex-col">
                                <CardHeader className="flex-shrink-0">
                                    <CardTitle className="text-xl">Añade Notas y Registros</CardTitle>
                                    <CardDescription>Documenta el progreso de tu cultivo. Las imágenes no se guardan en la nube.</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow overflow-hidden">
                                    <ScrollArea className="h-full max-h-[40vh] md:max-h-none pr-4">
                                        <WeatherRecommendation />

                                        {currentLifeCycleStage && (
                                            <Alert className="mb-4 bg-primary/10 border-primary/20">
                                                <Info className="h-4 w-4 text-primary" />
                                                <AlertTitle className="text-primary font-bold">Estás en la etapa: {currentLifeCycleStage.etapa}</AlertTitle>
                                                <AlertDescription className="text-primary/90 space-y-1 mt-2 text-xs">
                                                   <p><strong>Notas para esta etapa:</strong> {currentLifeCycleStage.notas}</p>
                                                   <p><strong>Labores recomendadas:</strong> {currentLifeCycleStage.labores.join(', ')}</p>
                                                   {typeof currentLifeCycleStage.alertas_plagas === 'string' && currentLifeCycleStage.alertas_plagas && <p><strong>Plagas comunes:</strong> {humanizeTerm(currentLifeCycleStage.alertas_plagas)}</p>}
                                                   {Array.isArray(currentLifeCycleStage.alertas_plagas) && currentLifeCycleStage.alertas_plagas.length > 0 && <p><strong>Plagas comunes:</strong> {currentLifeCycleStage.alertas_plagas.map(humanizeTerm).join(', ')}</p>}
                                                </AlertDescription>
                                            </Alert>
                                        )}

                                        <div className="space-y-6">
                                            {isLogLoading && Array.from({ length: 3 }).map((_, i) => (
                                                <div key={i} className="flex items-start gap-4">
                                                    <Skeleton className="h-10 w-10 rounded-full" />
                                                    <div className="flex-grow space-y-2">
                                                        <Skeleton className="h-4 w-1/4" />
                                                        <Skeleton className="h-4 w-3/4" />
                                                    </div>
                                                </div>
                                            ))}
                                            {!isLogLoading && logEntries.map(entry => (
                                                <div key={entry.id} className={`relative p-4 rounded-lg border flex items-start gap-4 text-sm ${getLogEntryColor(entry.type)}`}>
                                                    <div className="p-2 bg-background/50 rounded-full"><entry.icon className="h-5 w-5" /></div>
                                                    <div className="flex-grow">
                                                        <p className="font-nunito font-semibold">{entry.date ? new Date(entry.date.seconds * 1000).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Fecha pendiente'}</p>
                                                        <p className="mt-1">{entry.content}</p>
                                                        {entry.imageUrl && (
                                                            <Dialog>
                                                                <DialogTrigger asChild>
                                                                    <Image 
                                                                        src={entry.imageUrl} 
                                                                        alt="Foto del diario" 
                                                                        width={80} 
                                                                        height={80} 
                                                                        className="mt-2 rounded-md cursor-pointer hover:opacity-80 transition-opacity" 
                                                                        data-ai-hint={entry.dataAiHint || ''}
                                                                    />
                                                                </DialogTrigger>
                                                                <DialogContent className="max-w-3xl">
                                                                    <DialogHeader>
                                                                        <DialogTitle className="sr-only">Foto del diario ampliada</DialogTitle>
                                                                    </DialogHeader>
                                                                    <Image 
                                                                        src={entry.imageUrl} 
                                                                        alt="Foto del diario ampliada" 
                                                                        width={800} 
                                                                        height={600} 
                                                                        className="rounded-md object-contain w-full h-auto"
                                                                    />
                                                                </DialogContent>
                                                            </Dialog>
                                                        )}
                                                    </div>
                                                    {entry.id !== '0' && (
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        Esta acción no se puede deshacer. Esto eliminará permanentemente la entrada del diario.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                                    <AlertDialogAction onClick={() => removeLogEntry(entry.id)}>Eliminar</AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    )}
                                                </div>
                                            ))}
                                            {!isLogLoading && logEntries.length === 0 && (
                                                <div className="text-center text-muted-foreground py-8">
                                                    <p>Aún no hay entradas en el diario.</p>
                                                    <p className="text-xs">¡Empieza añadiendo una nota o un registro!</p>
                                                </div>
                                            )}
                                        </div>
                                    </ScrollArea>
                                </CardContent>
                                <CardFooter className="flex-col items-start gap-4 border-t pt-4 bg-background/95 flex-shrink-0">
                                    <div className="w-full space-y-2">
                                        <Textarea placeholder="Escribe una nueva nota..." value={newNote} onChange={(e) => setNewNote(e.target.value)} />
                                        <div className="flex flex-wrap gap-2">
                                            <Button size="sm" variant="outline" onClick={() => addLogEntry('note')} disabled={isAddingNote}><NotebookText className="mr-2 h-4 w-4" />Guardar Nota</Button>
                                            <Button size="sm" variant="outline" onClick={() => addLogEntry('water')}><Droplet className="mr-2 h-4 w-4" />Registrar Riego</Button>
                                            <Button size="sm" variant="outline" onClick={() => addLogEntry('fertilize')}><Zap className="mr-2 h-4 w-4" />Abonado</Button>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2 pt-2 border-t mt-2">
                                            <Input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageFileChange} className="text-xs flex-grow" />
                                            {imagePreview && <Image src={imagePreview} alt="Preview" width={40} height={40} className="rounded-md" />}
                                            <Button size="sm" variant="outline" onClick={() => addLogEntry('photo')} disabled={isUploading || !imageFile}>
                                                {isUploading ? 'Añadiendo...' : <Camera className="mr-2 h-4 w-4" />}
                                                Añadir Foto
                                            </Button>
                                        </div>
                                    </div>
                                </CardFooter>
                            </Card>
                        </TabsContent>

                        <TabsContent value="datasheet" className="flex-grow overflow-auto mt-4">
                             {isSheetLoading ? (
                                <Card>
                                    <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
                                    <CardContent className="space-y-2">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-3/4" />
                                    </CardContent>
                                </Card>
                            ) : technicalSheet ? (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-xl">Ficha Técnica de {technicalSheet.nombre}</CardTitle>
                                        <CardDescription>{technicalSheet.descripcion}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-2 text-sm">
                                        <p><strong>Especie:</strong> <i>{technicalSheet.nombreCientifico}</i></p>
                                        <p><strong>Familia:</strong> {technicalSheet.tipo_planta}</p>
                                        <p><strong>Clima Ideal:</strong> {technicalSheet.clima.clase.map(humanizeTerm).join(', ')}</p>
                                        <p><strong>Exposición Solar:</strong> {technicalSheet.tecnica.luz_solar}</p>
                                        <p><strong>Riego:</strong> {technicalSheet.tecnica.riego}</p>
                                        <p><strong>Suelo:</strong> {humanizeTerm(technicalSheet.tecnica.suelo.textura)}, {humanizeTerm(technicalSheet.tecnica.suelo.drenaje)}.</p>
                                    </CardContent>
                                </Card>
                            ) : (
                                <p>No se encontró la ficha técnica.</p>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
