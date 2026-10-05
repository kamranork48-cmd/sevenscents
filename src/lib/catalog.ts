export type SizeMl = 30 | 50 | 100;

export type FragranceSize = {
  ml: SizeMl;
  price: number;
  inventory: number;
};

export type FragranceDetails = {
  slug: string;
  brand: string;
  concentration: string;
  category: string;
  gallery: string[];
  details: string[];
  ingredients?: string[];
  relatedIds: string[];
};

export type Fragrance = {
  id: string;
  slug: string;
  brand: string;
  name: string;
  family: string;
  mood: string;
  notes: string[];
  description: string;
  concentration: string;
  category: string;
  gallery: string[];
  details: string[];
  ingredients?: string[];
  relatedIds: string[];
  image: string;
  imageAlt: string;
  background: string;
  sizes: FragranceSize[];
  salePrice?: number;
};

type FragranceSeed = Omit<Fragrance, keyof FragranceDetails>;

const perfumePhotos = [
  "https://fimgs.net/images/perfume/375x500.68578.jpg",
  "https://fimgs.net/images/perfume/375x500.1018.jpg",
  "https://fimgs.net/images/perfume/375x500.611.jpg",
  "https://fimgs.net/images/perfume/375x500.31861.jpg",
  "https://fimgs.net/images/perfume/375x500.56077.jpg",
  "https://fimgs.net/images/perfume/375x500.33519.jpg",
  "https://fimgs.net/images/perfume/375x500.29727.jpg",
  "https://fimgs.net/images/perfume/375x500.18767.jpg",
  "https://fimgs.net/images/perfume/375x500.55805.jpg",
  "https://fimgs.net/images/perfume/375x500.1825.jpg"
];

const missingProductPhotos = {
  "ysl-libre": perfumePhotos[4],
  "acqua-di-gio-profumo": perfumePhotos[6],
  "baccarat-rouge-540": perfumePhotos[5],
  "jo-malone-peony-blush-suede": perfumePhotos[7]
};

