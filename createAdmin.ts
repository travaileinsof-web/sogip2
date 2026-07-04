import 'dotenv/config';
import { getDb } from './api/db/index.js';
import { users } from './api/db/schema.js';
import bcrypt from 'bcryptjs';

async function createAdmin() {
  console.log('Connexion à la base de données...');
  try {
    const db = getDb();
    
    const email = 'admin@sogipgroup.com';
    const password = 'password123';
    const passwordHash = await bcrypt.hash(password, 10);
    
    console.log(`Création de l'administrateur: ${email} ...`);
    
    await db.insert(users).values({
      name: 'Admin SOGIP',
      email: email,
      passwordHash: passwordHash,
      role: 'admin',
    });
    
    console.log('✅ Succès! Administrateur créé.');
    console.log(`Email: ${email}`);
    console.log(`Mot de passe: ${password}`);
    console.log('N\'oubliez pas de changer ce mot de passe depuis le tableau de bord une fois connecté.');
  } catch (err) {
    console.error('❌ Erreur lors de la création de l\'administrateur:');
    console.error(err);
  }
}

createAdmin().then(() => process.exit(0));
