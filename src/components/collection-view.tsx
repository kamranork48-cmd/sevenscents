"use client";

import { Search } from "lucide-react";
import { useDeferredValue, useState } from "react";
import type { Fragrance, SizeMl } from "@/lib/catalog";
import { ProductCard } from "@/components/product-card";

const sizes: SizeMl[] = [30, 50, 100];
const filters = ["All fragrances", "Amber", "Floral", "Woods", "Fresh"];

function matchesFilter(product: Fragrance, filter: string) {
  if (filter === "All fragrances") return true;
  const words: Record<string, string[]> = {
    Amber: ["amber", "resin", "tonka", "cacao", "vanilla"],
    Floral: ["floral", "rose", "iris", "jasmine", "neroli", "petal"],
    Woods: ["wood", "oud", "cedar", "sandalwood", "vetiver", "patchouli"],
    Fresh: ["fresh", "citrus", "green", "bergamot", "mandarin", "salt"],
  };
  const searchable = `${product.family} ${product.mood} ${product.notes.join(" ")}`.toLowerCase();
  return words[filter]?.some((word) => searchable.includes(word)) ?? true;
}

type CollectionViewProps = {
  products: Fragrance[];
  onAddToBag?: (product: Fragrance, size: SizeMl) => void;
};

export function CollectionView({ products, onAddToBag }: CollectionViewProps) {
  const [activeSizes, setActiveSizes] = useState<Record<string, SizeMl>>({});
  const [activeFilter, setActiveFilter] = useState("All fragrances");
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const shownProducts = products.filter((product) => {
    const query = deferredSearch.trim().toLowerCase();
    const text = `${product.name} ${product.brand} ${product.family} ${product.notes.join(" ")}`.toLowerCase();
    return (!query || text.includes(query)) && matchesFilter(product, activeFilter);
  });

  return (
    <section className="collection-section collection-page" id="collection">
      <div className="collection-heading"><div><span className="section-kicker">The collection · 01—{String(products.length).padStart(2, "0")}</span><h1>Find your<br /><em>own note.</em></h1></div><p>Explore the full fragrance wardrobe. Start with a feeling, then follow the notes.</p></div>
      <div className="collection-tools">
        <div className="filter-list" aria-label="Filter fragrances">{filters.map((filter) => <button className="filter-button" key={filter} aria-pressed={activeFilter === filter} onClick={() => setActiveFilter(filter)}>{filter}</button>)}</div>
        <label className="search-field"><Search aria-hidden="true" /><span className="sr-only">Search by fragrance or note</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search notes or name" /></label>
      </div>
      <div className="product-grid">
        {shownProducts.map((product) => {
          const selectedSize = activeSizes[product.id] ?? 50;
          return <ProductCard key={product.id} product={product} index={products.indexOf(product)} selectedSize={selectedSize} sizes={sizes} priority={products.indexOf(product) === 0} onSizeChange={(size) => setActiveSizes((current) => ({ ...current, [product.id]: size }))} onAddToBag={(size) => onAddToBag?.(product, size)} />;
        })}
        {shownProducts.length === 0 && <p className="empty-results">No fragrance found for that search. Try a note like rose or cedar.</p>}
      </div>
    </section>
  );
}
