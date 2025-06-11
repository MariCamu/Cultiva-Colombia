import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default function MapaPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Mapa Interactivo
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Explora los Cultivos de Colombia</CardTitle>
          <CardDescription>Navegue por las regiones y descubra la riqueza agrícola del país.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Esta sección presentará un mapa interactivo de Colombia dividido por regiones. Podrá seleccionar una región para ver los cultivos asociados,
            codificados por colores según su nivel de dificultad.
          </p>
          <div className="p-4 border rounded-lg bg-muted/50">
             <Image 
                src="https://placehold.co/800x500.png"
                alt="Placeholder para el mapa interactivo de Colombia"
                width={800}
                height={500}
                className="w-full h-auto rounded-md"
                data-ai-hint="colombia map illustration"
              />
          </div>
          <p className="text-sm text-muted-foreground">Funcionalidad completa en desarrollo.</p>
        </CardContent>
      </Card>
    </div>
  );
}
