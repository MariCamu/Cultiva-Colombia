import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function TestPage() {
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
          <form className="space-y-4">
            <div>
              <Label htmlFor="region">Tu región en Colombia:</Label>
              <Select>
                <SelectTrigger id="region">
                  <SelectValue placeholder="Selecciona tu región" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="andina">Andina</SelectItem>
                  <SelectItem value="caribe">Caribe</SelectItem>
                  <SelectItem value="pacifica">Pacífica</SelectItem>
                  <SelectItem value="orinoquia">Orinoquía</SelectItem>
                  <SelectItem value="amazonia">Amazonía</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="espacio">Espacio disponible:</Label>
              <Select>
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
               <Select>
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
            <Button type="submit" disabled>Obtener Recomendaciones (Próximamente)</Button>
          </form>
          <p className="text-sm text-muted-foreground">
            Basado en tus respuestas, te sugeriremos los cultivos más adecuados y te daremos la opción de agregarlos a tu dashboard personalizado.
            Funcionalidad completa en desarrollo.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
