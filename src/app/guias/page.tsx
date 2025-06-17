
"use client";

import { useEffect, useState } from 'react';
import { collection, getDocs, type QueryDocumentSnapshot, type DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { EducationalGuideDocument } from '@/lib/educational-guides-structure';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, AlertCircle, Info, Library, Users } from 'lucide-react';

export default function GuiasPage() {
  const [guides, setGuides] = useState<EducationalGuideDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGuides = async () => {
      setIsLoading(true);
      setError(null);
      try {
        if (!db) {
            throw new Error("Firestore no está inicializado correctamente. Revisa la configuración en src/lib/firebase.ts");
        }
        const guidesCollection = collection(db, 'educational_guides');
        const guidesSnapshot = await getDocs(guidesCollection);

        if (guidesSnapshot.empty) {
          setGuides([]);
        } else {
          const guidesList = guidesSnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
            const data = doc.data() as Omit<EducationalGuideDocument, 'id'>;
            return {
              id: doc.id,
              ...data,
            } as EducationalGuideDocument;
          });
          setGuides(guidesList);
        }
      } catch (err: any) {
        console.error("Error fetching guides:", err);
        setError(err.message || "No se pudieron cargar las guías educativas. Inténtalo de nuevo más tarde.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGuides();
  }, []);

  const generalGuides = guides.filter(guide => guide.type === 'general');
  const educationalGuides = guides.filter(guide => guide.type === 'educativo');

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-1/2" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-1/2 mb-4" />
            <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Guías Educativas
        </h1>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error al cargar las guías</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const renderGuideList = (guideList: EducationalGuideDocument[], listTitle: string, icon: React.ReactNode) => (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl flex items-center gap-2">
        {icon}
        {listTitle}
      </h2>
      {guideList.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">
              Actualmente no hay guías de tipo "{listTitle.toLowerCase().replace('guías ', '')}" disponibles.
            </p>
          </CardContent>
        </Card>
      ) : (
        guideList.map((guide) => (
          <Card key={guide.id} className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-headline flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-primary"/>
                  {guide.title}
              </CardTitle>
              <CardDescription className="pt-1">{guide.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                  <p className="text-sm font-semibold text-foreground">Público Objetivo:</p>
                  <p className="text-sm text-muted-foreground">{guide.target_audience.join(', ')}</p>
              </div>
              
              {guide.subcategories && guide.subcategories.length > 0 && (
                <div>
                  <h4 className="text-md font-semibold text-foreground mb-2">Subcategorías:</h4>
                  <Accordion type="single" collapsible className="w-full">
                    {guide.subcategories.map((subcategory, index) => (
                      <AccordionItem value={`item-${guide.id}-${index}`} key={index}>
                        <AccordionTrigger className="text-base hover:no-underline">
                          {subcategory.name}
                        </AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground">{subcategory.description}</p>
                           <p className="text-xs text-primary mt-2">Más detalles y contenido específico próximamente.</p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </section>
  );

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold font-headline tracking-tight text-foreground sm:text-4xl pb-2 border-b">
        Centro de Guías
      </h1>

      {guides.length === 0 && !isLoading && (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"> <Info className="h-6 w-6 text-primary" /> Información</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">
                Actualmente no hay guías educativas disponibles. Estamos trabajando para añadir contenido pronto. ¡Vuelve a visitarnos!
                </p>
            </CardContent>
        </Card>
      )}

      {guides.length > 0 && (
        <>
          {renderGuideList(generalGuides, "Guías Generales", <Users className="h-7 w-7 text-accent" />)}
          {renderGuideList(educationalGuides, "Guías Educativas", <Library className="h-7 w-7 text-accent" />)}
        </>
      )}
    </div>
  );
}

