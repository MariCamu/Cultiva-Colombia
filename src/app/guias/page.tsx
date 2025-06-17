
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Leaf, School } from "lucide-react"; // Usando School para Actividades Escolares

export default function GuiasPage() {
  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold font-headline tracking-tight text-foreground sm:text-4xl pb-4 border-b">
        Centro de Guías
      </h1>

      <Card className="w-full shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="items-start gap-4 space-y-0">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-3 rounded-full">
              <Leaf className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Guías de Cultivo
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-base">
            Aprende a sembrar, cuidar y cosechar tus propios alimentos en casa, en escuela o en comunidad. Métodos, materiales, soluciones ecológicas.
          </p>
        </CardContent>
        <CardFooter>
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
            <Link href="#">Explorar Guías de Cultivo</Link>
          </Button>
        </CardFooter>
      </Card>

      <Card className="w-full shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="items-start gap-4 space-y-0">
          <div className="flex items-center gap-3">
            <div className="bg-purple-600/10 p-3 rounded-full">
              <School className="h-8 w-8 text-purple-600" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-purple-700 sm:text-3xl">
              Actividades Escolares
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-base">
            Juegos, talleres y experiencias para aprender en el aula o la huerta escolar. Ideal para docentes y niños de todas las edades.
          </p>
        </CardContent>
        <CardFooter>
          <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-600/90 text-white">
            <Link href="#">Explorar Actividades Escolares</Link>
          </Button>
        </CardFooter>
      </Card>
      
      <Card className="mt-10 bg-accent/10">
        <CardHeader>
            <CardTitle>Más Contenido Próximamente</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">
                Estamos trabajando para expandir nuestras guías y actividades. ¡Vuelve pronto para descubrir nuevos recursos y aprender más sobre el fascinante mundo de la agricultura!
            </p>
        </CardContent>
      </Card>
    </div>
  );
}
