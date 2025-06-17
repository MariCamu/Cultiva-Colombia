import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ArticulosPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-nunito font-bold tracking-tight text-foreground sm:text-4xl">
        Artículos
      </h1>
      <Card>
        <CardHeader>
          <CardTitle className="font-nunito font-bold">Centro de Conocimiento</CardTitle>
          <CardDescription>Artículos informativos y guías sobre agricultura.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Acceda a una biblioteca de artículos, noticias y mejores prácticas del sector agrícola para mantenerse informado y mejorar sus técnicas.
            Próximamente.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
