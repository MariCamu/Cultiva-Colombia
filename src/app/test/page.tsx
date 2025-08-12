
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
import { MapPin, Home, User, Leaf, Clock, Sun, ChevronLeft, ChevronRight, CheckCircle, RefreshCw, Star, PlusCircle, Carrot, Wheat, BookHeart, Building, Sprout, Thermometer } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { AddCropDialog } from '../cultivos/components/add-crop-dialog';
import type { SampleCrop } from '@/models/crop-model';


const sampleCropsData: SampleCrop[] = [
    { id: 'frijol_andino', name: 'Fríjol', regionSlugs: ['andina'], pancoger: true, patrimonial: false, sembrable_en_casa: 'sí', educativo: 'sí', description: 'Leguminosa fundamental en la dieta andina, con gran variedad de tipos y usos.', imageUrl: 'https://firebasestorage.googleapis.com/v0/b/agrinavigate.firebasestorage.app/o/Cultivos%2Ffrijol.jpg?alt=media&token=9af96b87-5d6c-40af-af29-0a4087544269', dataAiHint: 'bean plant', estimatedPrice: 'Precio bajo', duration: 'Media (3–5 meses)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Leguminosas', difficulty: 2, daysToHarvest: 90, lifeCycle: [{ name: 'Siembra' }, { name: 'Germinación' }, { name: 'Crecimiento' }, { name: 'Floración' }, { name: 'Cosecha' }], clima: 'Templado' },
    { id: 'papa_andina', name: 'Papa', regionSlugs: ['andina'], pancoger: true, patrimonial: true, sembrable_en_casa: 'sí', educativo: 'sí', description: 'Tubérculo versátil y nutritivo, base de la alimentación en la región andina. Se puede sembrar en costal.', imageUrl: 'https://firebasestorage.googleapis.com/v0/b/agrinavigate.firebasestorage.app/o/Cultivos%2Fpapa.jpg?alt=media&token=9615f312-8217-47e2-8ea3-ae3fa80494c5', dataAiHint: 'potato field', estimatedPrice: 'Precio bajo', duration: 'Media (3–5 meses)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Tubérculos', difficulty: 2, daysToHarvest: 120, lifeCycle: [{ name: 'Siembra' }, { name: 'Brote' }, { name: 'Desarrollo' }, { name: 'Maduración' }, { name: 'Cosecha' }], clima: 'Frío' },
    { id: 'maiz_caribe', name: 'Maíz', regionSlugs: ['caribe'], pancoger: true, patrimonial: true, sembrable_en_casa: 'sí', educativo: 'sí', description: 'Cereal esencial en la cultura caribeña. Variedades pequeñas son aptas para siembra en casa.', imageUrl: 'https://firebasestorage.googleapis.com/v0/b/agrinavigate.firebasestorage.app/o/Cultivos%2Fmaiz.jpg?alt=media&token=b2e64dac-2b21-4ddc-b54d-4fa2f79a681a', dataAiHint: 'corn field', estimatedPrice: 'Precio bajo', duration: 'Media (3–5 meses)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Cereales', difficulty: 2, daysToHarvest: 100, lifeCycle: [{ name: 'Siembra' }, { name: 'Crecimiento' }, { name: 'Polinización' }, { name: 'Cosecha' }], clima: 'Cálido' },
    { id: 'platano_caribe', name: 'Plátano', regionSlugs: ['caribe'], pancoger: true, patrimonial: true, sembrable_en_casa: 'no', educativo: 'no', description: 'Fruta esencial en la cocina caribeña, consumida verde o madura.', imageUrl: 'https://firebasestorage.googleapis.com/v0/b/agrinavigate.firebasestorage.app/o/Cultivos%2Fplatano.jpg?alt=media&token=d9020e75-063b-400e-a855-934297e92040', dataAiHint: 'banana tree', estimatedPrice: 'Precio bajo', duration: 'Larga (6 meses o más)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Frutales', difficulty: 2, daysToHarvest: 365, lifeCycle: [{ name: 'Cormo' }, { name: 'Crecimiento' }, { name: 'Floración' }, { name: 'Cosecha' }], clima: 'Cálido' },
    { id: 'coco_insular', name: 'Coco', regionSlugs: ['insular'], pancoger: false, patrimonial: true, sembrable_en_casa: 'no', educativo: 'no', description: 'Fruto tropical versátil, utilizado para agua, pulpa y aceite en las islas.', imageUrl: 'https://firebasestorage.googleapis.com/v0/b/agrinavigate.firebasestorage.app/o/Cultivos%2Fcoco.jpg?alt=media&token=642cf4b3-a160-47ba-975d-2b3ea6f9f77d', dataAiHint: 'coconut tree', estimatedPrice: 'Precio bajo', duration: 'Larga (6 meses o más)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Frutales', difficulty: 2, daysToHarvest: 2555, lifeCycle: [{ name: 'Nuez' }, { name: 'Palma Joven' }, { name: 'Producción' }, { name: 'Cosecha' }], clima: 'Muy cálido' },
    { id: 'arbol_pan_insular', name: 'Árbol del pan', regionSlugs: ['insular'], pancoger: false, patrimonial: true, sembrable_en_casa: 'no', educativo: 'no', description: 'Fruto grande y almidonado, básico en la alimentación de las islas caribeñas.', imageUrl: 'https://firebasestorage.googleapis.com/v0/b/agrinavigate.firebasestorage.app/o/Cultivos%2Farbol_de_pan.jpg?alt=media&token=738a9ce7-9f24-4947-bd72-441e526f9932', dataAiHint: 'breadfruit tree', estimatedPrice: 'Precio moderado', duration: 'Larga (6 meses o más)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Frutales', difficulty: 3, daysToHarvest: 1095, lifeCycle: [{ name: 'Semilla' }, { name: 'Plántula' }, { name: 'Crecimiento' }, { name: 'Producción' }, { name: 'Cosecha' }], clima: 'Muy cálido' },
    { id: 'arroz_orinoquia', name: 'Arroz', regionSlugs: ['orinoquia'], pancoger: true, patrimonial: false, sembrable_en_casa: 'sí', educativo: 'sí', description: 'Cereal básico cultivado extensamente en las llanuras inundables. Se puede cultivar en balde.', imageUrl: 'https://firebasestorage.googleapis.com/v0/b/agrinavigate.firebasestorage.app/o/Cultivos%2Farroz.jpg?alt=media&token=07c37633-2c5f-4e14-811b-27b60c9cbbd6', dataAiHint: 'rice paddy', estimatedPrice: 'Precio bajo', duration: 'Media (3–5 meses)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Cereales', difficulty: 3, daysToHarvest: 120, lifeCycle: [{ name: 'Siembra' }, { name: 'Macollamiento' }, { name: 'Floración' }, { name: 'Maduración' }, { name: 'Cosecha' }], clima: 'Cálido' },
    { id: 'yuca_amazonia', name: 'Yuca', regionSlugs: ['amazonia'], pancoger: true, patrimonial: true, sembrable_en_casa: 'no', educativo: 'parcialmente', description: 'Raíz comestible fundamental en la dieta amazónica, adaptable a climas tropicales.', imageUrl: 'https://firebasestorage.googleapis.com/v0/b/agrinavigate.firebasestorage.app/o/Cultivos%2Fyuca.jpg?alt=media&token=581647db-384d-472c-8d7f-5c813515d097', dataAiHint: 'cassava plant', estimatedPrice: 'Precio bajo', duration: 'Larga (6 meses o más)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Tubérculos', difficulty: 2, daysToHarvest: 240, lifeCycle: [{ name: 'Estaca' }, { name: 'Brotación' }, { name: 'Engrosamiento' }, { name: 'Cosecha' }], clima: 'Cálido' },
    { id: 'cacao_amazonia', name: 'Cacao', regionSlugs: ['amazonia'], pancoger: false, patrimonial: true, sembrable_en_casa: 'no', educativo: 'sí', description: 'Fruto del que se obtiene el chocolate, de gran importancia cultural y económica. Se puede germinar como proyecto educativo.', imageUrl: 'https://firebasestorage.googleapis.com/v0/b/agrinavigate.firebasestorage.app/o/Cultivos%2Flow-angle-scacao.jpg?alt=media&token=810a39e7-767b-47d6-b457-d15cc31cbc14', dataAiHint: 'cacao pods', estimatedPrice: 'Precio moderado', duration: 'Larga (6 meses o más)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Frutales', difficulty: 4, daysToHarvest: 1095, lifeCycle: [{ name: 'Semilla' }, { name: 'Plántula' }, { name: 'Crecimiento' }, { name: 'Producción' }, { name: 'Cosecha' }], clima: 'Cálido' },
    { id: 'name_pacifico', name: 'Ñame', regionSlugs: ['pacifica'], pancoger: true, patrimonial: true, sembrable_en_casa: 'parcialmente', educativo: 'parcialmente', description: 'Tubérculo importante en la gastronomía del Pacífico, similar a la papa. Se puede sembrar en costal.', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'yam tuber', estimatedPrice: 'Precio bajo', duration: 'Larga (6 meses o más)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Tubérculos', difficulty: 3, daysToHarvest: 270, lifeCycle: [{ name: 'Siembra' }, { name: 'Brotación' }, { name: 'Desarrollo' }, { name: 'Maduración' }, { name: 'Cosecha' }], clima: 'Cálido' },
    { id: 'mango_caribe', name: 'Mango', regionSlugs: ['caribe'], pancoger: true, patrimonial: false, sembrable_en_casa: 'no', educativo: 'no', description: 'Fruta tropical dulce y jugosa, con múltiples variedades en la región.', imageUrl: 'https://firebasestorage.googleapis.com/v0/b/agrinavigate.firebasestorage.app/o/Cultivos%2Fmango.jpg?alt=media&token=2482a09a-213b-486a-9923-80a9c2f24d75', dataAiHint: 'mango fruit', estimatedPrice: 'Precio moderado', duration: 'Larga (6 meses o más)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Frutales', difficulty: 3, daysToHarvest: 1460, lifeCycle: [{ name: 'Semilla' }, { name: 'Plántula' }, { name: 'Crecimiento' }, { name: 'Producción' }, { name: 'Cosecha' }], clima: 'Cálido' },
    { id: 'oregano', name: 'Orégano', regionSlugs: ['andina', 'caribe', 'pacifica', 'orinoquia', 'amazonia', 'insular'], pancoger: false, patrimonial: true, sembrable_en_casa: 'sí', educativo: 'sí', description: 'Hierba aromática popular, fácil de cultivar en macetas.', imageUrl: 'https://firebasestorage.googleapis.com/v0/b/agrinavigate.firebasestorage.app/o/Cultivos%2Foregano.jpg?alt=media&token=b303420f-be22-4721-bc4e-3fbac3945796', dataAiHint: 'oregano plant', estimatedPrice: 'Precio bajo', duration: 'Corta (1–2 meses)', spaceRequired: 'Maceta pequeña (1–3 L)', plantType: 'Plantas aromáticas', difficulty: 1, daysToHarvest: 60, lifeCycle: [{ name: 'Siembra' }, { name: 'Crecimiento' }, { name: 'Cosecha' }], clima: 'Templado' },
    { id: 'hierbabuena', name: 'Hierbabuena', regionSlugs: ['andina', 'caribe', 'pacifica', 'orinoquia', 'amazonia', 'insular'], pancoger: false, patrimonial: true, sembrable_en_casa: 'sí', educativo: 'sí', description: 'Hierba aromática refrescante y de crecimiento rápido, ideal para principiantes.', imageUrl: 'https://firebasestorage.googleapis.com/v0/b/agrinavigate.firebasestorage.app/o/Cultivos%2Fhierbabuena.jpg?alt=media&token=dac10822-6ccd-42f1-a56f-65d38f8513a5', dataAiHint: 'mint plant', estimatedPrice: 'Precio bajo', duration: 'Corta (1–2 meses)', spaceRequired: 'Maceta pequeña (1–3 L)', plantType: 'Plantas aromáticas', difficulty: 1, daysToHarvest: 50, lifeCycle: [{ name: 'Siembra' }, { name: 'Crecimiento' }, { name: 'Cosecha' }], clima: 'Templado' },
    { id: 'albahaca', name: 'Albahaca', regionSlugs: ['andina', 'caribe', 'pacifica', 'orinoquia', 'amazonia', 'insular'], pancoger: false, patrimonial: true, sembrable_en_casa: 'sí', educativo: 'sí', description: 'Hierba culinaria muy versátil, perfecta para huertos caseros.', imageUrl: 'https://firebasestorage.googleapis.com/v0/b/agrinavigate.firebasestorage.app/o/Cultivos%2Falbahaca.jpg?alt=media&token=3e287ab2-463b-480c-9483-d18c6f9cb6c7', dataAiHint: 'basil plant', estimatedPrice: 'Precio bajo', duration: 'Corta (1–2 meses)', spaceRequired: 'Maceta pequeña (1–3 L)', plantType: 'Plantas aromáticas', difficulty: 2, daysToHarvest: 70, lifeCycle: [{ name: 'Siembra' }, { name: 'Crecimiento' }, { name: 'Cosecha' }], clima: 'Templado' },
    { id: 'guayaba', name: 'Guayaba', regionSlugs: ['andina', 'caribe'], pancoger: true, patrimonial: true, sembrable_en_casa: 'parcialmente', educativo: 'sí', description: 'Árbol frutal fácil de cuidar que produce frutos deliciosos. Requiere macetón grande o suelo.', imageUrl: 'https://firebasestorage.googleapis.com/v0/b/agrinavigate.firebasestorage.app/o/Cultivos%2Fguayaba.jpg?alt=media&token=354326fb-b67b-4af3-86d7-c6a6be6a8d43', dataAiHint: 'guava tree', estimatedPrice: 'Precio bajo', duration: 'Larga (6 meses o más)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Frutales', difficulty: 3, daysToHarvest: 730, lifeCycle: [{ name: 'Semilla' }, { name: 'Plántula' }, { name: 'Producción' }], clima: 'Templado' },
    { id: 'tomate_cherry', name: 'Tomate cherry', regionSlugs: ['andina', 'caribe', 'pacifica', 'orinoquia', 'amazonia', 'insular'], pancoger: false, patrimonial: false, sembrable_en_casa: 'sí', educativo: 'sí', description: 'Pequeños tomates dulces y jugosos, ideales para cultivar en macetas.', imageUrl: 'https://firebasestorage.googleapis.com/v0/b/agrinavigate.firebasestorage.app/o/Cultivos%2Ftomate_cherry.jpg?alt=media&token=44504067-71d1-4ee0-838b-54f70e31c451', dataAiHint: 'cherry tomatoes', estimatedPrice: 'Precio moderado', duration: 'Media (3–5 meses)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Hortalizas de fruto', difficulty: 2, daysToHarvest: 90, lifeCycle: [{ name: 'Siembra' }, { name: 'Crecimiento' }, { name: 'Floración' }, { name: 'Cosecha' }], clima: 'Templado' },
    { id: 'cebollin', name: 'Cebollín', regionSlugs: ['andina', 'caribe', 'pacifica', 'orinoquia', 'amazonia', 'insular'], pancoger: false, patrimonial: true, sembrable_en_casa: 'sí', educativo: 'sí', description: 'Fácil de cultivar en macetas, añade un sabor suave a cebolla a tus platos.', imageUrl: 'https://firebasestorage.googleapis.com/v0/b/agrinavigate.firebasestorage.app/o/Cultivos%2Fcebollin.jpg?alt=media&token=d15c1bb8-287a-48d0-93b7-9bf407a48ebf', dataAiHint: 'chives plant', estimatedPrice: 'Precio bajo', duration: 'Corta (1–2 meses)', spaceRequired: 'Maceta pequeña (1–3 L)', plantType: 'Hortalizas de hoja', difficulty: 1, daysToHarvest: 60, lifeCycle: [{ name: 'Siembra' }, { name: 'Crecimiento' }, { name: 'Cosecha' }], clima: 'Frío' },
    { id: 'maracuya', name: 'Maracuyá', regionSlugs: ['pacifica', 'andina', 'caribe'], pancoger: true, patrimonial: true, sembrable_en_casa: 'parcialmente', educativo: 'sí', description: 'Enredadera que produce una fruta tropical exótica y deliciosa.', imageUrl: 'https://firebasestorage.googleapis.com/v0/b/agrinavigate.firebasestorage.app/o/Cultivos%2Fmaracuya.jpg?alt=media&token=5fe49455-3e5c-4f4d-bb99-75385115b4c5', dataAiHint: 'passion fruit vine', estimatedPrice: 'Precio moderado', duration: 'Larga (6 meses o más)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Frutales', difficulty: 4, daysToHarvest: 365, lifeCycle: [{ name: 'Siembra' }, { name: 'Crecimiento' }, { name: 'Floración' }, { name: 'Cosecha' }], clima: 'Templado' },
    { id: 'auyama', name: 'Auyama', regionSlugs: ['caribe', 'andina'], pancoger: true, patrimonial: true, sembrable_en_casa: 'sí', educativo: 'sí', description: 'Calabaza versátil y nutritiva, se puede cultivar en huertas o costales.', imageUrl: 'https://firebasestorage.googleapis.com/v0/b/agrinavigate.firebasestorage.app/o/Cultivos%2Fauyama.jpg?alt=media&token=aba42a3a-3e24-4ddf-8a32-b800a6a8fe96', dataAiHint: 'squash plant', estimatedPrice: 'Precio bajo', duration: 'Media (3–5 meses)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Hortalizas de fruto', difficulty: 2, daysToHarvest: 100, lifeCycle: [{ name: 'Siembra' }, { name: 'Crecimiento' }, { name: 'Floración' }, { name: 'Cosecha' }], clima: 'Cálido' },
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
  clima: string;
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
    id: 'clima',
    icon: Thermometer,
    question: '¿Y cómo describirías el clima donde vives?',
    stateKey: 'clima',
    options: [
      { value: 'Frío', label: 'Frío', description: '10–17 °C (ej. Bogotá, Tunja)' },
      { value: 'Templado', label: 'Templado', description: '18–23 °C (ej. Medellín, Popayán)' },
      { value: 'Cálido', label: 'Cálido', description: '24–30 °C (ej. Barranquilla, Cali)' },
      { value: 'Muy cálido', label: 'Muy cálido', description: '>30 °C (ej. Riohacha, Santa Marta)' },
      { value: 'any', label: 'No estoy seguro' },
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
  clima: '',
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


// SVG Icons for Crop Types
const BeanIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 100 100" width="28" height="28" {...props}><path d="M50,10 C20,25 20,75 50,90 C80,75 80,25 50,10 M40,40 Q50,50 60,40 M40,60 Q50,50 60,60" stroke="#a16207" fill="#facc15" strokeWidth="5" /></svg>
);
const CarrotIconSvg = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 100 100" width="28" height="28" {...props}><path d="M50 90 L60 30 L40 30 Z" fill="#f97316"/><path d="M50 30 L40 10 L45 30 M50 30 L60 10 L55 30" fill="#22c55e"/></svg>
);
const LeafIconSvg = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 100 100" width="28" height="28" {...props}><path d="M50 10 C 20 40, 20 70, 50 90 C 80 70, 80 40, 50 10 Z" fill="#4ade80" /><line x1="50" y1="90" x2="50" y2="25" stroke="#16a34a" strokeWidth="5" /></svg>
);
const GenericFruitIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 100 100" width="28" height="28" {...props}><circle cx="50" cy="60" r="30" fill="#ef4444"/><path d="M50 30 Q 60 10, 70 20" stroke="#166534" strokeWidth="8" fill="none"/></svg>
)

