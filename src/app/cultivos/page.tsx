
"use client";

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { useEffect, useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, AlertCircle, CheckCircle, HelpCircle, LocateFixed, Star, Filter, MessageSquareText, PlusCircle, Wheat, BookHeart, Building, Home, Sprout, Search, ExternalLink } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { AddCropDialog } from './components/add-crop-dialog';
import type { SampleCrop } from '@/models/crop-model';
import { Input } from '@/components/ui/input';
import Link from 'next/link';


const sampleCropsData: SampleCrop[] = [
    { id: 'frijol_andino', name: 'Fríjol', regionSlugs: ['andina'], pancoger: true, patrimonial: false, sembrable_en_casa: 'sí', educativo: 'sí', description: 'Leguminosa fundamental en la dieta andina, con gran variedad de tipos y usos.', imageUrl: 'https://firebasestorage.googleapis.com/v0/b/agrinavigate.firebasestorage.app/o/Cultivos%2Ffrijol.jpg?alt=media&token=9af96b87-5d6c-40af-af29-0a4087544269', dataAiHint: 'bean plant', estimatedPrice: 'Precio bajo', duration: 'Media (3–5 meses)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Leguminosas', difficulty: 2, lifeCycle: [{ name: 'Siembra' }, { name: 'Germinación' }, { name: 'Crecimiento' }, { name: 'Floración' }, { name: 'Cosecha' }], clima: 'Templado', datos_programaticos: { dias_para_cosecha: 90, frecuencia_riego_dias: 3 } },
    { id: 'papa_andina', name: 'Papa', regionSlugs: ['andina'], pancoger: true, patrimonial: true, sembrable_en_casa: 'sí', educativo: 'sí', description: 'Tubérculo versátil y nutritivo, base de la alimentación en la región andina. Se puede sembrar en costal.', imageUrl: 'https://firebasestorage.googleapis.com/v0/b/agrinavigate.firebasestorage.app/o/Cultivos%2Fpapa.jpg?alt=media&token=9615f312-8217-47e2-8ea3-ae3fa80494c5', dataAiHint: 'potato field', estimatedPrice: 'Precio bajo', duration: 'Media (3–5 meses)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Tubérculos', difficulty: 2, lifeCycle: [{ name: 'Siembra' }, { name: 'Brote' }, { name: 'Desarrollo' }, { name: 'Maduración' }, { name: 'Cosecha' }], clima: 'Frío', datos_programaticos: { dias_para_cosecha: 120, frecuencia_riego_dias: 4 } },
    { id: 'maiz_caribe', name: 'Maíz', regionSlugs: ['caribe'], pancoger: true, patrimonial: true, sembrable_en_casa: 'sí', educativo: 'sí', description: 'Cereal esencial en la cultura caribeña. Variedades pequeñas son aptas para siembra en casa.', imageUrl: 'https://firebasestorage.googleapis.com/v0/b/agrinavigate.firebasestorage.app/o/Cultivos%2Fmaiz.jpg?alt=media&token=b2e64dac-2b21-4ddc-b54d-4fa2f79a681a', dataAiHint: 'corn field', estimatedPrice: 'Precio bajo', duration: 'Media (3–5 meses)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Cereales', difficulty: 2, lifeCycle: [{ name: 'Siembra' }, { name: 'Crecimiento' }, { name: 'Polinización' }, { name: 'Cosecha' }], clima: 'Cálido', datos_programaticos: { dias_para_cosecha: 100, frecuencia_riego_dias: 2 } },
    { id: 'platano_caribe', name: 'Plátano', regionSlugs: ['caribe'], pancoger: true, patrimonial: true, sembrable_en_casa: 'no', educativo: 'no', description: 'Fruta esencial en la cocina caribeña, consumida verde o madura.', imageUrl: 'https://firebasestorage.googleapis.com/v0/b/agrinavigate.firebasestorage.app/o/Cultivos%2Fplatano.jpg?alt=media&token=d9020e75-063b-400e-a855-934297e92040', dataAiHint: 'banana tree', estimatedPrice: 'Precio bajo', duration: 'Larga (6 meses o más)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Frutales', difficulty: 2, lifeCycle: [{ name: 'Cormo' }, { name: 'Crecimiento' }, { name: 'Floración' }, { name: 'Cosecha' }], clima: 'Cálido', datos_programaticos: { dias_para_cosecha: 365, frecuencia_riego_dias: 3 } },
    { id: 'coco_insular', name: 'Coco', regionSlugs: ['insular'], pancoger: false, patrimonial: true, sembrable_en_casa: 'no', educativo: 'no', description: 'Fruto tropical versátil, utilizado para agua, pulpa y aceite en las islas.', imageUrl: 'https://firebasestorage.googleapis.com/v0/b/agrinavigate.firebasestorage.app/o/Cultivos%2Fcoco.jpg?alt=media&token=642cf4b3-a160-47ba-975d-2b3ea6f9f77d', dataAiHint: 'coconut tree', estimatedPrice: 'Precio bajo', duration: 'Larga (6 meses o más)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Frutales', difficulty: 2, lifeCycle: [{ name: 'Nuez' }, { name: 'Palma Joven' }, { name: 'Producción' }, { name: 'Cosecha' }], clima: 'Muy cálido', datos_programaticos: { dias_para_cosecha: 2555, frecuencia_riego_dias: 7 } },
    { id: 'arbol_pan_insular', name: 'Árbol del pan', regionSlugs: ['insular'], pancoger: false, patrimonial: true, sembrable_en_casa: 'no', educativo: 'no', description: 'Fruto grande y almidonado, básico en la alimentación de las islas caribeñas.', imageUrl: 'https://firebasestorage.googleapis.com/v0/b/agrinavigate.firebasestorage.app/o/Cultivos%2Farbol_de_pan.jpg?alt=media&token=738a9ce7-9f24-4947-bd72-441e526f9932', dataAiHint: 'breadfruit tree', estimatedPrice: 'Precio moderado', duration: 'Larga (6 meses o más)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Frutales', difficulty: 3, lifeCycle: [{ name: 'Semilla' }, { name: 'Plántula' }, { name: 'Crecimiento' }, { name: 'Producción' }, { name: 'Cosecha' }], clima: 'Muy cálido', datos_programaticos: { dias_para_cosecha: 1095, frecuencia_riego_dias: 5 } },
    { id: 'arroz_orinoquia', name: 'Arroz', regionSlugs: ['orinoquia'], pancoger: true, patrimonial: false, sembrable_en_casa: 'sí', educativo: 'sí', description: 'Cereal básico cultivado extensamente en las llanuras inundables. Se puede cultivar en balde.', imageUrl: 'https://firebasestorage.googleapis.com/v0/b/agrinavigate.firebasestorage.app/o/Cultivos%2Farroz.jpg?alt=media&token=07c37633-2c5f-4e14-811b-27b60c9cbbd6', dataAiHint: 'rice paddy', estimatedPrice: 'Precio bajo', duration: 'Media (3–5 meses)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Cereales', difficulty: 3, lifeCycle: [{ name: 'Siembra' }, { name: 'Macollamiento' }, { name: 'Floración' }, { name: 'Maduración' }, { name: 'Cosecha' }], clima: 'Cálido', datos_programaticos: { dias_para_cosecha: 120, frecuencia_riego_dias: 1 } },
    { id: 'yuca_amazonia', name: 'Yuca', regionSlugs: ['amazonia'], pancoger: true, patrimonial: true, sembrable_en_casa: 'no', educativo: 'parcialmente', description: 'Raíz comestible fundamental en la dieta amazónica, adaptable a climas tropicales.', imageUrl: 'https://firebasestorage.googleapis.com/v0/b/agrinavigate.firebasestorage.app/o/Cultivos%2Fyuca.jpg?alt=media&token=581647db-384d-472c-8d7f-5c813515d097', dataAiHint: 'cassava plant', estimatedPrice: 'Precio bajo', duration: 'Larga (6 meses o más)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Tubérculos', difficulty: 2, lifeCycle: [{ name: 'Estaca' }, { name: 'Brotación' }, { name: 'Engrosamiento' }, { name: 'Cosecha' }], clima: 'Cálido', datos_programaticos: { dias_para_cosecha: 240, frecuencia_riego_dias: 4 } },
    { id: 'cacao_amazonia', name: 'Cacao', regionSlugs: ['amazonia'], pancoger: false, patrimonial: true, sembrable_en_casa: 'no', educativo: 'sí', description: 'Fruto del que se obtiene el chocolate, de gran importancia cultural y económica. Se puede germinar como proyecto educativo.', imageUrl: 'https://firebasestorage.googleapis.com/v0/b/agrinavigate.firebasestorage.app/o/Cultivos%2Flow-angle-scacao.jpg?alt=media&token=810a39e7-767b-47d6-b457-d15cc31cbc14', dataAiHint: 'cacao pods', estimatedPrice: 'Precio moderado', duration: 'Larga (6 meses o más)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Frutales', difficulty: 4, lifeCycle: [{ name: 'Semilla' }, { name: 'Plántula' }, { name: 'Crecimiento' }, { name: 'Producción' }, { name: 'Cosecha' }], clima: 'Cálido', datos_programaticos: { dias_para_cosecha: 1095, frecuencia_riego_dias: 3 } },
    { id: 'name_pacifico', name: 'Ñame', regionSlugs: ['pacifica'], pancoger: true, patrimonial: true, sembrable_en_casa: 'parcialmente', educativo: 'parcialmente', description: 'Tubérculo importante en la gastronomía del Pacífico, similar a la papa. Se puede sembrar en costal.', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'yam tuber', estimatedPrice: 'Precio bajo', duration: 'Larga (6 meses o más)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Tubérculos', difficulty: 3, lifeCycle: [{ name: 'Siembra' }, { name: 'Brotación' }, { name: 'Desarrollo' }, { name: 'Maduración' }, { name: 'Cosecha' }], clima: 'Cálido', datos_programaticos: { dias_para_cosecha: 270, frecuencia_riego_dias: 4 } },
    { id: 'mango_caribe', name: 'Mango', regionSlugs: ['caribe'], pancoger: true, patrimonial: false, sembrable_en_casa: 'no', educativo: 'no', description: 'Fruta tropical dulce y jugosa, con múltiples variedades en la región.', imageUrl: 'https://firebasestorage.googleapis.com/v0/b/agrinavigate.firebasestorage.app/o/Cultivos%2Fmango.jpg?alt=media&token=2482a09a-213b-486a-9923-80a9c2f24d75', dataAiHint: 'mango fruit', estimatedPrice: 'Precio moderado', duration: 'Larga (6 meses o más)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Frutales', difficulty: 3, lifeCycle: [{ name: 'Semilla' }, { name: 'Plántula' }, { name: 'Crecimiento' }, { name: 'Producción' }, { name: 'Cosecha' }], clima: 'Cálido', datos_programaticos: { dias_para_cosecha: 1460, frecuencia_riego_dias: 5 } },
    { id: 'oregano', name: 'Orégano', regionSlugs: ['andina', 'caribe', 'pacifica', 'orinoquia', 'amazonia', 'insular'], pancoger: false, patrimonial: true, sembrable_en_casa: 'sí', educativo: 'sí', description: 'Hierba aromática popular, fácil de cultivar en macetas.', imageUrl: 'https://firebasestorage.googleapis.com/v0/b/agrinavigate.firebasestorage.app/o/Cultivos%2Foregano.jpg?alt=media&token=b303420f-be22-4721-bc4e-3fbac3945796', dataAiHint: 'oregano plant', estimatedPrice: 'Precio bajo', duration: 'Corta (1–2 meses)', spaceRequired: 'Maceta pequeña (1–3 L)', plantType: 'Plantas aromáticas', difficulty: 1, lifeCycle: [{ name: 'Siembra' }, { name: 'Crecimiento' }, { name: 'Cosecha' }], clima: 'Templado', datos_programaticos: { dias_para_cosecha: 60, frecuencia_riego_dias: 2 } },
    { id: 'hierbabuena', name: 'Hierbabuena', regionSlugs: ['andina', 'caribe', 'pacifica', 'orinoquia', 'amazonia', 'insular'], pancoger: false, patrimonial: true, sembrable_en_casa: 'sí', educativo: 'sí', description: 'Hierba aromática refrescante y de crecimiento rápido, ideal para principiantes.', imageUrl: 'https://firebasestorage.googleapis.com/v0/b/agrinavigate.firebasestorage.app/o/Cultivos%2Fhierbabuena.jpg?alt=media&token=dac10822-6ccd-42f1-a56f-65d38f8513a5', dataAiHint: 'mint plant', estimatedPrice: 'Precio bajo', duration: 'Corta (1–2 meses)', spaceRequired: 'Maceta pequeña (1–3 L)', plantType: 'Plantas aromáticas', difficulty: 1, lifeCycle: [{ name: 'Siembra' }, { name: 'Crecimiento' }, { name: 'Cosecha' }], clima: 'Templado', datos_programaticos: { dias_para_cosecha: 50, frecuencia_riego_dias: 2 } },
    { id: 'albahaca', name: 'Albahaca', regionSlugs: ['andina', 'caribe', 'pacifica', 'orinoquia', 'amazonia', 'insular'], pancoger: false, patrimonial: true, sembrable_en_casa: 'sí', educativo: 'sí', description: 'Hierba culinaria muy versátil, perfecta para huertos caseros.', imageUrl: 'https://firebasestorage.googleapis.com/v0/b/agrinavigate.firebasestorage.app/o/Cultivos%2Falbahaca.jpg?alt=media&token=3e287ab2-463b-480c-9483-d18c6f9cb6c7', dataAiHint: 'basil plant', estimatedPrice: 'Precio bajo', duration: 'Corta (1–2 meses)', spaceRequired: 'Maceta pequeña (1–3 L)', plantType: 'Plantas aromáticas', difficulty: 2, lifeCycle: [{ name: 'Siembra' }, { name: 'Crecimiento' }, { name: 'Cosecha' }], clima: 'Templado', datos_programaticos: { dias_para_cosecha: 70, frecuencia_riego_dias: 2 } },
    { id: 'guayaba', name: 'Guayaba', regionSlugs: ['andina', 'caribe'], pancoger: true, patrimonial: true, sembrable_en_casa: 'parcialmente', educativo: 'sí', description: 'Árbol frutal fácil de cuidar que produce frutos deliciosos. Requiere macetón grande o suelo.', imageUrl: 'https://firebasestorage.googleapis.com/v0/b/agrinavigate.firebasestorage.app/o/Cultivos%2Fguayaba.jpg?alt=media&token=354326fb-b67b-4af3-86d7-c6a6be6a8d43', dataAiHint: 'guava tree', estimatedPrice: 'Precio bajo', duration: 'Larga (6 meses o más)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Frutales', difficulty: 3, lifeCycle: [{ name: 'Semilla' }, { name: 'Plántula' }, { name: 'Producción' }], clima: 'Templado', datos_programaticos: { dias_para_cosecha: 730, frecuencia_riego_dias: 4 } },
    { id: 'tomate_cherry', name: 'Tomate cherry', regionSlugs: ['andina', 'caribe', 'pacifica', 'orinoquia', 'amazonia', 'insular'], pancoger: false, patrimonial: false, sembrable_en_casa: 'sí', educativo: 'sí', description: 'Pequeños tomates dulces y jugosos, ideales para cultivar en macetas.', imageUrl: 'https://firebasestorage.googleapis.com/v0/b/agrinavigate.firebasestorage.app/o/Cultivos%2Ftomate_cherry.jpg?alt=media&token=44504067-71d1-4ee0-838b-54f70e31c451', dataAiHint: 'cherry tomatoes', estimatedPrice: 'Precio moderado', duration: 'Media (3–5 meses)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Hortalizas de fruto', difficulty: 2, lifeCycle: [{ name: 'Siembra' }, { name: 'Crecimiento' }, { name: 'Floración' }, { name: 'Cosecha' }], clima: 'Templado', datos_programaticos: { dias_para_cosecha: 90, frecuencia_riego_dias: 3 } },
    { id: 'cebollin', name: 'Cebollín', regionSlugs: ['andina', 'caribe', 'pacifica', 'orinoquia', 'amazonia', 'insular'], pancoger: false, patrimonial: true, sembrable_en_casa: 'sí', educativo: 'sí', description: 'Fácil de cultivar en macetas, añade un sabor suave a cebolla a tus platos.', imageUrl: 'https://firebasestorage.googleapis.com/v0/b/agrinavigate.firebasestorage.app/o/Cultivos%2Fcebollin.jpg?alt=media&token=d15c1bb8-287a-48d0-93b7-9bf407a48ebf', dataAiHint: 'chives plant', estimatedPrice: 'Precio bajo', duration: 'Corta (1–2 meses)', spaceRequired: 'Maceta pequeña (1–3 L)', plantType: 'Hortalizas de hoja', difficulty: 1, lifeCycle: [{ name: 'Siembra' }, { name: 'Crecimiento' }, { name: 'Cosecha' }], clima: 'Frío', datos_programaticos: { dias_para_cosecha: 60, frecuencia_riego_dias: 2 } },
    { id: 'maracuya', name: 'Maracuyá', regionSlugs: ['pacifica', 'andina', 'caribe'], pancoger: true, patrimonial: true, sembrable_en_casa: 'parcialmente', educativo: 'sí', description: 'Enredadera que produce una fruta tropical exótica y deliciosa.', imageUrl: 'https://firebasestorage.googleapis.com/v0/b/agrinavigate.firebasestorage.app/o/Cultivos%2Fmaracuya.jpg?alt=media&token=5fe49455-3e5c-4f4d-bb99-75385115b4c5', dataAiHint: 'passion fruit vine', estimatedPrice: 'Precio moderado', duration: 'Larga (6 meses o más)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Frutales', difficulty: 4, lifeCycle: [{ name: 'Siembra' }, { name: 'Crecimiento' }, { name: 'Floración' }, { name: 'Cosecha' }], clima: 'Templado', datos_programaticos: { dias_para_cosecha: 365, frecuencia_riego_dias: 3 } },
    { id: 'auyama', name: 'Auyama', regionSlugs: ['caribe', 'andina'], pancoger: true, patrimonial: true, sembrable_en_casa: 'sí', educativo: 'sí', description: 'Calabaza versátil y nutritiva, se puede cultivar en huertas o costales.', imageUrl: 'https://firebasestorage.googleapis.com/v0/b/agrinavigate.firebasestorage.app/o/Cultivos%2Fauyama.jpg?alt=media&token=aba42a3a-3e24-4ddf-8a32-b800a6a8fe96', dataAiHint: 'squash plant', estimatedPrice: 'Precio bajo', duration: 'Media (3–5 meses)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Hortalizas de fruto', difficulty: 2, lifeCycle: [{ name: 'Siembra' }, { name: 'Crecimiento' }, { name: 'Floración' }, { name: 'Cosecha' }], clima: 'Cálido', datos_programaticos: { dias_para_cosecha: 100, frecuencia_riego_dias: 2 } },
];


