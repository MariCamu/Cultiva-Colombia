
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { MapPin, Home, User, Leaf, Clock, Sun, ChevronLeft, ChevronRight, CheckCircle, RefreshCw, Star, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';


interface SampleCrop {
  id: string;
  name: string;
  description: string;
  regionSlug: string;
  imageUrl: string;
  dataAiHint: string;
  estimatedPrice: 'Precio bajo' | 'Precio moderado' | 'Precio alto';
  duration: 'Corta (1–2 meses)' | 'Media (3–5 meses)' | 'Larga (6 meses o más)';
  spaceRequired: 'Maceta pequeña (1–3 L)' | 'Maceta mediana (4–10 L)' | 'Maceta grande o jardín (10+ L)';
  plantType: 'Hortalizas de hoja' | 'Hortalizas de raíz' | 'Hortalizas de fruto' | 'Hortalizas de flor' | 'Leguminosas' | 'Cereales' | 'Plantas aromáticas' | 'Plantas de bulbo' | 'Frutales' | 'Tubérculos' | 'Otro';
  difficulty: 1 | 2 | 3 | 4 | 5;
  daysToHarvest: number;
}

const sampleCropsData: SampleCrop[] = [
  { id: 'tomate_cherry_id', name: 'Tomate Cherry', description: 'Pequeño y dulce, ideal para ensaladas y snacks. Crece bien en macetas.', regionSlug: 'andina', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'cherry tomatoes', estimatedPrice: 'Precio moderado', duration: 'Media (3–5 meses)', spaceRequired: 'Maceta mediana (4–10 L)', plantType: 'Hortalizas de fruto', difficulty: 3, daysToHarvest: 90 },
  { id: 'papa_andina', name: 'Papa (Región Andina)', description: 'Tubérculo versátil y nutritivo, base de la alimentación en la región andina.', regionSlug: 'andina', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'potato field', estimatedPrice: 'Precio bajo', duration: 'Media (3–5 meses)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Tubérculos', difficulty: 2, daysToHarvest: 120 },
  { id: 'cafe_andino', name: 'Café (Región Andina)', description: 'Reconocido mundialmente por su aroma y sabor, cultivado en las laderas montañosas.', regionSlug: 'andina', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'coffee plant', estimatedPrice: 'Precio moderado', duration: 'Larga (6 meses o más)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Frutales', difficulty: 4, daysToHarvest: 1095 },
  { id: 'yuca_amazonia', name: 'Yuca (Región Amazonía)', description: 'Raíz comestible fundamental en la dieta amazónica, adaptable a climas tropicales.', regionSlug: 'amazonia', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'cassava plant', estimatedPrice: 'Precio bajo', duration: 'Larga (6 meses o más)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Tubérculos', difficulty: 2, daysToHarvest: 240 },
  { id: 'copoazu_amazonia', name: 'Copoazú (Región Amazonía)', description: 'Fruta exótica con pulpa aromática, usada en jugos, postres y cosméticos.', regionSlug: 'amazonia', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'copoazu fruit', estimatedPrice: 'Precio moderado', duration: 'Larga (6 meses o más)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Frutales', difficulty: 3, daysToHarvest: 730 },
  { id: 'platano_caribe', name: 'Plátano (Región Caribe)', description: 'Fruta esencial en la cocina caribeña, consumida verde o madura.', regionSlug: 'caribe', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'banana tree', estimatedPrice: 'Precio bajo', duration: 'Larga (6 meses o más)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Frutales', difficulty: 2, daysToHarvest: 365 },
  { id: 'mango_caribe', name: 'Mango (Región Caribe)', description: 'Fruta tropical dulce y jugosa, con múltiples variedades en la región.', regionSlug: 'caribe', imageUrl: 'https://firebasestorage.googleapis.com/v0/b/agrinavigate.firebasestorage.app/o/composicion-de-deliciosos-mangos-exoticos.jpg?alt=media&token=b91b9d90-e67d-4a7f-9c37-fedb49fcba38', dataAiHint: 'mango fruit', estimatedPrice: 'Precio moderado', duration: 'Larga (6 meses o más)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Frutales', difficulty: 3, daysToHarvest: 1460 },
  { id: 'arroz_orinoquia', name: 'Arroz (Región Orinoquía)', description: 'Cereal básico cultivado extensamente en las llanuras inundables de la Orinoquía.', regionSlug: 'orinoquia', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'rice paddy', estimatedPrice: 'Precio bajo', duration: 'Media (3–5 meses)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Cereales', difficulty: 3, daysToHarvest: 120 },
  { id: 'marañon_orinoquia', name: 'Marañón (Región Orinoquía)', description: 'Fruto seco y pseudofruto carnoso, apreciado por su nuez y pulpa agridulce.', regionSlug: 'orinoquia', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'cashew fruit', estimatedPrice: 'Precio alto', duration: 'Larga (6 meses o más)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Frutales', difficulty: 4, daysToHarvest: 1095 },
  { id: 'chontaduro_pacifica', name: 'Chontaduro (Región Pacífica)', description: 'Fruto de palmera altamente nutritivo, parte integral de la cultura del Pacífico.', regionSlug: 'pacifica', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'chontaduro fruit', estimatedPrice: 'Precio moderado', duration: 'Larga (6 meses o más)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Frutales', difficulty: 3, daysToHarvest: 1825 },
  { id: 'borojo_pacifica', name: 'Borojó (Región Pacífica)', description: 'Fruta energética con propiedades afrodisíacas, consumida en jugos y jaleas.', regionSlug: 'pacifica', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'borojo fruit', estimatedPrice: 'Precio moderado', duration: 'Larga (6 meses o más)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Frutales', difficulty: 4, daysToHarvest: 1825 },
  { id: 'coco_insular', name: 'Coco (Región Insular)', description: 'Fruto tropical versátil, utilizado para agua, pulpa y aceite en las islas.', regionSlug: 'insular', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'coconut tree', estimatedPrice: 'Precio bajo', duration: 'Larga (6 meses o más)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Frutales', difficulty: 2, daysToHarvest: 2555 },
  { id: 'pan_de_fruta_insular', name: 'Pan de Fruta (Región Insular)', description: 'Fruto grande y almidonado, básico en la alimentación de las islas caribeñas.', regionSlug: 'insular', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'breadfruit tree', estimatedPrice: 'Precio moderado', duration: 'Larga (6 meses o más)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Frutales', difficulty: 3, daysToHarvest: 1095 },
];


interface Step {
  id: string;
  icon: React.ElementType;
  question: string;
  options: { value: string; label: string; description?: string }[];
  stateKey: keyof UserAnswers;
}

interface UserAnswers {
  region: string;
  space: string;
  experience: string;
  plantType: string;
  care: string;
  learning: string;
}

const steps: Step[] = [
  {
    id: 'region',
    icon: MapPin,
    question: '¿En qué región de Colombia te encuentras?',
    stateKey: 'region',
    options: [
      { value: 'andina', label: 'Andina' },
      { value: 'caribe', label: 'Caribe' },
      { value: 'pacifica', label: 'Pacífica' },
      { value: 'orinoquia', label: 'Orinoquía' },
      { value: 'amazonia', label: 'Amazonía' },
      { value: 'insular', label: 'Insular' },
      { value: 'any', label: 'No estoy seguro / Quiero ver todas' },
    ],
  },
  {
    id: 'space',
    icon: Home,
    question: '¿De cuánto espacio dispones para cultivar?',
    stateKey: 'space',
    options: [
      { value: 'pequeno', label: 'Espacio pequeño', description: 'Macetas en un balcón o ventana.' },
      { value: 'mediano', label: 'Espacio mediano', description: 'Un patio o un jardín pequeño.' },
      { value: 'grande', label: 'Espacio grande', description: 'Una huerta o un terreno amplio.' },
    ],
  },
  {
    id: 'experience',
    icon: User,
    question: '¿Cuál es tu nivel de experiencia en jardinería?',
    stateKey: 'experience',
    options: [
      { value: 'principiante', label: 'Principiante', description: '¡Estoy empezando mi aventura verde!' },
      { value: 'intermedio', label: 'Intermedio', description: 'Ya he cultivado algunas cosas antes.' },
      { value: 'avanzado', label: 'Avanzado', description: 'Tengo manos de jardinero experto.' },
    ],
  },
  {
    id: 'plantType',
    icon: Leaf,
    question: '¿Qué tipo de plantas te llaman más la atención?',
    stateKey: 'plantType',
    options: [
      { value: 'comestibles', label: 'Comestibles', description: 'Hortalizas, hierbas para cocinar.' },
      { value: 'aromaticas', label: 'Aromáticas', description: 'Para infusiones o dar buen olor.' },
      { value: 'coloridas', label: 'Coloridas', description: 'Flores y plantas ornamentales.' },
      { value: 'frutales', label: 'Frutales', description: 'Árboles o arbustos que den fruta.' },
      { value: 'cualquiera', label: 'Cualquiera', description: '¡Sorpréndeme!' },
    ],
  },
  {
    id: 'care',
    icon: Clock,
    question: '¿Cuánto tiempo puedes dedicar a tus plantas?',
    stateKey: 'care',
    options: [
      { value: 'diario', label: 'Cuidado diario', description: 'Un ratito todos los días.' },
      { value: 'dos_tres_semana', label: 'Un par de veces por semana', description: '2-3 días a la semana.' },
      { value: 'ocasionalmente', label: 'Ocasionalmente', description: 'Prefiero algo de bajo mantenimiento.' },
    ],
  },
  {
    id: 'learning',
    icon: Sun,
    question: '¿Te interesa aprender sobre el proceso o prefieres algo muy sencillo?',
    stateKey: 'learning',
    options: [
      { value: 'si', label: 'Sí, quiero aprender', description: 'Me emociona el reto y aprender trucos.' },
      { value: 'no', label: 'No, prefiero lo más fácil', description: 'Busco algo simple que casi se cuide solo.' },
    ],
  },
];

const initialAnswers: UserAnswers = {
  region: '',
  space: '',
  experience: '',
  plantType: '',
  care: '',
  learning: '',
};

// Mapeos para filtros
const testPlantTypeMap: { [key: string]: string | null } = {
  'comestibles': null,
  'aromaticas': 'Plantas aromáticas',
  'coloridas': 'Hortalizas de flor',
  'frutales': 'Frutales',
  'cualquiera': null,
};

const testSpaceMap: { [key: string]: string | null } = {
  'pequeno': 'Maceta pequeña (1–3 L)',
  'mediano': 'Maceta mediana (4–10 L)',
  'grande': 'Maceta grande o jardín (10+ L)',
};


export default function TestPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<UserAnswers>(initialAnswers);
  const [showResults, setShowResults] = useState(false);
  const [filteredCrops, setFilteredCrops] = useState<SampleCrop[]>([]);

  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isAddingCrop, setIsAddingCrop] = useState<string | null>(null);

  const handleAnswerChange = (stateKey: keyof UserAnswers, value: string) => {
    setAnswers(prev => ({ ...prev, [stateKey]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Logic to calculate and show results
      let difficultyValue: string | null = null;
      if (answers.experience) {
          if (answers.experience === 'principiante') {
              difficultyValue = '1';
              if (answers.learning === 'si' && (answers.care === 'diario' || answers.care === 'dos_tres_semana')) difficultyValue = '2';
          } else if (answers.experience === 'intermedio') {
              difficultyValue = '2';
              if (answers.learning === 'si') difficultyValue = '3';
              if (answers.learning === 'si' && (answers.care === 'diario' || answers.care === 'dos_tres_semana')) difficultyValue = '4';
          } else if (answers.experience === 'avanzado') {
              difficultyValue = '3';
              if (answers.learning === 'si') difficultyValue = '4';
              if (answers.learning === 'si' && (answers.care === 'diario' || answers.care === 'dos_tres_semana')) difficultyValue = '5';
          }
      }

      const regionFilter = answers.region !== 'any' ? answers.region : null;
      const spaceFilter = testSpaceMap[answers.space] || null;
      const plantTypeFilter = testPlantTypeMap[answers.plantType] || null;

      const results = sampleCropsData.filter(crop => {
          let matches = true;
          if (regionFilter && crop.regionSlug !== regionFilter) matches = false;
          if (spaceFilter && crop.spaceRequired !== spaceFilter) matches = false;
          if (plantTypeFilter && crop.plantType !== plantTypeFilter) matches = false;
          if (difficultyValue && crop.difficulty.toString() > difficultyValue) matches = false; // Show easier or equal
          return matches;
      });

      setFilteredCrops(results);
      setShowResults(true);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  const resetTest = () => {
      setCurrentStep(0);
      setAnswers(initialAnswers);
      setShowResults(false);
      setFilteredCrops([]);
  }

  const handleAddCropToDashboard = async (crop: SampleCrop) => {
    if (!user) {
      toast({
        title: "Inicia Sesión",
        description: "Debes iniciar sesión para añadir cultivos a tu dashboard.",
        variant: "destructive",
      });
      router.push('/login');
      return;
    }

    setIsAddingCrop(crop.id);
    const dataToAdd = {
      ficha_cultivo_id: crop.id,
      nombre_cultivo_personal: crop.name,
      fecha_plantacion: serverTimestamp(),
      imageUrl: crop.imageUrl,
      dataAiHint: crop.dataAiHint,
      daysToHarvest: crop.daysToHarvest,
      nextTask: { name: 'Regar', dueInDays: 2, iconName: 'Droplets' },
      lastNote: '¡Cultivo recién añadido! Empieza a registrar tu progreso.',
    };
    
    try {
      const userCropsCollection = collection(db, 'usuarios', user.uid, 'cultivos_del_usuario');
      await addDoc(userCropsCollection, dataToAdd);
      
      toast({
        title: "¡Cultivo Añadido!",
        description: `${crop.name} ha sido añadido a tu dashboard.`,
      });
      router.push('/dashboard');
      
    } catch (error: any) {
      console.error("Error al añadir cultivo al dashboard:", error);
      toast({
        title: "Error al añadir cultivo",
        description: `Hubo un problema al guardar los datos.`,
        variant: "destructive",
      });
    } finally {
      setIsAddingCrop(null);
    }
  };

  const progress = Math.round(((currentStep + 1) / steps.length) * 100);
  const currentQuestion = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isNextDisabled = !answers[currentQuestion.stateKey];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-nunito font-bold tracking-tight text-foreground sm:text-4xl">
          Encuentra tu Cultivo Ideal
        </h1>
        <p className="mt-2 max-w-2xl mx-auto text-lg text-muted-foreground">
          Responde unas preguntas rápidas y descubre qué sembrar según tus preferencias y recursos.
        </p>
      </div>

      {!showResults && (
        <Card>
          <CardHeader>
            <div className="w-full space-y-2">
              <div className="flex justify-between text-sm font-nunito font-semibold text-muted-foreground">
                <span>Pregunta {currentStep + 1} de {steps.length}</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <currentQuestion.icon className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-nunito font-semibold">{currentQuestion.question}</h2>
              </div>
              
              <RadioGroup
                value={answers[currentQuestion.stateKey]}
                onValueChange={(value) => handleAnswerChange(currentQuestion.stateKey, value)}
                className="space-y-3"
              >
                {currentQuestion.options.map(option => (
                  <Label
                    key={option.value}
                    htmlFor={`${currentQuestion.id}-${option.value}`}
                    className={cn(
                      "flex items-center gap-4 rounded-lg border p-4 cursor-pointer transition-all hover:bg-muted/80",
                      answers[currentQuestion.stateKey] === option.value && "bg-muted border-primary ring-2 ring-primary"
                    )}
                  >
                    <RadioGroupItem value={option.value} id={`${currentQuestion.id}-${option.value}`} />
                    <div className="flex-grow">
                      <p className="font-nunito font-semibold text-base">{option.label}</p>
                      {option.description && <p className="text-sm text-muted-foreground">{option.description}</p>}
                    </div>
                  </Label>
                ))}
              </RadioGroup>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handlePrev} disabled={currentStep === 0}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Anterior
            </Button>
            <Button onClick={handleNext} disabled={isNextDisabled}>
              {isLastStep ? 'Ver Mis Recomendaciones' : 'Siguiente'}
              {isLastStep ? <CheckCircle className="ml-2 h-4 w-4" /> : <ChevronRight className="ml-2 h-4 w-4" />}
            </Button>
          </CardFooter>
        </Card>
      )}

      {showResults && (
        <div className="space-y-6">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto bg-green-100 p-3 rounded-full w-fit">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <CardTitle className="text-2xl mt-4">¡Estos son tus cultivos recomendados!</CardTitle>
              <CardDescription>Basado en tus respuestas, estos cultivos son un excelente punto de partida.</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredCrops.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCrops.map((crop) => (
                    <Card key={crop.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow flex flex-col">
                       <Image
                        src={crop.imageUrl}
                        alt={crop.name}
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover"
                        data-ai-hint={crop.dataAiHint}
                      />
                      <CardHeader>
                        <CardTitle className="text-xl font-nunito font-bold">{crop.name}</CardTitle>
                        <Badge variant="outline" className="mt-1 w-fit font-nunito">Región: {crop.regionSlug}</Badge>
                      </CardHeader>
                      <CardContent className="flex-grow space-y-3">
                         <p className="text-sm text-muted-foreground mb-3">{crop.description}</p>
                         <div className="space-y-2 pt-2 border-t">
                             <div className="flex items-center">
                                 <span className="text-xs font-nunito font-semibold mr-2 w-28">Dificultad:</span>
                                 <div className="flex">
                                     {Array.from({ length: 5 }).map((_, i) => (
                                     <Star key={i} className={`h-4 w-4 ${i < crop.difficulty ? 'fill-yellow-400 text-yellow-500' : 'text-gray-300'}`} />
                                     ))}
                                 </div>
                             </div>
                             <Badge variant="outline" className="font-nunito">Espacio: {crop.spaceRequired}</Badge>
                         </div>
                      </CardContent>
                      <CardFooter>
                         <Button 
                            onClick={() => handleAddCropToDashboard(crop)} 
                            disabled={isAddingCrop === crop.id}
                            className="w-full"
                          >
                           <PlusCircle className="mr-2 h-4 w-4" />
                           {isAddingCrop === crop.id ? 'Añadiendo...' : 'Añadir a mi Dashboard'}
                         </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <Alert>
                  <AlertTitle>No se encontraron cultivos</AlertTitle>
                  <AlertDescription>No hemos encontrado cultivos que coincidan perfectamente con tus respuestas. ¡Intenta con otras opciones!</AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button variant="ghost" onClick={resetTest}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Volver a empezar el test
              </Button>
            </CardFooter>
          </Card>
          <div className="text-center">
             <Button asChild>
                <Link href="/cultivos">O explora todos los cultivos</Link>
             </Button>
          </div>
        </div>
      )}
    </div>
  );
}
