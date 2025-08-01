
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Article } from '@/models/article-model';
import { ExternalLink, UploadCloud, Loader2 } from "lucide-react";
import { seedArticles } from '@/lib/seed';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

async function getArticles() {
  const articlesCollectionRef = collection(db, 'articulos');
  const q = query(articlesCollectionRef, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  
  const articles = querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      slug: data.slug,
      title: data.title,
      summary: data.summary,
      imageUrl: data.imageUrl,
      dataAiHint: data.dataAiHint,
      createdAt: data.createdAt.toDate(),
    } as Article;
  });

  return articles;
}

export default function ArticulosPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);
  const { toast } = useToast();

  const fetchArticles = async () => {
    setIsLoading(true);
    const fetchedArticles = await getArticles();
    setArticles(fetchedArticles);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleSeed = async () => {
    setIsSeeding(true);
    try {
      await seedArticles();
      toast({
        title: "¡Artículos cargados!",
        description: "Los artículos de ejemplo se han añadido a tu base de datos.",
      });
      await fetchArticles(); // Refresh the list
    } catch (error) {
      console.error("Error seeding articles:", error);
      toast({
        title: "Error al cargar",
        description: "Hubo un problema al cargar los artículos de ejemplo.",
        variant: "destructive",
      });
    } finally {
      setIsSeeding(false);
    }
  };
  
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <Skeleton className="h-52 w-full" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6 mt-2" />
              </CardContent>
              <CardFooter>
                 <Skeleton className="h-10 w-28" />
              </CardFooter>
            </Card>
          ))}
        </div>
      );
    }

    if (articles.length === 0) {
      return (
        <Card className="text-center py-10 px-6">
          <CardHeader>
            <CardTitle>¡Tu sección de artículos está lista!</CardTitle>
            <CardDescription>No hemos encontrado artículos en tu base de datos. ¿Quieres cargar algunos ejemplos para empezar?</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleSeed} disabled={isSeeding}>
              {isSeeding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
              {isSeeding ? 'Cargando...' : 'Cargar artículos de ejemplo'}
            </Button>
            <p className="text-xs text-muted-foreground mt-4">
              Esto añadirá 3 artículos de muestra a tu colección 'articulos' en Firestore.
            </p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article) => (
           <Card key={article.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
               <Image
                src={article.imageUrl}
                alt={`Imagen para ${article.title}`}
                width={400}
                height={250}
                className="w-full h-52 object-cover"
                data-ai-hint={article.dataAiHint}
              />
              <CardHeader>
                <CardTitle className="text-xl font-nunito font-bold">{article.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground text-sm">{article.summary}</p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline">
                  <Link href={`/articulos/${article.slug}`}>Leer más <ExternalLink className="ml-2 h-4 w-4" /></Link>
                </Button>
              </CardFooter>
            </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8">
       <div className="text-center">
        <h1 className="text-3xl font-nunito font-bold tracking-tight text-foreground sm:text-4xl">
          Artículos y Conocimiento
        </h1>
        <p className="mt-2 max-w-2xl mx-auto text-lg text-muted-foreground">
          Explora nuestras guías, noticias y mejores prácticas para llevar tus cultivos al siguiente nivel.
        </p>
      </div>
      
      {renderContent()}

    </div>
  );
}
