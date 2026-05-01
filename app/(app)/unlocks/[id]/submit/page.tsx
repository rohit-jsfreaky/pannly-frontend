import { PlaceholderPage } from "@/components/placeholder-page";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PlaceholderPage route={`/unlocks/${id}/submit`} phase="Phase 6.3" />;
}
