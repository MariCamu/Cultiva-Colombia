import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CultivosPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Información de Cultivos
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Fichas Detalladas de Cultivos</CardTitle>
          <CardDescription>Aprenda todo sobre los diferentes cultivos, desde su siembra hasta su cosecha.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Aquí encontrará información detallada para cada cultivo, incluyendo origen, clima ideal, datos técnicos, guías de siembra,
            y mucho más. Podrá agregar cultivos a su dashboard personalizado una vez implementada la funcionalidad de usuario.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">Contenido y funcionalidad en desarrollo.</p>
        </CardContent>
      </Card>
    </div>
  );
}
