
export interface Article {
    id: string;
    slug: string; // URL-friendly version of the title
    title: string;
    summary: string;
    content: string; // HTML content for the article body
    imageUrl: string;
    dataAiHint: string;
    tags?: string[];
    createdAt: Date;
}
