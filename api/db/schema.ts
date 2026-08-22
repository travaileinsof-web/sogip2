import { pgTable, serial, text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: varchar('role', { length: 50 }).default('admin'),
  createdAt: timestamp('created_at').defaultNow()
});

export const formations = pgTable('formations', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  category: varchar('category', { length: 255 }).notNull(),
  duration: varchar('duration', { length: 100 }).notNull(),
  price: integer('price').notNull(),
  description: text('description').notNull(),
  image: text('image').notNull(),
  mode: varchar('mode', { length: 50 }).default('Présentiel'),
  whatsappLink: varchar('whatsapp_link', { length: 500 }),
  actif: boolean('actif').default(true),
  createdAt: timestamp('created_at').defaultNow()
});

export const contacts = pgTable('contacts', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  subject: varchar('subject', { length: 255 }).notNull(),
  message: text('message').notNull(),
  status: varchar('status', { length: 50 }).default('nouveau'),
  read: boolean('read').default(false),
  createdAt: timestamp('created_at').defaultNow()
});

export const media = pgTable('media', {
  id: serial('id').primaryKey(),
  filename: varchar('filename', { length: 255 }).notNull(),
  url: text('url').notNull(),
  type: varchar('type', { length: 50 }).notNull(),
  size: integer('size').notNull(),
  createdAt: timestamp('created_at').defaultNow()
});

export const pages = pgTable('pages', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(), // JSON stringified content
  updatedAt: timestamp('updated_at').defaultNow()
});

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  category: varchar('category', { length: 255 }).notNull(),
  price: integer('price').notNull(),
  description: text('description').notNull(),
  image: text('image').notNull(),
  actif: boolean('actif').default(true),
  createdAt: timestamp('created_at').defaultNow()
});

export const settings = pgTable('settings', {
  key: varchar('key', { length: 255 }).primaryKey(),
  value: text('value').notNull(), // JSON stringified value or plain text
  updatedAt: timestamp('updated_at').defaultNow()
});

export const realizations = pgTable('realizations', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }),
  category: varchar('category', { length: 255 }).notNull(),
  image: text('image').notNull(),
  createdAt: timestamp('created_at').defaultNow()
});

export const properties = pgTable('properties', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  propertyType: varchar('property_type', { length: 50 }).notNull(), // Terrain, Appartement, Immeuble, etc.
  transactionType: varchar('transaction_type', { length: 50 }).notNull(), // Vente, Location
  status: varchar('status', { length: 50 }).default('Disponible'), // Disponible, Vendu, Loué
  price: integer('price').notNull(),
  currency: varchar('currency', { length: 10 }).default('GNF'),
  location: varchar('location', { length: 255 }).notNull(),
    city: varchar('city', { length: 100 }),
    neighborhood: varchar('neighborhood', { length: 100 }),
    area: integer('area'), // Surface en m2
    image: text('image').notNull(),
    gallery: text('gallery'), // JSON array of additional images
    features: text('features'), // JSON array or text of features
    specifications: text('specifications'), // JSON object of dynamic properties (rooms, floors, etc)
  actif: boolean('actif').default(true),
  createdAt: timestamp('created_at').defaultNow()
});
