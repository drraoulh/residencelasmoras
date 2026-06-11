import { useMemo, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import {
  Eye,
  EyeOff,
  ImagePlus,
  Link2,
  Pencil,
  Search,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import { galleryCategories } from '../../data/galleryImages';
import { useGallery } from '../../hooks/useGallery';
import type { GalleryCategory, GalleryImage } from '../../types';
import { uploadGalleryImage } from '../../utils/galleryStorage';

const emptyForm = {
  label: '',
  category: 'Résidence' as GalleryCategory,
  image_url: '',
  storage_path: '' as string | null,
  visible: true,
  newImageUrl: '',
};

export default function ManageGallery() {
  const {
    galleryImages,
    fromDatabase,
    isLoading,
    addGalleryImage,
    updateGalleryImage,
    deleteGalleryImage,
  } = useGallery({ includeHidden: true });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'Tous' | GalleryCategory>('Tous');
  const [uploadError, setUploadError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const filteredImages = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return galleryImages.filter((image) => {
      const matchesSearch =
        !normalizedQuery ||
        image.label.toLowerCase().includes(normalizedQuery) ||
        image.category.toLowerCase().includes(normalizedQuery);
      const matchesCategory = categoryFilter === 'Tous' || image.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [galleryImages, query, categoryFilter]);

  const openCreateModal = () => {
    setEditingImage(null);
    setForm(emptyForm);
    setUploadError('');
    setIsModalOpen(true);
  };

  const openEditModal = (image: GalleryImage) => {
    if (!fromDatabase || image.id.startsWith('default-')) return;

    setEditingImage(image);
    setForm({
      label: image.label,
      category: image.category,
      image_url: image.image_url,
      storage_path: image.storage_path ?? null,
      visible: image.visible !== false,
      newImageUrl: '',
    });
    setUploadError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingImage(null);
    setForm(emptyForm);
    setUploadError('');
  };

  const applyImageUrl = () => {
    const url = form.newImageUrl.trim();
    if (!url) return;
    setForm((current) => ({
      ...current,
      image_url: url,
      storage_path: null,
      newImageUrl: '',
    }));
  };

  const handleFiles = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;

    setIsUploading(true);
    setUploadError('');

    try {
      const uploaded = await uploadGalleryImage(file);
      setForm((current) => ({
        ...current,
        image_url: uploaded.image_url,
        storage_path: uploaded.storage_path,
      }));
    } catch {
      setUploadError('Upload impossible. Vérifiez que le bucket « gallery » existe dans Supabase.');
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.image_url.trim()) {
      setUploadError('Ajoutez une image (upload ou URL).');
      return;
    }

    setUploadError('');

    try {
      if (editingImage) {
        await updateGalleryImage.mutateAsync({
          id: editingImage.id,
          updates: {
            label: form.label.trim(),
            category: form.category,
            image_url: form.image_url,
            storage_path: form.storage_path,
            visible: form.visible,
          },
        });
      } else {
        await addGalleryImage.mutateAsync({
          label: form.label.trim(),
          category: form.category,
          image_url: form.image_url,
          storage_path: form.storage_path,
          sort_order: galleryImages.length + 1,
          visible: form.visible,
        });
      }
      closeModal();
    } catch {
      setUploadError('Enregistrement impossible. Exécutez supabase-gallery.sql si ce n\'est pas déjà fait.');
    }
  };

  const handleDelete = async (image: GalleryImage) => {
    if (!fromDatabase || image.id.startsWith('default-')) return;
    if (!window.confirm(`Supprimer « ${image.label} » de la galerie ?`)) return;

    try {
      await deleteGalleryImage.mutateAsync({ id: image.id, storage_path: image.storage_path });
    } catch {
      window.alert('Suppression impossible pour le moment.');
    }
  };

  const toggleVisible = (image: GalleryImage) => {
    if (!fromDatabase || image.id.startsWith('default-')) return;

    updateGalleryImage.mutate({
      id: image.id,
      updates: { visible: !(image.visible !== false) },
    });
  };

  return (
    <div className="mx-auto max-w-7xl">
      <AdminPageHeader
        title="Galerie photos"
        description="Ajoutez, masquez ou supprimez les images affichées sur la page Galerie du site."
        actions={
          <button type="button" onClick={openCreateModal} className="admin-btn-primary">
            <ImagePlus className="h-4 w-4" />
            Ajouter une photo
          </button>
        }
      />

      {!fromDatabase && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Exécutez le script <code className="rounded bg-white/80 px-1.5 py-0.5">supabase-gallery.sql</code>{' '}
          dans Supabase pour activer la galerie dynamique. Les images par défaut sont affichées en attendant.
        </div>
      )}

      <div className="admin-card mb-6 grid gap-4 p-4 md:grid-cols-[1fr_200px]">
        <label className="relative block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Rechercher par titre ou catégorie"
            className="h-11 w-full rounded-lg bg-gray-50 pl-10 pr-4 text-sm font-medium outline-none ring-1 ring-gray-200 focus:bg-white focus:ring-2 focus:ring-brand-red"
          />
        </label>
        <select
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value as typeof categoryFilter)}
          className="h-11 rounded-lg bg-gray-50 px-3 text-sm font-bold text-gray-700 outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-brand-red"
        >
          <option value="Tous">Toutes les catégories</option>
          {galleryCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="admin-card flex items-center justify-center p-12 text-sm text-brand-muted">
          Chargement de la galerie…
        </div>
      ) : filteredImages.length === 0 ? (
        <div className="admin-card flex flex-col items-center justify-center gap-3 p-12 text-center">
          <ImagePlus className="h-8 w-8 text-brand-muted" />
          <p className="text-sm text-brand-muted">Aucune photo dans la galerie.</p>
          <button type="button" onClick={openCreateModal} className="admin-btn-primary">
            Ajouter la première photo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredImages.map((image) => {
            const isDefault = image.id.startsWith('default-');
            const canManage = fromDatabase && !isDefault;

            return (
              <article key={image.id} className="admin-card overflow-hidden">
                <div className="relative aspect-[4/3] bg-brand-gray">
                  <img src={image.image_url} alt={image.label} className="h-full w-full object-cover" />
                  {image.visible === false && (
                    <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-white">
                      Masquée
                    </span>
                  )}
                  {isDefault && (
                    <span className="absolute right-3 top-3 rounded-full bg-amber-500/90 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-white">
                      Démo
                    </span>
                  )}
                </div>
                <div className="space-y-3 p-4">
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-widest text-brand-red">
                      {image.category}
                    </p>
                    <h2 className="mt-1 text-sm font-semibold text-brand-dark">{image.label}</h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {canManage && (
                      <>
                        <button
                          type="button"
                          onClick={() => openEditModal(image)}
                          className="admin-btn-secondary px-3 py-2 text-xs"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Modifier
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleVisible(image)}
                          className="admin-btn-secondary px-3 py-2 text-xs"
                        >
                          {image.visible === false ? (
                            <>
                              <Eye className="h-3.5 w-3.5" />
                              Afficher
                            </>
                          ) : (
                            <>
                              <EyeOff className="h-3.5 w-3.5" />
                              Masquer
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(image)}
                          className="admin-btn-secondary border-red-100 bg-red-50 px-3 py-2 text-xs text-brand-red hover:bg-red-100"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Supprimer
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-100 px-5 py-4">
              <h2 className="text-lg font-semibold text-brand-dark">
                {editingImage ? 'Modifier la photo' : 'Ajouter une photo'}
              </h2>
              <button type="button" onClick={closeModal} className="rounded-lg p-2 hover:bg-brand-gray">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-5">
              <label className="grid gap-2 text-sm font-medium text-gray-700">
                Titre
                <input
                  value={form.label}
                  onChange={(event) => setForm({ ...form, label: event.target.value })}
                  className="h-11 rounded-lg bg-gray-50 px-4 outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-brand-red"
                  placeholder="Ex. Salon lumineux"
                  required
                />
              </label>

              <label className="grid gap-2 text-sm font-medium text-gray-700">
                Catégorie
                <select
                  value={form.category}
                  onChange={(event) =>
                    setForm({ ...form, category: event.target.value as GalleryCategory })
                  }
                  className="h-11 rounded-lg bg-gray-50 px-3 outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-brand-red"
                >
                  {galleryCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>

              <div className="space-y-3 rounded-xl border border-dashed border-stone-200 bg-brand-gray/60 p-4">
                <p className="text-sm font-medium text-brand-dark">Image</p>

                {form.image_url ? (
                  <div className="relative overflow-hidden rounded-xl">
                    <img src={form.image_url} alt="Aperçu" className="h-40 w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, image_url: '', storage_path: null })}
                      className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-6 text-center transition hover:border-brand-red/40">
                    <Upload className="h-6 w-6 text-brand-red" />
                    <span className="text-sm font-medium text-brand-dark">
                      {isUploading ? 'Upload en cours…' : 'Choisir une image (max 5 Mo)'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFiles}
                      disabled={isUploading}
                    />
                  </label>
                )}

                <div className="flex gap-2">
                  <input
                    value={form.newImageUrl}
                    onChange={(event) => setForm({ ...form, newImageUrl: event.target.value })}
                    placeholder="Ou coller une URL d'image"
                    className="h-10 min-w-0 flex-1 rounded-lg bg-white px-3 text-sm outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-brand-red"
                  />
                  <button type="button" onClick={applyImageUrl} className="admin-btn-secondary shrink-0 px-3">
                    <Link2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={form.visible}
                  onChange={(event) => setForm({ ...form, visible: event.target.checked })}
                  className="rounded border-gray-300 text-brand-red focus:ring-brand-red"
                />
                Visible sur le site public
              </label>

              {uploadError && (
                <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-brand-red">
                  {uploadError}
                </p>
              )}

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={closeModal} className="admin-btn-secondary flex-1">
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={addGalleryImage.isPending || updateGalleryImage.isPending || isUploading}
                  className="admin-btn-primary flex-1 disabled:opacity-60"
                >
                  {editingImage ? 'Enregistrer' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
