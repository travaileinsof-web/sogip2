import 'dotenv/config';
import { getDb } from './api/db/index.js';
import { formations, products, settings } from './api/db/schema.js';
import * as fs from 'fs';

async function seed() {
  const db = getDb();
  
  // 1. Seed Formations
  console.log('Seeding formations...');
  const formationsData = fs.readFileSync('formations_extracted.json', 'utf8');
  // It's a JS array, we can safely eval it (since we generated it from our code)
  const formationsList = eval(formationsData);
  
  for (const category of formationsList) {
    for (const course of category.courses) {
      await db.insert(formations).values({
        title: course.title,
        category: category.category,
        duration: course.duration,
        price: parseInt(course.price) || 0,
        description: course.desc,
        image: course.image,
        actif: true
      });
    }
  }

  // 2. Seed Products
  console.log('Seeding products...');
  const productsData = fs.readFileSync('products_extracted.json', 'utf8');
  const productsList = eval(productsData);
  
  for (const product of productsList) {
    await db.insert(products).values({
      title: product.title,
      category: product.category,
      price: 0, // No price was in the array, let's default to 0
      description: product.desc,
      image: product.image,
      actif: true
    });
  }

  // 3. Seed Global Settings
  console.log('Seeding settings...');
  const defaultSettings = [
    { key: 'contact_email', value: 'contact@sogipgroup.com' },
    { key: 'contact_phone', value: '+224 620 52 12 49' },
    { key: 'contact_address', value: 'Conakry, Guinée' },
    { key: 'social_facebook', value: 'https://facebook.com/sogipgroup' },
    { key: 'social_linkedin', value: 'https://linkedin.com/company/sogipgroup' },
    { key: 'social_tiktok', value: 'https://tiktok.com/@sogipgroup' },
    { key: 'photo_fondateur', value: '/images/fondateur.jpg' },
    { key: 'photo_directeur', value: '/images/fondateur2.jpg' }, // Using fondateur2 as DG based on current code
  ];
  
  for (const setting of defaultSettings) {
    await db.insert(settings).values(setting);
  }

  console.log('Seed complete!');
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
