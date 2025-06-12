
"use client";

import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function capitalizeFirstLetter(string: string | null) {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function CultivosPage() {
  const searchParams = useSearchParams();
  const regionQueryParam = searchParams.get('region');
  const capitalizedRegion = capitalizeFirstLetter(regionQueryParam);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Información de Cultivos
      </h1>

      {regionQueryParam && (
        <h2 className="text-2xl font-semibold text-accent">
          Explorando la Región: {capitalizedRegion}
        </h2>
      )}

      <Card>
        <CardHeader>
          <CardTitle>
            Fichas Detalladas de Cultivos {regionQueryParam ? `de la Región ${capitalizedRegion}` : ''}
          </CardTitle>
          <CardDescription>
            {regionQueryParam
              ? `Aprenda todo sobre los diferentes cultivos de la región ${capitalizedRegion}, desde su siembra hasta su cosecha.`
              : "Aprenda todo sobre los diferentes cultivos, desde su siembra hasta su cosecha."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Aquí encontrará información detallada para cada cultivo{regionQueryParam ? ` específico de la región ${capitalizedRegion}` : ''}, incluyendo origen, clima ideal, datos técnicos, guías de siembra,
            y mucho más. Podrá agregar cultivos a su dashboard personalizado una vez implementada la funcionalidad de usuario.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">Contenido y funcionalidad en desarrollo.</p>
        </CardContent>
      </Card>
    </div>
  );
}
