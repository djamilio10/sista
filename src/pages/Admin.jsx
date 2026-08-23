import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Package, FolderOpen, ShoppingCart, X, Save, LayoutDashboard } from 'lucide-react';
import { api, formatPrice } from '../api';
import toast from 'react-hot-toast';

function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div className="bg-white border border-sista-blush/50 p-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-body text-sista-muted uppercase tracking-wide">{label}</span>
        <Icon size={20} className={color} />
      </div>
      <p className="font-display text-3xl text-sista-dark">{value}</p>
    </div>
  );
}

function CategoryForm({ category, categories, onSave, onCancel }) {
  const [form, setForm] = useState(
    category || { name: '', description: '', image_url: '', display_order: 0 }
  );
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (category?.id) {
        await api.categories.update(category.id, form);
        toast.success('Catégorie modifiée');
      } else {
        await api.categories.create(form);
        toast.success('Catégorie créée');
      }
      onSave();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-sista-dark/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-sista-blush">
          <h3 className="font-display text-xl text-sista-dark">
            {category?.id ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
          </h3>
          <button onClick={onCancel} className="p-1 text-sista-muted hover:text-sista-dark">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-body text-sista-muted mb-1">Nom *</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              required
              className="input-field"
              placeholder="Ex: Bijoux & Accessoires"
            />
          </div>
          <div>
            <label className="block text-sm font-body text-sista-muted mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              className="input-field h-24 resize-none"
              placeholder="Brève description de la catégorie..."
            />
          </div>
          <div>
            <label className="block text-sm font-body text-sista-muted mb-1">URL de l'image</label>
            <input
              type="url"
              value={form.image_url}
              onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
              className="input-field"
              placeholder="https://images.unsplash.com/..."
            />
            {form.image_url && (
              <img src={form.image_url} alt="Preview" className="mt-2 h-32 w-full object-cover bg-sista-blush/20" />
            )}
          </div>
          <div>
            <label className="block text-sm font-body text-sista-muted mb-1">Ordre d'affichage</label>
            <input
              type="number"
              value={form.display_order}
              onChange={e => setForm(f => ({ ...f, display_order: parseInt(e.target.value) || 0 }))}
              className="input-field w-32"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
              <Save size={16} />
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
            <button type="button" onClick={onCancel} className="btn-outline">
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ProductForm({ product, categories, onSave, onCancel }) {
  const [form, setForm] = useState(
    product || {
      name: '', description: '', price: '', compare_price: '',
      image_url: '', category_id: '', stock: 0, featured: false,
    }
  );
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    const data = {
      ...form,
      price: parseFloat(form.price),
      compare_price: form.compare_price ? parseFloat(form.compare_price) : null,
      category_id: form.category_id ? parseInt(form.category_id) : null,
      stock: parseInt(form.stock) || 0,
      featured: form.featured ? 1 : 0,
    };
    try {
      if (product?.id) {
        await api.products.update(product.id, data);
        toast.success('Produit modifié');
      } else {
        await api.products.create(data);
        toast.success('Produit créé');
      }
      onSave();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-sista-dark/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-sista-blush">
          <h3 className="font-display text-xl text-sista-dark">
            {product?.id ? 'Modifier le produit' : 'Nouveau produit'}
          </h3>
          <button onClick={onCancel} className="p-1 text-sista-muted hover:text-sista-dark">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-body text-sista-muted mb-1">Nom *</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              required
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-body text-sista-muted mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              className="input-field h-24 resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-body text-sista-muted mb-1">Prix (FCFA) *</label>
              <input
                type="number"
                value={form.price}
                onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                required
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-body text-sista-muted mb-1">Ancien prix</label>
              <input
                type="number"
                value={form.compare_price || ''}
                onChange={e => setForm(f => ({ ...f, compare_price: e.target.value }))}
                className="input-field"
                placeholder="Optionnel"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-body text-sista-muted mb-1">Catégorie</label>
            <select
              value={form.category_id || ''}
              onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}
              className="input-field"
            >
              <option value="">— Sans catégorie —</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-body text-sista-muted mb-1">URL de l'image</label>
            <input
              type="url"
              value={form.image_url}
              onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
              className="input-field"
              placeholder="https://images.unsplash.com/..."
            />
            {form.image_url && (
              <img src={form.image_url} alt="Preview" className="mt-2 h-32 w-full object-cover bg-sista-blush/20" />
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-body text-sista-muted mb-1">Stock</label>
              <input
                type="number"
                value={form.stock}
                onChange={e => setForm(f => ({ ...f, stock: e.target.value }))}
                className="input-field"
              />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
                  className="w-4 h-4 accent-sista-gold"
                />
                <span className="text-sm font-body text-sista-charcoal">Produit vedette</span>
              </label>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
              <Save size={16} />
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
            <button type="button" onClick={onCancel} className="btn-outline">
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Admin() {
  const [tab, setTab] = useState('dashboard');
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);

  function loadAll() {
    api.categories.list().then(setCategories).catch(console.error);
    api.products.list().then(setProducts).catch(console.error);
    api.orders.list().then(setOrders).catch(console.error);
  }

  useEffect(() => { loadAll(); }, []);

  async function deleteCategory(id) {
    if (!confirm('Supprimer cette catégorie ?')) return;
    try {
      await api.categories.delete(id);
      toast.success('Catégorie supprimée');
      loadAll();
    } catch (err) { toast.error(err.message); }
  }

  async function deleteProduct(id) {
    if (!confirm('Supprimer ce produit ?')) return;
    try {
      await api.products.delete(id);
      toast.success('Produit supprimé');
      loadAll();
    } catch (err) { toast.error(err.message); }
  }

  async function updateOrderStatus(id, status) {
    try {
      await api.orders.updateStatus(id, status);
      toast.success('Statut mis à jour');
      loadAll();
    } catch (err) { toast.error(err.message); }
  }

  const tabs = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'categories', label: 'Catégories', icon: FolderOpen },
    { id: 'products', label: 'Produits', icon: Package },
    { id: 'orders', label: 'Commandes', icon: ShoppingCart },
  ];

  const statusLabels = {
    pending: 'En attente',
    confirmed: 'Confirmée',
    shipped: 'Expédiée',
    delivered: 'Livrée',
    cancelled: 'Annulée',
  };
  const statusColors = {
    pending: 'bg-amber-100 text-amber-800',
    confirmed: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div className="min-h-screen bg-sista-cream">
      {/* Header */}
      <div className="bg-sista-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="font-display text-2xl tracking-[0.2em]">SISTA — Administration</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-8 overflow-x-auto pb-2">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-body whitespace-nowrap transition-colors ${
                tab === t.id
                  ? 'bg-sista-dark text-white'
                  : 'bg-white text-sista-charcoal hover:bg-sista-blush/50'
              }`}
            >
              <t.icon size={16} />
              {t.label}
            </button>
          ))}
        </div>

        {/* Dashboard */}
        {tab === 'dashboard' && (
          <div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard label="Produits" value={products.length} icon={Package} color="text-sista-gold" />
              <StatCard label="Catégories" value={categories.length} icon={FolderOpen} color="text-blue-500" />
              <StatCard label="Commandes" value={orders.length} icon={ShoppingCart} color="text-green-500" />
              <StatCard
                label="Revenus"
                value={formatPrice(orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0))}
                icon={ShoppingCart}
                color="text-sista-rose"
              />
            </div>
            <div className="bg-white border border-sista-blush/50 p-6">
              <h3 className="font-display text-lg text-sista-dark mb-4">Dernières commandes</h3>
              {orders.length === 0 ? (
                <p className="text-sista-muted text-sm">Aucune commande pour le moment</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm font-body">
                    <thead>
                      <tr className="border-b border-sista-blush text-left">
                        <th className="py-2 text-sista-muted font-medium">#</th>
                        <th className="py-2 text-sista-muted font-medium">Client</th>
                        <th className="py-2 text-sista-muted font-medium">Total</th>
                        <th className="py-2 text-sista-muted font-medium">Statut</th>
                        <th className="py-2 text-sista-muted font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map(order => (
                        <tr key={order.id} className="border-b border-sista-blush/30">
                          <td className="py-3">{order.id}</td>
                          <td className="py-3">{order.customer_name}</td>
                          <td className="py-3 text-sista-gold font-medium">{formatPrice(order.total)}</td>
                          <td className="py-3">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[order.status]}`}>
                              {statusLabels[order.status]}
                            </span>
                          </td>
                          <td className="py-3 text-sista-muted">
                            {new Date(order.created_at).toLocaleDateString('fr-FR')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Categories */}
        {tab === 'categories' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl text-sista-dark">
                Catégories ({categories.length})
              </h2>
              <button
                onClick={() => { setEditingCategory(null); setShowCategoryForm(true); }}
                className="btn-primary flex items-center gap-2 text-xs"
              >
                <Plus size={16} />
                Ajouter
              </button>
            </div>
            <div className="grid gap-3">
              {categories.map(cat => (
                <div key={cat.id} className="bg-white border border-sista-blush/50 p-4 flex items-center gap-4">
                  {cat.image_url && (
                    <img src={cat.image_url} alt={cat.name} className="w-16 h-16 object-cover bg-sista-blush/20 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-base text-sista-dark">{cat.name}</h3>
                    <p className="text-xs text-sista-muted truncate">{cat.description}</p>
                    <p className="text-xs text-sista-gold mt-1">{cat.product_count} produit(s)</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => { setEditingCategory(cat); setShowCategoryForm(true); }}
                      className="p-2 text-sista-muted hover:text-sista-gold transition-colors"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => deleteCategory(cat.id)}
                      className="p-2 text-sista-muted hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {showCategoryForm && (
              <CategoryForm
                category={editingCategory}
                categories={categories}
                onSave={() => { setShowCategoryForm(false); loadAll(); }}
                onCancel={() => setShowCategoryForm(false)}
              />
            )}
          </div>
        )}

        {/* Products */}
        {tab === 'products' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl text-sista-dark">
                Produits ({products.length})
              </h2>
              <button
                onClick={() => { setEditingProduct(null); setShowProductForm(true); }}
                className="btn-primary flex items-center gap-2 text-xs"
              >
                <Plus size={16} />
                Ajouter
              </button>
            </div>
            <div className="bg-white border border-sista-blush/50 overflow-x-auto">
              <table className="w-full text-sm font-body">
                <thead>
                  <tr className="border-b border-sista-blush text-left bg-sista-cream/50">
                    <th className="p-3 text-sista-muted font-medium">Image</th>
                    <th className="p-3 text-sista-muted font-medium">Nom</th>
                    <th className="p-3 text-sista-muted font-medium">Catégorie</th>
                    <th className="p-3 text-sista-muted font-medium">Prix</th>
                    <th className="p-3 text-sista-muted font-medium">Stock</th>
                    <th className="p-3 text-sista-muted font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(prod => (
                    <tr key={prod.id} className="border-b border-sista-blush/30 hover:bg-sista-cream/30">
                      <td className="p-3">
                        {prod.image_url && (
                          <img src={prod.image_url} alt="" className="w-12 h-12 object-cover bg-sista-blush/20" />
                        )}
                      </td>
                      <td className="p-3">
                        <span className="text-sista-dark">{prod.name}</span>
                        {prod.featured === 1 && (
                          <span className="ml-2 text-[10px] bg-sista-gold/10 text-sista-gold px-1.5 py-0.5">
                            VEDETTE
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-sista-muted">{prod.category_name || '—'}</td>
                      <td className="p-3 text-sista-gold font-medium whitespace-nowrap">{formatPrice(prod.price)}</td>
                      <td className="p-3">
                        <span className={prod.stock > 0 ? 'text-green-600' : 'text-red-500'}>
                          {prod.stock}
                        </span>
                      </td>
                      <td className="p-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => { setEditingProduct(prod); setShowProductForm(true); }}
                          className="p-1.5 text-sista-muted hover:text-sista-gold transition-colors"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => deleteProduct(prod.id)}
                          className="p-1.5 text-sista-muted hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {showProductForm && (
              <ProductForm
                product={editingProduct}
                categories={categories}
                onSave={() => { setShowProductForm(false); loadAll(); }}
                onCancel={() => setShowProductForm(false)}
              />
            )}
          </div>
        )}

        {/* Orders */}
        {tab === 'orders' && (
          <div>
            <h2 className="font-display text-xl text-sista-dark mb-6">
              Commandes ({orders.length})
            </h2>
            {orders.length === 0 ? (
              <div className="bg-white border border-sista-blush/50 p-12 text-center">
                <ShoppingCart size={48} className="text-sista-blush mx-auto mb-4" />
                <p className="font-display text-lg text-sista-dark">Aucune commande</p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map(order => (
                  <div key={order.id} className="bg-white border border-sista-blush/50 p-4 sm:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-display text-base text-sista-dark">
                            Commande #{order.id}
                          </h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[order.status]}`}>
                            {statusLabels[order.status]}
                          </span>
                        </div>
                        <p className="text-sm text-sista-muted">
                          {order.customer_name} • {order.customer_phone}
                        </p>
                        <p className="text-xs text-sista-muted">
                          {order.address}{order.city ? `, ${order.city}` : ''}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-display text-lg text-sista-gold">{formatPrice(order.total)}</p>
                        <p className="text-xs text-sista-muted">
                          {new Date(order.created_at).toLocaleDateString('fr-FR', {
                            day: 'numeric', month: 'long', year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-3 border-t border-sista-blush/30">
                      {['confirmed', 'shipped', 'delivered', 'cancelled'].map(status => (
                        <button
                          key={status}
                          onClick={() => updateOrderStatus(order.id, status)}
                          disabled={order.status === status}
                          className={`text-xs px-3 py-1.5 border transition-colors disabled:opacity-30 ${
                            order.status === status
                              ? 'border-sista-gold text-sista-gold'
                              : 'border-sista-blush text-sista-muted hover:border-sista-gold hover:text-sista-gold'
                          }`}
                        >
                          {statusLabels[status]}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
