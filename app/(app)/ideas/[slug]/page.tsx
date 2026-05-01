import { PlaceholderPage } from "@/components/placeholder-page";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <PlaceholderPage route={`/ideas/${slug}`} phase="Phase 4.2 (locked) / Phase 6.2 (unlocked)" />;
}
