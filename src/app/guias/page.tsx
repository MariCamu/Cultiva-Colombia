import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function GuiasPage() {
  const guias = [
    {
      title: "¿Qué es el compost y cómo hacerlo?",
      content: "El compost es un abono orgánico rico en nutrientes que se forma por la descomposición de materia orgánica. Aprende a prepararlo en casa para mejorar la fertilidad de tu suelo."
    },
    {
      title: "¿Cómo preparar un suelo suelto y fértil?",
      content: "Un suelo suelto y bien aireado es crucial para el desarrollo de las raíces. Descubre técnicas para mejorar la estructura y composición de tu tierra de cultivo."
    },
    {
      title: "¿Qué son los surcos y por qué se usan en la siembra?",
      content: "Los surcos son hileras o canales que se hacen en la tierra para sembrar. Conoce su importancia para la distribución de semillas, el riego y el manejo de los cultivos."
    },
    {
      title: "¿Cómo construir un sistema hidropónico básico en casa?",
      content: "La hidroponía permite cultivar plantas sin suelo, usando soluciones minerales. Te mostramos los pasos para armar un sistema sencillo para tus propios cultivos urbanos."
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Guías Educativas
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Aprende y Cultiva</CardTitle>
          <CardDescription>Recursos educativos para fortalecer tus conocimientos en agricultura y soberanía alimentaria.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Explore nuestras guías diseñadas para niños, jóvenes y familias. Con un lenguaje accesible, buscamos fomentar el aprendizaje práctico y el amor por la tierra.
          </p>
          <Accordion type="single" collapsible className="w-full">
            {guias.map((guia, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger className="text-lg">{guia.title}</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">{guia.content}</p>
                  <p className="text-sm text-primary mt-2">Más detalles próximamente.</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
