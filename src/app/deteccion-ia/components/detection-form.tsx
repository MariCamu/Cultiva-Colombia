
"use client";

import { useState, type FormEvent, useEffect, useRef } from 'react';
import Image from 'next/image';
import { analyzePlantImage, type AnalyzePlantImageOutput } from '@/ai/flows/detect-crop-disease'; // Updated import
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { UploadCloud, AlertCircle, CheckCircle2, List, Sprout, ShieldCheck, ShieldAlert, FlaskConical, FileQuestion, Microscope } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const fileToDataUri = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export function DetectionForm() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalyzePlantImageOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileInputKey, setFileInputKey] = useState<number>(Date.now());

  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
    setPreviewUrl(null);
  }, [file]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      setError('Por favor, seleccione una imagen para analizar.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const photoDataUri = await fileToDataUri(file);
      const result = await analyzePlantImage({ photoDataUri }); // Updated function call
      setAnalysisResult(result);
    } catch (e) {
      console.error(e);
      setError('Ocurrió un error durante el análisis. Por favor, inténtelo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Validate file type and size (optional)
      const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
      if (!allowedTypes.includes(selectedFile.type)) {
        setError('Tipo de archivo no permitido. Sube PNG, JPG o WEBP.');
        setFile(null);
        return;
      }
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (selectedFile.size > maxSize) {
        setError('El archivo es demasiado grande. Máximo 5MB.');
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError(null);
      setAnalysisResult(null);
    } else {
      setFile(null);
    }
  };
  
  const resetForm = () => {
    setFile(null);
    setPreviewUrl(null);
    setAnalysisResult(null);
    setError(null);
    setIsLoading(false);
    setFileInputKey(Date.now()); 
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2 font-nunito font-bold">
            <Microscope className="h-7 w-7 text-primary" />
            Análisis IA de Plantas
        </CardTitle>
        <CardDescription>
          Sube una imagen de tu planta para identificarla y conocer su estado de salud.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="cropImage" className="block text-sm font-nunito font-semibold text-foreground mb-1">
              Imagen de la Planta
            </label>
            <Input
              id="cropImage"
              key={fileInputKey}
              type="file"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleFileChange}
              className="file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20 file:border-0 file:rounded-md file:px-3 file:py-1.5 font-nunito"
              disabled={isLoading}
            />
          </div>

          {previewUrl && (
            <div className="mt-4 border border-dashed border-border rounded-lg p-2">
              <Image
                src={previewUrl}
                alt="Vista previa de la planta"
                width={500}
                height={300}
                className="rounded-md object-contain max-h-[300px] w-auto mx-auto"
                data-ai-hint="plant detail"
              />
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading || !file}>
            {isLoading ? (
              <>
                <UploadCloud className="mr-2 h-4 w-4 animate-pulse" />
                Analizando...
              </>
            ) : (
              <>
                <UploadCloud className="mr-2 h-4 w-4" />
                Analizar Imagen
              </>
            )}
          </Button>
           { (file || analysisResult || error) && 
            <Button type="button" variant="outline" className="w-full mt-2" onClick={resetForm} disabled={isLoading}>
              Limpiar y Subir Nueva Imagen
            </Button>
           }
        </form>

        {isLoading && <Progress value={undefined} className="w-full animate-pulse mt-4 h-2" />}

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="font-nunito font-semibold">Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {analysisResult && (
          <Card className="mt-6 bg-background/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-nunito font-bold">
                <FlaskConical className="h-6 w-6 text-primary" />
                Resultados del Análisis IA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!analysisResult.identification.isPlant ? (
                 <Alert variant="default" className="border-orange-300 bg-orange-50 text-orange-700">
                    <FileQuestion className="h-5 w-5 text-orange-600" />
                    <AlertTitle className="font-nunito font-semibold">No se detectó una planta</AlertTitle>
                    <AlertDescription>
                        La IA no pudo identificar claramente una planta en la imagen. Intenta con otra foto donde la planta sea el sujeto principal y esté bien iluminada.
                    </AlertDescription>
                </Alert>
              ) : (
                <>
                  <Card className="p-4 bg-primary/5">
                    <CardTitle className="text-lg mb-2 flex items-center gap-2 font-nunito font-bold">
                        <Sprout className="h-5 w-5 text-green-600" />
                        Identificación de la Planta
                    </CardTitle>
                    <div className="space-y-1 text-sm">
                        <p><strong className="font-nunito font-semibold">¿Es una planta?</strong> <Badge variant={analysisResult.identification.isPlant ? "default" : "destructive"} className="font-nunito">{analysisResult.identification.isPlant ? 'Sí' : 'No'}</Badge></p>
                        {analysisResult.identification.commonName && <p><strong className="font-nunito font-semibold">Nombre Común:</strong> {analysisResult.identification.commonName}</p>}
                        {analysisResult.identification.scientificName && <p><strong className="font-nunito font-semibold">Nombre Científico:</strong> <em>{analysisResult.identification.scientificName}</em></p>}
                        {!(analysisResult.identification.commonName || analysisResult.identification.scientificName) && <p className="text-muted-foreground">La IA confirmó que es una planta, pero no pudo determinar la especie específica con esta imagen.</p>}
                    </div>
                  </Card>

                  {analysisResult.health && (
                    <Card className="p-4 bg-secondary/5">
                        <CardTitle className="text-lg mb-2 flex items-center gap-2 font-nunito font-bold">
                            {analysisResult.health.isHealthy ? <ShieldCheck className="h-5 w-5 text-green-600" /> : <ShieldAlert className="h-5 w-5 text-destructive" />}
                            Estado de Salud
                        </CardTitle>
                        <p className={`text-sm font-nunito font-semibold ${analysisResult.health.isHealthy ? 'text-green-700' : 'text-destructive'}`}>
                            {analysisResult.health.isHealthy ? 'La planta parece estar saludable.' : 'La planta podría tener algunos problemas.'}
                        </p>

                        {analysisResult.health.problems && analysisResult.health.problems.length > 0 && (
                        <div className="mt-3">
                            <h4 className="font-nunito font-semibold text-md mb-1">Problemas Detectados:</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground pl-2">
                            {analysisResult.health.problems.map((problem, index) => (
                                <li key={index}><strong className="font-nunito font-semibold">{problem.name}:</strong> {problem.description}</li>
                            ))}
                            </ul>
                        </div>
                        )}

                        {analysisResult.health.suggestions && analysisResult.health.suggestions.length > 0 && (
                        <div className="mt-4">
                            <h4 className="font-nunito font-semibold text-md mb-1 flex items-center gap-2">
                                <List className="h-5 w-5 text-primary" />
                                Sugerencias:
                            </h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground pl-2">
                            {analysisResult.health.suggestions.map((suggestion, index) => (
                                <li key={index}>{suggestion}</li>
                            ))}
                            </ul>
                        </div>
                        )}
                         {(!analysisResult.health.problems || analysisResult.health.problems.length === 0) && !analysisResult.health.isHealthy && (
                             <p className="text-sm text-muted-foreground mt-2">La IA indica que la planta podría no estar completamente saludable, pero no se especificaron problemas concretos. Considera revisar el entorno y cuidados generales.</p>
                         )}
                    </Card>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
