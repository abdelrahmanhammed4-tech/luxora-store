import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAdmin } from '../../context/AdminContext';
import { Plus, Edit2, Trash2, Search, X, Image as ImageIcon, Upload, Sparkles, Check, EyeOff, Eye } from 'lucide-react';
import { Product } from '../../types';

export const AdminProducts: React.FC = () => {
  const { t, language } = useApp();
  const { products, addProduct, editProduct, deleteProduct, isLoading } = useAdmin();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'watches' | 'perfumes'>('all');
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<Product | null>(null);

  // Form states
  const [nameEn, setNameEn] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [category, setCategory] = useState<'watches' | 'perfumes'>('watches');
  const [image, setImage] = useState('');
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState<'active' | 'hidden'>('active');

  const [newImageInput, setNewImageInput] = useState('');

  const filtered = products.filter(p => {
    const matchesSearch = p.nameEn.toLowerCase().includes(search.toLowerCase()) || p.nameAr.includes(search);
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addProduct({
        nameEn,
        nameAr,
        descriptionEn: descriptionEn || 'Premium luxury collection piece.',
        descriptionAr: descriptionAr || 'قطعة حصرية من المجموعة الفاخرة.',
        category,
        price,
        stock,
        image: image || 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=600&auto=format&fit=crop',
        images: additionalImages,
        specsEn: {},
        specsAr: {},
        featured,
        status,
        rating: 5,
        reviewsCount: 0
      });
      setIsAdding(false);
      resetForm();
    } catch (err) {
      alert("Failed to add product: " + err);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditing) return;
    try {
      await editProduct(isEditing.id, {
        nameEn,
        nameAr,
        descriptionEn,
        descriptionAr,
        price,
        stock,
        category,
        image,
        images: additionalImages,
        featured,
        status
      });
      setIsEditing(null);
      resetForm();
    } catch (err) {
      alert("Failed to edit product: " + err);
    }
  };

  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      await deleteProduct(productToDelete.id);
      setSuccessMsg("Product deleted successfully.");
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      console.error("Failed to delete product:", err);
      const msg = err?.message || String(err);
      setErrorMsg(`Failed to delete product: ${msg}`);
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  const handleDelete = (product: Product) => {
    setSuccessMsg(null);
    setErrorMsg(null);
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const resetForm = () => {
    setNameEn('');
    setNameAr('');
    setDescriptionEn('');
    setDescriptionAr('');
    setPrice(0);
    setStock(0);
    setCategory('watches');
    setImage('');
    setAdditionalImages([]);
    setFeatured(false);
    setStatus('active');
    setNewImageInput('');
  };

  const startEdit = (p: Product) => {
    setIsEditing(p);
    setNameEn(p.nameEn);
    setNameAr(p.nameAr);
    setDescriptionEn(p.descriptionEn || '');
    setDescriptionAr(p.descriptionAr || '');
    setPrice(p.price);
    setStock(p.stock);
    setCategory(p.category as 'watches' | 'perfumes');
    setImage(p.image);
    setAdditionalImages(p.images || []);
    setFeatured(p.featured || false);
    setStatus(p.status || 'active');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isPrimary: boolean) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: any) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          if (isPrimary) {
            setImage(reader.result);
          } else {
            setAdditionalImages(prev => [...prev, reader.result as string]);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeAdditionalImage = (indexToRemove: number) => {
    setAdditionalImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const addImageFromUrl = () => {
    if (newImageInput.trim()) {
      setAdditionalImages(prev => [...prev, newImageInput.trim()]);
      setNewImageInput('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-serif text-charcoal-900 dark:text-white">{t.manageProducts}</h2>
          <p className="text-xs text-charcoal-500 dark:text-gold-400/60 mt-1">Add, modify, or retire items from the vault.</p>
        </div>
        <button 
          onClick={() => { setIsAdding(true); resetForm(); }}
          className="flex items-center gap-2 px-5 py-3 bg-gold-luxe hover:bg-gold-500 text-charcoal-950 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Success Banner */}
      {successMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs rounded-xl font-medium tracking-wide flex items-center justify-between transition-all">
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-500" />
            {successMsg}
          </span>
          <button onClick={() => setSuccessMsg(null)} className="p-1 hover:opacity-80 transition-opacity">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Error Banner */}
      {errorMsg && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs rounded-xl font-medium tracking-wide flex items-center justify-between transition-all">
          <span className="flex items-center gap-2">
            <X className="w-4 h-4 text-rose-500" />
            {errorMsg}
          </span>
          <button onClick={() => setErrorMsg(null)} className="p-1 hover:opacity-80 transition-opacity">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-charcoal-900 p-4 rounded-2xl border border-charcoal-200 dark:border-gold-900/10">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400" />
          <input 
            type="text"
            placeholder={t.searchProducts}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-charcoal-50 dark:bg-charcoal-950 border border-charcoal-200 dark:border-gold-900/10 focus:outline-none focus:border-gold-luxe transition-all dark:text-white"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
          {(['all', 'watches', 'perfumes'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-[11px] uppercase tracking-wider border transition-all ${
                selectedCategory === cat 
                  ? 'bg-gold-luxe text-charcoal-950 border-gold-luxe font-medium'
                  : 'border-charcoal-200 dark:border-gold-900/10 text-charcoal-600 dark:text-gold-400/60 hover:border-gold-luxe/40'
              }`}
            >
              {cat === 'all' ? 'All Items' : cat === 'watches' ? t.watchesCategory : t.perfumesCategory}
            </button>
          ))}
        </div>
      </div>

      {/* Add / Edit Modal Overlay */}
      {(isAdding || isEditing) && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-charcoal-900 border border-charcoal-200 dark:border-gold-900/15 p-8 rounded-3xl w-full max-w-2xl shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-charcoal-100 dark:border-gold-900/10">
              <h3 className="text-xl font-serif text-charcoal-900 dark:text-white">
                {isAdding ? 'Add Heritage Piece' : 'Refine Heritage Piece'}
              </h3>
              <button onClick={() => { setIsAdding(false); setIsEditing(null); }} className="p-1 hover:text-rose-500 transition-colors dark:text-gold-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={isAdding ? handleAdd : handleEdit} className="space-y-6">
              
              {/* Product Basic Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider text-charcoal-500 dark:text-gold-400/60 mb-1">Name (EN)</label>
                  <input type="text" value={nameEn} onChange={e => setNameEn(e.target.value)} required className="w-full p-2.5 text-xs rounded-lg border border-charcoal-200 dark:border-gold-900/15 dark:bg-charcoal-950 dark:text-white" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider text-charcoal-500 dark:text-gold-400/60 mb-1">الاسم (AR)</label>
                  <input type="text" value={nameAr} onChange={e => setNameAr(e.target.value)} required className="w-full p-2.5 text-xs rounded-lg border border-charcoal-200 dark:border-gold-900/15 dark:bg-charcoal-950 dark:text-white text-right" />
                </div>
              </div>

              {/* Descriptions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider text-charcoal-500 dark:text-gold-400/60 mb-1">Description (EN)</label>
                  <textarea rows={3} value={descriptionEn} onChange={e => setDescriptionEn(e.target.value)} className="w-full p-2.5 text-xs rounded-lg border border-charcoal-200 dark:border-gold-900/15 dark:bg-charcoal-950 dark:text-white resize-none" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider text-charcoal-500 dark:text-gold-400/60 mb-1">الوصف (AR)</label>
                  <textarea rows={3} value={descriptionAr} onChange={e => setDescriptionAr(e.target.value)} className="w-full p-2.5 text-xs rounded-lg border border-charcoal-200 dark:border-gold-900/15 dark:bg-charcoal-950 dark:text-white text-right resize-none" />
                </div>
              </div>

              {/* Price, Stock, Category */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider text-charcoal-500 dark:text-gold-400/60 mb-1">Price ($)</label>
                  <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} required className="w-full p-2.5 text-xs rounded-lg border border-charcoal-200 dark:border-gold-900/15 dark:bg-charcoal-950 dark:text-white" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider text-charcoal-500 dark:text-gold-400/60 mb-1">Stock</label>
                  <input type="number" value={stock} onChange={e => setStock(Number(e.target.value))} required className="w-full p-2.5 text-xs rounded-lg border border-charcoal-200 dark:border-gold-900/15 dark:bg-charcoal-950 dark:text-white" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider text-charcoal-500 dark:text-gold-400/60 mb-1">Category</label>
                  <select value={category} onChange={e => setCategory(e.target.value as 'watches' | 'perfumes')} className="w-full p-2.5 text-xs rounded-lg border border-charcoal-200 dark:border-gold-900/15 dark:bg-charcoal-950 dark:text-white">
                    <option value="watches">Luxury Watch</option>
                    <option value="perfumes">Premium Perfume</option>
                  </select>
                </div>
              </div>

              {/* Primary Image */}
              <div className="space-y-2">
                <label className="block text-[10px] uppercase font-mono tracking-wider text-charcoal-500 dark:text-gold-400/60">Primary Image</label>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="w-20 h-20 bg-charcoal-50 dark:bg-charcoal-950 rounded-xl overflow-hidden border border-charcoal-200 dark:border-gold-900/15 flex-shrink-0 flex items-center justify-center">
                    {image ? (
                      <img src={image} alt="Primary Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-charcoal-400 dark:text-gold-400/40" />
                    )}
                  </div>
                  <div className="flex-1 space-y-2 w-full">
                    <input 
                      type="text" 
                      value={image} 
                      onChange={e => setImage(e.target.value)} 
                      placeholder="Paste main image URL..." 
                      className="w-full p-2.5 text-xs rounded-lg border border-charcoal-200 dark:border-gold-900/15 dark:bg-charcoal-950 dark:text-white" 
                    />
                    <div className="relative">
                      <label className="flex items-center gap-2 justify-center py-2.5 px-4 rounded-lg border border-dashed border-gold-luxe/30 hover:border-gold-luxe bg-gold-luxe/5 hover:bg-gold-luxe/10 text-gold-luxe text-xs cursor-pointer transition-all">
                        <Upload className="w-4 h-4" />
                        <span>Or upload file (PNG, JPG)</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => handleImageUpload(e, true)} 
                          className="hidden" 
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Multiple Images Upload & Gallery */}
              <div className="space-y-2 pt-2 border-t border-charcoal-100 dark:border-gold-900/10">
                <label className="block text-[10px] uppercase font-mono tracking-wider text-charcoal-500 dark:text-gold-400/60">Additional Images (Gallery)</label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                  {additionalImages.map((imgUrl, index) => (
                    <div key={index} className="relative group w-16 h-16 bg-charcoal-50 dark:bg-charcoal-950 rounded-lg overflow-hidden border border-charcoal-200 dark:border-gold-900/15 flex-shrink-0">
                      <img src={imgUrl} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => removeAdditionalImage(index)}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-rose-500 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <label className="flex flex-col items-center justify-center w-16 h-16 rounded-lg border border-dashed border-charcoal-300 dark:border-gold-900/20 hover:border-gold-luxe/50 cursor-pointer text-charcoal-400 hover:text-gold-luxe transition-colors bg-charcoal-50/50 dark:bg-charcoal-950">
                    <Upload className="w-4 h-4" />
                    <span className="text-[8px] mt-1">Upload</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      multiple 
                      onChange={(e) => handleImageUpload(e, false)} 
                      className="hidden" 
                    />
                  </label>
                </div>
                <div className="flex gap-2 mt-2">
                  <input 
                    type="text" 
                    value={newImageInput}
                    onChange={e => setNewImageInput(e.target.value)}
                    placeholder="Or paste additional image URL..." 
                    className="flex-1 p-2.5 text-xs rounded-lg border border-charcoal-200 dark:border-gold-900/15 dark:bg-charcoal-950 dark:text-white" 
                  />
                  <button 
                    type="button"
                    onClick={addImageFromUrl}
                    className="px-4 py-2 bg-charcoal-900 dark:bg-gold-luxe/10 hover:bg-gold-luxe/20 text-white dark:text-gold-luxe text-xs rounded-lg border border-charcoal-700 dark:border-gold-luxe/20 transition-all font-medium"
                  >
                    Add URL
                  </button>
                </div>
              </div>

              {/* Status and Visibility Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-charcoal-100 dark:border-gold-900/10">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-charcoal-50 dark:bg-charcoal-950 border border-charcoal-100 dark:border-gold-900/10">
                  <input 
                    type="checkbox" 
                    id="featured" 
                    checked={featured} 
                    onChange={e => setFeatured(e.target.checked)} 
                    className="w-4 h-4 rounded border-charcoal-300 dark:border-gold-900/30 text-gold-luxe focus:ring-gold-luxe bg-transparent cursor-pointer"
                  />
                  <label htmlFor="featured" className="text-xs font-serif text-charcoal-900 dark:text-white cursor-pointer select-none">
                    ⭐ Mark as Featured Collection
                  </label>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-charcoal-50 dark:bg-charcoal-950 border border-charcoal-100 dark:border-gold-900/10">
                  <div className="flex items-center gap-1.5">
                    {status === 'active' ? (
                      <Eye className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-rose-500" />
                    )}
                  </div>
                  <div className="flex-1 flex justify-between items-center">
                    <span className="text-xs font-serif text-charcoal-900 dark:text-white select-none">Visibility Status</span>
                    <select 
                      value={status} 
                      onChange={e => setStatus(e.target.value as 'active' | 'hidden')}
                      className="p-1.5 text-xs rounded border border-charcoal-200 dark:border-gold-900/15 dark:bg-charcoal-900 dark:text-white"
                    >
                      <option value="active">Active (Visible)</option>
                      <option value="hidden">Hidden</option>
                    </select>
                  </div>
                </div>
              </div>

              <button type="submit" className="w-full py-4 bg-gold-luxe hover:bg-gold-500 text-charcoal-950 rounded-xl text-xs font-semibold uppercase tracking-widest transition-colors mt-6">
                Save Product
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && productToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-charcoal-900 border border-charcoal-200 dark:border-gold-900/15 p-6 rounded-3xl w-full max-w-sm shadow-2xl space-y-6">
            <div className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 mb-4">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif text-charcoal-900 dark:text-white">Delete Product</h3>
              <p className="text-xs text-charcoal-500 dark:text-gold-400/60">
                Are you sure you want to permanently delete <strong className="text-charcoal-900 dark:text-white">{productToDelete.nameEn}</strong>? 
                This action cannot be undone.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => { setIsDeleteModalOpen(false); setProductToDelete(null); }}
                className="flex-1 py-3 bg-charcoal-100 dark:bg-charcoal-800 hover:bg-charcoal-200 dark:hover:bg-charcoal-700 text-charcoal-900 dark:text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products Table/Grid */}
      <div className="bg-white dark:bg-charcoal-900 rounded-2xl border border-charcoal-200 dark:border-gold-900/10 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-12 text-center text-xs font-mono tracking-widest text-charcoal-400">
              SYNCHRONIZING LUXURY VAULT...
            </div>
          ) : (
            <table className="w-full text-left rtl:text-right">
              <thead className="bg-charcoal-50 dark:bg-charcoal-950 border-b border-charcoal-100 dark:border-gold-900/10 text-[10px] uppercase tracking-wider text-charcoal-500 dark:text-gold-400/60 font-mono">
                <tr>
                  <th className="py-4 px-6">Product</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Price</th>
                  <th className="py-4 px-6">Stock</th>
                  <th className="py-4 px-6">Featured</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right rtl:text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-100 dark:divide-gold-900/10 text-xs text-charcoal-700 dark:text-white">
                {filtered.map(product => (
                  <tr key={product.id} className="hover:bg-charcoal-50/50 dark:hover:bg-charcoal-800/20 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-charcoal-100 dark:bg-charcoal-950 border border-charcoal-200 dark:border-gold-900/10 flex-shrink-0">
                          <img src={product.image} alt={product.nameEn} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-serif font-medium text-charcoal-900 dark:text-white">{language === 'en' ? product.nameEn : product.nameAr}</p>
                          <p className="text-[10px] text-charcoal-600 dark:text-gold-400/40 font-mono uppercase">{product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 uppercase tracking-wider text-[10px] font-mono text-charcoal-600 dark:text-gold-400/40">{product.category}</td>
                    <td className="py-4 px-6 font-semibold text-charcoal-900 dark:text-white">${(product.price ?? 0).toLocaleString()}</td>
                    <td className="py-4 px-6 font-mono text-charcoal-600 dark:text-gold-400/40">
                      <span className={`${product.stock < 10 ? 'text-rose-500 font-bold' : ''}`}>
                        {product.stock} units
                      </span>
                    </td>
                    <td className="py-4 px-6 font-mono">
                      {product.featured ? (
                        <span className="px-2.5 py-1 rounded-full text-[9px] uppercase tracking-wider bg-gold-luxe/10 text-gold-luxe border border-gold-luxe/20">
                          ⭐ Featured
                        </span>
                      ) : (
                        <span className="text-charcoal-400 dark:text-gold-400/20">-</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      {product.status === 'hidden' ? (
                        <span className="px-2.5 py-1 rounded-full text-[9px] uppercase font-mono tracking-wider bg-rose-400/10 text-rose-500 border border-rose-500/20">
                          Hidden
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[9px] uppercase font-mono tracking-wider bg-emerald-400/10 text-emerald-500 border border-emerald-500/20">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right rtl:text-left">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => startEdit(product)} className="p-2 hover:bg-charcoal-100 dark:hover:bg-charcoal-800 rounded-lg text-charcoal-500 hover:text-gold-luxe transition-colors" title="Edit">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(product)} className="p-2 hover:bg-charcoal-100 dark:hover:bg-charcoal-800 rounded-lg text-charcoal-500 hover:text-rose-500 transition-colors" title="Delete">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
