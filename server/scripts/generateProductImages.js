import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT = path.join(__dirname, '..', 'uploads', 'products');
fs.mkdirSync(OUTPUT, { recursive: true });

const CATEGORIES = {
  Mobiles: { gradient: ['#1a1a2e', '#16213e'], accent: '#e94560', icon: 'phone', textColor: '#e94560' },
  Laptops: { gradient: ['#0f0c29', '#302b63'], accent: '#00d2ff', icon: 'laptop', textColor: '#00d2ff' },
  Electronics: { gradient: ['#0d1117', '#1a1a2e'], accent: '#00ff88', icon: 'headphones', textColor: '#00ff88' },
  Fashion: { gradient: ['#1e0a3c', '#2d1b69'], accent: '#ff6b9d', icon: 'shirt', textColor: '#ff6b9d' },
  Accessories: { gradient: ['#1c1410', '#2a1f1a'], accent: '#fbbf24', icon: 'watch', textColor: '#fbbf24' },
  Home: { gradient: ['#0c1a1e', '#1a2f35'], accent: '#7c3aed', icon: 'home', textColor: '#7c3aed' },
  Sports: { gradient: ['#1a0c0c', '#2f1a1a'], accent: '#f97316', icon: 'activity', textColor: '#f97316' },
};

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

function generateProductSvg(name, category) {
  const cat = CATEGORIES[category] || CATEGORIES.Mobiles;
  const [g1, g2] = cat.gradient;
  const slug = slugify(name);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${g1}"/>
      <stop offset="100%" style="stop-color:${g2}"/>
    </linearGradient>
    <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${cat.accent};stop-opacity:0.15"/>
      <stop offset="100%" style="stop-color:${cat.accent};stop-opacity:0"/>
    </linearGradient>
  </defs>
  <rect width="400" height="400" fill="url(#bg)"/>
  <rect width="400" height="400" fill="url(#glow)"/>
  <circle cx="320" cy="80" r="160" fill="${cat.accent}" opacity="0.06"/>
  <circle cx="80" cy="340" r="120" fill="${cat.accent}" opacity="0.04"/>
  <rect x="140" y="120" width="120" height="120" rx="24" fill="none" stroke="${cat.accent}" stroke-width="2" opacity="0.3"/>
  <rect x="150" y="130" width="100" height="100" rx="16" fill="none" stroke="${cat.accent}" stroke-width="1.5" opacity="0.2"/>
  <circle cx="200" cy="180" r="24" fill="none" stroke="${cat.accent}" stroke-width="2" opacity="0.4"/>
  <line x1="200" y1="156" x2="200" y2="168" stroke="${cat.accent}" stroke-width="2" opacity="0.3"/>
  <line x1="188" y1="168" x2="200" y2="168" stroke="${cat.accent}" stroke-width="2" opacity="0.3"/>
  <line x1="200" y1="192" x2="200" y2="204" stroke="${cat.accent}" stroke-width="2" opacity="0.3"/>
  <line x1="188" y1="196" x2="212" y2="196" stroke="${cat.accent}" stroke-width="2" opacity="0.3"/>
  <text x="200" y="290" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="700" fill="#ffffff" letter-spacing="0.5">${escapeXml(name)}</text>
  <text x="200" y="316" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="${cat.accent}" opacity="0.8" letter-spacing="2" text-transform="uppercase">${category}</text>
</svg>`;
  return svg;
}

function escapeXml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

function generateCategoryDefaultSvg(category) {
  const cat = CATEGORIES[category] || CATEGORIES.Mobiles;
  const [g1, g2] = cat.gradient;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${g1}"/>
      <stop offset="100%" style="stop-color:${g2}"/>
    </linearGradient>
    <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${cat.accent};stop-opacity:0.15"/>
      <stop offset="100%" style="stop-color:${cat.accent};stop-opacity:0"/>
    </linearGradient>
  </defs>
  <rect width="400" height="400" fill="url(#bg)"/>
  <rect width="400" height="400" fill="url(#glow)"/>
  <circle cx="340" cy="60" r="180" fill="${cat.accent}" opacity="0.06"/>
  <circle cx="60" cy="340" r="140" fill="${cat.accent}" opacity="0.04"/>
  <rect x="140" y="110" width="120" height="120" rx="24" fill="none" stroke="${cat.accent}" stroke-width="2" opacity="0.3"/>
  <circle cx="200" cy="170" r="28" fill="none" stroke="${cat.accent}" stroke-width="2" opacity="0.35"/>
  <circle cx="200" cy="170" r="10" fill="${cat.accent}" opacity="0.25"/>
  <text x="200" y="280" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="700" fill="#ffffff">${category}</text>
  <text x="200" y="306" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="${cat.accent}" opacity="0.7" letter-spacing="3" text-transform="uppercase">Product</text>
</svg>`;
  return svg;
}

