import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="text-center py-12 md:py-16">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Cultiva con conciencia. Conoce lo que crece en tu tierra
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
          Una guía ecológica para sembrar, cuidar y transformar tus plantas.
        </p>
      </section>

      <section className="w-full max-w-xl mx-auto space-y-4">
        <form action="/cultivos" method="GET"> {/* Form wraps input and button for potential submission */}
          <div className="flex w-full items-center space-x-2">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                name="q" // Added name for query parameter
                placeholder="¿Qué planta estás buscando?"
                className="pl-10 h-12 text-base" 
              />
            </div>
            <Button 
              type="submit" 
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground h-12"
            >
              Explorar Cultivos
            </Button>
          </div>
        </form>
        <p className="text-center">
          <Link href="/test" className="text-primary hover:text-primary/80 underline font-medium">
            Encuentra tu cultivo indicado
          </Link>
        </p>
      </section>

      <section className="grid md:grid-cols-2 gap-8 items-center py-8">
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
           <div className="mt-8">
            <Button asChild size="lg">
              <Link href="/mapa">Explorar Mapa Interactivo</Link>
            </Button>
          </div>
        </div>
        <div className="rounded-lg overflow-hidden shadow-xl aspect-video">
          <Image
            src="https://placehold.co/600x400.png"
            alt="Agricultura colombiana"
            width={600}
            height={400}
            className="object-cover w-full h-full"
            data-ai-hint="colombia agriculture"
          />
        </div>
      </section>

       <section className="text-center py-12">
         <h2 className="text-3xl font-bold tracking-tight text-foreground">Guías para Todos</h2>
         <p className="mt-4 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
            Recursos educativos diseñados para niños, jóvenes y familias. Aprende de forma práctica y fomenta el amor por la tierra.
         </p>
         <div className="mt-8">
            <Button asChild variant="outline" size="lg">
                <Link href="/guias">Ver Guías Educativas</Link>
            </Button>
         </div>
       </section>
    </div>
  );
}
