import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CultivosPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline tracking-tight text-foreground sm:text-4xl">
        Cultivos
      </h1>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Gestión de Cultivos</CardTitle>
          <CardDescription>Información y seguimiento detallado de sus cultivos.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Aquí podrá registrar y monitorear el progreso de sus diferentes cultivos, gestionar tareas y analizar rendimientos.
            Funcionalidad en desarrollo.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
