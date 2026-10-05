"use client";

import { useEffect, useState } from "react";
import { CollectionView } from "@/components/collection-view";
import { SiteHeader } from "@/components/site-header";
import type { Fragrance, SizeMl } from "@/lib/catalog";

type CartLine = { id: string; ml: SizeMl; quantity: number };

type CollectionPageProps = {
  products: Fragrance[];
};

export function CollectionPage({ products }: CollectionPageProps) {
  const [cartCount, setCartCount] = useState(0);
  const [status, setStatus] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem("seven-scents-bag") ?? "[]") as CartLine[];
      setCartCount(saved.reduce((total, line) => total + line.quantity, 0));
    } catch {
      window.localStorage.removeItem("seven-scents-bag");
    }
  }, []);

  function addToBag(product: Fragrance, ml: SizeMl) {
    let current: CartLine[] = [];
    try {
      current = JSON.parse(window.localStorage.getItem("seven-scents-bag") ?? "[]") as CartLine[];
    } catch {
      current = [];
    }
    const existing = current.find((line) => line.id === product.id && line.ml === ml);
    const next = existing
      ? current.map((line) => line.id === product.id && line.ml === ml ? { ...line, quantity: line.quantity + 1 } : line)
      : [...current, { id: product.id, ml, quantity: 1 }];
    window.localStorage.setItem("seven-scents-bag", JSON.stringify(next));
    setCartCount(next.reduce((total, line) => total + line.quantity, 0));
    setStatus(`${product.name} added to your bag.`);
    window.setTimeout(() => setStatus(""), 2800);
  }

  return (
    <div className="storefront-shell collection-route">
      <div className="announcement">Complimentary delivery on orders above PKR 10,000 <span>◆</span> Cash on delivery available</div>
      <SiteHeader cartCount={cartCount} mobileMenuOpen={mobileMenuOpen} onConciergeOpen={() => { window.location.href = "/#concierge"; }} onMobileMenuToggle={() => setMobileMenuOpen((open) => !open)} onNavigation={() => setMobileMenuOpen(false)} onBagOpen={() => setStatus("Your bag is saved. Continue from the homepage to review it.")} />
      <main>
        <CollectionView products={products} onAddToBag={addToBag} />
      </main>
      <p className="collection-status" aria-live="polite">{status}</p>
    </div>
  );
}
