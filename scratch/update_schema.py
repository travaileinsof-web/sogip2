import sys

with open('api/db/schema.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace corrupted character 'LouǸ'
text = text.replace('LouǸ', 'Loué')

# Insert city and neighborhood after location
# and specifications after features
insertion = """
    location: varchar('location', { length: 255 }).notNull(),
    city: varchar('city', { length: 100 }),
    neighborhood: varchar('neighborhood', { length: 100 }),
    area: integer('area'), // Surface en m2
    image: text('image').notNull(),
    gallery: text('gallery'), // JSON array of additional images
    features: text('features'), // JSON array or text of features
    specifications: text('specifications'), // JSON object of dynamic properties (rooms, floors, etc)
"""

# We'll replace the block:
old_block = """    location: varchar('location', { length: 255 }).notNull(),
    area: integer('area'), // Surface en m2
    image: text('image').notNull(),
    gallery: text('gallery'), // JSON array of additional images
    features: text('features'), // JSON array or text of features"""

text = text.replace(old_block, insertion.strip('\n'))

with open('api/db/schema.ts', 'w', encoding='utf-8') as f:
    f.write(text)
print("Updated schema.ts")
