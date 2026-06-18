import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

dotenv.config();

const categories = ['Mobiles', 'Laptops', 'Electronics', 'Fashion', 'Accessories', 'Home', 'Sports'];

function getCategoryDefault(category) {
  return `/uploads/products/default-${category.toLowerCase()}.svg`;
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

function isInvalidImage(image) {
  if (!image) return true;
  if (image.startsWith('data:')) return true;
  if (image.startsWith('http://') || image.startsWith('https://')) return true;
  if (image.startsWith('file://')) return true;
  if (image.includes('C:\\') || image.includes('D:\\')) return true;
  if (image === '/uploads/products/placeholder.svg') return true;
  if (image.endsWith('.jpg') || image.endsWith('.jpeg') || image.endsWith('.png') || image.endsWith('.gif') || image.endsWith('.webp')) return true;
  return false;
}

async function fixMissingImages() {
  await mongoose.connect(process.env.MONGO_URL);
  console.log('Connected to MongoDB\n');

  const products = await Product.find({}).lean();
  console.log(`Found ${products.length} products\n`);

  let fixed = 0;
  let skipped = 0;
  let toCategoryDefault = 0;

  for (const product of products) {
    const image = product.image || '';

    if (isInvalidImage(image)) {
      const slug = slugify(product.name.replace("'", ''));
      const correctPath = `/uploads/products/${slug}.svg`;
      const fallbackPath = getCategoryDefault(product.category);

      await Product.findByIdAndUpdate(product._id, { image: correctPath });
      console.log(`  FIXED  ${product.name}`);
      console.log(`         ${image || '(empty)'} → ${correctPath}`);
      fixed++;
    } else if (image.startsWith('/uploads/products/') && image.endsWith('.svg')) {
      console.log(`  OK     ${product.name} — ${image}`);
      skipped++;
    } else if (image.startsWith('/uploads/products/')) {
      const slug = slugify(product.name.replace("'", ''));
      const correctPath = `/uploads/products/${slug}.svg`;
      await Product.findByIdAndUpdate(product._id, { image: correctPath });
      console.log(`  FIXED  ${product.name} — wrong extension: ${image} → ${correctPath}`);
      fixed++;
    } else {
      const slug = slugify(product.name.replace("'", ''));
      const correctPath = `/uploads/products/${slug}.svg`;
      await Product.findByIdAndUpdate(product._id, { image: correctPath });
      console.log(`  FIXED  ${product.name} — invalid: ${image} → ${correctPath}`);
      fixed++;
    }
  }

  console.log(`\nDone. Fixed: ${fixed}, Skipped (OK): ${skipped}`);
  await mongoose.disconnect();
  process.exit(0);
}

fixMissingImages().catch((err) => {
  console.error('Script failed:', err);
  process.exit(1);
});
