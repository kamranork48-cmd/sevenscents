"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Check, ChevronLeft, LoaderCircle, Minus, Plus, Search, Send, ShoppingBag, Sparkles, X } from "lucide-react";
import { useDeferredValue, useEffect, useRef, useState, type FormEvent } from "react";
import { formatPrice, type Fragrance, type SizeMl } from "@/lib/catalog";
import { HeroSection } from "@/components/hero-section";
import { ProductCard } from "@/components/product-card";
import { SiteHeader } from "@/components/site-header";
import { StorySection } from "@/components/story-section";

type CartLine = { id: string; ml: SizeMl; quantity: number };
type CartStep = "bag" | "checkout" | "complete";
type Message = { role: "assistant" | "user"; text: string };
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

export default function Storefront({ products }: { products: Fragrance[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [activeSizes, setActiveSizes] = useState<Record<string, SizeMl>>({});
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartReady, setCartReady] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartStep, setCartStep] = useState<CartStep>("bag");
  const [reference, setReference] = useState("");
  const [checkoutPending, setCheckoutPending] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [conciergeOpen, setConciergeOpen] = useState(false);
  const [conciergePending, setConciergePending] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", text: "Welcome. Tell me what you want a fragrance to feel like, or choose a starting point below." }]);
  const [question, setQuestion] = useState("");
  const [activeFilter, setActiveFilter] = useState("All fragrances");
  const [search, setSearch] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const deferredSearch = useDeferredValue(search);

  const shownProducts = products.filter((product) => {
    const query = deferredSearch.trim().toLowerCase();
    const text = `${product.name} ${product.family} ${product.notes.join(" ")}`.toLowerCase();
    return (!query || text.includes(query)) && matchesFilter(product, activeFilter);
  });
  const cartProducts = cart.flatMap((line) => {
    const product = products.find((item) => item.id === line.id);
    const size = product?.sizes.find((item) => item.ml === line.ml);
    return product && size ? [{ ...line, product, size }] : [];
  });
  const cartCount = cart.reduce((sum, line) => sum + line.quantity, 0);
  const subtotal = cartProducts.reduce((sum, line) => sum + line.size.price * line.quantity, 0);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const saved = window.localStorage.getItem("seven-scents-bag");
        if (saved) setCart(JSON.parse(saved) as CartLine[]);
      } catch {
        window.localStorage.removeItem("seven-scents-bag");
      }
      setCartReady(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (cartReady) window.localStorage.setItem("seven-scents-bag", JSON.stringify(cart));
  }, [cart, cartReady]);

  useEffect(() => {
    let disposed = false;
    let revert: (() => void) | undefined;
    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([gsapModule, triggerModule]) => {
      if (disposed || !rootRef.current) return;
      const gsap = gsapModule.gsap;
      gsap.registerPlugin(triggerModule.ScrollTrigger);
      const context = gsap.context(() => {
        gsap.fromTo(".story-image", { clipPath: "inset(12% 5% 12% 5%)" }, {
          clipPath: "inset(0% 0% 0% 0%)",
          ease: "none",
          scrollTrigger: { trigger: ".story-section", start: "top 85%", end: "center center", scrub: true },
        });
      }, rootRef);
      revert = () => context.revert();
    });
    return () => { disposed = true; revert?.(); };
  }, []);

  useEffect(() => {
    if (!cartOpen && !conciergeOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setCartOpen(false); setConciergeOpen(false); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [cartOpen, conciergeOpen]);

  function selectedSize(product: Fragrance) { return activeSizes[product.id] ?? 50; }

  function addToBag(product: Fragrance, ml: SizeMl) {
    const stock = product.sizes.find((size) => size.ml === ml)?.inventory ?? 0;
    if (!stock) return;
    setCart((current) => {
      const existing = current.find((line) => line.id === product.id && line.ml === ml);
      if (existing) {
        if (existing.quantity >= stock) return current;
        return current.map((line) => line.id === product.id && line.ml === ml ? { ...line, quantity: line.quantity + 1 } : line);
      }
      return [...current, { id: product.id, ml, quantity: 1 }];
    });
    setCartStep("bag");
    setCartOpen(true);
  }

  function changeQuantity(id: string, ml: SizeMl, amount: number) {
    setCart((current) => {
      const line = current.find((item) => item.id === id && item.ml === ml);
      const stock = products.find((item) => item.id === id)?.sizes.find((item) => item.ml === ml)?.inventory ?? 0;
      if (amount > 0 && line && line.quantity >= stock) return current;
      return current.map((item) => item.id === id && item.ml === ml ? { ...item, quantity: item.quantity + amount } : item).filter((item) => item.quantity > 0);
    });
  }

  async function submitCheckout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCheckoutPending(true);
    setCheckoutError("");
    const customer = Object.fromEntries(new FormData(event.currentTarget).entries());
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer, items: cart }),
      });
      const result = await response.json() as { reference?: string; message?: string };
      if (!response.ok || !result.reference) throw new Error(result.message ?? "We could not prepare the order preview.");
      setReference(result.reference);
      setCartStep("complete");
      setCart([]);
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : "Please try again in a moment.");
    } finally {
      setCheckoutPending(false);
    }
  }

  async function sendQuestion(value = question) {
    const prompt = value.trim();
    if (!prompt || conciergePending) return;
    setMessages((current) => [...current, { role: "user", text: prompt }]);
    setQuestion("");
    setConciergePending(true);
    try {
      const response = await fetch("/api/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const result = await response.json() as { message?: string };
      if (!response.ok || !result.message) throw new Error("No response");
      setMessages((current) => [...current, { role: "assistant", text: result.message! }]);
    } catch {
      setMessages((current) => [...current, { role: "assistant", text: "I could not reach the fragrance desk just now. Try again shortly, or browse the collection by note." }]);
    } finally {
      setConciergePending(false);
    }
  }

  function openConcierge() { setConciergeOpen(true); setMobileMenuOpen(false); }

  return (
    <div ref={rootRef} className="storefront-shell">
      <div className="announcement">Complimentary delivery on orders above PKR 10,000 <span>◆</span> Cash on delivery available</div>
      <SiteHeader
        cartCount={cartCount}
        mobileMenuOpen={mobileMenuOpen}
        onConciergeOpen={openConcierge}
        onMobileMenuToggle={() => setMobileMenuOpen((open) => !open)}
        onNavigation={() => setMobileMenuOpen(false)}
        onBagOpen={() => { setCartStep("bag"); setCartOpen(true); }}
      />
      <button className="floating-buddy" type="button" onClick={openConcierge} aria-label="Open Perfume Buddy fragrance concierge">
        <Sparkles aria-hidden="true" /><span>Perfume Buddy</span>
      </button>

      <main>
        <HeroSection product={products[0]} productCount={products.length} onConciergeOpen={openConcierge} />

        <div className="ticker" aria-label="Our fragrance principles"><span>Made to be remembered</span><span aria-hidden="true">✳</span><span>Composed with intention</span><span aria-hidden="true">✳</span><span>Worn close, kept longer</span><span aria-hidden="true">✳</span><span>Seven Scents, your story</span></div>

        <section className="collection-section" id="collection">
          <div className="collection-heading"><div><span className="section-kicker">The collection · 01—10</span><h2>Find your<br /><em>own note.</em></h2></div><p>Ten fragrances, each with a different point of view. Start with a feeling, then follow the notes.</p></div>
          <div className="collection-tools">
            <div className="filter-list" aria-label="Filter fragrances">{filters.map((filter) => <button className="filter-button" key={filter} aria-pressed={activeFilter === filter} onClick={() => setActiveFilter(filter)}>{filter}</button>)}</div>
            <label className="search-field"><Search aria-hidden="true" /><span className="sr-only">Search by fragrance or note</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search notes or name" /></label>
          </div>
          <div className="product-grid">
            {shownProducts.map((product) => <ProductCard key={product.id} product={product} index={products.indexOf(product)} selectedSize={selectedSize(product)} sizes={sizes} onSizeChange={(size) => setActiveSizes((current) => ({ ...current, [product.id]: size }))} onAddToBag={(size) => addToBag(product, size)} />)}
            {shownProducts.length === 0 && <p className="empty-results">No fragrance found for that search. Try a note like rose or cedar.</p>}
          </div>
        </section>

        <StorySection product={products[1] ?? products[0]} />

        <section className="concierge-section" id="concierge">
          <div className="concierge-copy"><span className="section-kicker">A considered beginning</span><h2>Not sure where<br />to <em>begin?</em></h2><p>Tell our fragrance concierge what you gravitate towards. We’ll help you find a composition that feels like you.</p></div>
          <button className="button-dark concierge-cta" onClick={openConcierge}>Speak with the concierge <Sparkles aria-hidden="true" /></button>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-main">
          <div className="footer-brand"><a className="wordmark" href="#top"><img className="brand-mark-image" src="/seven-scents-mark.svg" alt="" /><span className="brand-word">SEVEN</span><span className="brand-sub">SCENTS</span></a><p>A fragrance house for the moments that stay with you.</p></div>
          <div className="footer-column"><h3>Discover</h3><a className="footer-link" href="#collection">All fragrances</a><button className="footer-link footer-button" onClick={openConcierge}>Scent concierge</button></div>
          <div className="footer-column"><h3>Service</h3><p>Delivery across Pakistan</p><p>Cash on delivery</p></div>
          <div className="footer-column"><h3>Get in touch</h3><a className="footer-link" href="mailto:care@sevenscents.pk">care@sevenscents.pk</a><p>Monday — Saturday</p></div>
        </div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} Seven Scents</span><span>Made with intention. Worn your way.</span></div>
      </footer>

      <AnimatePresence>
        {cartOpen && <div className="overlay" key="cart-overlay">
          <button className="overlay-dismiss" aria-label="Close shopping bag" onClick={() => setCartOpen(false)} />
          <motion.aside className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}>
            <div className="drawer-header"><h2 id="cart-title">{cartStep === "checkout" ? "Your details" : cartStep === "complete" ? "Order note" : `Your bag (${cartCount})`}</h2><button className="drawer-close" aria-label="Close bag" onClick={() => setCartOpen(false)}><X aria-hidden="true" /></button></div>
            {cartStep === "complete" ? <div className="confirmation-view"><span className="confirmation-mark"><Check aria-hidden="true" /></span><h3>Order preview ready.</h3><p>Reference {reference}. This preview is not a confirmed order. Connect the commerce backend to accept and fulfill customer orders.</p><button className="button-dark" onClick={() => { setCartOpen(false); setCartStep("bag"); }}>Continue exploring <ArrowRight aria-hidden="true" /></button></div>
              : cartStep === "checkout" ? <form className="checkout-form" onSubmit={submitCheckout}>
                <p>Delivery anywhere in Pakistan. Payment is collected in cash when your order arrives.</p>
                <label className="field-label">Full name<input name="name" autoComplete="name" required maxLength={100} /></label>
                <label className="field-label">Mobile number<input name="phone" type="tel" autoComplete="tel" inputMode="tel" pattern="\+?[0-9]{9,15}" placeholder="03xx xxxxxxx" required /></label>
                <label className="field-label">City<input name="city" autoComplete="address-level2" required maxLength={80} /></label>
                <label className="field-label">Delivery address<textarea name="address" autoComplete="street-address" required maxLength={300} /></label>
                <div className="payment-choice"><input type="radio" checked readOnly aria-label="Cash on delivery selected" /><span>Cash on delivery</span></div>
                {checkoutError && <p className="checkout-error" role="alert">{checkoutError}</p>}
                <button className="button-dark" type="submit" disabled={checkoutPending}>{checkoutPending ? "Preparing preview…" : `Review order · ${formatPrice(subtotal)}`}{checkoutPending ? <LoaderCircle className="spin-icon" aria-hidden="true" /> : <ArrowRight aria-hidden="true" />}</button>
                <button className="text-command" type="button" onClick={() => setCartStep("bag")}><ChevronLeft aria-hidden="true" /> Return to bag</button>
              </form>
              : cartProducts.length === 0 ? <div className="empty-bag"><ShoppingBag aria-hidden="true" /><h3>Your bag is waiting.</h3><p>Find a fragrance that feels like yours.</p><button className="button-dark" onClick={() => setCartOpen(false)}>Discover the collection <ArrowRight aria-hidden="true" /></button></div>
              : <><div className="cart-lines">{cartProducts.map((line) => <div className="cart-line" key={`${line.id}-${line.ml}`}>
                <Image src={line.product.image} alt={line.product.imageAlt} width={160} height={190} unoptimized />
                <div><h3>{line.product.name}</h3><p>{line.ml} ml · {line.product.family}</p><div className="quantity-control" aria-label={`Quantity of ${line.product.name}`}><button aria-label="Remove one" onClick={() => changeQuantity(line.id, line.ml, -1)}><Minus aria-hidden="true" /></button><span>{line.quantity}</span><button aria-label="Add one" onClick={() => changeQuantity(line.id, line.ml, 1)}><Plus aria-hidden="true" /></button></div></div>
                <span className="cart-line-price">{formatPrice(line.size.price * line.quantity)}</span>
              </div>)}</div><div className="drawer-footer"><div className="subtotal-row"><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div><p className="delivery-note">Delivery calculated at checkout. Complimentary delivery over PKR 10,000.</p><button className="button-dark" onClick={() => setCartStep("checkout")}>Continue to delivery <ArrowRight aria-hidden="true" /></button></div></>}
          </motion.aside>
        </div>}
      </AnimatePresence>

      <AnimatePresence>
        {conciergeOpen && <div className="overlay concierge-overlay" key="concierge-overlay">
          <button className="overlay-dismiss" aria-label="Close fragrance concierge" onClick={() => setConciergeOpen(false)} />
          <motion.section className="concierge-dialog" role="dialog" aria-modal="true" aria-labelledby="concierge-title" initial={{ opacity: 0, y: 18, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.98 }} transition={{ duration: 0.22 }}>
            <div className="concierge-head"><span className="concierge-symbol"><Sparkles aria-hidden="true" /></span><div className="concierge-head-copy"><strong id="concierge-title">Scent concierge</strong><span>A considered recommendation, just for you</span></div><button className="drawer-close" aria-label="Close concierge" onClick={() => setConciergeOpen(false)}><X aria-hidden="true" /></button></div>
            <div className="concierge-messages" aria-live="polite">
              {messages.map((message, index) => <div className={`concierge-message${message.role === "user" ? " is-user" : ""}`} key={`${message.role}-${index}`}>{message.text}</div>)}
              {conciergePending && <div className="concierge-message"><LoaderCircle className="spin-icon" aria-label="Thinking" /></div>}
              {messages.length === 1 && <div className="concierge-suggestions">{["Fresh and clean", "Warm and magnetic", "Soft and intimate"].map((suggestion) => <button key={suggestion} onClick={() => void sendQuestion(suggestion)}>{suggestion}</button>)}</div>}
            </div>
            <form className="concierge-form" onSubmit={(event) => { event.preventDefault(); void sendQuestion(); }}><label className="sr-only" htmlFor="concierge-question">Tell us what you like in a fragrance</label><input id="concierge-question" value={question} onChange={(event) => setQuestion(event.target.value)} maxLength={400} placeholder="Tell us what you are drawn to…" /><button type="submit" disabled={!question.trim() || conciergePending} aria-label="Send message"><Send aria-hidden="true" /></button></form>
          </motion.section>
        </div>}
      </AnimatePresence>
    </div>
  );
}