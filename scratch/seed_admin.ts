import { db } from '../api/db';
import { users } from '../api/db/schema';

async function seed() {
  try {
    await db.insert(users).values({
      name: 'Administrateur',
      email: 'admin@sogip.com',
      passwordHash: 'admin123',
      role: 'admin'
    });
    console.log("Admin user created!");
  } catch (error) {
    console.error("Error or user already exists:", error);
  }
  process.exit(0);
}
seed();
