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

router.get('/', (req, res) => {
  const categories = db.getAll('categories')
    .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
    .map(cat => ({
      ...cat,
      product_count: db.filter('products', p => p.category_id === cat.id).length,
    }));
  res.json(categories);
});

router.get('/:slug', (req, res) => {
  const category = db.getBy('categories', 'slug', req.params.slug);
  if (!category) return res.status(404).json({ error: 'Catégorie introuvable' });
  res.json(category);
});

router.post('/', (req, res) => {
  const { name, description, image_url, display_order } = req.body;
  if (!name) return res.status(400).json({ error: 'Le nom est requis' });

  const slug = slugify(name);
  const existing = db.getBy('categories', 'slug', slug);
  if (existing) return res.status(400).json({ error: 'Cette catégorie existe déjà' });

  const category = db.insert('categories', {
    name, slug, description: description || '', image_url: image_url || '', display_order: display_order || 0,
  });
  res.status(201).json(category);
});

router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const existing = db.getById('categories', id);
  if (!existing) return res.status(404).json({ error: 'Catégorie introuvable' });

  const { name, description, image_url, display_order } = req.body;
  const slug = name ? slugify(name) : existing.slug;

  const updated = db.update('categories', id, {
    name: name || existing.name,
    slug,
    description: description ?? existing.description,
    image_url: image_url ?? existing.image_url,
    display_order: display_order ?? existing.display_order,
  });
  res.json(updated);
});

router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const deleted = db.delete('categories', id);
  if (!deleted) return res.status(404).json({ error: 'Catégorie introuvable' });
  res.json({ success: true });
});

export default router;
