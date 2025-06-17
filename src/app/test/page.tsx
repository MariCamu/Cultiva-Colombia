
"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';

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
}

const sampleCropsData: SampleCrop[] = [
  // Andina
  { id: 'papa_andina', name: 'Papa (Región Andina)', description: 'Tubérculo versátil y nutritivo, base de la alimentación en la región andina.', regionSlug: 'andina', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'potato field', estimatedPrice: 'Precio bajo', duration: 'Media (3–5 meses)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Tubérculos', difficulty: 2 },
  { id: 'cafe_andino', name: 'Café (Región Andina)', description: 'Reconocido mundialmente por su aroma y sabor, cultivado en las laderas montañosas.', regionSlug: 'andina', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'coffee plant', estimatedPrice: 'Precio moderado', duration: 'Larga (6 meses o más)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Frutales', difficulty: 4 },
  // Amazonía
  { id: 'yuca_amazonia', name: 'Yuca (Región Amazonía)', description: 'Raíz comestible fundamental en la dieta amazónica, adaptable a climas tropicales.', regionSlug: 'amazonia', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'cassava plant', estimatedPrice: 'Precio bajo', duration: 'Larga (6 meses o más)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Tubérculos', difficulty: 2 },
  { id: 'copoazu_amazonia', name: 'Copoazú (Región Amazonía)', description: 'Fruta exótica con pulpa aromática, usada en jugos, postres y cosméticos.', regionSlug: 'amazonia', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'copoazu fruit', estimatedPrice: 'Precio moderado', duration: 'Larga (6 meses o más)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Frutales', difficulty: 3 },
  // Caribe
  { id: 'platano_caribe', name: 'Plátano (Región Caribe)', description: 'Fruta esencial en la cocina caribeña, consumida verde o madura.', regionSlug: 'caribe', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'banana tree', estimatedPrice: 'Precio bajo', duration: 'Larga (6 meses o más)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Frutales', difficulty: 2 },
  { id: 'mango_caribe', name: 'Mango (Región Caribe)', description: 'Fruta tropical dulce y jugosa, con múltiples variedades en la región.', regionSlug: 'caribe', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'mango fruit', estimatedPrice: 'Precio moderado', duration: 'Larga (6 meses o más)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Frutales', difficulty: 3 },
  // Orinoquía
  { id: 'arroz_orinoquia', name: 'Arroz (Región Orinoquía)', description: 'Cereal básico cultivado extensamente en las llanuras inundables de la Orinoquía.', regionSlug: 'orinoquia', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'rice paddy', estimatedPrice: 'Precio bajo', duration: 'Media (3–5 meses)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Cereales', difficulty: 3 },
  { id: 'marañon_orinoquia', name: 'Marañón (Región Orinoquía)', description: 'Fruto seco y pseudofruto carnoso, apreciado por su nuez y pulpa agridulce.', regionSlug: 'orinoquia', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'cashew fruit', estimatedPrice: 'Precio alto', duration: 'Larga (6 meses o más)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Frutales', difficulty: 4 },
  // Pacífica
  { id: 'chontaduro_pacifica', name: 'Chontaduro (Región Pacífica)', description: 'Fruto de palmera altamente nutritivo, parte integral de la cultura del Pacífico.', regionSlug: 'pacifica', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'chontaduro fruit', estimatedPrice: 'Precio moderado', duration: 'Larga (6 meses o más)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Frutales', difficulty: 3 },
  { id: 'borojo_pacifica', name: 'Borojó (Región Pacífica)', description: 'Fruta energética con propiedades afrodisíacas, consumida en jugos y jaleas.', regionSlug: 'pacifica', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'borojo fruit', estimatedPrice: 'Precio moderado', duration: 'Larga (6 meses o más)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Frutales', difficulty: 4 },
  // Insular
  { id: 'coco_insular', name: 'Coco (Región Insular)', description: 'Fruto tropical versátil, utilizado para agua, pulpa y aceite en las islas.', regionSlug: 'insular', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'coconut tree', estimatedPrice: 'Precio bajo', duration: 'Larga (6 meses o más)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Frutales', difficulty: 2 },
  { id: 'pan_de_fruta_insular', name: 'Pan de Fruta (Región Insular)', description: 'Fruto grande y almidonado, básico en la alimentación de las islas caribeñas.', regionSlug: 'insular', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'breadfruit tree', estimatedPrice: 'Precio moderado', duration: 'Larga (6 meses o más)', spaceRequired: 'Maceta grande o jardín (10+ L)', plantType: 'Frutales', difficulty: 3 },
];

