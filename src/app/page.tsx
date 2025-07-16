
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const popularCrops = [
  { 
    name: "Café", 
    imgSrc: "https://placehold.co/300x200.png", // Usar imagen real si se tiene
    imgAlt: "Planta de café", 
    hint: "coffee beans", 
    href: "/cultivos?q=Café",
    tags: ["Región: Andina", "Dificultad: Difícil", "Patrimonial"] 
  },
  { 
    name: "Papa", 
    imgSrc: "https://firebasestorage.googleapis.com/v0/b/agrinavigate.firebasestorage.app/o/Cultivos%2Fpapa.jpg?alt=media&token=9615f312-8217-47e2-8ea3-ae3fa80494c5", 
    imgAlt: "Cultivo de papa", 
    hint: "potato harvest", 
    href: "/cultivos?q=Papa",
    tags: ["Región: Andina", "Dificultad: Fácil", "Pancoger"]
  },
  { 
    name: "Maíz", 
    imgSrc: "https://firebasestorage.googleapis.com/v0/b/agrinavigate.firebasestorage.app/o/Cultivos%2Fmaiz.jpg?alt=media&token=b2e64dac-2b21-4ddc-b54d-4fa2f79a681a", 
    imgAlt: "Planta de maíz", 
    hint: "corn field", 
    href: "/cultivos?q=Maíz",
    tags: ["Región: Caribe", "Dificultad: Fácil", "Patrimonial"]
  },
];