const regionBoundingBoxes = [
  { slug: 'insular', name: 'Insular', bounds: { minLat: 12.0, maxLat: 16.5, minLng: -82.0, maxLng: -78.0 } },
  { slug: 'caribe', name: 'Caribe', bounds: { minLat: 7.0, maxLat: 12.5, minLng: -76.0, maxLng: -71.0 } },
  { slug: 'pacifica', name: 'Pacífica', bounds: { minLat: 0.5, maxLat: 8.0, minLng: -79.5, maxLng: -75.8 } },
  { slug: 'amazonia', name: 'Amazonía', bounds: { minLat: -4.25, maxLat: 1.5, minLng: -75.5, maxLng: -66.8 } },
  { slug: 'orinoquia', name: 'Orinoquía', bounds: { minLat: 1.0, maxLat: 7.5, minLng: -72.5, maxLng: -67.0 } },
  { slug: 'andina', name: 'Andina', bounds: { minLat: -1.5, maxLat: 11.5, minLng: -78.0, maxLng: -71.5 } }, 
];

function getRegionFromCoordinates(lat: number, lng: number): { slug: string; name: string } | null {
  for (const region of regionBoundingBoxes) {
    if (lat >= region.bounds.minLat && lat <= region.bounds.maxLat &&
        lng >= region.bounds.minLng && lng <= region.bounds.maxLng) {
      return { slug: region.slug, name: region.name };
    }
  }
  return null;
}

