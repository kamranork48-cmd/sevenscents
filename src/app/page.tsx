import Storefront from "@/components/storefront";
import { fragrances } from "@/lib/catalog";

export default function Home() {
  return <Storefront products={fragrances} />;
}
