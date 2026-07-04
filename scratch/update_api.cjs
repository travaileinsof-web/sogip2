const fs = require('fs');

let api = fs.readFileSync('api/index.ts', 'utf8');

// 1. Add multer imports
if (!api.includes('import multer')) {
  api = api.replace(/import express from 'express';/, "import express from 'express';\nimport multer from 'multer';\nimport fs from 'fs';\nimport path from 'path';");
}

// 2. Add multer config and upload route before AUTHENTICATION (or around line 46)
const multerConfig = `
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
  res.json({ url: \`/uploads/\${req.file.filename}\` });
});
`;

if (!api.includes("app.use('/uploads'")) {
  api = api.replace(/app\.get\('\/api\/v1\/ping'.+;/, "app.get('/api/v1/ping', (req, res) => res.json({ message: 'pong' }));\n" + multerConfig);
}

// 3. Update formations PUT route
const formationPutRegex = /app\.put\('\/api\/v1\/admin\/formations\/:id', authenticate, async \(req, res\) => \{\s*try \{\s*const result = await getDb\(\)\.update\(formations\)\s*\.set\(req\.body\)/;
api = api.replace(formationPutRegex, `app.put('/api/v1/admin/formations/:id', authenticate, async (req, res) => {
  try {
    const { id, createdAt, ...updateData } = req.body;
    const result = await getDb().update(formations)
      .set(updateData)`);

// 4. Update products PUT route
const productPutRegex = /app\.put\('\/api\/v1\/admin\/products\/:id', authenticate, async \(req, res\) => \{\s*try \{\s*const result = await getDb\(\)\.update\(products\)\s*\.set\(req\.body\)/;
api = api.replace(productPutRegex, `app.put('/api/v1/admin/products/:id', authenticate, async (req, res) => {
  try {
    const { id, createdAt, ...updateData } = req.body;
    const result = await getDb().update(products)
      .set(updateData)`);

fs.writeFileSync('api/index.ts', api, 'utf8');
console.log('api/index.ts updated.');
