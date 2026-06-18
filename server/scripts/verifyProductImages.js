import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

dotenv.config();

const UPLOADS_DIR = path.join(process.cwd(), 'uploads', 'products');
const REPORT_PATH = path.join(process.cwd(), 'missing-images.json');

const categories = ['Mobiles', 'Laptops', 'Electronics', 'Fashion', 'Accessories', 'Home', 'Sports'];

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

async function verifyProductImages() {
  await mongoose.connect(process.env.MONGO_URL);
  console.log('Connected to MongoDB\n');

  const products = await Product.find({}).lean();
  console.log(`Found ${products.length} products\n`);

  let ok = 0;
  let missing = 0;
  const missingList = [];

  for (const product of products) {
    const image = product.image || '';
    if (!image.startsWith('/uploads/')) {
      console.log(`  INVALID  ${product.name} — path not relative: ${image}`);
      missing++;
      missingList.push({ name: product.name, category: product.category, image, _id: product._id });
      continue;
    }

    const relativePath = image.replace('/uploads/', '');
    const filepath = path.join(process.cwd(), 'uploads', relativePath);

    if (fs.existsSync(filepath)) {
      const stats = fs.statSync(filepath);
      if (stats.size > 100) {
        console.log(`  ✓  ${product.name} — ${path.basename(filepath)}`);
        ok++;
        continue;
      }
    }

    console.log(`  ✗  ${product.name} — MISSING: ${image}`);
    missing++;
    missingList.push({ name: product.name, category: product.category, image, _id: product._id });
  }

  // Check category defaults
  console.log('\n--- Category Defaults ---');
  for (const cat of categories) {
    const filename = `default-${cat.toLowerCase()}.svg`;
    const filepath = path.join(UPLOADS_DIR, filename);
    if (fs.existsSync(filepath)) {
      console.log(`  ✓  ${filename}`);
    } else {
      console.log(`  ✗  ${filename} — MISSING`);
    }
  }

  // Write report
  fs.writeFileSync(REPORT_PATH, JSON.stringify(missingList, null, 2));
  console.log(`\nReport written to: ${REPORT_PATH}`);

  console.log(`\n========================================`);
  console.log(`  Product Image Verification Report`);
  console.log(`========================================`);
  console.log(`  Total products:     ${products.length}`);
  console.log(`  OK:                 ${ok}`);
  console.log(`  Missing/Failed:     ${missing}`);
  console.log('========================================\n');

  await mongoose.disconnect();
  process.exit(missing > 0 ? 1 : 0);
}

verifyProductImages().catch((err) => {
  console.error('Script failed:', err);
  process.exit(1);
});
