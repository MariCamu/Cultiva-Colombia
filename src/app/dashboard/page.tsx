
'use client';

import { ProtectedRoute, useAuth } from '@/context/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { PlusCircle, Leaf, CalendarDays, Droplets, Sun, Wind, BookOpen, Sparkles, MessageSquarePlus, AlertCircle, Trash2, LocateFixed, Bell, CheckCheck, Weight, CloudRain, Sprout as SproutIcon } from 'lucide-react';
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
import { addDays, format, isToday, isTomorrow, differenceInDays, startOfDay, isPast, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, type DocumentData, type QueryDocumentSnapshot, doc, deleteDoc, type Timestamp, addDoc, serverTimestamp, where, getDocs, updateDoc, writeBatch, getDoc, runTransaction, increment, orderBy, setDoc } from 'firebase/firestore';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { fetchWeatherForecast } from '@/services/weatherService';
import { getWeatherDescription, getWeatherIcon, type WeatherData, willItRainSoon } from '@/lib/weather-utils';
import type { UserCrop, UserProfile } from '@/models/crop-model';


export interface UserAlert {
    id: string;
    cropId: string;
    cropName: string;
    message: string;
    type: 'riego' | 'abono' | 'cosecha' | 'info';
    date: Timestamp;
    isRead: boolean;
    icon: React.ElementType;
}

interface SimulatedTask {
    date: Date;
    description: string;
    type: 'riego' | 'abono' | 'cosecha' | 'siembra';
}

const ICONS: { [key: string]: React.ElementType } = {
  Droplets: Droplets,
  Sun: Sun,
  Wind: Wind,
  Default: Leaf
};

const ALERT_ICONS: { [key: string]: React.ElementType } = {
    riego: Droplets,
    abono: Sparkles,
    cosecha: Leaf,
    info: CloudRain
}

const recommendedArticles = [
    { id: '1', title: 'Guía de compostaje para principiantes', href: '/articulos' },
    { id: '2', title: 'Cómo regar tus tomates correctamente', href: '/articulos' },
    { id: '3', title: 'Control orgánico de pulgones', href: '/articulos' },
];

const formatHarvestTime = (days: number, progress: number) => {
  if (progress >= 100) return '¡Listo para Cosechar!';

  const remainingDays = Math.max(0, days - Math.floor((days * progress) / 100));

  if (remainingDays > 365 * 2) {
    const years = Math.floor(remainingDays / 365);
    return `~${years} años est.`;
  }
   if (remainingDays > 365) {
    const years = Math.floor(remainingDays / 365);
    const months = Math.round((remainingDays % 365) / 30);
    let result = `~${years} año`;
    if (months > 0) result += ` y ${months} mes${months > 1 ? 'es' : ''}`;
    return `${result} est.`;
  }
  if (remainingDays > 60) {
      const months = Math.floor(remainingDays/30);
      return `~${months} meses est.`;
  }
  return `${remainingDays} días est.`;
};


function getTaskBadgeVariant(days: number) {
  if (days <= 0) return 'destructive';
  if (days <= 3) return 'secondary';
  return 'outline';
}

