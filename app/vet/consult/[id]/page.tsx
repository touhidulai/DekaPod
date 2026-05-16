import ConsultationRoom from '@/components/ConsultationRoom';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function VetConsultPage({ params }: Props) {
  const { id } = await params;
  return <ConsultationRoom consultationId={id} backHref="/vet" />;
}
