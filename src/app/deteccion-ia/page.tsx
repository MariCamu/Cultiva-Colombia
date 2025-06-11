import { DetectionForm } from './components/detection-form';

export default function DeteccionIAPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline tracking-tight text-foreground sm:text-4xl">
        Detección con IA
      </h1>
      <DetectionForm />
    </div>
  );
}