function WeatherWidget() {
  const { user } = useAuth();
  const [location, setLocation] = useState<{ lat: number, lon: number } | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [weatherDescription, setWeatherDescription] = useState<string>('');
  const [WeatherIcon, setWeatherIcon] = useState<React.ElementType | null>(null);

  useEffect(() => {
    setStatus('pending');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lon: longitude });
      },
      (err) => {
        setError("No se pudo obtener la ubicación. Revisa los permisos.");
        setStatus('error');
        console.error(err);
      }
    );
  }, []);

  const createRainAlert = async () => {
      if (!user) return;
      const alertsCollectionRef = collection(db, 'usuarios', user.uid, 'alertas');
      const rainAlertId = `rain_alert_${new Date().toISOString().split('T')[0]}`; // Daily unique ID
      const rainAlertRef = doc(alertsCollectionRef, rainAlertId);

      const rainAlertDoc = await getDoc(rainAlertRef);
      if (!rainAlertDoc.exists()) {
          await setDoc(rainAlertRef, {
              cropId: 'general',
              cropName: 'Clima',
              message: "¡Lluvia a la vista! Considera no regar tus cultivos hoy.",
              type: 'info',
              date: serverTimestamp(),
              isRead: false,
          });
      }
  };

  useEffect(() => {
    if (location && user) {
      fetchWeatherForecast(location.lat, location.lon)
        .then(async data => {
          setWeather(data);
           if (data.hourly.weather_code.length > 0) {
            const now = new Date();
            const currentHourIndex = now.getHours();
            
            if (currentHourIndex >= 0 && currentHourIndex < data.hourly.weather_code.length) {
              const code = data.hourly.weather_code[currentHourIndex];
              const desc = getWeatherDescription(code);
              const icon = getWeatherIcon(code);
              setWeatherDescription(desc);
              setWeatherIcon(() => icon);
            }
          }
           if (willItRainSoon(data.hourly, 40)) { // 40% threshold for rain probability
                createRainAlert();
           }
          setStatus('success');
        })
        .catch(err => {
          setError("No se pudo cargar el pronóstico.");
          setStatus('error');
          console.error(err);
        });
    }
  }, [location, user]);

  const renderContent = () => {
    if (status === 'pending') {
      return (
        <div className="flex flex-col items-center justify-center gap-2 text-center text-muted-foreground">
          <LocateFixed className="h-10 w-10 animate-pulse" />
          <p className="font-nunito font-semibold">Obteniendo ubicación...</p>
        </div>
      );
    }

    if (status === 'error' || !weather) {
      return (
         <div className="flex flex-col items-center justify-center gap-2 text-center text-destructive">
          <AlertCircle className="h-10 w-10" />
          <p className="font-nunito font-semibold">{error || "Error desconocido"}</p>
        </div>
      );
    }
    
    const now = new Date();
    const currentHourIndex = now.getHours();

    if (currentHourIndex < 0 || currentHourIndex >= weather.hourly.time.length) {
      return <p>Cargando datos actuales...</p>
    }

    const currentTemp = weather.hourly.temperature_2m[currentHourIndex];
    const currentPrecipitation = weather.hourly.precipitation_probability[currentHourIndex];

    return (
        <div className="flex items-center justify-around text-center w-full">
            <div className="flex flex-col items-center gap-1">
                {WeatherIcon && <WeatherIcon className="h-10 w-10 text-yellow-500"/>}
                <p className="font-nunito font-bold text-2xl">{Math.round(currentTemp)}°C</p>
                <p className="text-sm text-muted-foreground capitalize">{weatherDescription}</p>
            </div>
            <div className="flex flex-col items-center gap-1 text-muted-foreground">
                <Droplets className="h-8 w-8"/>
                <p className="font-nunito font-semibold">{currentPrecipitation}%</p>
                <p className="text-xs">Lluvia</p>
            </div>
            <div className="flex flex-col items-center gap-1 text-muted-foreground">
                <Wind className="h-8 w-8"/>
                <p className="font-nunito font-semibold">N/A</p>
                <p className="text-xs">Viento</p>
            </div>
        </div>
    );
  };
  
  return (
      <Card>
          <CardHeader>
              <CardTitle className="text-xl">Pronóstico del Tiempo</CardTitle>
              <CardDescription>{status === 'success' ? `Para tu ubicación actual` : status === 'error' ? 'Error' : 'Obteniendo ubicación...'}</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center min-h-[100px]">
              {renderContent()}
          </CardContent>
      </Card>
  );
}

