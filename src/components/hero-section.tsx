import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import type { Fragrance } from "@/lib/catalog";

type HeroSectionProps = {
  product: Fragrance;
  productCount: number;
  onConciergeOpen: () => void;
};

export function HeroSection({ product, productCount, onConciergeOpen }: HeroSectionProps) {
  return (
    <section className="hero" id="top">
      <motion.div className="hero-copy" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
        <span className="eyebrow">A fragrance house, considered</span>
        <h1>Leave a little<br /><em>of yourself</em><br />behind.</h1>
        <p className="hero-description">Fragrance for the moments that stay with you. Discover ten distinct compositions, made to be worn your way.</p>
        <div className="hero-actions">
          <a className="button-dark" href="#collection">Explore the collection <ArrowRight aria-hidden="true" /></a>
          <button className="text-command" onClick={onConciergeOpen}><Sparkles aria-hidden="true" /> Find your scent</button>
        </div>
        <div className="hero-footnote"><div><strong>{productCount} compositions</strong>One considered collection</div><div><strong>30 / 50 / 100 ml</strong>Three ways to wear it</div></div>
      </motion.div>
      <div className="hero-art">
        <Image className="hero-art-image" src={product.image} alt={product.imageAlt} width={1500} height={1000} priority unoptimized />
        <div className="hero-art-caption"><div><strong>{product.name}</strong><span>{product.family} · Eau de parfum</span></div><span className="hero-art-index">01 / {String(productCount).padStart(2, "0")}</span></div>
      </div>
    </section>
  );
}
