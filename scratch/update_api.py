import sys

with open('api/index.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace POST
old_post = """const { title, description, propertyType, transactionType, status, price, currency, location, area, image, 
gallery, features } = req.body;
      
      const [property] = await db.insert(properties).values({
        title,
        description,
        propertyType,
        transactionType,
        status: status || 'Disponible',
        price: Number(price),
        currency: currency || 'GNF',
        location,
        area: area ? Number(area) : null,
        image,
        gallery: gallery ? JSON.stringify(gallery) : null,
        features: features ? JSON.stringify(features) : null,
      }).returning();"""

# Note: the line break after `image, ` might be different. Let's do it line by line or with re
import re

old_post_re = r"const \{ title, description, propertyType, transactionType, status, price, currency, location, area, image, \s*gallery, features \} = req\.body;\s*const \[property\] = await db\.insert\(properties\)\.values\(\{.*?\n\s*features: features \? JSON\.stringify\(features\) : null,\s*\}\)\.returning\(\);"

new_post = """const { title, description, propertyType, transactionType, status, price, currency, location, city, neighborhood, area, image, gallery, features, specifications } = req.body;
      
      const [property] = await db.insert(properties).values({
        title,
        description,
        propertyType,
        transactionType,
        status: status || 'Disponible',
        price: Number(price),
        currency: currency || 'GNF',
        location,
        city,
        neighborhood,
        area: area ? Number(area) : null,
        image,
        gallery: gallery ? (typeof gallery === 'string' ? gallery : JSON.stringify(gallery)) : null,
        features: features ? (typeof features === 'string' ? features : JSON.stringify(features)) : null,
        specifications: specifications ? (typeof specifications === 'string' ? specifications : JSON.stringify(specifications)) : null,
      }).returning();"""

text = re.sub(old_post_re, new_post, text, flags=re.DOTALL)

old_put_re = r"const \{ title, description, propertyType, transactionType, status, price, currency, location, area, image, \s*gallery, features \} = req\.body;\s*const \[property\] = await db\.update\(properties\)\.set\(\{.*?\n\s*features: features \? \(typeof features === 'string' \? features : JSON\.stringify\(features\)\) : null,\s*\}\)\.where\(eq\(properties\.id, Number\(id\)\)\)\.returning\(\);"

new_put = """const { title, description, propertyType, transactionType, status, price, currency, location, city, neighborhood, area, image, gallery, features, specifications } = req.body;
      
      const [property] = await db.update(properties).set({
        title,
        description,
        propertyType,
        transactionType,
        status,
        price: Number(price),
        currency,
        location,
        city,
        neighborhood,
        area: area ? Number(area) : null,
        image,
        gallery: gallery ? (typeof gallery === 'string' ? gallery : JSON.stringify(gallery)) : null,
        features: features ? (typeof features === 'string' ? features : JSON.stringify(features)) : null,
        specifications: specifications ? (typeof specifications === 'string' ? specifications : JSON.stringify(specifications)) : null,
      }).where(eq(properties.id, Number(id))).returning();"""

text = re.sub(old_put_re, new_put, text, flags=re.DOTALL)

with open('api/index.ts', 'w', encoding='utf-8') as f:
    f.write(text)

print("Updated index.ts")
