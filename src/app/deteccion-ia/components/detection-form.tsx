
"use client";

import { useState, type FormEvent, useEffect } from 'react';
import Image from 'next/image';
import { detectCropDisease, type DetectCropDiseaseOutput } from '@/ai/flows/detect-crop-disease';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { UploadCloud, AlertCircle, CheckCircle2, List } from 'lucide-react';

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
  const [analysisResult, setAnalysisResult] = useState<DetectCropDiseaseOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileInputKey, setFileInputKey] = useState<number>(Date.now()); // For resetting file input

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
      const result = await detectCropDisease({ photoDataUri });
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
    setFileInputKey(Date.now()); // Reset file input to allow re-selection of the same file
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl">Analizar Cultivo</CardTitle>
        <CardDescription>
          Suba una imagen de su cultivo para detectar posibles enfermedades y obtener sugerencias de tratamiento.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="cropImage" className="block text-sm font-medium text-foreground mb-1">
              Imagen del Cultivo
            </label>
            <Input
              id="cropImage"
              key={fileInputKey}
              type="file"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleFileChange}
              className="file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20 file:border-0 file:rounded-md file:px-3 file:py-1.5"
              disabled={isLoading}
            />
          </div>

          {previewUrl && (
            <div className="mt-4 border border-dashed border-border rounded-lg p-2">
              <Image
                src={previewUrl}
                alt="Vista previa del cultivo"
                width={500}
                height={300}
                className="rounded-md object-contain max-h-[300px] w-auto mx-auto"
                data-ai-hint="crop plant"
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
              Limpiar
            </Button>
           }
        </form>

        {isLoading && <Progress value={undefined} className="w-full animate-pulse mt-4 h-2" />}

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {analysisResult && (
          <Card className="mt-6 bg-background/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {analysisResult.diseaseDetected ? <AlertCircle className="text-destructive h-6 w-6" /> : <CheckCircle2 className="text-green-600 h-6 w-6" />}
                Resultado del Análisis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {analysisResult.diseaseDetected ? (
                <>
                  <p><strong>Enfermedad Detectada:</strong> {analysisResult.diseaseName || 'No especificada'}</p>
                  <p>
                    <strong>Nivel de Confianza:</strong>{' '}
                    {analysisResult.confidenceLevel !== undefined 
                      ? `${(analysisResult.confidenceLevel * 100).toFixed(0)}%`
                      : 'No especificado'}
                  </p>
                  {analysisResult.remedies && analysisResult.remedies.length > 0 && (
                    <div>
                      <h4 className="font-semibold mt-3 mb-1 flex items-center gap-2">
                        <List className="h-5 w-5 text-primary" />
                        Remedios Sugeridos:
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground pl-2">
                        {analysisResult.remedies.map((remedy, index) => (
                          <li key={index}>{remedy}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-green-700 font-medium">
                  No se detectó ninguna enfermedad aparente en la imagen proporcionada.
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
