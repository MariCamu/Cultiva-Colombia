
"use client";

import { useState, useEffect, useMemo } from 'react';
import type { GlossaryTerm } from '@/models/glossary-model';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Search, Info } from 'lucide-react';


async function getGlossaryTerms(): Promise<GlossaryTerm[]> {
    const termsCollectionRef = collection(db, 'glosario');
    // FIX: Order by the correct field 'palabra' instead of 'termino'
    const q = query(termsCollectionRef, orderBy('palabra', 'asc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        // FIX: Prioritize 'palabra' as the main field for the term.
        termino: data.palabra || data.termino, 
        definicion: data.definicion,
        categoria: data.categoria,
        // FIX: Prioritize 'emojis' as the main field for the icon.
        icono_referencia: data.emojis || data.icono_referencia,
        orden_alfabetico: (data.palabra || data.termino).charAt(0).toUpperCase(),
        palabras_clave: data.palabras_clave || [],
      } as GlossaryTerm;
    });
}


export default function GlosarioPage() {
    const [terms, setTerms] = useState<GlossaryTerm[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    useEffect(() => {
        const fetchTerms = async () => {
            setIsLoading(true);
            try {
                const fetchedTerms = await getGlossaryTerms();
                setTerms(fetchedTerms);
            } catch (err) {
                console.error("Error fetching glossary:", err);
                setError("No se pudieron cargar los términos del glosario. Revisa las reglas de seguridad de Firestore y la conexión a internet.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchTerms();
    }, []);

    const categories = useMemo(() => {
        const uniqueCategories = [...new Set(terms.map(term => term.categoria))];
        return uniqueCategories.sort();
    }, [terms]);

    const filteredTerms = useMemo(() => {
        return terms.filter(term => {
            const matchesCategory = selectedCategory === 'all' || term.categoria === selectedCategory;
            const matchesSearch = searchQuery.toLowerCase() === '' ||
                term.termino.toLowerCase().includes(searchQuery.toLowerCase()) ||
                term.definicion.toLowerCase().includes(searchQuery.toLowerCase()) ||
                term.palabras_clave?.some(key => key.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchesCategory && matchesSearch;
        }).sort((a, b) => a.termino.localeCompare(b.termino));
    }, [terms, searchQuery, selectedCategory]);

    const groupedTerms = useMemo(() => {
        return filteredTerms.reduce((acc, term) => {
            const firstLetter = term.orden_alfabetico || term.termino.charAt(0).toUpperCase();
            if (!acc[firstLetter]) {
                acc[firstLetter] = [];
            }
            acc[firstLetter].push(term);
            return acc;
        }, {} as Record<string, GlossaryTerm[]>);
    }, [filteredTerms]);

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-nunito font-bold tracking-tight text-foreground sm:text-4xl">
                    Glosario: ¡Aprende los Términos Clave! 📚
                </h1>
                <p className="mt-2 max-w-2xl mx-auto text-lg text-muted-foreground">
                    Descubre el significado de las palabras esenciales para convertirte en un experto agricultor.
                </p>
            </div>

            <Card className="p-4 sm:p-6 shadow-lg bg-card/50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                        <label htmlFor="search-glossary" className="sr-only">Buscar término</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                id="search-glossary"
                                type="text"
                                placeholder="Buscar por término, palabra clave o definición..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 h-11"
                            />
                        </div>
                    </div>
                    <div>
                         <label htmlFor="category-filter" className="sr-only">Filtrar por categoría</label>
                         <Select value={selectedCategory} onValueChange={setSelectedCategory} disabled={isLoading || categories.length === 0}>
                            <SelectTrigger id="category-filter" className="h-11">
                                <SelectValue placeholder="Filtrar por categoría..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas las Categorías</SelectItem>
                                {categories.map(category => (
                                    <SelectItem key={category} value={category}>{category}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </Card>

            <div className="space-y-6">
                {isLoading && (
                    <div className="space-y-4">
                        <Skeleton className="h-10 w-20 mb-4" />
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-24 w-full" />
                    </div>
                )}

                {error && <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}

                {!isLoading && !error && filteredTerms.length > 0 && (
                     Object.keys(groupedTerms).sort().map(letter => (
                        <div key={letter}>
                            <h2 className="text-3xl font-nunito font-bold text-primary mb-4 pb-2 border-b-2 border-primary/20">{letter}</h2>
                            <div className="space-y-4">
                                {groupedTerms[letter].map(term => (
                                    <Card key={term.id} className="bg-background/50 p-4 shadow-sm hover:shadow-md transition-shadow">
                                        <CardHeader className="p-0">
                                            <CardTitle className="text-xl flex items-center gap-3">
                                                {term.icono_referencia && <span className="text-2xl">{term.icono_referencia}</span>}
                                                {term.termino}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-0 pt-2">
                                            <p className="text-muted-foreground">{term.definicion}</p>
                                            <Badge variant="outline" className="mt-3">{term.categoria}</Badge>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    ))
                )}

                {!isLoading && !error && terms.length > 0 && filteredTerms.length === 0 && (
                     <Alert>
                        <Info className="h-4 w-4" />
                        <AlertTitle>No se encontraron términos</AlertTitle>
                        <AlertDescription>
                            No se encontraron términos que coincidan con tu búsqueda. Prueba a cambiar los filtros o el término de búsqueda.
                        </AlertDescription>
                    </Alert>
                )}
                 {!isLoading && !error && terms.length === 0 && (
                     <Alert>
                        <Info className="h-4 w-4" />
                        <AlertTitle>Glosario Vacío</AlertTitle>
                        <AlertDescription>
                            Aún no se han añadido términos a la base de datos. Una vez que los añadas en Firestore, aparecerán aquí.
                        </AlertDescription>
                    </Alert>
                )}
            </div>
        </div>
    );
}
