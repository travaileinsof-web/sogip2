import 'dotenv/config';
import { getDb } from './api/db/index.js';
import { users } from './api/db/schema.js';

async function check() {
  const allUsers = await getDb().select().from(users);
  console.log('Utilisateurs dans la BDD:', allUsers.map(u => ({ id: u.id, email: u.email, role: u.role })));
  process.exit(0);
}
check();
