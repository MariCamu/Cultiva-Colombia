
"use client";

import { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import type { EducationalGuideDocument } from '@/lib/educational-guides-structure';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { BookOpen, Info, CheckCircle, FlaskConical, Recycle, Search } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';


async function getGuides(): Promise<EducationalGuideDocument[]> {
    const guidesCollectionRef = collection(db, 'guias_educativas');
    const q = query(guidesCollectionRef, orderBy('titulo', 'asc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data
      } as EducationalGuideDocument;
    });
}

const normalizeText = (text: string) => {
    if (!text) return '';
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
};

export default function GuiasPage() {
  const [guides, setGuides] = useState<EducationalGuideDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [openAccordionItem, setOpenAccordionItem] = useState<string | undefined>(undefined);
  const accordionRefs = useRef<{[key: string]: HTMLDivElement | null}>({});

  useEffect(() => {
    const fetchGuides = async () => {
        setIsLoading(true);
        try {
            const fetchedGuides = await getGuides();
            setGuides(fetchedGuides);

            // Check for hash in URL to open specific guide
            const hash = window.location.hash.substring(1);
            if (hash) {
                setOpenAccordionItem(hash);
            }
        } catch (err) {
            console.error("Error fetching guides:", err);
            setError("No se pudieron cargar las guías. Revisa tu conexión y las reglas de seguridad de Firestore.");
        } finally {
            setIsLoading(false);
        }
    };
    fetchGuides();
  }, []);

  // Effect to scroll to and open the guide from URL hash
  useEffect(() => {
    if (openAccordionItem && !isLoading) {
        const element = accordionRefs.current[openAccordionItem];
        if (element) {
            setTimeout(() => {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100); // Small delay to ensure accordion is rendered
        }
    }
  }, [openAccordionItem, isLoading]);

  const filteredGuides = useMemo(() => {
    if (!searchQuery) {
        return guides;
    }
    const normalizedQuery = normalizeText(searchQuery);
    return guides.filter(guide => 
        normalizeText(guide.titulo).includes(normalizedQuery) ||
        normalizeText(guide.subtitulo).includes(normalizedQuery)
    );
  }, [guides, searchQuery]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      );
    }
    
    if (error) {
        return <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>;
    }
    
    if (guides.length === 0) {
        return (
            <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Sección en Construcción</AlertTitle>
                <AlertDescription>
                    Aún no se han añadido guías a la base de datos. ¡Vuelve pronto para ver el nuevo contenido!
                </AlertDescription>
            </Alert>
        );
    }
    
    if (filteredGuides.length === 0) {
       return (
            <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>No se encontraron guías</AlertTitle>
                <AlertDescription>
                    Ninguna guía coincide con tu búsqueda. Intenta con otras palabras.
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <Accordion type="single" collapsible value={openAccordionItem} onValueChange={setOpenAccordionItem} className="w-full space-y-4">
            {filteredGuides.map((guide) => (
                <div key={guide.id} id={guide.id} ref={el => accordionRefs.current[guide.id] = el}>
                    <AccordionItem value={guide.id} className="border rounded-lg bg-card">
                        <AccordionTrigger className="p-6 text-xl text-left hover:no-underline">
                            <div className="flex items-start gap-4">
                            <div className="bg-primary/10 p-3 rounded-full mt-1">
                                <BookOpen className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h2 className="font-nunito font-bold text-primary">{guide.titulo}</h2>
                                <p className="text-sm font-sans font-normal text-muted-foreground mt-1">{guide.subtitulo}</p>
                            </div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="p-6 pt-0">
                            <div className="space-y-6">
                                <p className="text-base text-muted-foreground">{guide.descripcion}</p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {guide.materiales && guide.materiales.length > 0 && (
                                        <Card className="bg-background/50">
                                            <CardHeader>
                                                <CardTitle className="text-lg flex items-center gap-2"><Recycle className="h-5 w-5 text-green-600"/>Materiales</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                                    {guide.materiales.map((item, i) => <li key={i}>{item}</li>)}
                                                </ul>
                                            </CardContent>
                                        </Card>
                                    )}
                                    {guide.exito && guide.exito.length > 0 && (
                                        <Card className="bg-background/50">
                                            <CardHeader>
                                                <CardTitle className="text-lg flex items-center gap-2"><CheckCircle className="h-5 w-5 text-blue-600"/>Indicadores de Éxito</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                                    {guide.exito.map((item, i) => <li key={i}>{item}</li>)}
                                                </ul>
                                            </CardContent>
                                        </Card>
                                    )}
                                </div>

                                {guide.pasos && guide.pasos.length > 0 && (
                                    <div className="space-y-3">
                                        <h3 className="text-lg font-nunito font-semibold flex items-center gap-2"><FlaskConical className="h-5 w-5 text-amber-600"/>Pasos a Seguir</h3>
                                        <ol className="list-decimal list-inside space-y-2 text-muted-foreground pl-4">
                                            {guide.pasos.map((paso, i) => <li key={i}>{paso}</li>)}
                                        </ol>
                                    </div>
                                )}

                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </div>
            ))}
        </Accordion>
    );
  };


  return (
    <div className="space-y-8">
       <div className="text-center">
            <h1 className="text-3xl font-nunito font-bold tracking-tight text-foreground sm:text-4xl">
                Guías Didácticas y Prácticas
            </h1>
            <p className="mt-2 max-w-2xl mx-auto text-lg text-muted-foreground">
                Aprende técnicas, prepara abonos y descubre secretos para que tus cultivos prosperen.
            </p>
        </div>
        
        <Card className="p-4 sm:p-6 shadow-lg bg-card/50">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    id="search-guides"
                    type="text"
                    placeholder="Buscar por título o descripción de la guía..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-11"
                />
            </div>
        </Card>

        <div className="mt-6">
            {renderContent()}
        </div>
    </div>
  );
}