// Products (matching seed.js)
const products = [
  { name: 'iPhone 15 Pro Max', category: 'Mobiles' },
  { name: 'Samsung Galaxy S24 Ultra', category: 'Mobiles' },
  { name: 'OnePlus 12', category: 'Mobiles' },
  { name: 'Pixel 8 Pro', category: 'Mobiles' },
  { name: 'Nothing Phone 2', category: 'Mobiles' },
  { name: 'iPhone 15', category: 'Mobiles' },

  { name: 'MacBook Pro 16 M3 Max', category: 'Laptops' },
  { name: 'MacBook Air M3', category: 'Laptops' },
  { name: 'Dell XPS 15', category: 'Laptops' },
  { name: 'HP Spectre x360', category: 'Laptops' },
  { name: 'Lenovo ThinkPad X1 Carbon', category: 'Laptops' },
  { name: 'ASUS ROG Zephyrus G14', category: 'Laptops' },

  { name: 'Sony WH-1000XM5', category: 'Electronics' },
  { name: 'Apple AirPods Pro 2', category: 'Electronics' },
  { name: 'Samsung 65" OLED TV', category: 'Electronics' },
  { name: 'Bose SoundLink Max', category: 'Electronics' },
  { name: 'Canon EOS R6 Mark II', category: 'Electronics' },
  { name: 'Nintendo Switch OLED', category: 'Electronics' },

  { name: 'Classic Leather Jacket', category: 'Fashion' },
  { name: 'Denim Jeans', category: 'Fashion' },
  { name: 'Casual Sneakers', category: 'Fashion' },
  { name: 'Wool Sweater', category: 'Fashion' },
  { name: 'Summer Dress', category: 'Fashion' },
  { name: "Men's Formal Shirt", category: 'Fashion' },

  { name: 'Apple Watch Ultra 2', category: 'Accessories' },
  { name: 'Samsung Galaxy Watch 6', category: 'Accessories' },
  { name: 'Ray-Ban Aviator Sunglasses', category: 'Accessories' },
  { name: 'Leather Wallet', category: 'Accessories' },
  { name: 'Smart Watch Band', category: 'Accessories' },
  { name: 'Noise-Cancelling Earbuds', category: 'Accessories' },

  { name: 'Dyson V15 Detect', category: 'Home' },
  { name: 'Philips Air Purifier', category: 'Home' },
  { name: 'Instant Pot Duo Plus', category: 'Home' },
  { name: 'Smart LED Bulb (4-Pack)', category: 'Home' },
  { name: 'Cast Iron Cookware Set', category: 'Home' },
  { name: 'Memory Foam Pillow (2-Pack)', category: 'Home' },

  { name: 'Nike Dri-FIT T-Shirt', category: 'Sports' },
  { name: 'Yoga Mat Premium', category: 'Sports' },
  { name: 'Resistance Bands Set', category: 'Sports' },
  { name: 'Running Shoes', category: 'Sports' },
  { name: 'Dumbbell Set 20kg', category: 'Sports' },
  { name: 'Cycling Helmet', category: 'Sports' },

  { name: 'iPhone 15 Pro', category: 'Mobiles' },
  { name: 'Samsung Galaxy Z Fold 5', category: 'Mobiles' },
  { name: 'Microsoft Surface Laptop 5', category: 'Laptops' },
  { name: 'JBL Flip 6', category: 'Electronics' },
  { name: 'Leather Handbag', category: 'Fashion' },
  { name: 'Smart Thermostat', category: 'Home' },
  { name: 'Basketball', category: 'Sports' },
];

console.log('Generating product images...\n');

let generated = 0;
let failed = 0;

for (const product of products) {
    const slug = slugify(product.name);
    const filename = `${slug}.svg`;
  const filepath = path.join(OUTPUT, filename);
  try {
    const svg = generateProductSvg(product.name, product.category);
    fs.writeFileSync(filepath, svg);
    console.log(`  OK  ${filename}`);
    generated++;
  } catch (err) {
    console.log(`  ERR  ${filename} — ${err.message}`);
    failed++;
  }
}

console.log(`\n--- Product Images: ${generated} generated, ${failed} failed ---\n`);

// Generate category defaults
console.log('Generating category defaults...\n');
const categories = ['Mobiles', 'Laptops', 'Electronics', 'Fashion', 'Accessories', 'Home', 'Sports'];
for (const cat of categories) {
  const filename = `default-${cat.toLowerCase()}.svg`;
  const filepath = path.join(OUTPUT, filename);
  try {
    const svg = generateCategoryDefaultSvg(cat);
    fs.writeFileSync(filepath, svg);
    console.log(`  OK  ${filename}`);
  } catch (err) {
    console.log(`  ERR  ${filename} — ${err.message}`);
  }
}

// Count
const totalFiles = fs.readdirSync(OUTPUT).filter(f => f.endsWith('.svg')).length;
console.log(`\nTotal SVG files in uploads/products/: ${totalFiles}`);
console.log('Done.');