function capitalizeFirstLetter(string: string | null | undefined) {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
}

type GeolocationStatus = 'idle' | 'pending' | 'success' | 'error';
type FilterSource = 'manual' | 'url' | 'geo' | 'none';

const regionOptions = regionBoundingBoxes.map(r => ({ value: r.slug, label: r.name }));
const climaOptions = [
    { value: 'all', label: 'Todos los Climas' },
    { value: 'Frío', label: 'Frío (10–17 °C)' },
    { value: 'Templado', label: 'Templado (18–23 °C)' },
    { value: 'Cálido', label: 'Cálido (24–30 °C)' },
    { value: 'Muy cálido', label: 'Muy cálido (>30 °C)' },
];
const priceOptions = [
  { value: 'all', label: 'Todos los Precios' },
  { value: 'Precio bajo', label: 'Precio bajo' },
  { value: 'Precio moderado', label: 'Precio moderado' },
  { value: 'Precio alto', label: 'Precio alto' },
];
const durationOptions = [
  { value: 'all', label: 'Todas las Duraciones' },
  { value: 'Corta (1–2 meses)', label: 'Corta (1–2 meses)' },
  { value: 'Media (3–5 meses)', label: 'Media (3–5 meses)' },
  { value: 'Larga (6 meses o más)', label: 'Larga (6 meses o más)' },
];
const spaceOptions = [
  { value: 'all', label: 'Todos los Espacios' },
  { value: 'Maceta pequeña (1–3 L)', label: 'Maceta pequeña (1–3 L)' },
  { value: 'Maceta mediana (4–10 L)', label: 'Maceta mediana (4–10 L)' },
  { value: 'Maceta grande o jardín (10+ L)', label: 'Maceta grande o jardín (10+ L)' },
];
const plantTypeOptions = [
  { value: 'all', label: 'Todos los Tipos' },
  ...Array.from(new Set(sampleCropsData.map(c => c.plantType))).sort().map(pt => ({ value: pt, label: pt }))
];
const difficultyOptions = [
  { value: 'all', label: 'Todas las Dificultades' },
  { value: '1', label: '⭐ (Muy Fácil)' },
  { value: '2', label: '⭐⭐ (Fácil)' },
  { value: '3', label: '⭐⭐⭐ (Medio)' },
  { value: '4', label: '⭐⭐⭐⭐ (Difícil)' },
  { value: '5', label: '⭐⭐⭐⭐⭐ (Muy Difícil)' },
];

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


