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
