import { Router } from 'express';
import db from '../db.js';

const router = Router();

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function enrichProduct(p) {
  const cat = p.category_id ? db.getById('categories', p.category_id) : null;
  return {
    ...p,
    category_name: cat?.name || null,
    category_slug: cat?.slug || null,
  };
}

router.get('/', (req, res) => {
  const { category, featured, search, limit, offset } = req.query;
  let products = db.getAll('products');

  if (category) {
    const cat = db.getBy('categories', 'slug', category);
    if (cat) products = products.filter(p => p.category_id === cat.id);
    else products = [];
  }
  if (featured === '1') {
    products = products.filter(p => p.featured);
  }
  if (search) {
    const term = search.toLowerCase();
    products = products.filter(p =>
      p.name.toLowerCase().includes(term) ||
      (p.description && p.description.toLowerCase().includes(term))
    );
  }

  products.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const start = offset ? parseInt(offset) : 0;
  const end = limit ? start + parseInt(limit) : undefined;
  products = products.slice(start, end);

  res.json(products.map(enrichProduct));
});

router.get('/:slug', (req, res) => {
  const product = db.getBy('products', 'slug', req.params.slug);
  if (!product) return res.status(404).json({ error: 'Produit introuvable' });
  res.json(enrichProduct(product));
});

router.post('/', (req, res) => {
  const { name, description, price, compare_price, image_url, category_id, stock, featured } = req.body;
  if (!name || price == null) return res.status(400).json({ error: 'Nom et prix requis' });

  let slug = slugify(name);
  if (db.getBy('products', 'slug', slug)) slug += '-' + Date.now();

  const product = db.insert('products', {
    name, slug, description: description || '', price: parseFloat(price),
    compare_price: compare_price ? parseFloat(compare_price) : null,
    image_url: image_url || '', category_id: category_id ? parseInt(category_id) : null,
    stock: parseInt(stock) || 0, featured: featured ? 1 : 0,
  });
  res.status(201).json(enrichProduct(product));
});

router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const existing = db.getById('products', id);
  if (!existing) return res.status(404).json({ error: 'Produit introuvable' });

  const { name, description, price, compare_price, image_url, category_id, stock, featured } = req.body;
  const slug = name ? slugify(name) : existing.slug;

  const updated = db.update('products', id, {
    name: name || existing.name,
    slug,
    description: description ?? existing.description,
    price: price != null ? parseFloat(price) : existing.price,
    compare_price: compare_price !== undefined ? (compare_price ? parseFloat(compare_price) : null) : existing.compare_price,
    image_url: image_url ?? existing.image_url,
    category_id: category_id !== undefined ? (category_id ? parseInt(category_id) : null) : existing.category_id,
    stock: stock != null ? parseInt(stock) : existing.stock,
    featured: featured !== undefined ? (featured ? 1 : 0) : existing.featured,
  });
  res.json(enrichProduct(updated));
});

router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const deleted = db.delete('products', id);
  if (!deleted) return res.status(404).json({ error: 'Produit introuvable' });
  res.json({ success: true });
});

export default router;
