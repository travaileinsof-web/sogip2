import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import { getDb } from './db/index.js';
import { users, formations, contacts, media, pages, products, settings, realizations } from './db/schema.js';
import { eq, desc } from 'drizzle-orm';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import rateLimit from 'express-rate-limit';

const app = express();

const corsOptions = {
  origin: process.env.APP_ENV === 'production' 
    ? ['https://sogipgroup.com', 'https://www.sogipgroup.com']
    : ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

if (!process.env.JWT_SECRET) {
  throw new Error('FATAL: JWT_SECRET environment variable is not set');
}
const JWT_SECRET = process.env.JWT_SECRET;

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

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'public/uploads';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

app.use('/uploads', express.static('public/uploads'));

app.post('/api/v1/admin/upload', authenticate, upload.single('image'), (req: any, res: any) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.json({ url: `/uploads/${req.file.filename}` });
});


// --- AUTHENTICATION ---
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Trop de tentatives. Réessayez dans 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.post('/api/v1/auth/login', loginLimiter, async (req, res) => {
  const { email, password } = req.body;
  console.log(`[LOGIN ATTEMPT] email: "${email}", password length: ${password?.length}`);
  
  try {
    const user = await getDb().select().from(users).where(eq(users.email, email)).limit(1);
    console.log(`[LOGIN] User found in DB: ${user.length > 0}`);
    
    if (user.length === 0) {
      console.log(`[LOGIN] Identifiants incorrects (email introuvable)`);
      return res.status(401).json({ message: 'Identifiants incorrects' });
    }
    
    const isValid = await bcrypt.compare(password, user[0].passwordHash);
    console.log(`[LOGIN] Password is valid: ${isValid}`);
    if (!isValid) {
      return res.status(401).json({ message: 'Identifiants incorrects' });
    }
    
    console.log(`[LOGIN] Success for ${email}`);
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

app.get('/api/v1/auth/check', authenticate, (req, res) => {
  res.json({ success: true, admin: req.user });
});

app.post('/api/v1/auth/logout', (req, res) => {
  res.json({ success: true });
});

// --- PUBLIC ROUTES ---
app.get('/api/v1/formations', async (req, res) => {
  try {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    const result = await getDb().select().from(formations).where(eq(formations.actif, true)).orderBy(desc(formations.createdAt));
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.get('/api/v1/products', async (req, res) => {
  try {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    const result = await getDb().select().from(products).where(eq(products.actif, true)).orderBy(desc(products.createdAt));
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.get('/api/v1/settings', async (req, res) => {
  try {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    const result = await getDb().select().from(settings);
    // Convert array to object { key: value }
    const settingsObj = result.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);
    res.json(settingsObj);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
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
    const { id, createdAt, ...updateData } = req.body;
    const result = await getDb().update(formations)
      .set(updateData)
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

// --- PRODUCTS ---
app.get('/api/v1/admin/products', authenticate, async (req, res) => {
  try {
    const result = await getDb().select().from(products).orderBy(desc(products.createdAt));
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur: ' + (error.message || String(error)) });
  }
});

app.post('/api/v1/admin/products', authenticate, async (req, res) => {
  try {
    const result = await getDb().insert(products).values(req.body).returning();
    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur: ' + (error.message || String(error)) });
  }
});

app.put('/api/v1/admin/products/:id', authenticate, async (req, res) => {
  try {
    const { id, createdAt, ...updateData } = req.body;
    const result = await getDb().update(products)
      .set(updateData)
      .where(eq(products.id, Number(req.params.id)))
      .returning();
    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur: ' + (error.message || String(error)) });
  }
});

app.put('/api/v1/admin/products/:id/toggle', authenticate, async (req, res) => {
  try {
    const result = await getDb().update(products)
      .set({ actif: req.body.actif === 1 || req.body.actif === true })
      .where(eq(products.id, Number(req.params.id)))
      .returning();
    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur: ' + (error.message || String(error)) });
  }
});

app.delete('/api/v1/admin/products/:id', authenticate, async (req, res) => {
  try {
    await getDb().delete(products).where(eq(products.id, Number(req.params.id)));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur: ' + (error.message || String(error)) });
  }
});

// --- SETTINGS ---
app.put('/api/v1/admin/settings', authenticate, async (req, res) => {
  try {
    // Expecting a body like { "contact_email": "hello@sogip.com", "social_facebook": "..." }
    const entries = Object.entries(req.body);
    const db = getDb();
    
    // We update each setting individually (upsert pattern logic)
    for (const [key, value] of entries) {
      const existing = await db.select().from(settings).where(eq(settings.key, key));
      if (existing.length > 0) {
        await db.update(settings).set({ value: String(value), updatedAt: new Date() }).where(eq(settings.key, key));
      } else {
        await db.insert(settings).values({ key, value: String(value) });
      }
    }
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur: ' + (error.message || String(error)) });
  }
});

// --- REALIZATIONS ---
app.get('/api/v1/realizations', async (req, res) => {
  try {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    const { category } = req.query;
    let query = getDb().select().from(realizations).orderBy(desc(realizations.createdAt));
    if (category) {
      query = query.where(eq(realizations.category, String(category)));
    }
    const result = await query;
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.get('/api/v1/admin/realizations', authenticate, async (req, res) => {
  try {
    const result = await getDb().select().from(realizations).orderBy(desc(realizations.createdAt));
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur: ' + (error?.message || String(error)) });
  }
});

app.post('/api/v1/admin/realizations', authenticate, async (req, res) => {
  try {
    const result = await getDb().insert(realizations).values(req.body).returning();
    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur: ' + (error?.message || String(error)) });
  }
});

app.delete('/api/v1/admin/realizations/:id', authenticate, async (req, res) => {
  try {
    await getDb().delete(realizations).where(eq(realizations.id, Number(req.params.id)));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur: ' + (error?.message || String(error)) });
  }
});

export default app;