const getCropTypeIcon = (plantType: string) => {
    switch (plantType) {
        case 'Leguminosas': return BeanIcon;
        case 'Tubérculos':
        case 'Hortalizas de raíz': return CarrotIconSvg;
        case 'Frutales':
        case 'Hortalizas de fruto': return GenericFruitIcon;
        case 'Cereales': return Wheat;
        case 'Plantas aromáticas':
        case 'Hortalizas de hoja': return LeafIconSvg;
        default: return LeafIconSvg;
    }
};

const getDifficultyStyles = (difficulty: number): { badge: string, iconBg: string, iconText: string } => {
    if (difficulty <= 2) return { badge: 'bg-green-100 text-green-800 border-green-200', iconBg: 'bg-green-500', iconText: 'text-white' };
    if (difficulty <= 4) return { badge: 'bg-yellow-100 text-yellow-800 border-yellow-200', iconBg: 'bg-yellow-500', iconText: 'text-white' };
    return { badge: 'bg-red-100 text-red-800 border-red-200', iconBg: 'bg-red-600', iconText: 'text-white' };
};

export default function TestPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<UserAnswers>(initialAnswers);
  const [showResults, setShowResults] = useState(false);
  const [filteredCrops, setFilteredCrops] = useState<SampleCrop[]>([]);

  const handleAnswerChange = (stateKey: keyof UserAnswers, value: string) => {
    setAnswers(prev => ({ ...prev, [stateKey]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      let maxDifficulty: number | null = null;
      if (answers.experience === 'principiante' || (answers.experience === 'intermedio' && answers.learning === 'no')) {
          maxDifficulty = 2;
      } else if (answers.experience === 'intermedio') {
          maxDifficulty = 4;
      }

      const regionFilter = answers.region !== 'any' ? answers.region : null;
      const climaFilter = answers.clima !== 'any' ? answers.clima : null;
      const spaceFilter = testSpaceMap[answers.space] || null;
      const plantTypeFilter = testPlantTypeMap[answers.plantType] || null;
      
      const results = sampleCropsData.filter(crop => {
          let matches = true;
          if (regionFilter && !crop.regionSlugs.includes(regionFilter)) matches = false;
          if (climaFilter && crop.clima !== climaFilter) matches = false;
          if (spaceFilter && crop.spaceRequired !== spaceFilter) matches = false;
          if (plantTypeFilter && crop.plantType !== plantTypeFilter) matches = false;
          if (maxDifficulty !== null && crop.difficulty > maxDifficulty) matches = false;
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
                      "flex items-center gap-4 rounded-lg border p-4 cursor-pointer transition-all hover:bg-muted/80 min-h-[44px]",
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
              <CardDescription>Basado en tus respuestas, estos son los cultivos que mejor se adaptan a ti.</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredCrops.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCrops.map((crop) => {
                     const TypeIcon = getCropTypeIcon(crop.plantType);
                     const difficultyStyles = getDifficultyStyles(crop.difficulty);
                     const difficultyText = crop.difficulty <= 2 ? 'Fácil' : crop.difficulty <=4 ? 'Media' : 'Difícil';
                    
                     return (
                        <Card key={crop.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow flex flex-col">
                          <CardHeader>
                              <div className="flex items-center gap-4">
                                  <div className={cn("p-3 rounded-full", difficultyStyles.iconBg)}>
                                      <TypeIcon className={cn("h-6 w-6", difficultyStyles.iconText)} />
                                  </div>
                                  <div>
                                      <CardTitle className="text-xl font-nunito font-bold">{crop.name}</CardTitle>
                                      <Badge variant="outline" className={cn("mt-1 w-fit font-nunito", difficultyStyles.badge)}>
                                        Dificultad: {difficultyText}
                                      </Badge>
                                  </div>
                              </div>
                          </CardHeader>
                          <CardContent className="flex-grow space-y-3 pt-0">
                             <Image
                                src={crop.imageUrl}
                                alt={crop.name}
                                width={300}
                                height={200}
                                className="w-full h-40 object-cover rounded-md"
                                data-ai-hint={crop.dataAiHint}
                              />
                             <p className="text-sm text-muted-foreground pt-2">{crop.description}</p>
                             <div className="flex flex-wrap gap-2 pt-2 border-t">
                               {crop.pancoger && <Badge variant="secondary" className="bg-sky-100 text-sky-800"><Sprout className="mr-1 h-3 w-3" />Pancoger</Badge>}
                               {crop.patrimonial && <Badge variant="secondary" className="bg-amber-100 text-amber-800"><Building className="mr-1 h-3 w-3" />Patrimonial</Badge>}
                               {crop.sembrable_en_casa !== 'no' && <Badge variant="secondary" className="bg-teal-100 text-teal-800"><Home className="mr-1 h-3 w-3" />Para Casa</Badge>}
                               {crop.educativo !== 'no' && <Badge variant="secondary" className="bg-indigo-100 text-indigo-800"><BookHeart className="mr-1 h-3 w-3" />Educativo</Badge>}
                             </div>
                          </CardContent>
                          <CardFooter>
                            <AddCropDialog crop={crop}>
                              <Button className="w-full">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Añadir a mi Dashboard
                              </Button>
                            </AddCropDialog>
                          </CardFooter>
                        </Card>
                     );
                  })}
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

    