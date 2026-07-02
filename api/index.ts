import express from 'express';
import cors from 'cors';
import { getDb } from './db';
import { users, formations, contacts, media, pages } from './db/schema';
import { eq, desc } from 'drizzle-orm';
import jwt from 'jsonwebtoken';

const app = express();

app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-for-sogip-admin-2026';

// Middleware for authentication
const authenticate = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Token missing' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

app.get('/api/v1/ping', (req, res) => res.json({ message: 'pong' }));

// --- AUTHENTICATION ---
app.post('/api/v1/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await getDb().select().from(users).where(eq(users.email, email)).limit(1);
    
    // Simplification for demo: In production, compare hashed passwords!
    if (user.length === 0 || user[0].passwordHash !== password) {
      return res.status(401).json({ message: 'Identifiants incorrects' });
    }
    
    const token = jwt.sign(
      { id: user[0].id, email: user[0].email, role: user[0].role }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );
    
    res.json({
      token,
      user: {
        id: user[0].id,
        name: user[0].name,
        email: user[0].email,
        role: user[0].role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Erreur serveur: ' + (error.message || String(error)) });
  }
});

// --- DASHBOARD STATS ---
app.get('/api/v1/stats', authenticate, async (req, res) => {
  try {
    const formationsList = await getDb().select().from(formations);
    const contactsList = await getDb().select().from(contacts);
    const pagesList = await getDb().select().from(pages);
    
    const newContactsCount = contactsList.filter(c => c.status === 'nouveau').length;
    const activeFormationsCount = formationsList.filter(f => f.actif).length;
    
    res.json({
      formations: formationsList.length,
      activeFormations: activeFormationsCount,
      messages: contactsList.length,
      newMessages: newContactsCount,
      pages: pagesList.length,
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ message: 'Erreur serveur: ' + (error.message || String(error)) });
  }
});

// --- FORMATIONS ---
app.get('/api/v1/admin/formations', authenticate, async (req, res) => {
  try {
    const result = await getDb().select().from(formations).orderBy(desc(formations.createdAt));
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur: ' + (error.message || String(error)) });
  }
});

app.post('/api/v1/admin/formations', authenticate, async (req, res) => {
  try {
    const result = await getDb().insert(formations).values(req.body).returning();
    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur: ' + (error.message || String(error)) });
  }
});

app.put('/api/v1/admin/formations/:id', authenticate, async (req, res) => {
  try {
    const result = await getDb().update(formations)
      .set(req.body)
      .where(eq(formations.id, Number(req.params.id)))
      .returning();
    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur: ' + (error.message || String(error)) });
  }
});

app.put('/api/v1/admin/formations/:id/toggle', authenticate, async (req, res) => {
  try {
    const result = await getDb().update(formations)
      .set({ actif: req.body.actif === 1 || req.body.actif === true })
      .where(eq(formations.id, Number(req.params.id)))
      .returning();
    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur: ' + (error.message || String(error)) });
  }
});

app.delete('/api/v1/admin/formations/:id', authenticate, async (req, res) => {
  try {
    await getDb().delete(formations).where(eq(formations.id, Number(req.params.id)));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur: ' + (error.message || String(error)) });
  }
});

// --- CONTACTS ---
app.get('/api/v1/admin/contacts', authenticate, async (req, res) => {
  try {
    const result = await getDb().select().from(contacts).orderBy(desc(contacts.createdAt));
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur: ' + (error.message || String(error)) });
  }
});

app.get('/api/v1/admin/contacts/:id', authenticate, async (req, res) => {
  try {
    const result = await getDb().select().from(contacts).where(eq(contacts.id, Number(req.params.id)));
    if (result.length === 0) return res.status(404).json({ message: 'Contact not found' });
    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur: ' + (error.message || String(error)) });
  }
});

app.put('/api/v1/admin/contacts/:id/read', authenticate, async (req, res) => {
  try {
    const result = await getDb().update(contacts)
      .set({ read: true, status: 'lu' })
      .where(eq(contacts.id, Number(req.params.id)))
      .returning();
    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur: ' + (error.message || String(error)) });
  }
});

app.put('/api/v1/admin/contacts/:id/status', authenticate, async (req, res) => {
  try {
    const result = await getDb().update(contacts)
      .set({ status: req.body.statut })
      .where(eq(contacts.id, Number(req.params.id)))
      .returning();
    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur: ' + (error.message || String(error)) });
  }
});

app.delete('/api/v1/admin/contacts/:id', authenticate, async (req, res) => {
  try {
    await getDb().delete(contacts).where(eq(contacts.id, Number(req.params.id)));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur: ' + (error.message || String(error)) });
  }
});

// --- MEDIA ---
app.get('/api/v1/admin/media', authenticate, async (req, res) => {
  try {
    const result = await getDb().select().from(media).orderBy(desc(media.createdAt));
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur: ' + (error.message || String(error)) });
  }
});

app.post('/api/v1/admin/media', authenticate, async (req, res) => {
  // Simplification: In a real app, you'd use multer and upload to Vercel Blob or AWS S3
  // Since we are in a serverless environment, local filesystem uploads don't persist.
  res.status(501).json({ message: 'Media upload requires cloud storage configuration (S3/Vercel Blob)' });
});

app.delete('/api/v1/admin/media/:id', authenticate, async (req, res) => {
  try {
    await getDb().delete(media).where(eq(media.id, Number(req.params.id)));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur: ' + (error.message || String(error)) });
  }
});

// --- PAGES ---
app.get('/api/v1/admin/pages', authenticate, async (req, res) => {
  try {
    const result = await getDb().select().from(pages).orderBy(pages.slug);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur: ' + (error.message || String(error)) });
  }
});

app.post('/api/v1/admin/pages/batch', authenticate, async (req, res) => {
  try {
    const { items } = req.body;
    
    // Very simple batch update/insert logic
    for (const item of items) {
      const existing = await getDb().select().from(pages).where(eq(pages.slug, item.slug));
      
      if (existing.length > 0) {
        await getDb().update(pages).set({ content: item.content, title: item.title, updatedAt: new Date() }).where(eq(pages.slug, item.slug));
      } else {
        await getDb().insert(pages).values({ slug: item.slug, title: item.title, content: item.content });
      }
    }
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur: ' + (error.message || String(error)) });
  }
});

export default app;
