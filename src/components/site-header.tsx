import { Menu, Search, ShoppingBag, X } from "lucide-react";

type SiteHeaderProps = {
  cartCount: number;
  mobileMenuOpen: boolean;
  onConciergeOpen: () => void;
  onMobileMenuToggle: () => void;
  onNavigation: () => void;
  onBagOpen: () => void;
};

export function SiteHeader({ cartCount, mobileMenuOpen, onConciergeOpen, onMobileMenuToggle, onNavigation, onBagOpen }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <a className="wordmark" href="#top" aria-label="Seven Scents home"><img className="brand-mark-image" src="/seven-scents-mark.svg" alt="" /><span className="brand-word">SEVEN</span><span className="brand-sub">SCENTS</span></a>
      <nav className={`main-nav${mobileMenuOpen ? " is-open" : ""}`} aria-label="Main navigation">
        <a href="#collection" onClick={onNavigation}>Fragrances</a>
        <a href="#story" onClick={onNavigation}>Our point of view</a>
        <button className="nav-text-button" onClick={onConciergeOpen}>Scent concierge</button>
      </nav>
      <div className="header-actions">
        <a className="header-search-link" href="#collection" aria-label="Search fragrances"><Search aria-hidden="true" /></a>
        <button className="icon-button bag-button" aria-label={`Open shopping bag, ${cartCount} items`} onClick={onBagOpen}>
          <ShoppingBag aria-hidden="true" /><span className="bag-count">{cartCount}</span>
        </button>
        <button className="icon-button mobile-menu-button" aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"} aria-expanded={mobileMenuOpen} onClick={onMobileMenuToggle}>
          {mobileMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>
    </header>
  );
}
