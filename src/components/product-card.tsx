import Image from "next/image";
import { motion } from "motion/react";
import { Plus } from "lucide-react";
import type { CSSProperties } from "react";
import { formatPrice, type Fragrance, type SizeMl } from "@/lib/catalog";

type ProductCardProps = {
  product: Fragrance;
  index: number;
  selectedSize: SizeMl;
  sizes: SizeMl[];
  onSizeChange: (size: SizeMl) => void;
  onAddToBag: (size: SizeMl) => void;
  priority?: boolean;
};

export function ProductCard({ product, index, selectedSize, sizes, onSizeChange, onAddToBag, priority = false }: ProductCardProps) {
  const size = product.sizes.find((item) => item.ml === selectedSize) ?? product.sizes[1];
  const available = size.inventory > 0;

  return (
    <motion.article className="product-card" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.18 }} transition={{ duration: 0.45, delay: (index % 4) * 0.06 }}>
      <div className="product-image-wrap" style={{ "--product-bg": product.background } as CSSProperties}>
        <span className="product-index">No. {String(index + 1).padStart(2, "0")}</span><span className="product-note">Eau de parfum</span>
        <Image className="product-image" src={product.image} alt={product.imageAlt} width={700} height={850} unoptimized priority={priority} loading={priority ? undefined : "lazy"} />
      </div>
      <div className="product-info">
        <div className="product-title-line"><h3>{product.name}</h3><span className="product-price">{formatPrice(size.price)}</span></div>
        <p className="product-family">{product.family} · {product.mood}</p><p className="product-notes">{product.notes.join(" · ")}</p>
        <fieldset className="variant-select"><legend>Choose bottle size for {product.name}</legend>{sizes.map((option) => {
          const variant = product.sizes.find((item) => item.ml === option);
          return <button key={option} type="button" aria-pressed={selectedSize === option} aria-label={`${option} millilitres${variant?.inventory ? "" : ", sold out"}`} disabled={!variant?.inventory} onClick={() => onSizeChange(option)}>{option} ml</button>;
        })}</fieldset>
        <div className="product-buy-row"><span className={`stock-note${size.inventory > 0 && size.inventory < 5 ? " is-low" : ""}`}>{!available ? "Currently unavailable" : size.inventory < 5 ? "Almost gone" : "In stock"}</span><button className="add-button" disabled={!available} onClick={() => onAddToBag(selectedSize)}><Plus aria-hidden="true" /> Add to bag</button></div>
      </div>
    </motion.article>
  );
}