const recentArticles = [
  { 
    title: "Control de Plagas Casero y Orgánico", 
    description: "Aprende a proteger tus cultivos de forma natural y efectiva sin químicos.",
    imgSrc: "https://placehold.co/400x250.png",
    imgAlt: "Control de plagas orgánico",
    hint: "garden pests",
    href: "/articulos" 
  },
  { 
    title: "El Arte del Compostaje: Nutriendo tu Tierra", 
    description: "Descubre cómo transformar desechos orgánicos en abono rico para tus plantas.",
    imgSrc: "https://placehold.co/400x250.png",
    imgAlt: "Compostaje casero",
    hint: "compost bin",
    href: "/articulos"
  },
  { 
    title: "Guía Práctica para la Siembra en Macetas", 
    description: "Ideal para espacios pequeños. Cultiva tus propios alimentos en balcones y patios.",
    imgSrc: "https://placehold.co/400x250.png",
    imgAlt: "Siembra en macetas",
    hint: "potted plants",
    href: "/articulos"
  },
];

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section 
        className="relative bg-cover bg-center py-20 md:py-28" 
        style={{ backgroundImage: "url('https://firebasestorage.googleapis.com/v0/b/agrinavigate.firebasestorage.app/o/vineyard-france.jpg?alt=media&token=9474ac58-bbb2-48bd-a1ff-925ef1b25805')" }}
        data-ai-hint="farming landscape"
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-4xl font-nunito font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Cultiva con conciencia. Conoce lo que crece en tu tierra
          </h1>
          <p className="mt-4 text-lg leading-7 text-neutral-200 max-w-2xl mx-auto font-sans">
            Una guía ecológica para sembrar, cuidar y transformar tus plantas.
          </p>
          
          <div className="mt-8 w-full max-w-xl mx-auto">
            <form action="/cultivos" method="GET" className="flex w-full items-center space-x-2">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="search"
                    name="q"
                    placeholder="¿Qué planta estás buscando?"
                    className="pl-10 h-12 text-base bg-white/90 text-gray-900 placeholder-gray-500 focus:bg-white font-nunito" 
                  />
                </div>
                <Button 
                  type="submit" 
                  size="lg"
                  variant="default" // Explicitly primary
                >
                  Explorar Cultivos
                </Button>
            </form>
          </div>
          <div className="text-center mt-6">
            <Button asChild size="lg" variant="default">
              <Link href="/test">Haz el test y encuentra tu planta ideal</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-12">
        <h2 className="text-3xl font-nunito font-bold tracking-tight text-foreground text-center mb-8">Cultivos Populares en Colombia</h2>
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 px-4">
          {popularCrops.map((crop) => (
            <Card key={crop.name} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow flex flex-col">
              <Image
                src={crop.imgSrc}
                alt={crop.imgAlt}
                width={300}
                height={200}
                className="w-full h-48 object-cover"
                data-ai-hint={crop.hint}
              />
              <CardHeader>
                <CardTitle className="font-nunito font-bold">{crop.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow space-y-2">
                <div className="flex flex-wrap gap-2">
                  {crop.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs font-nunito">{tag}</Badge>
                  ))}
                </div>
              </CardContent>
              <div className="p-6 pt-2">
                <Button asChild variant="link" className="p-0 h-auto text-primary font-nunito font-semibold">
                  <Link href={crop.href}>Ver detalles <ExternalLink className="ml-1 h-4 w-4" /></Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>
      
      <section className="grid md:grid-cols-2 gap-8 items-center py-12 px-4">
        <div>
          <h2 className="text-3xl font-nunito font-bold tracking-tight text-foreground">Descubra los Cultivos de Colombia</h2>
          <p className="mt-4 text-muted-foreground">
            Navegue por nuestro mapa interactivo para explorar los cultivos asociados a cada región de Colombia. Aprenda sobre su siembra, cuidado y cosecha de una manera fácil y divertida.
          </p>
           <div className="mt-8">
            <Button asChild size="lg" variant="default">
              <Link href="/mapa">Explorar Mapa Interactivo</Link>
            </Button>
          </div>
        </div>
        <div className="rounded-lg overflow-hidden shadow-xl aspect-video">
          <Image
            src="https://firebasestorage.googleapis.com/v0/b/agrinavigate.firebasestorage.app/o/mapa_pag_principal.jpg?alt=media&token=2d87fac5-0ef7-4054-b75c-ed63a3cc38b0"
            alt="Agricultura colombiana"
            width={600}
            height={400}
            className="object-cover w-full h-full"
            data-ai-hint="colombia agriculture"
          />
        </div>
      </section>

      <section className="py-12 bg-muted/30">
        <h2 className="text-3xl font-nunito font-bold tracking-tight text-foreground text-center mb-10">Artículos Recientes</h2>
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 px-4">
          {recentArticles.map((article) => (
            <Card key={article.title} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
               <Image
                src={article.imgSrc}
                alt={article.imgAlt}
                width={400}
                height={250}
                className="w-full h-52 object-cover"
                data-ai-hint={article.hint}
              />
              <CardHeader>
                <CardTitle className="text-xl font-nunito font-bold">{article.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground text-sm">{article.description}</p>
              </CardContent>
              <div className="p-6 pt-0">
                <Button asChild variant="outline">
                  <Link href={article.href}>Leer más <ExternalLink className="ml-2 h-4 w-4" /></Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

       <section className="text-center py-12 px-4">
         <h2 className="text-3xl font-nunito font-bold tracking-tight text-foreground">Guías para Todos</h2>
         <p className="mt-4 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
            Recursos educativos diseñados para niños, jóvenes y familias. Aprende de forma práctica y fomenta el amor por la tierra.
         </p>
         <div className="mt-8">
            <Button asChild variant="outline" size="lg">
                <Link href="/guias">Ver Guías Educativas</Link>
            </Button>
         </div>
       </section>

       <section className="text-center py-16 px-4 bg-primary/5">
         <h2 className="text-3xl font-nunito font-bold tracking-tight text-foreground">Únete a Nuestra Comunidad</h2>
         <p className="mt-4 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
            ¿Eres agricultor, investigador o apasionado por el campo? ¡Tu conocimiento y experiencia son valiosos! Ayúdanos a enriquecer esta plataforma.
         </p>
         <div className="mt-8">
            <Button size="lg" variant="default">
                Haz Parte de la Comunidad
            </Button>
         </div>
       </section>
    </div>
  );
}
