import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { Fragrance } from "@/lib/catalog";

type StorySectionProps = {
  product: Fragrance;
};

export function StorySection({ product }: StorySectionProps) {
  return (
    <section className="story-section" id="story">
      <div className="story-image-wrap"><Image className="story-image" src={product.image} alt={product.imageAlt} width={1200} height={1500} unoptimized loading="lazy" /></div>
      <div className="story-copy"><span className="section-kicker">A point of view</span><h2>The lasting part<br />is rarely the<br /><em>first note.</em></h2><p>A fragrance unfolds in its own time. The first impression gives way to something closer, more personal, unmistakably yours. We make room for that quiet transformation.</p><a className="button-light" href="#collection">Explore the fragrances <ArrowRight aria-hidden="true" /></a></div>
    </section>
  );
}
