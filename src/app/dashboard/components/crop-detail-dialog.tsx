
"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Droplet, Sun, Zap, NotebookText, Camera, Trash2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface UserCrop {
  id: string;
  name: string;
  plantId: string;
  imageUrl: string;
  dataAiHint: string;
  datePlanted: string;
  daysToHarvest: number;
  progress: number;
  nextTask: { name: string; dueInDays: number; icon: React.ElementType };
  lastNote: string;
}

const sampleLogEntries = [
  { id: 1, type: 'note', date: '2024-06-10', content: 'Aparecieron las primeras flores amarillas hoy.', icon: NotebookText },
  { id: 2, type: 'water', date: '2024-06-08', content: 'Riego profundo realizado.', icon: Droplet },
  { id: 3, type: 'photo', date: '2024-06-05', content: 'Foto de progreso subida.', imageUrl: 'https://placehold.co/100x100.png', dataAiHint: 'tomato plant', icon: Camera },
  { id: 4, type: 'fertilize', date: '2024-06-01', content: 'Abono orgánico añadido.', icon: Zap },
  { id: 5, type: 'planted', date: '2024-05-15', content: 'Cultivo plantado.', icon: Sun },
];

const getLogEntryColor = (type: string) => {
    switch(type) {
        case 'note': return 'bg-yellow-100 border-yellow-300';
        case 'water': return 'bg-blue-100 border-blue-300';
        case 'photo': return 'bg-purple-100 border-purple-300';
        case 'fertilize': return 'bg-green-100 border-green-300';
        case 'planted': return 'bg-orange-100 border-orange-300';
        default: return 'bg-gray-100 border-gray-300';
    }
}


export function CropDetailDialog({ crop, children }: { crop: UserCrop; children: React.ReactNode }) {
  const [logEntries, setLogEntries] = useState(sampleLogEntries);

  const addLogEntry = (type: 'note' | 'water' | 'fertilize' | 'photo') => {
    let content = `Nuevo registro de ${type}.`;
    let icon = NotebookText;
    let imageUrl = '';
    let dataAiHint = '';

    switch(type) {
        case 'note':
            icon = NotebookText;
            content = "Nueva nota añadida.";
            break;
        case 'water':
            icon = Droplet;
            content = "Riego registrado.";
            break;
        case 'fertilize':
            icon = Zap;
            content = "Abonado registrado.";
            break;
        case 'photo':
            icon = Camera;
            content = "Nueva foto subida.";
            imageUrl = 'https://placehold.co/100x100.png';
            dataAiHint = 'new plant photo';
            break;
    }
    
    const newEntry = {
        id: Date.now(),
        type,
        date: new Date().toISOString().split('T')[0],
        content,
        icon,
        imageUrl,
        dataAiHint
    };
    setLogEntries([newEntry, ...logEntries]);
  };

  const removeLogEntry = (id: number) => {
    setLogEntries(logEntries.filter(entry => entry.id !== id));
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-3xl font-nunito font-bold">{crop.name}</DialogTitle>
          <DialogDescription>
            Detalles y seguimiento de tu cultivo de {crop.name}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid md:grid-cols-2 gap-6 mt-4 h-full overflow-hidden">
            <div className="flex flex-col gap-4">
                <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                    <Image
                        src={crop.imageUrl}
                        alt={`Imagen de ${crop.name}`}
                        fill
                        className="object-cover"
                        data-ai-hint={crop.dataAiHint}
                    />
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">Ficha Rápida</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <p><strong>Fecha de Siembra:</strong> {new Date(crop.datePlanted).toLocaleDateString()}</p>
                        <p><strong>Cosecha Estimada en:</strong> {crop.daysToHarvest - Math.round(crop.progress / 100 * crop.daysToHarvest)} días</p>
                        <p><strong>Progreso General:</strong></p>
                        <div className="w-full bg-secondary rounded-full h-2.5">
                            <div className="bg-primary h-2.5 rounded-full" style={{ width: `${crop.progress}%` }}></div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex flex-col h-full overflow-hidden">
                 <Tabs defaultValue="journal" className="flex flex-col h-full">
                    <TabsList className="w-full">
                        <TabsTrigger value="journal" className="flex-1">Diario de Cultivo</TabsTrigger>
                        <TabsTrigger value="datasheet" className="flex-1">Ficha Técnica</TabsTrigger>
                    </TabsList>
                    <TabsContent value="journal" className="flex-grow flex flex-col mt-2 h-0">
                        <Card className="flex-grow flex flex-col overflow-hidden">
                            <CardHeader>
                                <CardTitle className="text-xl">Diario de Cultivo</CardTitle>
                                <div className="flex flex-wrap gap-2 pt-2">
                                    <Button size="sm" variant="outline" onClick={() => addLogEntry('note')}><NotebookText className="mr-2 h-4 w-4" />Nota</Button>
                                    <Button size="sm" variant="outline" onClick={() => addLogEntry('water')}><Droplet className="mr-2 h-4 w-4" />Riego</Button>
                                    <Button size="sm" variant="outline" onClick={() => addLogEntry('fertilize')}><Zap className="mr-2 h-4 w-4" />Abonado</Button>
                                    <Button size="sm" variant="outline" onClick={() => addLogEntry('photo')}><Camera className="mr-2 h-4 w-4" />Foto</Button>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-grow overflow-auto p-0">
                                <ScrollArea className="h-full pr-4 p-6">
                                    <div className="space-y-4">
                                        {logEntries.map(entry => (
                                            <div key={entry.id} className={`relative p-3 rounded-lg border flex items-start gap-3 text-sm ${getLogEntryColor(entry.type)}`}>
                                                <div className="p-2 bg-white/50 rounded-full"><entry.icon className="h-5 w-5 text-gray-700" /></div>
                                                <div className="flex-grow">
                                                    <p className="font-nunito font-semibold">{new Date(entry.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                                    <p className="text-gray-700">{entry.content}</p>
                                                    {entry.imageUrl && <Image src={entry.imageUrl} alt="Foto del diario" width={80} height={80} className="mt-2 rounded-md" data-ai-hint={entry.dataAiHint || ''} />}
                                                </div>
                                                 <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-7 w-7 text-gray-500 hover:text-destructive hover:bg-destructive/10">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>¿Estás seguro que deseas eliminar esto?</AlertDialogTitle>
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
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="datasheet" className="flex-grow overflow-auto">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl">Ficha Técnica (Ejemplo)</CardTitle>
                                <CardDescription>Información general sobre el cultivo de {crop.name}.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <p><strong>Especie:</strong> <i>Solanum lycopersicum var. cerasiforme</i></p>
                                <p><strong>Familia:</strong> Solanaceae</p>
                                <p><strong>Clima:</strong> Templado a cálido.</p>
                                <p><strong>Exposición Solar:</strong> Pleno sol (mínimo 6 horas diarias).</p>
                                <p><strong>Riego:</strong> Frecuente y regular, evitando encharcamiento.</p>
                                <p><strong>Suelo:</strong> Rico en materia orgánica, bien drenado.</p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