function DashboardContent() {
  const { user } = useAuth();
  const { toast } = useToast();
  const displayUser = user || { displayName: 'Agricultor(a)', email: 'tu@correo.com' };

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userCrops, setUserCrops] = useState<UserCrop[]>([]);
  const [isCropsLoading, setIsCropsLoading] = useState(true);

  const [alerts, setAlerts] = useState<UserAlert[]>([]);
  const [isAlertsLoading, setIsAlertsLoading] = useState(true);

  const [harvestingCrop, setHarvestingCrop] = useState<UserCrop | null>(null);
  const [harvestWeight, setHarvestWeight] = useState('');
  const [isSavingHarvest, setIsSavingHarvest] = useState(false);

  const [journalProblem, setJournalProblem] = useState('');
  const [journalCropId, setJournalCropId] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<CropDiseaseRemedySuggestionsOutput | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date | undefined>(new Date());


    const checkForUpcomingTasks = async (crops: UserCrop[]) => {
        if (!user) return;

        try {
            const batch = writeBatch(db);
            const alertsCollectionRef = collection(db, 'usuarios', user.uid, 'alertas');
            const today = startOfDay(new Date());

            for (const crop of crops) {
                const plantedDate = startOfDay(new Date(crop.fecha_plantacion.seconds * 1000));
                
                // Check for harvest
                if (crop.daysToHarvest > 0) {
                    const harvestDate = addDays(plantedDate, crop.daysToHarvest);
                    if (today >= harvestDate) {
                        const taskId = `${crop.id}_harvest_${format(harvestDate, 'yyyy-MM-dd')}`;
                        const alertDocRef = doc(alertsCollectionRef, taskId);
                        const alertDoc = await getDoc(alertDocRef);
                        if (!alertDoc.exists()) {
                            batch.set(alertDocRef, {
                                cropId: crop.id, cropName: crop.nombre_cultivo_personal,
                                message: `¡Tu cultivo de ${crop.nombre_cultivo_personal} está listo para cosechar!`,
                                type: 'cosecha', date: serverTimestamp(), isRead: false,
                            });
                        }
                    }
                }

                // Check for next task (riego/abono)
                if (crop.nextTask) {
                    const nextTaskDate = addDays(plantedDate, crop.nextTask.dueInDays);
                    if (today >= nextTaskDate) {
                        const taskId = `${crop.id}_${crop.nextTask.name.replace(/\s+/g, '')}_${crop.nextTask.dueInDays}`;
                        const alertDocRef = doc(alertsCollectionRef, taskId);
                        const alertDoc = await getDoc(alertDocRef);
                        if (!alertDoc.exists()) {
                             const alertType = crop.nextTask.name.toLowerCase().includes('regar') ? 'riego' : 'abono';
                             batch.set(alertDocRef, {
                                cropId: crop.id, cropName: crop.nombre_cultivo_personal,
                                message: `Es hora de "${crop.nextTask.name}" tu cultivo de ${crop.nombre_cultivo_personal}.`,
                                type: alertType, date: serverTimestamp(), isRead: false,
                            });
                        }
                    }
                }
            }
            await batch.commit();
        } catch (error) {
            console.error("Error al verificar tareas y generar alertas:", error);
        }
    };


  useEffect(() => {
    if (!user) {
      setIsCropsLoading(false);
      setIsAlertsLoading(false);
      return;
    };

    setIsCropsLoading(true);
    const userProfileRef = doc(db, 'usuarios', user.uid);
    const unsubscribeProfile = onSnapshot(userProfileRef, (doc) => {
        if (doc.exists()) {
            setUserProfile(doc.data() as UserProfile);
        }
    });

    const userCropsQuery = query(collection(db, 'usuarios', user.uid, 'cultivos_del_usuario'));

    const unsubscribeCrops = onSnapshot(userCropsQuery, (snapshot) => {
      const cropsData = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
        const data = doc.data();
        if (!data.fecha_plantacion || typeof data.daysToHarvest !== 'number' || !data.nextTask) {
            return null;
        }

        const plantedDate = startOfDay(new Date(data.fecha_plantacion.seconds * 1000));
        const daysSincePlanted = differenceInDays(startOfDay(new Date()), plantedDate);
        const progress = data.daysToHarvest > 0 ? Math.min(Math.round((daysSincePlanted / data.daysToHarvest) * 100), 100) : 0;

        return {
          id: doc.id,
          ...data,
          progress,
        } as UserCrop;
      }).filter((crop): crop is UserCrop => crop !== null);

      setUserCrops(cropsData);
      if (cropsData.length > 0) {
        checkForUpcomingTasks(cropsData);
        if (!journalCropId) {
            setJournalCropId(cropsData[0].id);
        }
      }
      setIsCropsLoading(false);
    }, (error) => {
      console.error("Error fetching user crops:", error);
      setIsCropsLoading(false);
    });
    
    const alertsQuery = query(collection(db, 'usuarios', user.uid, 'alertas'), orderBy("date", "desc"));
    const unsubscribeAlerts = onSnapshot(alertsQuery, (snapshot) => {
        const allAlerts = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            icon: ALERT_ICONS[doc.data().type] || Leaf
        } as UserAlert));
        
        const unreadAlerts = allAlerts.filter(alert => !alert.isRead);
        
        setAlerts(unreadAlerts);
        setIsAlertsLoading(false);
    }, (error) => {
        console.error("Error fetching alerts:", error)
        setIsAlertsLoading(false);
    });


    return () => {
        unsubscribeProfile();
        unsubscribeCrops();
        unsubscribeAlerts();
    };
  }, [user, journalCropId]);

  const handleHarvestCrop = async () => {
    if (!user || !harvestingCrop) return;

    setIsSavingHarvest(true);

    try {
        const weight = parseFloat(harvestWeight) || 0;

        await runTransaction(db, async (transaction) => {
            const userRef = doc(db, "usuarios", user.uid);
            const cropRef = doc(db, "usuarios", user.uid, "cultivos_del_usuario", harvestingCrop.id);
            
            transaction.update(userRef, {
                harvestedCropsCount: increment(1),
                totalHarvestWeight: increment(weight)
            });

            transaction.delete(cropRef);
        });

        toast({
            title: "¡Cultivo Cosechado!",
            description: "¡Felicitaciones! Tu cosecha ha sido registrada.",
        });

        setHarvestingCrop(null);
        setHarvestWeight('');

    } catch (error) {
      console.error("Error harvesting crop: ", error);
      toast({
        title: "Error",
        description: "No se pudo registrar la cosecha.",
        variant: "destructive",
      });
    } finally {
        setIsSavingHarvest(false);
    }
  };

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

  const handleDismissAlert = async (alert: UserAlert) => {
      if (!user) return;
      const alertRef = doc(db, 'usuarios', user.uid, 'alertas', alert.id);
      try {
        const batch = writeBatch(db);
        batch.update(alertRef, { isRead: true });

        if (alert.type === 'riego') {
            const cropRef = doc(db, 'usuarios', user.uid, 'cultivos_del_usuario', alert.cropId);
            const cropToUpdate = userCrops.find(c => c.id === alert.cropId);
            if (cropToUpdate) {
                const plantedDate = startOfDay(new Date(cropToUpdate.fecha_plantacion.seconds * 1000));
                const daysSincePlanted = differenceInDays(startOfDay(new Date()), plantedDate);
                const nextDueInDays = daysSincePlanted + 2; // Schedule next watering 2 days from today
                batch.update(cropRef, {
                    'nextTask.dueInDays': nextDueInDays
                });
            }
        }
        await batch.commit();
        toast({ title: "Alerta atendida", description: "¡Buen trabajo!"});
      } catch (error) {
          console.error("Error dismissing alert:", error);
          toast({ title: "Error", description: "No se pudo marcar la alerta.", variant: "destructive" });
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

  const allSimulatedTasks: SimulatedTask[] = userCrops
    .flatMap(crop => {
        if (!crop.fecha_plantacion) return [];
        
        const tasks: SimulatedTask[] = [];
        const plantedDate = startOfDay(new Date(crop.fecha_plantacion.seconds * 1000));

        tasks.push({
            date: plantedDate,
            description: `Siembra de ${crop.nombre_cultivo_personal}`,
            type: 'siembra'
        });

        // Generate next 2 watering tasks
        let currentDueDay = crop.nextTask.dueInDays;
        for (let i = 0; i < 2; i++) {
            if (currentDueDay < crop.daysToHarvest) {
                tasks.push({
                    date: addDays(plantedDate, currentDueDay),
                    description: `Regar ${crop.nombre_cultivo_personal}`,
                    type: 'riego'
                });
                currentDueDay += 2; // Assuming watering is every 2 days for this simulation
            }
        }
        
        if (crop.daysToHarvest > 0) {
             const harvestDate = addDays(plantedDate, crop.daysToHarvest);
             tasks.push({
                date: harvestDate,
                description: `Cosechar ${crop.nombre_cultivo_personal}`,
                type: 'cosecha'
            });
        }
        return tasks;
    });

  const upcomingTasks = allSimulatedTasks
    .filter(task => {
        const today = startOfDay(new Date());
        const thirtyDaysFromNow = addDays(today, 30);
        return (isToday(task.date) || task.date > today) && task.date <= thirtyDaysFromNow;
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const calendarModifiers = {
    siembra: allSimulatedTasks.filter(t => t.type === 'siembra').map(t => t.date),
    riego: allSimulatedTasks.filter(t => t.type === 'riego').map(t => t.date),
    abono: allSimulatedTasks.filter(t => t.type === 'abono').map(t => t.date),
    cosecha: allSimulatedTasks.filter(t => t.type === 'cosecha').map(t => t.date)
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
  
  const formatAiSuggestion = (text: string) => {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, index) =>
      index % 2 === 1 ? <strong key={index}>{part}</strong> : part
    );
  };
  
  const tasksForSelectedDate = selectedCalendarDate 
    ? allSimulatedTasks
        .filter(task => isSameDay(task.date, selectedCalendarDate))
        .sort((a, b) => a.date.getTime() - b.date.getTime())
    : [];


  return (
    <>
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
                  const plantedDate = startOfDay(new Date(crop.fecha_plantacion.seconds * 1000));
                  const daysSincePlanted = differenceInDays(startOfDay(new Date()), plantedDate);
                  const daysUntilNextTask = crop.nextTask.dueInDays - daysSincePlanted;
                  const isReadyForHarvest = crop.progress >= 100;

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
                            {!isReadyForHarvest && 
                                <Badge variant={getTaskBadgeVariant(daysUntilNextTask)}>
                                  {daysUntilNextTask <= 0 ? 'Hoy' : `En ${daysUntilNextTask} días`}
                                </Badge>
                            }
                        </div>
                        <div>
                          <Label className="text-xs font-nunito font-semibold">Progreso a cosecha ({formatHarvestTime(crop.daysToHarvest, crop.progress)})</Label>
                          <Progress value={crop.progress} className="h-3 mt-1" />
                        </div>
                        <p className="text-sm font-sans italic text-muted-foreground">Última nota: "{crop.lastNote}"</p>
                        <div className="flex justify-between items-center pt-2 border-t">
                          {isReadyForHarvest ? (
                             <Button onClick={() => setHarvestingCrop(crop)} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold">
                                <Leaf className="mr-2 h-4 w-4" />
                                ¡Cosechar!
                             </Button>
                          ) : (
                            <div className="flex items-center gap-2 text-sm font-nunito font-semibold">
                                <NextTaskIcon className="h-4 w-4 text-primary" />
                                <span>Próxima tarea: {crop.nextTask.name}</span>
                            </div>
                          )}

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
                      <Bell className="h-7 w-7 text-primary" />
                      Tablero de Alertas
                  </CardTitle>
                  <CardDescription>
                      Aquí aparecerán las tareas importantes y recomendaciones para tus cultivos.
                  </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {isAlertsLoading && (
                    <div className="space-y-2">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                )}
                {!isAlertsLoading && alerts.length === 0 && (
                    <Alert variant="default" className="bg-primary/5">
                        <CheckCheck className="h-4 w-4 text-primary" />
                        <AlertTitle>¡Todo en orden!</AlertTitle>
                        <AlertDescription>No tienes alertas pendientes. ¡Sigue así!</AlertDescription>
                    </Alert>
                )}
                {!isAlertsLoading && alerts.map(alert => {
                    const AlertIcon = alert.icon;
                    return(
                        <div key={alert.id} className="flex items-center gap-4 p-3 rounded-lg bg-background border">
                           <div className="p-2 bg-primary/10 rounded-full">
                               <AlertIcon className="h-5 w-5 text-primary" />
                           </div>
                           <div className="flex-grow">
                               <p className="font-nunito font-semibold">{alert.message}</p>
                               <p className="text-xs text-muted-foreground">
                                   {alert.date ? format(new Date(alert.date.seconds * 1000), 'PPp', { locale: es }) : 'Ahora'}
                                </p>
                           </div>
                           <Button size="sm" variant="outline" onClick={() => handleDismissAlert(alert)}>
                               <CheckCheck className="mr-2 h-4 w-4" />
                               Marcar como Hecha
                           </Button>
                        </div>
                    )
                })}
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
                          <AlertDescription className="text-primary/90 space-y-3">
                            <p className="font-sans font-semibold">Para tu problema con "{journalProblem}" en {userCrops.find(c => c.id === journalCropId)?.nombre_cultivo_personal}, aquí tienes algunas ideas:</p>
                              <ul className="list-disc pl-5 font-sans space-y-2">
                                  {aiSuggestion.remedySuggestions.map((s, i) => (
                                      <li key={i}>
                                          <strong className='text-primary'>{s.title}:</strong> {formatAiSuggestion(s.description)}
                                      </li>
                                  ))}
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
                    <div className="flex justify-between font-nunito font-semibold"><span>Cultivos Cosechados:</span><span>{userProfile?.harvestedCropsCount || 0}</span></div>
                    <div className="flex justify-between font-nunito font-semibold"><span>Kg. de Alimento:</span><span>{userProfile?.totalHarvestWeight?.toFixed(2) || '0.00'} kg</span></div>
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
                        selected={selectedCalendarDate}
                        onSelect={setSelectedCalendarDate}
                        modifiers={calendarModifiers}
                        modifiersStyles={calendarModifierStyles}
                        className="p-0"
                    />
                    
                    <div className="md:pt-1 pl-4">
                        <h4 className="font-nunito font-semibold text-sm mb-2">Leyenda:</h4>
                        <div className="space-y-1 text-xs">
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full flex items-center justify-center" style={calendarModifierStyles.siembra}><SproutIcon className="h-2 w-2 text-green-900"/></div><span>Siembra</span></div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={calendarModifierStyles.riego}></div><span>Riego</span></div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={calendarModifierStyles.abono}></div><span>Abono</span></div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={calendarModifierStyles.cosecha}></div><span>Cosecha</span></div>
                        </div>
                    </div>
                </div>
              
                <div className="border-t pt-4">
                  <h4 className="font-nunito font-semibold text-sm mb-2">
                      Tareas para: {selectedCalendarDate ? format(selectedCalendarDate, 'EEEE d MMM', { locale: es }) : 'Selecciona una fecha'}
                  </h4>
                  <div className="space-y-3 mt-2">
                    {tasksForSelectedDate.length > 0 ? (
                        tasksForSelectedDate.map((task, i) => (
                          <div key={i} className="flex items-start gap-3 text-sm">
                            <div className={`mt-1 w-3 h-3 rounded-full flex-shrink-0 ${
                              task.type === 'siembra' ? 'bg-green-400' :
                              task.type === 'riego' ? 'bg-blue-400' :
                              task.type === 'abono' ? 'bg-yellow-400' :
                              task.type === 'cosecha' ? 'bg-red-400' : 'bg-gray-400'
                            }`}></div>
                            <div className="flex-1">
                              <p className="font-nunito font-semibold">{task.description}</p>
                            </div>
                          </div>
                        ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No hay tareas programadas para este día.</p>
                    )}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-nunito font-semibold text-sm mb-2">Próximas Tareas (en 30 días):</h4>
                  <div className="space-y-3 mt-2">
                    {upcomingTasks.slice(0, 5).map((task, i) => (
                      <div key={i} className="flex items-start gap-3 text-sm">
                        <div className={`mt-1 w-3 h-3 rounded-full flex-shrink-0 ${
                          task.type === 'riego' ? 'bg-blue-400' :
                          task.type === 'abono' ? 'bg-yellow-400' :
                          task.type === 'cosecha' ? 'bg-red-400' :
                          task.type === 'siembra' ? 'bg-green-400' : 'bg-gray-400'
                        }`}></div>
                        <div className="flex-1">
                          <p className="font-nunito font-semibold">{task.description}</p>
                          <p className="text-xs text-muted-foreground">{formatRelativeDate(task.date)}</p>
                        </div>
                      </div>
                    ))}
                    {upcomingTasks.length === 0 && <p className="text-sm text-muted-foreground">¡Sin tareas próximas en los siguientes 30 días!</p>}
                  </div>
                </div>
            </CardContent>
          </Card>

          <WeatherWidget />

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
    <Dialog open={!!harvestingCrop} onOpenChange={(isOpen) => !isOpen && setHarvestingCrop(null)}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>¡Felicidades por tu Cosecha!</DialogTitle>
                <DialogDescription>
                    Registra el peso de tu cosecha de <strong>{harvestingCrop?.nombre_cultivo_personal}</strong> para llevar un control en tu resumen anual.
                </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
                <Label htmlFor="harvest-weight">Peso de la Cosecha (en kg, opcional)</Label>
                <div className="relative">
                    <Weight className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        id="harvest-weight"
                        type="number"
                        placeholder="Ej: 1.5"
                        value={harvestWeight}
                        onChange={(e) => setHarvestWeight(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setHarvestingCrop(null)} disabled={isSavingHarvest}>Cancelar</Button>
                <Button onClick={handleHarvestCrop} disabled={isSavingHarvest}>
                    {isSavingHarvest ? 'Guardando...' : 'Confirmar Cosecha'}
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
    </>
  );
}

export default function DashboardPage() {
    return (
        <ProtectedRoute>
            <DashboardContent />
        </ProtectedRoute>
    );
}
