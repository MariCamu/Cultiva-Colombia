import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Bienvenido a Cultivando Saberes
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
          Su plataforma interactiva para aprender sobre la diversidad de cultivos en Colombia, promover la soberanía alimentaria y conectar con la tierra.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button asChild size="lg">
            <Link href="/mapa">Explorar Mapa Interactivo</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/guias">Ver Guías Educativas</Link>
          </Button>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Descubra los Cultivos de Colombia</h2>
          <p className="mt-4 text-muted-foreground">
            Navegue por nuestro mapa interactivo para explorar los cultivos asociados a cada región de Colombia. Aprenda sobre su siembra, cuidado y cosecha de una manera fácil y divertida.
          </p>
          <ul className="mt-6 space-y-2 text-muted-foreground">
            <li>🌱 Información detallada de cada cultivo.</li>
            <li>🗺️ Visualización por regiones geográficas.</li>
            <li>🎨 Indicadores de dificultad para todos los niveles.</li>
          </ul>
        </div>
        <div className="rounded-lg overflow-hidden shadow-xl">
          <Image
            src="https://placehold.co/600x400.png"
            alt="Mapa interactivo de Colombia"
            width={600}
            height={400}
            className="object-cover w-full h-auto"
            data-ai-hint="colombia map agriculture"
          />
        </div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>¿Listo para empezar?</CardTitle>
          <CardDescription>Realice nuestro test interactivo para descubrir qué cultivos son ideales para usted según su región, espacio y experiencia.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/test">Hacer el Test Interactivo</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
