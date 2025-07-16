
"use client";

import { useState, useEffect, useMemo } from 'react';
import type { GlossaryTerm } from '@/models/glossary-model';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Search, BookText, Info } from 'lucide-react';

const exampleTerms: Omit<GlossaryTerm, 'id'>[] = [
    { termino: "Compost", definicion: "Proceso natural de descomposición de materia orgánica (restos de comida, hojas secas) para crear un abono rico en nutrientes para el suelo. ¡Es como el oro para tus plantas!", categoria: "Conceptos Básicos", icono_referencia: "🌿", orden_alfabetico: "C", palabras_clave: ["abono", "orgánico", "descomposición"] },
    { termino: "Hidroponía", definicion: "Método de cultivo de plantas que no utiliza suelo. Las raíces se suspenden en una solución de agua rica en nutrientes. ¡Ideal para espacios pequeños y mucha diversión!", categoria: "Técnicas de Cultivo", icono_referencia: "💧", orden_alfabetico: "H", palabras_clave: ["cultivo sin suelo", "agua", "nutrientes"] },
    { termino: "pH del Suelo", definicion: "Medida de la acidez o alcalinidad del suelo, crucial para que las plantas absorban nutrientes. Un pH balanceado es la clave para un huerto feliz. ¡Ni muy ácido, ni muy básico!", categoria: "Suelo y Nutrientes", icono_referencia: "🧪", orden_alfabetico: "P", palabras_clave: ["acidez", "alcalinidad", "suelo"] },
    { termino: "Control Biológico", definicion: "Uso de organismos vivos (como insectos beneficiosos o bacterias) o métodos naturales para controlar plagas y enfermedades en los cultivos de forma ecológica, sin químicos dañinos. ¡La naturaleza ayuda a la naturaleza!", categoria: "Salud de la Planta", icono_referencia: "🐞", orden_alfabetico: "C", palabras_clave: ["plagas", "enfermedades", "ecológico"] },
    { termino: "Mulch", definicion: "Capa de material (como paja, corteza o plástico) que se esparce sobre el suelo para conservar la humedad, suprimir malezas y regular la temperatura del suelo.", categoria: "Técnicas de Cultivo", icono_referencia: "🌾", orden_alfabetico: "M", palabras_clave: ["cobertura", "acolchado", "protección suelo"] },
    { termino: "Germinación", definicion: "Proceso por el cual una semilla se desarrolla para convertirse en una nueva planta. Es el primer paso emocionante en el viaje de un cultivo.", categoria: "Conceptos Básicos", icono_referencia: "🌱", orden_alfabetico: "G", palabras_clave: ["semilla", "brote", "nacer"] },
    { termino: "Polinización", definicion: "Transferencia de polen que permite la fecundación y la producción de frutos y semillas. Puede ser realizada por el viento, el agua o animales como abejas y pájaros.", categoria: "Conceptos Básicos", icono_referencia: "🐝", orden_alfabetico: "P", palabras_clave: ["abejas", "reproducción", "flores"] }
];

// Add a unique id to each term for React keys
const glossaryData: GlossaryTerm[] = exampleTerms.map((term, index) => ({
    ...term,
    id: `glossary-term-${index}`
}));


export default function GlosarioPage() {
    const [terms] = useState<GlossaryTerm[]>(glossaryData);
    const [isLoading, setIsLoading] = useState(false); // Can be removed or kept for optimistic UI
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

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
                    Glosario Agropecuario: ¡Aprende los Términos Clave! 📚
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
                         <Select value={selectedCategory} onValueChange={setSelectedCategory}>
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

                {!isLoading && !error && filteredTerms.length === 0 && (
                     <Alert>
                        <Info className="h-4 w-4" />
                        <AlertTitle>No se encontraron términos</AlertTitle>
                        <AlertDescription>
                            No se encontraron términos que coincidan con tu búsqueda. Prueba a cambiar los filtros o el término de búsqueda.
                        </AlertDescription>
                    </Alert>
                )}
            </div>
        </div>
    );
}
