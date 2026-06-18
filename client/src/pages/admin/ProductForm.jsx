import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Save, ArrowLeft, Upload, X, Loader2 } from 'lucide-react';
import api from '../../utils/axios';
import { useToast } from '../../components/ui/Toast';

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const addToast = useToast();
  const isEdit = Boolean(id);
  const [form, setForm] = useState({ name: '', description: '', price: '', category: 'Mobiles', stock: '', image: '' });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [dragOver, setDragOver] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (isEdit) {
      api.get(`/products/${id}`)
        .then(({ data }) => setForm({
          name: data.name || '',
          description: data.description || '',
          price: data.price?.toString() || '',
          category: data.category || 'Mobiles',
          stock: data.stock?.toString() || '',
          image: data.image || '',
        }))
        .catch(() => addToast('Failed to load product', 'error'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price || !form.stock) { addToast('Please fill required fields', 'error'); return; }
    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
      if (isEdit) {
        await api.put(`/products/${id}`, payload);
        addToast('Product updated', 'success');
      } else {
        await api.post('/products', payload);
        addToast('Product created', 'success');
      }
      navigate('/admin/products');
    } catch (err) {
      addToast(err?.response?.data?.message || 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const uploadFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setUploadingImage(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const { data } = await api.post('/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setForm({ ...form, image: data.image });
      addToast('Image uploaded', 'success');
    } catch (err) {
      addToast(err?.response?.data?.message || 'Upload failed', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageSelect = (e) => {
    uploadFile(e.target.files?.[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    uploadFile(e.dataTransfer.files?.[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const categories = ['Mobiles', 'Laptops', 'Electronics', 'Accessories', 'Fashion', 'Home & Living', 'Gaming'];

  if (loading) return <div className="text-center py-20"><p className="text-[var(--color-text-secondary)]">Loading...</p></div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl"
    >
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/admin/products')} className="btn-ghost p-2">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold">{isEdit ? 'Edit Product' : 'New Product'}</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">{isEdit ? 'Update product details' : 'Add a new product'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 md:p-8 space-y-6">
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium mb-1.5">Name *</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="Product name" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Category *</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field">
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Price *</label>
            <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-field" placeholder="0" step="0.01" min="0" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Stock *</label>
            <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="input-field" placeholder="0" min="0" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Description</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field min-h-[100px] resize-y" placeholder="Product description" rows={4} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Image</label>
          {form.image ? (
            <div className="relative inline-block">
              <div className="w-40 h-40 rounded-2xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)]">
                <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
              </div>
              <button
                type="button"
                onClick={() => setForm({ ...form, image: '' })}
                className="absolute -top-2 -right-2 bg-[var(--color-text-secondary)] text-white rounded-full p-1 hover:bg-[var(--color-text)] transition-colors shadow-md"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => document.getElementById('image-upload-input')?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                dragOver
                  ? 'border-[var(--color-accent)] bg-[var(--glass-bg)]'
                  : 'border-[var(--color-border)] hover:border-[var(--color-accent)] hover:bg-[var(--glass-bg)]'
              }`}
            >
              <input
                id="image-upload-input"
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              {uploadingImage ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-[var(--color-accent)]" />
                  <p className="text-sm text-[var(--color-text-secondary)]">Uploading...</p>
                </div>
              ) : (
                <>
                  <Upload className="w-8 h-8 mx-auto mb-2 text-[var(--color-text-secondary)]" />
                  <p className="text-sm text-[var(--color-text-secondary)]">Drop an image here or click to browse</p>
                </>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" className="btn-liquid" disabled={saving}>
            {saving ? <span className="spinner" /> : <><Save className="w-4 h-4" /> {isEdit ? 'Update' : 'Create'}</>}
          </button>
          <button type="button" onClick={() => navigate('/admin/products')} className="btn-glass">Cancel</button>
        </div>
      </form>
    </motion.div>
  );
}
