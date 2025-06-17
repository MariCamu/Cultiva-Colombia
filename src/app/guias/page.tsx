
"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Leaf, School, ChevronDown, ChevronUp } from "lucide-react";

type SectionType = 'cultivo' | 'escolar' | null;

interface SubSection {
  title: string;
  imgSrc: string;
  imgAlt: string;
  aiHint: string;
  href: string;
}

const guiasCultivoSubsections: SubSection[] = [
  { title: "Cultivo en Maceta", imgSrc: "https://placehold.co/300x200.png", imgAlt: "Planta en maceta", aiHint: "potted plant", href: "#" },
  { title: "Cultivo en Jardín/Suelo", imgSrc: "https://placehold.co/300x200.png", imgAlt: "Jardín con plantas", aiHint: "vegetable garden", href: "#" },
  { title: "Hidroponía Casera", imgSrc: "https://placehold.co/300x200.png", imgAlt: "Sistema hidropónico", aiHint: "hydroponics system", href: "#" },
  { title: "Compost y Abonos", imgSrc: "https://placehold.co/300x200.png", imgAlt: "Compostera", aiHint: "compost bin", href: "#" },
  { title: "Cuidado Natural de Plantas", imgSrc: "https://placehold.co/300x200.png", imgAlt: "Mano regando planta", aiHint: "plant care", href: "#" },
];

const actividadesEscolaresSubsections: SubSection[] = [
  { title: "Juegos por Etapa de Cultivo", imgSrc: "https://placehold.co/300x200.png", imgAlt: "Niños jugando en huerta", aiHint: "children gardening", href: "#" },
  { title: "Proyecto: Huerta Escolar", imgSrc: "https://placehold.co/300x200.png", imgAlt: "Huerta en una escuela", aiHint: "school garden", href: "#" },
  { title: "Recursos para el Aula", imgSrc: "https://placehold.co/300x200.png", imgAlt: "Materiales educativos", aiHint: "classroom materials", href: "#" },
  { title: "Materiales Imprimibles", imgSrc: "https://placehold.co/300x200.png", imgAlt: "Hojas imprimibles", aiHint: "printable worksheet", href: "#" },
];

export default function GuiasPage() {
  const [activeSection, setActiveSection] = useState<SectionType>(null);

  const toggleSection = (section: 'cultivo' | 'escolar') => {
    setActiveSection(prev => prev === section ? null : section);
  };

  const renderSubsections = (subsections: SubSection[], sectionTitle: string) => (
    <div className="mt-8">
      <h2 className="text-2xl font-nunito font-semibold tracking-tight text-foreground mb-6">{sectionTitle}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {subsections.map((item) => (
          <Card key={item.title} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow flex flex-col">
            <Image
              src={item.imgSrc}
              alt={item.imgAlt}
              width={300}
              height={200}
              className="w-full h-40 object-cover"
              data-ai-hint={item.aiHint}
            />
            <CardHeader className="flex-grow">
              <CardTitle className="text-lg font-nunito font-bold">{item.title}</CardTitle>
            </CardHeader>
            <CardFooter>
              <Button variant="outline" size="sm" asChild>
                <a href={item.href}>Explorar</a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-nunito font-bold tracking-tight text-foreground sm:text-4xl pb-4 border-b">
        Centro de Guías
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="w-full shadow-lg hover:shadow-xl transition-shadow">
          <Image
            src="https://placehold.co/600x300.png"
            alt="Guías de cultivo"
            width={600}
            height={300}
            className="w-full h-56 object-cover rounded-t-lg"
            data-ai-hint="gardening tools"
          />
          <CardHeader className="items-start gap-4 space-y-0 pt-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-3 rounded-full">
                <Leaf className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl font-nunito font-bold tracking-tight text-foreground sm:text-3xl">
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
            <Button onClick={() => toggleSection('cultivo')} size="lg" className="w-full">
              {activeSection === 'cultivo' ? <ChevronUp className="mr-2 h-5 w-5" /> : <ChevronDown className="mr-2 h-5 w-5" />}
              {activeSection === 'cultivo' ? 'Ocultar Guías' : 'Explorar Guías'}
            </Button>
          </CardFooter>
        </Card>

        <Card className="w-full shadow-lg hover:shadow-xl transition-shadow bg-accent/10 border-accent/30">
           <Image
            src="https://placehold.co/600x300.png"
            alt="Actividades escolares"
            width={600}
            height={300}
            className="w-full h-56 object-cover rounded-t-lg"
            data-ai-hint="children classroom"
          />
          <CardHeader className="items-start gap-4 space-y-0 pt-4">
            <div className="flex items-center gap-3">
              <div className="bg-accent/10 p-3 rounded-full"> {/* Changed from purple-600/10 to accent/10 */}
                <School className="h-8 w-8 text-accent" /> {/* Changed from text-purple-600 to text-accent */}
              </div>
              <CardTitle className="text-2xl font-nunito font-bold tracking-tight text-accent sm:text-3xl"> {/* Changed from text-purple-700 to text-accent */}
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
            <Button onClick={() => toggleSection('escolar')} size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground w-full"> {/* Changed button colors */}
              {activeSection === 'escolar' ? <ChevronUp className="mr-2 h-5 w-5" /> : <ChevronDown className="mr-2 h-5 w-5" />}
              {activeSection === 'escolar' ? 'Ocultar Actividades' : 'Explorar Actividades'}
            </Button>
          </CardFooter>
        </Card>
      </div>

      {activeSection === 'cultivo' && renderSubsections(guiasCultivoSubsections, "Explora Nuestras Guías de Cultivo")}
      {activeSection === 'escolar' && renderSubsections(actividadesEscolaresSubsections, "Descubre Actividades Escolares")}

      <Card className="mt-10 bg-card"> {/* Changed from bg-accent/10 to bg-card */}
        <CardHeader>
            <CardTitle className="font-nunito font-bold">Más Contenido Próximamente</CardTitle>
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
