import { CollectionPage } from "@/components/collection-page";
import { fragrances } from "@/lib/catalog";

export const metadata = {
  title: "The Collection | Seven Scents",
  description: "Explore the Seven Scents fragrance collection by mood, family, and note.",
};

export default function CollectionRoute() {
  return <CollectionPage products={fragrances} />;
}
