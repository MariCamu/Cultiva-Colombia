
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function TestPage() {
  const router = useRouter();
  const [region, setRegion] = useState('');
  const [espacio, setEspacio] = useState('');
  const [experiencia, setExperiencia] = useState('');
  const [plantTypePreference, setPlantTypePreference] = useState('');
  const [careFrequency, setCareFrequency] = useState('');
  const [learningInterest, setLearningInterest] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const queryParams = new URLSearchParams();

    if (region) queryParams.append('region', region);
    // Los parámetros 'espacio' y 'experiencia' se envían pero no se usan actualmente en /cultivos
    if (espacio) queryParams.append('space', espacio); 
    if (experiencia) queryParams.append('experience', experiencia);
    
    if (plantTypePreference) queryParams.append('plantType', plantTypePreference);
    if (careFrequency) queryParams.append('care', careFrequency);
    if (learningInterest) queryParams.append('learning', learningInterest);
    
    router.push(`/cultivos?${queryParams.toString()}`);
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
                </SelectContent>
              </Select>
            </div>
            <Button type="submit">Obtener Recomendaciones</Button>
          </form>
          <p className="text-sm text-muted-foreground">
            Basado en tus respuestas, te sugeriremos los cultivos más adecuados.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