const seedFragrances: FragranceSeed[] = [
  { id: "gucci-flora-gorgeous-gardenia", name: "Gucci Flora Gorgeous Gardenia", family: "Floral musk", mood: "Romantic and luminous", notes: ["Gardenia", "Pear", "Brown sugar"], description: "A creamy gardenia wrapped in juicy pear and a soft sensual base that keeps the bloom radiant.", image: perfumePhotos[0], imageAlt: "Gucci Flora Gorgeous Gardenia perfume bottle in a premium studio photograph", background: "#f0e6d7", sizes: [{ ml: 30, price: 8800, inventory: 18 }, { ml: 50, price: 12600, inventory: 12 }, { ml: 100, price: 18200, inventory: 7 }] },
  { id: "tom-ford-black-orchid", name: "Tom Ford Black Orchid", family: "Oriental floral", mood: "Dark and seductive", notes: ["Black truffle", "Orchid", "Spices"], description: "An opulent floral darkness with truffle, orchid, and warm spice that lingers in velvet layers.", image: perfumePhotos[1], imageAlt: "Tom Ford Black Orchid fragrance bottle photographed in luxury editorial lighting", background: "#ddd0c8", sizes: [{ ml: 30, price: 9400, inventory: 10 }, { ml: 50, price: 13400, inventory: 8 }, { ml: 100, price: 19600, inventory: 3 }] },
  { id: "chanel-coco-mademoiselle", name: "Chanel Coco Mademoiselle", family: "Citrus chypre", mood: "Confident and polished", notes: ["Orange", "Rose", "Patchouli"], description: "A sparkling citrus opening unfolds into rose and patchouli for a crisp, elegant signature.", image: perfumePhotos[2], imageAlt: "Chanel Coco Mademoiselle perfume bottle captured in a polished studio setup", background: "#efe5d4", sizes: [{ ml: 30, price: 9000, inventory: 14 }, { ml: 50, price: 12800, inventory: 6 }, { ml: 100, price: 18900, inventory: 0 }] },
  { id: "dior-sauvage", name: "Dior Sauvage", family: "Fresh woody", mood: "Bold and magnetic", notes: ["Bergamot", "Ambroxan", "Sandalwood"], description: "Crisp bergamot and ambroxan create a clean, fresh trail softened by sandalwood and musk.", image: perfumePhotos[3], imageAlt: "Dior Sauvage fragrance bottle in a refined menswear editorial style", background: "#dfe3d9", sizes: [{ ml: 30, price: 8600, inventory: 22 }, { ml: 50, price: 12100, inventory: 16 }, { ml: 100, price: 17600, inventory: 9 }] },
  { id: "ysl-libre", name: "YSL Libre", family: "Floral amber", mood: "Bold and sensual", notes: ["Lavender", "Orange blossom", "Vanilla"], description: "A striking lavender-and-orange-blossom heart gives way to warm vanilla that feels both fresh and sensual.", image: missingProductPhotos["ysl-libre"], imageAlt: "YSL Libre fragrance bottle photographed in a clean luxury studio", background: "#ede0d7", sizes: [{ ml: 30, price: 8900, inventory: 8 }, { ml: 50, price: 12700, inventory: 11 }, { ml: 100, price: 18400, inventory: 5 }] },
  { id: "baccarat-rouge-540", name: "Maison Francis Kurkdjian Baccarat Rouge 540", family: "Amber woody", mood: "Luxury and radiant", notes: ["Saffron", "Ambergris", "Fir resin"], description: "An amber-saffron glow with resinous woods and a sparkling trail that feels distinctly high-fashion.", image: missingProductPhotos["baccarat-rouge-540"], imageAlt: "Baccarat Rouge 540 fragrance bottle photographed in warm amber lighting", background: "#e5d7ca", sizes: [{ ml: 30, price: 9600, inventory: 5 }, { ml: 50, price: 13800, inventory: 4 }, { ml: 100, price: 20300, inventory: 2 }] },
  { id: "acqua-di-gio-profumo", name: "Acqua di Giò Profumo", family: "Marine woody", mood: "Fresh and elevated", notes: ["Marine notes", "Bergamot", "Patchouli"], description: "A crisp marine freshness layered with bergamot and warm patchouli for a refined, modern finish.", image: missingProductPhotos["acqua-di-gio-profumo"], imageAlt: "Acqua di Giò Profumo bottle shown in a refined coastal editorial photograph", background: "#dfe7e2", sizes: [{ ml: 30, price: 8700, inventory: 13 }, { ml: 50, price: 12400, inventory: 10 }, { ml: 100, price: 17900, inventory: 6 }] },
  { id: "jo-malone-peony-blush-suede", name: "Jo Malone Peony & Blush Suede", family: "Floral fruity", mood: "Soft and feminine", notes: ["Peony", "Red apple", "Suede"], description: "A plush peony heart with crisp apple and a suede accord that feels polished and romantic.", image: missingProductPhotos["jo-malone-peony-blush-suede"], imageAlt: "Jo Malone Peony and Blush Suede perfume bottle in a soft editorial shot", background: "#f1e3dd", sizes: [{ ml: 30, price: 8200, inventory: 9 }, { ml: 50, price: 11900, inventory: 7 }, { ml: 100, price: 17100, inventory: 3 }] },
  { id: "valentino-born-in-roma", name: "Valentino Donna Born in Roma", family: "Floral amber", mood: "Confident and feminine", notes: ["Grapefruit", "Jasmine", "Vanilla"], description: "A radiant citrus opening opens into jasmine and vanilla for a warm, confident feminine trail.", image: perfumePhotos[8], imageAlt: "Valentino Born in Roma fragrance bottle pictured with luxury editorial styling", background: "#efe4d8", sizes: [{ ml: 30, price: 8500, inventory: 11 }, { ml: 50, price: 12300, inventory: 6 }, { ml: 100, price: 17700, inventory: 4 }] },
  { id: "tobacco-vanille", name: "Tom Ford Tobacco Vanille", family: "Oriental vanilla", mood: "Warm and decadent", notes: ["Tobacco leaf", "Vanilla", "Cocoa"], description: "Tobacco and vanilla blend into a rich, creamy warmth shaped by cocoa and dry woods.", image: perfumePhotos[9], imageAlt: "Tom Ford Tobacco Vanille perfume bottle in warm rich studio lighting", background: "#e3d4c4", sizes: [{ ml: 30, price: 9300, inventory: 7 }, { ml: 50, price: 13200, inventory: 5 }, { ml: 100, price: 19400, inventory: 1 }] },
];

