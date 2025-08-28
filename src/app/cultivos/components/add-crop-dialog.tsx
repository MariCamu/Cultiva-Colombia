
"use client";

import { useState, type FormEvent } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import type { SampleCrop } from '@/models/crop-model';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader2, AlertCircle } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface AddCropDialogProps {
  crop: SampleCrop;
  children: React.ReactNode;
}

export function AddCropDialog({ crop, children }: AddCropDialogProps) {
  const [open, setOpen] = useState(false);
  const [plantingDate, setPlantingDate] = useState<Date | undefined>(new Date());
  const [currentStage, setCurrentStage] = useState<string>(crop.lifeCycle?.[0]?.name || 'Semilla');
  const [initialNotes, setInitialNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const { user, userProfile } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const userRegion = userProfile?.region;
  const isCropInUserRegion = userRegion && crop.regionSlugs.map(r => r.toLowerCase()).includes(userRegion.toLowerCase());
  const showRegionWarning = userRegion && !isCropInUserRegion;

  const handleAddCrop = async (event: FormEvent) => {
    event.preventDefault();
    
    if (!user) {
      toast({
        title: "Inicia Sesión",
        description: "Debes iniciar sesión para añadir cultivos a tu dashboard.",
        variant: "destructive",
      });
      router.push('/login');
      return;
    }

    if (!plantingDate) {
        toast({ title: "Fecha requerida", description: "Por favor, selecciona una fecha de plantación.", variant: "destructive" });
        return;
    }

    setIsSaving(true);

    let finalPlantingDate = plantingDate;

    // Adjust planting date based on the selected stage to reflect correct progress
    if (crop.lifeCycle && crop.lifeCycle.length > 0) {
      const selectedStageIndex = crop.lifeCycle.findIndex(stage => stage.name === currentStage);
      if (selectedStageIndex > 0) {
        // Calculate the duration of previous stages
        let daysToSubtract = 0;
        for (let i = 0; i < selectedStageIndex; i++) {
            // Use the detailed lifeCycle data passed in the crop prop
            daysToSubtract += crop.lifeCycle[i].duracion_dias_tipico || 0;
        }
        finalPlantingDate = subDays(plantingDate, daysToSubtract);
      }
    }


    const dataToAdd = {
      ficha_cultivo_id: crop.id,
      nombre_cultivo_personal: crop.name,
      fecha_plantacion: finalPlantingDate,
      imageUrl: crop.imageUrl,
      dataAiHint: crop.dataAiHint,
      daysToHarvest: crop.datos_programaticos.dias_para_cosecha,
      // Guardar el objeto completo de datos programáticos
      datos_programaticos: crop.datos_programaticos,
      estado_actual_cultivo: currentStage,
      notas_progreso_inicial: initialNotes,
      nextTask: { 
        name: 'Regar', 
        // Establecer el primer riego basado en la frecuencia
        dueInDays: crop.datos_programaticos.frecuencia_riego_dias,
        iconName: 'Droplets' 
      },
      lastNote: initialNotes || `¡Cultivo de ${crop.name} recién añadido!`,
      createdAt: serverTimestamp(),
    };

    try {
      const userCropsCollection = collection(db, 'usuarios', user.uid, 'cultivos_del_usuario');
      const docRef = await addDoc(userCropsCollection, dataToAdd);

      if(initialNotes.trim() !== '') {
          const logCollectionRef = collection(db, 'usuarios', user.uid, 'cultivos_del_usuario', docRef.id, 'diario');
          await addDoc(logCollectionRef, {
              type: 'note',
              date: serverTimestamp(),
              content: `Nota inicial: ${initialNotes}`,
          });
      }

      toast({
        title: "¡Cultivo Añadido!",
        description: `${crop.name} ha sido añadido a tu dashboard.`,
      });
      setOpen(false);
      router.push('/dashboard');
    } catch (error: any) {
      console.error("Error al añadir cultivo al dashboard:", error);
      toast({
        title: "Error al añadir cultivo",
        description: `Hubo un problema al guardar los datos: ${error.message}.`,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Configurar Mi Nuevo Cultivo</DialogTitle>
          <DialogDescription>
            Añade detalles sobre tu cultivo de <strong>{crop.name}</strong> para un mejor seguimiento.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-4">
          <Image
            src={crop.imageUrl}
            alt={crop.name}
            width={80}
            height={80}
            className="rounded-lg object-cover"
            data-ai-hint={crop.dataAiHint}
          />
          <p className="font-bold text-lg">{crop.name}</p>
        </div>

        {showRegionWarning && (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Cultivo no ideal para tu región</AlertTitle>
                <AlertDescription>
                   Este cultivo no es óptimo para tu región ({userRegion}). ¿Estás seguro de que quieres continuar?
                </AlertDescription>
            </Alert>
        )}

        <form onSubmit={handleAddCrop} className="space-y-4">
          <div>
            <Label htmlFor="planting-date">Fecha de Inicio de Etapa</Label>
             <Popover>
                <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                    "w-full justify-start text-left font-normal",
                    !plantingDate && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {plantingDate ? format(plantingDate, "PPP", { locale: es }) : <span>Elige una fecha</span>}
                </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={plantingDate}
                    onSelect={setPlantingDate}
                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                    initialFocus
                    locale={es}
                    captionLayout="dropdown-buttons"
                    fromYear={1990}
                    toYear={new Date().getFullYear()}
                />
                </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label htmlFor="current-stage">Mi cultivo está en la etapa de...</Label>
            <Select value={currentStage} onValueChange={setCurrentStage}>
              <SelectTrigger id="current-stage">
                <SelectValue placeholder="Selecciona una etapa" />
              </SelectTrigger>
              <SelectContent>
                {(crop.lifeCycle && crop.lifeCycle.length > 0 ? crop.lifeCycle : [{ name: 'Semilla' }, { name: 'Plántula' }, { name: 'Adulto' }]).map(stage => (
                    <SelectItem key={stage.name} value={stage.name}>
                        {stage.name}
                    </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="initial-notes">Comentarios iniciales (opcional)</Label>
            <Textarea
              id="initial-notes"
              placeholder="Ej: La adquirí hace 2 semanas, ya tiene 3 hojas reales."
              value={initialNotes}
              onChange={(e) => setInitialNotes(e.target.value)}
            />
          </div>
          <DialogFooter className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={isSaving}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSaving ? 'Añadiendo...' : 'Añadir a Mi Dashboard'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
