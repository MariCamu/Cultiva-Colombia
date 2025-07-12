
"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Droplet, Sun, Zap, NotebookText, Camera, Trash2, Upload } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import type { UserCrop } from '../page';
import { db, storage } from '@/lib/firebase';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from '@/context/auth-context';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

interface LogEntry {
  id: string;
  type: 'note' | 'water' | 'fertilize' | 'photo' | 'planted';
  date: { seconds: number; nanoseconds: number; };
  content: string;
  imageUrl?: string;
  dataAiHint?: string;
  icon: React.ElementType;
}

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

const getLogEntryIcon = (type: string) => {
    switch(type) {
        case 'note': return NotebookText;
        case 'water': return Droplet;
        case 'photo': return Camera;
        case 'fertilize': return Zap;
        case 'planted': return Sun;
        default: return NotebookText;
    }
}


export function CropDetailDialog({ crop, children }: { crop: UserCrop; children: React.ReactNode }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
  const [isLogLoading, setIsLogLoading] = useState(true);
  
  const [newNote, setNewNote] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!user) return;
    
    const logCollectionRef = collection(db, 'usuarios', user.uid, 'cultivos_del_usuario', crop.id, 'notas_progreso');
    const q = query(logCollectionRef, orderBy('fecha_nota', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const entries = snapshot.docs.map(doc => ({
        id: doc.id,
        icon: getLogEntryIcon(doc.data().type),
        ...doc.data(),
      } as LogEntry));
      setLogEntries(entries);
      setIsLogLoading(false);
    });

    return () => unsubscribe();
  }, [crop.id, user]);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const addLogEntry = async (type: 'note' | 'water' | 'fertilize' | 'photo') => {
    if (!user) return;
    
    let content = "";
    let data: { type: string; fecha_nota: any; texto_nota: string; url_foto?: string } = {
        type: type,
        fecha_nota: serverTimestamp(),
        texto_nota: "",
    };

    switch(type) {
        case 'note':
            if (!newNote) return;
            setIsAddingNote(true);
            data.texto_nota = newNote;
            break;
        case 'water':
            data.texto_nota = "Riego registrado.";
            break;
        case 'fertilize':
            data.texto_nota = "Abonado registrado.";
            break;
        case 'photo':
            if (!imageFile) return;
            setIsUploading(true);
            try {
                const storageRef = ref(storage, `cultivos_fotos/${user.uid}/${crop.id}/${Date.now()}_${imageFile.name}`);
                const snapshot = await uploadBytes(storageRef, imageFile);
                const downloadURL = await getDownloadURL(snapshot.ref);
                data.url_foto = downloadURL;
                data.texto_nota = newNote || "Foto de progreso añadida.";
            } catch (error) {
                console.error("Error uploading image:", error);
                toast({ variant: 'destructive', title: "Error al subir imagen" });
                setIsUploading(false);
                return;
            }
            break;
    }
    
    try {
        const logCollectionRef = collection(db, 'usuarios', user.uid, 'cultivos_del_usuario', crop.id, 'notas_progreso');
        await addDoc(logCollectionRef, data);
        setNewNote("");
        setImageFile(null);
        setImagePreview(null);
        toast({ title: "Diario actualizado", description: "Se ha añadido una nueva entrada."});
    } catch (error) {
        console.error("Error adding log entry:", error);
        toast({ variant: 'destructive', title: "Error al guardar" });
    } finally {
        setIsAddingNote(false);
        setIsUploading(false);
    }
  };

  const removeLogEntry = async (id: string) => {
    if (!user) return;
    try {
        await deleteDoc(doc(db, 'usuarios', user.uid, 'cultivos_del_usuario', crop.id, 'notas_progreso', id));
        toast({ title: "Entrada eliminada" });
    } catch (error) {
        console.error("Error removing log entry:", error);
        toast({ variant: 'destructive', title: "Error al eliminar" });
    }
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-3xl font-nunito font-bold">{crop.nombre_cultivo_personal}</DialogTitle>
          <DialogDescription>
            Detalles y seguimiento de tu cultivo.
          </DialogDescription>
        </DialogHeader>
        <div className="grid md:grid-cols-2 gap-6 mt-4 h-full overflow-hidden">
            <div className="flex flex-col gap-4">
                <div className="relative w-full aspect-video rounded-lg overflow-hidden">
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
                    <CardContent className="space-y-2 text-sm">
                        <p><strong>Fecha de Siembra:</strong> {new Date(crop.fecha_plantacion.seconds * 1000).toLocaleDateString()}</p>
                        <p><strong>Cosecha Estimada en:</strong> {crop.daysToHarvest - Math.round(crop.progress / 100 * crop.daysToHarvest)} días</p>
                        <p><strong>Progreso General:</strong></p>
                        <Progress value={crop.progress} />
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
                                <CardDescription>Añade notas, fotos y registra cuidados.</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow overflow-auto p-0">
                                <ScrollArea className="h-full p-6">
                                    <div className="space-y-4">
                                        {isLogLoading && <p>Cargando diario...</p>}
                                        {logEntries.map(entry => (
                                            <div key={entry.id} className={`relative p-3 rounded-lg border flex items-start gap-3 text-sm ${getLogEntryColor(entry.type)}`}>
                                                <div className="p-2 bg-white/50 rounded-full"><entry.icon className="h-5 w-5 text-gray-700" /></div>
                                                <div className="flex-grow">
                                                    <p className="font-nunito font-semibold">{new Date(entry.date.seconds * 1000).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
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
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </CardContent>
                             <CardFooter className="flex-col items-start gap-2 border-t pt-4">
                                <div className="w-full space-y-2">
                                  <Textarea placeholder="Escribe una nueva nota..." value={newNote} onChange={(e) => setNewNote(e.target.value)} />
                                  <div className="flex justify-between items-center">
                                      <div className="flex gap-2">
                                        <Button size="sm" variant="outline" onClick={() => addLogEntry('note')} disabled={isAddingNote || !newNote}><NotebookText className="mr-2 h-4 w-4" />Guardar Nota</Button>
                                        <Button size="sm" variant="outline" onClick={() => addLogEntry('water')}><Droplet className="mr-2 h-4 w-4" />Registrar Riego</Button>
                                        <Button size="sm" variant="outline" onClick={() => addLogEntry('fertilize')}><Zap className="mr-2 h-4 w-4" />Abonado</Button>
                                      </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                     <Input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageFileChange} className="text-xs" />
                                     {imagePreview && <Image src={imagePreview} alt="Preview" width={40} height={40} className="rounded-md" />}
                                     <Button size="sm" variant="outline" onClick={() => addLogEntry('photo')} disabled={isUploading || !imageFile}>
                                        {isUploading ? 'Subiendo...' : <Camera className="mr-2 h-4 w-4" />}
                                        Subir Foto
                                     </Button>
                                  </div>
                                </div>
                             </CardFooter>
                        </Card>
                    </TabsContent>
                    <TabsContent value="datasheet" className="flex-grow overflow-auto">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl">Ficha Técnica (Ejemplo)</CardTitle>
                                <CardDescription>Información general sobre el cultivo de {crop.nombre_cultivo_personal}.</CardDescription>
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
