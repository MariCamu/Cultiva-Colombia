
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { MapPin, Home, User, Leaf, Clock, Sun, ChevronLeft, ChevronRight, CheckCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

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

export default function TestPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<UserAnswers>(initialAnswers);
  const router = useRouter();

  const handleAnswerChange = (stateKey: keyof UserAnswers, value: string) => {
    setAnswers(prev => ({ ...prev, [stateKey]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Logic to show results
      const params = new URLSearchParams();
      if (answers.region && answers.region !== 'any') params.append('region', answers.region);
      if (answers.space) params.append('space', answers.space);
      if (answers.experience) params.append('experience', answers.experience);
      if (answers.plantType) params.append('plantType', answers.plantType);
      if (answers.care) params.append('care', answers.care);
      if (answers.learning) params.append('learning', answers.learning);
      
      router.push(`/cultivos?${params.toString()}`);
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
  }

  const progress = Math.round(((currentStep + 1) / steps.length) * 100);
  const currentQuestion = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isNextDisabled = !answers[currentQuestion.stateKey];

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-nunito font-bold tracking-tight text-foreground sm:text-4xl">
          Encuentra tu Cultivo Ideal
        </h1>
        <p className="mt-2 max-w-2xl mx-auto text-lg text-muted-foreground">
          Responde unas preguntas rápidas y descubre qué sembrar según tus preferencias y recursos.
        </p>
      </div>

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

      <div className="text-center">
        <Button variant="ghost" onClick={resetTest}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Volver a empezar el test
        </Button>
      </div>

    </div>
  );
}
