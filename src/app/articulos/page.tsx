
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { collection, getDocs, orderBy, query, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Article } from '@/models/article-model';
import { ExternalLink } from "lucide-react";

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

export default async function ArticulosPage() {
  const articles = await getArticles();

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

    </div>
  );
}
