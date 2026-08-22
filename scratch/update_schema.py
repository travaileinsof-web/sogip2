import sys
import re

with open('api/db/schema.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace corrupted character 'LouǸ'
text = text.replace('LouǸ', 'Loué')

# Replace the location block using regex
pattern = r"location: varchar\('location', \{ length: 255 \}\)\.notNull\(\),\s*area: integer\('area'\), // Surface en m2\s*image: text\('image'\)\.notNull\(\),\s*gallery: text\('gallery'\), // JSON array of additional images\s*features: text\('features'\), // JSON array or text of features"

replacement = """location: varchar('location', { length: 255 }).notNull(),
    city: varchar('city', { length: 100 }),
    neighborhood: varchar('neighborhood', { length: 100 }),
    area: integer('area'), // Surface en m2
    image: text('image').notNull(),
    gallery: text('gallery'), // JSON array of additional images
    features: text('features'), // JSON array or text of features
    specifications: text('specifications'), // JSON object of dynamic properties (rooms, floors, etc)"""

text = re.sub(pattern, replacement, text, flags=re.MULTILINE)

with open('api/db/schema.ts', 'w', encoding='utf-8') as f:
    f.write(text)
print("Updated schema.ts")