const fragranceDetails: Record<string, FragranceDetails> = {
  "gucci-flora-gorgeous-gardenia": { slug: "gucci-flora-gorgeous-gardenia", brand: "Gucci", concentration: "Eau de parfum", category: "Floral", gallery: [perfumePhotos[0]], details: ["30 / 50 / 100 ml", "Floral musk", "Cash on delivery available"], relatedIds: ["chanel-coco-mademoiselle", "jo-malone-peony-blush-suede"] },
  "tom-ford-black-orchid": { slug: "tom-ford-black-orchid", brand: "Tom Ford", concentration: "Eau de parfum", category: "Amber", gallery: [perfumePhotos[1]], details: ["30 / 50 / 100 ml", "Oriental floral", "Cash on delivery available"], relatedIds: ["tobacco-vanille", "baccarat-rouge-540"] },
  "chanel-coco-mademoiselle": { slug: "chanel-coco-mademoiselle", brand: "Chanel", concentration: "Eau de parfum", category: "Floral", gallery: [perfumePhotos[2]], details: ["30 / 50 / 100 ml", "Citrus chypre", "Cash on delivery available"], relatedIds: ["gucci-flora-gorgeous-gardenia", "ysl-libre"] },
  "dior-sauvage": { slug: "dior-sauvage", brand: "Dior", concentration: "Eau de parfum", category: "Fresh", gallery: [perfumePhotos[3]], details: ["30 / 50 / 100 ml", "Fresh woody", "Cash on delivery available"], relatedIds: ["acqua-di-gio-profumo", "tom-ford-black-orchid"] },
  "ysl-libre": { slug: "ysl-libre", brand: "Yves Saint Laurent", concentration: "Eau de parfum", category: "Floral", gallery: [missingProductPhotos["ysl-libre"]], details: ["30 / 50 / 100 ml", "Floral amber", "Cash on delivery available"], relatedIds: ["chanel-coco-mademoiselle", "valentino-born-in-roma"] },
  "baccarat-rouge-540": { slug: "baccarat-rouge-540", brand: "Maison Francis Kurkdjian", concentration: "Eau de parfum", category: "Amber", gallery: [missingProductPhotos["baccarat-rouge-540"]], details: ["30 / 50 / 100 ml", "Amber woody", "Cash on delivery available"], relatedIds: ["tom-ford-black-orchid", "tobacco-vanille"] },
  "acqua-di-gio-profumo": { slug: "acqua-di-gio-profumo", brand: "Giorgio Armani", concentration: "Eau de parfum", category: "Fresh", gallery: [missingProductPhotos["acqua-di-gio-profumo"]], details: ["30 / 50 / 100 ml", "Marine woody", "Cash on delivery available"], relatedIds: ["dior-sauvage", "tobacco-vanille"] },
  "jo-malone-peony-blush-suede": { slug: "jo-malone-peony-blush-suede", brand: "Jo Malone London", concentration: "Cologne", category: "Floral", gallery: [missingProductPhotos["jo-malone-peony-blush-suede"]], details: ["30 / 50 / 100 ml", "Floral fruity", "Cash on delivery available"], relatedIds: ["gucci-flora-gorgeous-gardenia", "valentino-born-in-roma"] },
  "valentino-born-in-roma": { slug: "valentino-born-in-roma", brand: "Valentino", concentration: "Eau de parfum", category: "Floral", gallery: [perfumePhotos[8]], details: ["30 / 50 / 100 ml", "Floral amber", "Cash on delivery available"], relatedIds: ["ysl-libre", "jo-malone-peony-blush-suede"] },
  "tobacco-vanille": { slug: "tobacco-vanille", brand: "Tom Ford", concentration: "Eau de parfum", category: "Amber", gallery: [perfumePhotos[9]], details: ["30 / 50 / 100 ml", "Oriental vanilla", "Cash on delivery available"], relatedIds: ["tom-ford-black-orchid", "baccarat-rouge-540"] },
};

export const fragrances: Fragrance[] = seedFragrances.map((fragrance) => ({
  ...fragrance,
  ...fragranceDetails[fragrance.id],
}));

export function formatPrice(price: number) {
  return `PKR ${new Intl.NumberFormat("en-PK", { maximumFractionDigits: 0 }).format(price)}`;
}