const testPlantTypeMap: { [key: string]: string | null } = {
  'comestibles': null, 
  'aromaticas': 'Plantas aromáticas',
  'coloridas': 'Hortalizas de flor', 
  'frutales': 'Frutales',
  // 'cualquiera' maps to null, meaning no filter by plant type.
};

const testSpaceMap: { [key: string]: string | null } = {
  'pequeno': 'Maceta pequeña (1–3 L)',
  'mediano': 'Maceta mediana (4–10 L)',
  'grande': 'Maceta grande o jardín (10+ L)',
};

function capitalizeFirstLetter(string: string | null | undefined) {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function TestPage() {
  const [region, setRegion] = useState('');
  const [espacio, setEspacio] = useState('');
  const [experiencia, setExperiencia] = useState('');
  const [plantTypePreference, setPlantTypePreference] = useState('');
  const [careFrequency, setCareFrequency] = useState('');
  const [learningInterest, setLearningInterest] = useState('');

  const [filteredCrops, setFilteredCrops] = useState<SampleCrop[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let plantTypeToFilter: string | null = null;
    if (plantTypePreference && plantTypePreference !== 'cualquiera' && testPlantTypeMap[plantTypePreference] !== undefined) {
      plantTypeToFilter = testPlantTypeMap[plantTypePreference];
    } else if (plantTypePreference === 'comestibles' || plantTypePreference === 'cualquiera') {
        plantTypeToFilter = null; // No filter for these options
    }


    let spaceToFilter: string | null = null;
    if (espacio && espacio !== 'all-spaces' && testSpaceMap[espacio] !== undefined) {
      spaceToFilter = testSpaceMap[espacio];
    }

    let difficultyToFilter: string | null = null;
    if (experiencia && experiencia !== 'all-experiences') {
        if (experiencia === 'principiante') {
            difficultyToFilter = '1';
            if ((learningInterest === 'si' || learningInterest === 'any-interest') && 
                (careFrequency === 'diario' || careFrequency === 'dos_tres_semana' || careFrequency === 'all-frequencies')) {
                difficultyToFilter = '2';
            }
        } else if (experiencia === 'intermedio') {
            difficultyToFilter = '2';
            if (learningInterest === 'si' || learningInterest === 'any-interest') {
                difficultyToFilter = '3';
                if (careFrequency === 'diario' || careFrequency === 'dos_tres_semana' || careFrequency === 'all-frequencies') {
                    difficultyToFilter = '4';
                }
            }
        } else if (experiencia === 'avanzado') {
            difficultyToFilter = '3';
            if (learningInterest === 'si' || learningInterest === 'any-interest') {
                difficultyToFilter = '4';
                if (careFrequency === 'diario' || careFrequency === 'dos_tres_semana' || careFrequency === 'all-frequencies') {
                    difficultyToFilter = '5';
                }
            }
        }
    }
    
    const results = sampleCropsData.filter(crop => {
        let matches = true;
        if (region && region !== 'all-regions' && crop.regionSlug !== region) matches = false;
        if (plantTypeToFilter && crop.plantType !== plantTypeToFilter) matches = false;
        if (spaceToFilter && crop.spaceRequired !== spaceToFilter) matches = false;
        if (difficultyToFilter && crop.difficulty.toString() !== difficultyToFilter) matches = false;
        return matches;
    });

    setFilteredCrops(results);
    setShowResults(true);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Test Interactivo
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Descubre tu Cultivo Ideal</CardTitle>
          <CardDescription>Responde unas pocas preguntas para recibir recomendaciones personalizadas de cultivos.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="region">Tu región en Colombia:</Label>
              <Select value={region} onValueChange={setRegion}>
                <SelectTrigger id="region">
                  <SelectValue placeholder="Selecciona tu región" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="andina">Andina</SelectItem>
                  <SelectItem value="caribe">Caribe</SelectItem>
                  <SelectItem value="pacifica">Pacífica</SelectItem>
                  <SelectItem value="orinoquia">Orinoquía</SelectItem>
                  <SelectItem value="amazonia">Amazonía</SelectItem>
                  <SelectItem value="insular">Insular</SelectItem>
                  <SelectItem value="all-regions">Cualquier Región</SelectItem> 
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="espacio">Espacio disponible:</Label>
              <Select value={espacio} onValueChange={setEspacio}>
                <SelectTrigger id="espacio">
                  <SelectValue placeholder="Selecciona el espacio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pequeno">Pequeño (macetas, balcón)</SelectItem>
                  <SelectItem value="mediano">Mediano (patio pequeño)</SelectItem>
                  <SelectItem value="grande">Grande (huerta, terreno)</SelectItem>
                  <SelectItem value="all-spaces">Cualquier Espacio</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="experiencia">Nivel de experiencia:</Label>
               <Select value={experiencia} onValueChange={setExperiencia}>
                <SelectTrigger id="experiencia">
                  <SelectValue placeholder="Selecciona tu experiencia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="principiante">Principiante</SelectItem>
                  <SelectItem value="intermedio">Intermedio</SelectItem>
                  <SelectItem value="avanzado">Avanzado</SelectItem>
                  <SelectItem value="all-experiences">Cualquier Experiencia</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="plantTypePreference">¿Qué tipo de plantas te gustaría tener?</Label>
              <Select value={plantTypePreference} onValueChange={setPlantTypePreference}>
                <SelectTrigger id="plantTypePreference">
                  <SelectValue placeholder="Selecciona tu preferencia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="comestibles">Comestibles (hortalizas, hierbas)</SelectItem>
                  <SelectItem value="aromaticas">Aromáticas (para cocinar o infusión)</SelectItem>
                  <SelectItem value="coloridas">Coloridas (flores, ornamentales)</SelectItem>
                  <SelectItem value="frutales">Frutales (árboles o arbustos)</SelectItem>
                  <SelectItem value="cualquiera">Cualquiera / Sorpréndeme</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="careFrequency">¿Cada cuánto puedes cuidarlas?</Label>
              <Select value={careFrequency} onValueChange={setCareFrequency}>
                <SelectTrigger id="careFrequency">
                  <SelectValue placeholder="Selecciona la frecuencia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="diario">Diario</SelectItem>
                  <SelectItem value="dos_tres_semana">2–3 veces a la semana</SelectItem>
                  <SelectItem value="ocasionalmente">Ocasionalmente (1 vez por semana o menos)</SelectItem>
                  <SelectItem value="all-frequencies">Cualquier Frecuencia</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="learningInterest">¿Te interesa aprender mientras cultivas?</Label>
              <Select value={learningInterest} onValueChange={setLearningInterest}>
                <SelectTrigger id="learningInterest">
                  <SelectValue placeholder="Selecciona tu interés" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="si">Sí, me gustaría aprender</SelectItem>
                  <SelectItem value="no">No, prefiero algo muy sencillo</SelectItem>
                  <SelectItem value="any-interest">Indiferente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit">Obtener Recomendaciones</Button>
          </form>
        </CardContent>
      </Card>

      {showResults && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Cultivos Recomendados</CardTitle>
            <CardDescription>
              Basado en tus respuestas, estos son algunos cultivos que te podrían interesar:
            </CardDescription>
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
                      <CardTitle className="text-xl">{crop.name}</CardTitle>
                      {(!region || region === "all-regions") && (
                        <Badge variant="outline" className="mt-1 w-fit">{capitalizeFirstLetter(crop.regionSlug)}</Badge>
                      )}
                    </CardHeader>
                    <CardContent className="flex-grow space-y-3">
                      <p className="text-sm text-muted-foreground mb-3">{crop.description}</p>
                      <div className="space-y-2 pt-2 border-t">
                          <div className="flex items-center">
                              <span className="text-xs font-semibold mr-2 w-28">Dificultad:</span>
                              <div className="flex">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                  <Star key={i} className={`h-4 w-4 ${i < crop.difficulty ? 'fill-yellow-400 text-yellow-500' : 'text-gray-300'}`} />
                                  ))}
                              </div>
                          </div>
                          <Badge variant="secondary">Precio: {crop.estimatedPrice}</Badge>
                          <Badge variant="secondary">Duración: {crop.duration}</Badge>
                          <Badge variant="secondary">Espacio: {crop.spaceRequired}</Badge>
                          <Badge variant="secondary">Tipo: {crop.plantType}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No se encontraron cultivos que coincidan con tus preferencias. Intenta ajustar tus respuestas o seleccionar opciones menos restrictivas.</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
