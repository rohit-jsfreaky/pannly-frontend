import { PlaceholderPage } from "@/components/placeholder-page";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <PlaceholderPage route={`/built/${slug}`} phase="Phase 4.4" />;
}
