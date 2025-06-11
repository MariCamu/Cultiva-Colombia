import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function MapaPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline tracking-tight text-foreground sm:text-4xl">
        Mapa
      </h1>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Funcionalidad de Mapa</CardTitle>
          <CardDescription>Visualización geográfica de sus parcelas y datos relevantes.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Esta sección integrará herramientas de mapeo para ayudarle a visualizar y analizar sus terrenos.
            Actualmente en desarrollo.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
