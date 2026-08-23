import { Router } from 'express';
import db from '../db.js';

const router = Router();

router.get('/', (req, res) => {
  const orders = db.getAll('orders').sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  res.json(orders);
});

router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const order = db.getById('orders', id);
  if (!order) return res.status(404).json({ error: 'Commande introuvable' });

  const items = db.filter('order_items', item => item.order_id === id);
  res.json({ ...order, items });
});

router.post('/', (req, res) => {
  const { customer_name, customer_email, customer_phone, address, city, items } = req.body;

  if (!customer_name || !customer_phone || !address || !items?.length) {
    return res.status(400).json({ error: 'Informations incomplètes' });
  }

  let total = 0;
  const validatedItems = [];
  for (const item of items) {
    const product = db.getById('products', item.product_id);
    if (!product) return res.status(400).json({ error: `Produit ${item.product_id} introuvable` });
    const lineTotal = product.price * item.quantity;
    total += lineTotal;
    validatedItems.push({ product_id: item.product_id, product_name: product.name, quantity: item.quantity, price: product.price });
  }

  const order = db.insert('orders', {
    customer_name, customer_email: customer_email || '', customer_phone,
    address, city: city || '', total, status: 'pending',
  });

  for (const item of validatedItems) {
    db.insert('order_items', { order_id: order.id, ...item });
  }

  res.status(201).json(order);
});

router.put('/:id/status', (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Statut invalide' });
  }
  const id = parseInt(req.params.id);
  const updated = db.update('orders', id, { status });
  if (!updated) return res.status(404).json({ error: 'Commande introuvable' });
  res.json(updated);
});

export default router;
