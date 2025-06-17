
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, ToyBrick } from "lucide-react";

const cultivoGuides = [
  {
    title: "Cultivo en Maceta",
    description: "Aprende a cultivar tus plantas favoritas en espacios reducidos utilizando macetas.",
    imgSrc: "https://placehold.co/400x300.png",
    dataAiHint: "potted plants",
    href: "#", 
  },
  {
    title: "Cultivo en Jardín",
    description: "Descubre cómo diseñar y mantener un jardín productivo y hermoso.",
    imgSrc: "https://placehold.co/400x300.png",
    dataAiHint: "home garden",
    href: "#",
  },
  {
    title: "Hidroponía Básica",
    description: "Introducción al cultivo sin suelo, una técnica moderna y eficiente.",
    imgSrc: "https://placehold.co/400x300.png",
    dataAiHint: "hydroponics system",
    href: "#",
  },
  {
    title: "Compostaje Casero",
    description: "Transforma tus residuos orgánicos en abono rico para tus plantas.",
    imgSrc: "https://placehold.co/400x300.png",
    dataAiHint: "compost bin",
    href: "#",
  },
  {
    title: "Cuidado Natural de Plantas",
    description: "Soluciones orgánicas y ecológicas para mantener tus plantas sanas.",
    imgSrc: "https://placehold.co/400x300.png",
    dataAiHint: "organic gardening",
    href: "#",
  },
];

const actividadesEscolares = [
  {
    title: "Juegos por Etapa de Cultivo",
    description: "Actividades lúdicas para enseñar sobre germinación, crecimiento y cosecha.",
    imgSrc: "https://placehold.co/400x300.png",
    dataAiHint: "kids gardening",
    href: "#", 
  },
  {
    title: "Montaje de Huerta Escolar",
    description: "Guía paso a paso para crear una huerta educativa en colegios.",
    imgSrc: "https://placehold.co/400x300.png",
    dataAiHint: "school garden",
    href: "#",
  },
  {
    title: "Recursos para el Aula",
    description: "Materiales y ideas para integrar la agricultura en el currículo escolar.",
    imgSrc: "https://placehold.co/400x300.png",
    dataAiHint: "classroom plants",
    href: "#",
  },
  {
    title: "Materiales Imprimibles",
    description: "Fichas, calendarios y más recursos descargables para actividades.",
    imgSrc: "https://placehold.co/400x300.png",
    dataAiHint: "printable worksheets",
    href: "#",
  },
];

export default function GuiasPage() {
  return (
    <div className="space-y-12">
      <h1 className="text-3xl font-bold font-headline tracking-tight text-foreground sm:text-4xl pb-4 border-b">
        Centro de Guías
      </h1>

      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <Leaf className="h-8 w-8 text-primary" />
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Guías de Cultivo
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cultivoGuides.map((guide) => (
            <Card key={guide.title} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow flex flex-col">
              <div className="relative w-full h-56">
                <Image
                  src={guide.imgSrc}
                  alt={guide.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  data-ai-hint={guide.dataAiHint}
                />
              </div>
              <CardHeader>
                <CardTitle className="text-xl font-headline">{guide.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">{guide.description}</p>
              </CardContent>
              {/* <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href={guide.href}>Explorar Guía</Link>
                </Button>
              </CardFooter> */}
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <ToyBrick className="h-8 w-8 text-purple-600" />
          <h2 className="text-2xl font-bold tracking-tight text-purple-700 sm:text-3xl">
            Actividades Escolares Divertidas
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {actividadesEscolares.map((activity) => (
            <Card 
              key={activity.title} 
              className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow flex flex-col bg-purple-50 border-purple-200 hover:border-purple-300"
            >
              <div className="relative w-full h-56">
                <Image
                  src={activity.imgSrc}
                  alt={activity.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  data-ai-hint={activity.dataAiHint}
                />
              </div>
              <CardHeader>
                <CardTitle className="text-xl font-headline text-purple-800">{activity.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-purple-700/90">{activity.description}</p>
              </CardContent>
              {/* <CardFooter>
                <Button asChild variant="outline" className="w-full border-purple-300 text-purple-700 hover:bg-purple-100">
                  <Link href={activity.href}>Ver Actividad</Link>
                </Button>
              </CardFooter> */}
            </Card>
          ))}
        </div>
      </section>
      
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
