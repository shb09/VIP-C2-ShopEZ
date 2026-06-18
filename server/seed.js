import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import User from './models/User.js';

dotenv.config();

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
}

const products = [
  { name: 'iPhone 15 Pro Max', description: 'Apple A17 Pro chip, 48MP camera, titanium design', price: 159999, category: 'Mobiles', image: `/uploads/products/${slugify("iPhone 15 Pro Max")}.svg`, stock: 25 },
  { name: 'Samsung Galaxy S24 Ultra', description: 'Snapdragon 8 Gen 3, S Pen, 200MP camera', price: 134999, category: 'Mobiles', image: `/uploads/products/${slugify("Samsung Galaxy S24 Ultra")}.svg`, stock: 30 },
  { name: 'OnePlus 12', description: 'Snapdragon 8 Gen 3, 100W charging, Hasselblad camera', price: 69999, category: 'Mobiles', image: `/uploads/products/${slugify("OnePlus 12")}.svg`, stock: 40 },
  { name: 'Pixel 8 Pro', description: 'Google Tensor G3, amazing camera software', price: 84999, category: 'Mobiles', image: `/uploads/products/${slugify("Pixel 8 Pro")}.svg`, stock: 20 },
  { name: 'Nothing Phone 2', description: 'Glyph Interface, Snapdragon 8+ Gen 1', price: 44999, category: 'Mobiles', image: `/uploads/products/${slugify("Nothing Phone 2")}.svg`, stock: 35 },
  { name: 'iPhone 15', description: 'A16 Bionic, 48MP camera, Dynamic Island', price: 79999, category: 'Mobiles', image: `/uploads/products/${slugify("iPhone 15")}.svg`, stock: 50 },
  { name: 'MacBook Pro 16 M3 Max', description: 'M3 Max chip, 36GB RAM, 1TB SSD', price: 399999, category: 'Laptops', image: `/uploads/products/${slugify("MacBook Pro 16 M3 Max")}.svg`, stock: 15 },
  { name: 'MacBook Air M3', description: 'M3 chip, 15-inch, 18-hour battery', price: 164900, category: 'Laptops', image: `/uploads/products/${slugify("MacBook Air M3")}.svg`, stock: 22 },
  { name: 'Dell XPS 15', description: 'Intel i9, 32GB RAM, OLED display', price: 189990, category: 'Laptops', image: `/uploads/products/${slugify("Dell XPS 15")}.svg`, stock: 18 },
  { name: 'HP Spectre x360', description: 'Intel i7, 16GB RAM, 2-in-1 convertible', price: 134999, category: 'Laptops', image: `/uploads/products/${slugify("HP Spectre x360")}.svg`, stock: 12 },
  { name: 'Lenovo ThinkPad X1 Carbon', description: 'Intel i7, 16GB RAM, ultra-light business laptop', price: 159999, category: 'Laptops', image: `/uploads/products/${slugify("Lenovo ThinkPad X1 Carbon")}.svg`, stock: 10 },
  { name: 'ASUS ROG Zephyrus G14', description: 'AMD Ryzen 9, RTX 4070, gaming powerhouse', price: 169990, category: 'Laptops', image: `/uploads/products/${slugify("ASUS ROG Zephyrus G14")}.svg`, stock: 14 },
  { name: 'Sony WH-1000XM5', description: 'Industry-leading noise cancellation, 30hr battery', price: 29990, category: 'Electronics', image: `/uploads/products/${slugify("Sony WH-1000XM5")}.svg`, stock: 45 },
  { name: 'Apple AirPods Pro 2', description: 'Adaptive audio, USB-C, spatial audio', price: 24900, category: 'Electronics', image: `/uploads/products/${slugify("Apple AirPods Pro 2")}.svg`, stock: 60 },
  { name: 'Samsung 65" OLED TV', description: '4K OLED, Dolby Atmos, smart TV', price: 189990, category: 'Electronics', image: `/uploads/products/${slugify('Samsung 65 OLED TV')}.svg`, stock: 8 },
  { name: 'Bose SoundLink Max', description: 'Portable Bluetooth speaker, deep bass', price: 39990, category: 'Electronics', image: `/uploads/products/${slugify("Bose SoundLink Max")}.svg`, stock: 25 },
  { name: 'Canon EOS R6 Mark II', description: '24.2MP mirrorless camera, 4K video', price: 249990, category: 'Electronics', image: `/uploads/products/${slugify("Canon EOS R6 Mark II")}.svg`, stock: 7 },
  { name: 'Nintendo Switch OLED', description: '7-inch OLED screen, enhanced audio', price: 34990, category: 'Electronics', image: `/uploads/products/${slugify("Nintendo Switch OLED")}.svg`, stock: 30 },
  { name: 'Classic Leather Jacket', description: 'Premium genuine leather, modern fit', price: 8999, category: 'Fashion', image: `/uploads/products/${slugify("Classic Leather Jacket")}.svg`, stock: 20 },
  { name: 'Denim Jeans', description: 'Slim-fit, stretchable denim, classic blue', price: 2999, category: 'Fashion', image: `/uploads/products/${slugify("Denim Jeans")}.svg`, stock: 55 },
  { name: 'Casual Sneakers', description: 'Comfortable everyday sneakers, breathable mesh', price: 4999, category: 'Fashion', image: `/uploads/products/${slugify("Casual Sneakers")}.svg`, stock: 40 },
  { name: 'Wool Sweater', description: 'Merino wool, warm and stylish', price: 3999, category: 'Fashion', image: `/uploads/products/${slugify("Wool Sweater")}.svg`, stock: 35 },
  { name: 'Summer Dress', description: 'Floral print, lightweight cotton dress', price: 2499, category: 'Fashion', image: `/uploads/products/${slugify("Summer Dress")}.svg`, stock: 42 },
  { name: 'Men\'s Formal Shirt', description: 'Premium cotton, wrinkle-free formal shirt', price: 1999, category: 'Fashion', image: `/uploads/products/${slugify("Men's Formal Shirt")}.svg`, stock: 60 },
  { name: 'Apple Watch Ultra 2', description: '49mm titanium case, precision dual-frequency GPS', price: 89900, category: 'Accessories', image: `/uploads/products/${slugify("Apple Watch Ultra 2")}.svg`, stock: 18 },
  { name: 'Samsung Galaxy Watch 6', description: 'Sapphire crystal, body composition sensor', price: 39999, category: 'Accessories', image: `/uploads/products/${slugify("Samsung Galaxy Watch 6")}.svg`, stock: 25 },
  { name: 'Ray-Ban Aviator Sunglasses', description: 'Gold frame, green gradient lens', price: 14990, category: 'Accessories', image: `/uploads/products/${slugify("Ray-Ban Aviator Sunglasses")}.svg`, stock: 30 },
  { name: 'Leather Wallet', description: 'Genuine leather, RFID-blocking, slim design', price: 1999, category: 'Accessories', image: `/uploads/products/${slugify("Leather Wallet")}.svg`, stock: 70 },
  { name: 'Smart Watch Band', description: 'Silicone sports band, 22mm universal fit', price: 999, category: 'Accessories', image: `/uploads/products/${slugify("Smart Watch Band")}.svg`, stock: 100 },
  { name: 'Noise-Cancelling Earbuds', description: 'True wireless, 24hr battery, IPX5', price: 7999, category: 'Accessories', image: `/uploads/products/${slugify("Noise-Cancelling Earbuds")}.svg`, stock: 45 },
  { name: 'Dyson V15 Detect', description: 'Laser reveals microscopic dust, 60 min run time', price: 64900, category: 'Home', image: `/uploads/products/${slugify("Dyson V15 Detect")}.svg`, stock: 12 },
  { name: 'Philips Air Purifier', description: 'HEPA filter, covers 500 sq ft, smart sensor', price: 29999, category: 'Home', image: `/uploads/products/${slugify("Philips Air Purifier")}.svg`, stock: 20 },
  { name: 'Instant Pot Duo Plus', description: '9-in-1 pressure cooker, 6 quart', price: 12999, category: 'Home', image: `/uploads/products/${slugify("Instant Pot Duo Plus")}.svg`, stock: 35 },
  { name: 'Smart LED Bulb (4-Pack)', description: 'WiFi-enabled, 16M colors, voice control', price: 3999, category: 'Home', image: `/uploads/products/${slugify("Smart LED Bulb (4-Pack)")}.svg`, stock: 80 },
  { name: 'Cast Iron Cookware Set', description: '5-piece set, pre-seasoned, oven safe', price: 14999, category: 'Home', image: `/uploads/products/${slugify("Cast Iron Cookware Set")}.svg`, stock: 15 },
  { name: 'Memory Foam Pillow (2-Pack)', description: 'Cooling gel, ergonomic neck support', price: 4999, category: 'Home', image: `/uploads/products/${slugify("Memory Foam Pillow (2-Pack)")}.svg`, stock: 50 },
  { name: 'Nike Dri-FIT T-Shirt', description: 'Moisture-wicking fabric, athletic fit', price: 2499, category: 'Sports', image: `/uploads/products/${slugify("Nike Dri-FIT T-Shirt")}.svg`, stock: 65 },
  { name: 'Yoga Mat Premium', description: '6mm thick, non-slip, eco-friendly TPE', price: 2999, category: 'Sports', image: `/uploads/products/${slugify("Yoga Mat Premium")}.svg`, stock: 40 },
  { name: 'Resistance Bands Set', description: '5 levels of resistance, portable carry bag', price: 1499, category: 'Sports', image: `/uploads/products/${slugify("Resistance Bands Set")}.svg`, stock: 75 },
  { name: 'Running Shoes', description: 'Lightweight, cushioned sole, breathable upper', price: 7999, category: 'Sports', image: `/uploads/products/${slugify("Running Shoes")}.svg`, stock: 30 },
  { name: 'Dumbbell Set 20kg', description: 'Adjustable dumbbells, foam grip, pair', price: 8499, category: 'Sports', image: `/uploads/products/${slugify("Dumbbell Set 20kg")}.svg`, stock: 22 },
  { name: 'Cycling Helmet', description: 'Aerodynamic design, MIPS safety system', price: 5999, category: 'Sports', image: `/uploads/products/${slugify("Cycling Helmet")}.svg`, stock: 28 },
  { name: 'iPhone 15 Pro', description: 'A17 Pro chip, 48MP camera system, titanium', price: 134999, category: 'Mobiles', image: `/uploads/products/${slugify("iPhone 15 Pro")}.svg`, stock: 35 },
  { name: 'Samsung Galaxy Z Fold 5', description: 'Foldable display, multitasking powerhouse', price: 164999, category: 'Mobiles', image: `/uploads/products/${slugify("Samsung Galaxy Z Fold 5")}.svg`, stock: 12 },
  { name: 'Microsoft Surface Laptop 5', description: 'Intel i7, 16GB RAM, PixelSense touchscreen', price: 149999, category: 'Laptops', image: `/uploads/products/${slugify("Microsoft Surface Laptop 5")}.svg`, stock: 10 },
  { name: 'JBL Flip 6', description: 'Portable Bluetooth speaker, IP67, rich sound', price: 12999, category: 'Electronics', image: `/uploads/products/${slugify("JBL Flip 6")}.svg`, stock: 40 },
  { name: 'Leather Handbag', description: 'Genuine leather, spacious compartments', price: 6999, category: 'Fashion', image: `/uploads/products/${slugify("Leather Handbag")}.svg`, stock: 25 },
  { name: 'Smart Thermostat', description: 'AI-powered, energy saving, voice compatible', price: 15999, category: 'Home', image: `/uploads/products/${slugify("Smart Thermostat")}.svg`, stock: 15 },
  { name: 'Basketball', description: 'Official size 7, indoor/outdoor, durable rubber', price: 2499, category: 'Sports', image: `/uploads/products/${slugify("Basketball")}.svg`, stock: 50 },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log(`Seeded ${products.length} products`);

    const adminExists = await User.findOne({ email: 'admin@shopez.com' });
    if (!adminExists) {
      await User.create({
        name: 'Admin',
        email: 'admin@shopez.com',
        password: 'admin123',
        role: 'admin',
      });
      console.log('Admin user created: admin@shopez.com / admin123');
    }

    const customerExists = await User.findOne({ email: 'user@shopez.com' });
    if (!customerExists) {
      await User.create({
        name: 'Test User',
        email: 'user@shopez.com',
        password: 'user123',
        role: 'customer',
      });
      console.log('Test user created: user@shopez.com / user123');
    }

    console.log('Seed complete!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
