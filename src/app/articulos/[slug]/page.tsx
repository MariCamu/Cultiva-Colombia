
'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import type { Article } from '@/models/article-model';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

async function getArticle(slug: string): Promise<Article | null> {
  const articlesCollectionRef = collection(db, 'articulos');
  const q = query(articlesCollectionRef, where('slug', '==', slug));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return null;
  }

  const doc = querySnapshot.docs[0];
  const data = doc.data();
  
  return {
    id: doc.id,
    slug: data.slug,
    title: data.title,
    summary: data.summary,
    content: data.content,
    imageUrl: data.imageUrl,
    dataAiHint: data.dataAiHint,
    createdAt: (data.createdAt as Timestamp).toDate(),
    tags: data.tags || [],
  };
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      setIsLoading(true);
      const fetchedArticle = await getArticle(params.slug);
      if (!fetchedArticle) {
        notFound();
      } else {
        setArticle(fetchedArticle);
      }
      setIsLoading(false);
    };

    fetchArticle();
  }, [params.slug]);

  if (isLoading) {
    return (
        <article className="max-w-4xl mx-auto">
            <Skeleton className="h-8 w-48 mb-4" />
            <Skeleton className="h-12 w-3/4 mb-6" />
            <Skeleton className="h-6 w-full mb-8" />
            <Skeleton className="w-full h-[500px] rounded-xl mb-8" />
            <div className="space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-5/6" />
                <Skeleton className="h-6 w-full" />
            </div>
        </article>
    );
  }

  if (!article) {
    return null; // notFound() is called in useEffect, this is for type safety
  }

  return (
    <article className="max-w-4xl mx-auto">
      <div className="mb-8">
        {/* Breadcrumbs for Desktop/Tablet */}
        <nav className="hidden md:flex items-center text-sm font-medium text-muted-foreground mb-4">
            <Link href="/articulos" className="hover:text-primary">Artículos</Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <span className="text-foreground truncate">{article.title}</span>
        </nav>
        {/* Back Button for Mobile */}
         <Button asChild variant="ghost" className="md:hidden mb-4 -ml-4">
           <Link href="/articulos">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a todos los artículos
           </Link>
         </Button>
        <h1 className="text-4xl font-nunito font-extrabold tracking-tight lg:text-5xl">
          {article.title}
        </h1>
        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Publicado el {article.createdAt.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="flex gap-2">
                {article.tags?.map(tag => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
            </div>
        </div>
      </div>

      <Image
        src={article.imageUrl}
        alt={`Imagen para ${article.title}`}
        width={1200}
        height={600}
        className="w-full h-auto max-h-[500px] object-cover rounded-xl shadow-lg mb-8"
        data-ai-hint={article.dataAiHint}
        priority
      />

      <div 
        className="prose prose-lg dark:prose-invert max-w-none prose-p:font-sans prose-headings:font-nunito"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
    </article>
  );
}
