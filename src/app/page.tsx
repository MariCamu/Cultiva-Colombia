import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline tracking-tight text-foreground sm:text-4xl">
        Inicio
      </h1>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Bienvenido a AgriNavigate</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Su plataforma integral para la gestión agrícola inteligente. Explore nuestras herramientas para optimizar sus cultivos y tomar decisiones informadas.
          </p>
        </CardContent>
      </Card>
      {/* Additional content for the home page can be added here */}
    </div>
  );
}