export default function CultivosPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [geolocationStatus, setGeolocationStatus] = useState<GeolocationStatus>('idle');
  const [geolocationErrorMsg, setGeolocationErrorMsg] = useState<string | null>(null);
  
  const [activeRegionSlug, setActiveRegionSlug] = useState<string | null>(searchParams.get('region'));
  const [activeRegionName, setActiveRegionName] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedClima, setSelectedClima] = useState<string | null>(searchParams.get('clima'));
  const [selectedPrice, setSelectedPrice] = useState<string | null>(searchParams.get('price'));
  const [selectedDuration, setSelectedDuration] = useState<string | null>(searchParams.get('duration'));
  const [selectedSpace, setSelectedSpace] = useState<string | null>(searchParams.get('space'));
  const [selectedPlantType, setSelectedPlantType] = useState<string | null>(searchParams.get('plantType'));
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(searchParams.get('difficulty'));
  
  const [filterSource, setFilterSource] = useState<FilterSource>('none');
  const [userHasInteracted, setUserHasInteracted] = useState(false);

  // Update URL from state changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    
    // Helper to set or delete params
    const updateParam = (key: string, value: string | null) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    };
    
    updateParam('q', searchQuery || null);
    updateParam('region', activeRegionSlug);
    updateParam('clima', selectedClima);
    updateParam('price', selectedPrice);
    updateParam('duration', selectedDuration);
    updateParam('space', selectedSpace);
    updateParam('plantType', selectedPlantType);
    updateParam('difficulty', selectedDifficulty);

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });

  }, [searchQuery, activeRegionSlug, selectedClima, selectedPrice, selectedDuration, selectedSpace, selectedPlantType, selectedDifficulty, router, pathname]);
  

  useEffect(() => {
    const regionParam = searchParams.get('region');
    const qParam = searchParams.get('q');
    
    if (userHasInteracted) {
      if(qParam !== null) setFilterSource('url');
      else setFilterSource('manual');
      return;
    }

    if (regionParam) {
      setFilterSource('url');
      setActiveRegionSlug(regionParam);
      const regionName = regionOptions.find(r => r.value === regionParam)?.label || capitalizeFirstLetter(regionParam);
      setActiveRegionName(regionName);
      return;
    }

    if (!qParam) {
      if (navigator.geolocation) {
        setGeolocationStatus('pending');
        navigator.geolocation.getCurrentPosition(
          (position) => {
            if (userHasInteracted) return;
            const { latitude, longitude } = position.coords;
            const regionInfo = getRegionFromCoordinates(latitude, longitude);
            if (regionInfo) {
              setFilterSource('geo');
              setActiveRegionSlug(regionInfo.slug);
              setActiveRegionName(regionInfo.name);
            } else {
               setFilterSource('none');
               setActiveRegionSlug(null);
               setActiveRegionName(null);
            }
            setGeolocationStatus('success');
          },
          (error) => {
            if (userHasInteracted) return;
            let message = "No se pudo obtener tu ubicación.";
            if (error.code === error.PERMISSION_DENIED) message = "Permiso de ubicación denegado.";
            setGeolocationErrorMsg(message);
            setGeolocationStatus('error');
            setFilterSource('none');
            setActiveRegionSlug(null);
            setActiveRegionName(null);
          }
        );
      } else {
        setFilterSource('none');
        setActiveRegionSlug(null);
        setActiveRegionName(null);
      }
    }
  }, [userHasInteracted]);

  const displayedCrops = sampleCropsData.filter(crop => {
    if (searchQuery && !crop.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (activeRegionSlug && !crop.regionSlugs.includes(activeRegionSlug)) {
      return false;
    }
     if (selectedClima && crop.clima !== selectedClima) {
      return false;
    }
    if (selectedPrice && crop.estimatedPrice !== selectedPrice) {
      return false;
    }
    if (selectedDuration && crop.duration !== selectedDuration) {
      return false;
    }
    if (selectedSpace && crop.spaceRequired !== selectedSpace) {
      return false;
    }
    if (selectedPlantType && crop.plantType !== selectedPlantType) {
      return false;
    }
    if (selectedDifficulty && crop.difficulty.toString() !== selectedDifficulty) {
      return false;
    }
    return true;
  });

  let pageTitle = "Todos los Cultivos";
  let pageDescription = "Descubre una variedad de cultivos de diferentes regiones de Colombia.";
  let alertMessageForPage: React.ReactNode = null;

  if (searchQuery) {
      pageTitle = `Resultados para: "${searchQuery}"`;
      pageDescription = `Mostrando cultivos que coinciden con "${searchQuery}".`;
  } else if (filterSource === 'manual') {
      if (activeRegionSlug) {
          pageTitle = `Cultivos para la Región: ${activeRegionName}`;
          pageDescription = `Explora los cultivos característicos de la región ${activeRegionName} según los filtros aplicados.`;
      } else {
          pageTitle = "Cultivos Filtrados";
          pageDescription = "Mostrando cultivos de todas las regiones, según los filtros aplicados.";
      }
  } else if (filterSource === 'url' && activeRegionName) {
      pageTitle = `Cultivos de la Región ${activeRegionName}`;
      pageDescription = `Explora los cultivos característicos de la región ${activeRegionName}.`;
      alertMessageForPage = (
          <Alert variant="default" className="bg-primary/10 border-primary/30 text-primary">
              <MapPin className="h-4 w-4 text-primary" />
              <AlertTitle className="font-nunito font-semibold">Filtro por Región</AlertTitle>
              <AlertDescription>Mostrando cultivos para la región: <strong>{activeRegionName}</strong>.</AlertDescription>
          </Alert>
      );
  } else if (filterSource === 'geo' && activeRegionName) {
      pageTitle = `Sugeridos para tu Región: ${activeRegionName}`;
      pageDescription = `Basado en tu ubicación (aproximada), te sugerimos estos cultivos de la región ${activeRegionName}.`;
      alertMessageForPage = (
          <Alert variant="default" className="bg-primary/10 border-primary/30 text-primary">
              <CheckCircle className="h-4 w-4 text-primary" />
              <AlertTitle className="font-nunito font-semibold">Región Detectada: {activeRegionName}</AlertTitle>
              <AlertDescription>Mostrando cultivos sugeridos para tu región. La detección es aproximada.</AlertDescription>
          </Alert>
      );
  }

  const handleFilterInteraction = () => {
    if (!userHasInteracted) {
        setUserHasInteracted(true);
    }
    setSearchQuery(''); // Reset search query when a filter is changed
  };

  const updateFilterState = (setter: React.Dispatch<React.SetStateAction<string | null>>, value: string) => {
      handleFilterInteraction();
      setter(value === 'all' ? null : value);
  };

  const handleRegionChange = (value: string) => {
      setUserHasInteracted(true);
      const newRegionSlug = value === 'all' ? null : value;
      setActiveRegionSlug(newRegionSlug);
      const regionName = newRegionSlug ? regionOptions.find(opt => opt.value === newRegionSlug)?.label || null : 'Todas las Regiones';
      setActiveRegionName(regionName);
  };
  
  const createSlug = (name: string) => {
    return name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-nunito font-bold tracking-tight text-foreground sm:text-4xl">
        {pageTitle}
      </h1>

      {geolocationStatus === 'pending' && !userHasInteracted && !searchParams.get('region') && (
        <Alert>
          <LocateFixed className="h-4 w-4 animate-ping" />
          <AlertTitle className="font-nunito font-semibold">Obteniendo Ubicación</AlertTitle>
          <AlertDescription>Intentando detectar tu región para mostrarte cultivos relevantes...</AlertDescription>
        </Alert>
      )}
      {geolocationStatus === 'error' && !userHasInteracted && !searchParams.get('region') && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="font-nunito font-semibold">Error de Geolocalización</AlertTitle>
          <AlertDescription>{geolocationErrorMsg} Mostrando todos los cultivos.</AlertDescription>
        </Alert>
      )}
      {alertMessageForPage}
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2 font-nunito font-bold">
            <Filter className="h-5 w-5" />
            Filtrar y Buscar Cultivos
          </CardTitle>
          <CardDescription>Ajusta los filtros para encontrar los cultivos que mejor se adapten a tus necesidades.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="md:col-span-2 lg:col-span-3">
             <Label htmlFor="search-input" className="text-sm font-nunito font-semibold">Buscar por nombre</Label>
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="search-input"
                  placeholder="Ej: Tomate, Papa, Maíz..."
                  value={searchQuery}
                  onChange={(e) => {
                    if (!userHasInteracted) setUserHasInteracted(true);
                    setSearchQuery(e.target.value);
                  }}
                  className="pl-10"
                />
             </div>
          </div>
          <div>
            <Label htmlFor="manualRegionSelect" className="text-sm font-nunito font-semibold">Región</Label>
            <Select 
              value={activeRegionSlug || 'all'} 
              onValueChange={handleRegionChange}
            >
              <SelectTrigger id="manualRegionSelect" className="font-nunito">
                <SelectValue placeholder="Seleccionar Región" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las Regiones</SelectItem>
                {regionOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
           <div>
            <Label htmlFor="climaSelect" className="text-sm font-nunito font-semibold">Clima (Temperatura)</Label>
            <Select value={selectedClima || 'all'} onValueChange={(v) => updateFilterState(setSelectedClima, v)}>
              <SelectTrigger id="climaSelect" className="font-nunito"><SelectValue placeholder="Todos los Climas" /></SelectTrigger>
              <SelectContent>
                {climaOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="priceSelect" className="text-sm font-nunito font-semibold">Precio Estimado</Label>
            <Select value={selectedPrice || 'all'} onValueChange={(v) => updateFilterState(setSelectedPrice, v)}>
              <SelectTrigger id="priceSelect" className="font-nunito"><SelectValue placeholder="Todos los Precios" /></SelectTrigger>
              <SelectContent>
                {priceOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="durationSelect" className="text-sm font-nunito font-semibold">Duración</Label>
            <Select value={selectedDuration || 'all'} onValueChange={(v) => updateFilterState(setSelectedDuration, v)}>
              <SelectTrigger id="durationSelect" className="font-nunito"><SelectValue placeholder="Todas las Duraciones" /></SelectTrigger>
              <SelectContent>
                {durationOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="spaceSelect" className="text-sm font-nunito font-semibold">Espacio Requerido</Label>
            <Select value={selectedSpace || 'all'} onValueChange={(v) => updateFilterState(setSelectedSpace, v)}>
              <SelectTrigger id="spaceSelect" className="font-nunito"><SelectValue placeholder="Todos los Espacios" /></SelectTrigger>
              <SelectContent>
                {spaceOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="plantTypeSelect" className="text-sm font-nunito font-semibold">Tipo de Planta</Label>
            <Select 
              value={selectedPlantType || 'all'} 
              onValueChange={(v) => updateFilterState(setSelectedPlantType, v)}
            >
              <SelectTrigger id="plantTypeSelect" className="font-nunito"><SelectValue placeholder="Todos los Tipos" /></SelectTrigger>
              <SelectContent>
                {plantTypeOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="difficultySelect" className="text-sm font-nunito font-semibold">Dificultad</Label>
            <Select value={selectedDifficulty || 'all'} onValueChange={(v) => updateFilterState(setSelectedDifficulty, v)}>
              <SelectTrigger id="difficultySelect" className="font-nunito"><SelectValue placeholder="Todas las Dificultades" /></SelectTrigger>
              <SelectContent>
                {difficultyOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-nunito font-bold">
            Fichas Técnicas de Cultivos
          </CardTitle>
          <CardDescription>
            {pageDescription}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {displayedCrops.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedCrops.map((crop) => {
                 const TypeIcon = getCropTypeIcon(crop.plantType);
                 const difficultyStyles = getDifficultyStyles(crop.difficulty);
                 const difficultyText = crop.difficulty <= 2 ? 'Fácil' : crop.difficulty <=4 ? 'Media' : 'Difícil';
                 const slug = createSlug(crop.name);
                 
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
                        <CardFooter className="flex-col items-start gap-2">
                            <Button asChild className="w-full">
                                <Link href={`/cultivos/${slug}`}>
                                    Ver Ficha Completa <ExternalLink className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                           <AddCropDialog crop={crop}>
                             <Button className="w-full" variant="outline">
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
             <Alert variant="default" className="mt-4">
                <HelpCircle className="h-4 w-4" />
                <AlertTitle className="font-nunito font-semibold">No se encontraron cultivos</AlertTitle>
                <AlertDescription>
                 No se encontraron cultivos que coincidan con los filtros o la búsqueda. Prueba a cambiar tus criterios.
                </AlertDescription>
            </Alert>
          )}
          <p className="mt-6 text-sm text-muted-foreground">
            Estos son datos de ejemplo. La funcionalidad completa estará disponible pronto.
          </p>
        </CardContent>
      </Card>

    </div>
  );
}
