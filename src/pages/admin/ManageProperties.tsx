import { useMemo, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import {
  Copy,
  Edit,
  Eye,
  ImagePlus,
  Link2,
  Plus,
  Search,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import type { Logement, LogementStatus } from '../../types';
import { useLogements } from '../../hooks/useLogements';

const emptyForm = {
  nom: '',
  type: 'Studio',
  prix: '',
  statut: 'disponible' as LogementStatus,
  description: '',
  photos: [] as string[],
  newPhotoUrl: '',
};

function statusClasses(status: LogementStatus) {
  if (status === 'disponible') return 'bg-green-50 text-green-700 ring-green-100';
  if (status === 'occupe') return 'bg-red-50 text-red-700 ring-red-100';
  return 'bg-orange-50 text-orange-700 ring-orange-100';
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ManageProperties() {
  const { logements, addLogement, updateLogement, deleteLogement } = useLogements();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLogement, setEditingLogement] = useState<Logement | null>(null);
  const [previewLogement, setPreviewLogement] = useState<Logement | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'tous' | LogementStatus>('tous');
  const [typeFilter, setTypeFilter] = useState('Tous');
  const [sortBy, setSortBy] = useState<'recent' | 'prix-asc' | 'prix-desc' | 'nom'>('recent');

  const types = useMemo(
    () => Array.from(new Set(logements.map((logement) => logement.type))).sort(),
    [logements],
  );

  const filteredLogements = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return logements
      .filter((logement) => {
        const matchesSearch =
          !normalizedQuery ||
          logement.nom.toLowerCase().includes(normalizedQuery) ||
          logement.description.toLowerCase().includes(normalizedQuery);
        const matchesStatus = statusFilter === 'tous' || logement.statut === statusFilter;
        const matchesType = typeFilter === 'Tous' || logement.type === typeFilter;

        return matchesSearch && matchesStatus && matchesType;
      })
      .sort((a, b) => {
        if (sortBy === 'prix-asc') return a.prix - b.prix;
        if (sortBy === 'prix-desc') return b.prix - a.prix;
        if (sortBy === 'nom') return a.nom.localeCompare(b.nom);
        return new Date(b.created_at ?? '').getTime() - new Date(a.created_at ?? '').getTime();
      });
  }, [logements, query, sortBy, statusFilter, typeFilter]);

  const openCreateModal = () => {
    setEditingLogement(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (logement: Logement) => {
    setEditingLogement(logement);
    setForm({
      nom: logement.nom,
      type: logement.type,
      prix: String(logement.prix),
      statut: logement.statut,
      description: logement.description,
      photos: logement.photos,
      newPhotoUrl: '',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingLogement(null);
    setForm(emptyForm);
  };

  const addPhotoUrl = () => {
    const url = form.newPhotoUrl.trim();
    if (!url) return;
    setForm((current) => ({
      ...current,
      photos: [...current.photos, url],
      newPhotoUrl: '',
    }));
  };

  const handleFiles = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []).filter((file) =>
      file.type.startsWith('image/'),
    );
    if (files.length === 0) return;

    const dataUrls = await Promise.all(files.map(readFileAsDataUrl));
    setForm((current) => ({
      ...current,
      photos: [...current.photos, ...dataUrls],
    }));
    event.target.value = '';
  };

  const removePhoto = (indexToRemove: number) => {
    setForm((current) => ({
      ...current,
      photos: current.photos.filter((_, index) => index !== indexToRemove),
    }));
  };

  const duplicateLogement = (logement: Logement) => {
    addLogement.mutate({
      nom: `${logement.nom} - copie`,
      type: logement.type,
      prix: logement.prix,
      statut: 'maintenance',
      description: logement.description,
      photos: logement.photos,
      surface: logement.surface,
      equipements: logement.equipements,
    });
  };

  const updateStatus = (logement: Logement, statut: LogementStatus) => {
    updateLogement.mutate({ id: logement.id, updates: { statut } });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const draft = {
      nom: form.nom.trim(),
      type: form.type,
      prix: Number(form.prix),
      statut: form.statut,
      description: form.description.trim(),
      photos: form.photos,
      surface: editingLogement?.surface,
      equipements: editingLogement?.equipements ?? ['Climatisation', 'Wi-Fi', 'Parking'],
    };

    if (editingLogement) updateLogement.mutate({ id: editingLogement.id, updates: draft });
    else addLogement.mutate(draft);

    closeModal();
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-brand-dark">
            Gestion des logements
          </h1>
          <p className="mt-2 text-sm font-medium text-gray-500">
            Ajoutez les logements, leurs statuts et leurs galeries photos.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-red px-5 py-3 font-bold text-white shadow-sm transition hover:bg-red-700 active:scale-95"
        >
          <Plus className="h-5 w-5" />
          Ajouter un logement
        </button>
      </div>

      <div className="mb-6 grid gap-4 rounded-lg border border-gray-100 bg-white p-4 shadow-sm lg:grid-cols-[1fr_170px_170px_170px]">
        <label className="relative block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Rechercher par nom ou description"
            className="h-11 w-full rounded-lg bg-gray-50 pl-10 pr-4 text-sm font-medium outline-none ring-1 ring-gray-200 focus:bg-white focus:ring-2 focus:ring-brand-red"
          />
        </label>
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as 'tous' | LogementStatus)}
          className="h-11 rounded-lg bg-gray-50 px-3 text-sm font-bold text-gray-700 outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-brand-red"
        >
          <option value="tous">Tous les statuts</option>
          <option value="disponible">Disponible</option>
          <option value="occupe">Occupe</option>
          <option value="maintenance">En maintenance</option>
        </select>
        <select
          value={typeFilter}
          onChange={(event) => setTypeFilter(event.target.value)}
          className="h-11 rounded-lg bg-gray-50 px-3 text-sm font-bold text-gray-700 outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-brand-red"
        >
          <option value="Tous">Tous les types</option>
          {types.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value as typeof sortBy)}
          className="h-11 rounded-lg bg-gray-50 px-3 text-sm font-bold text-gray-700 outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-brand-red"
        >
          <option value="recent">Plus recents</option>
          <option value="prix-asc">Prix croissant</option>
          <option value="prix-desc">Prix decroissant</option>
          <option value="nom">Nom A-Z</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-6 py-4 text-sm font-bold text-gray-600">
          {filteredLogements.length} logement{filteredLogements.length > 1 ? 's' : ''} affiche
          {filteredLogements.length > 1 ? 's' : ''}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-xs uppercase tracking-widest text-gray-500">
                <th className="px-6 py-4 font-bold">Photos</th>
                <th className="px-6 py-4 font-bold">Nom</th>
                <th className="px-6 py-4 font-bold">Type</th>
                <th className="px-6 py-4 font-bold">Prix / nuit</th>
                <th className="px-6 py-4 font-bold">Statut</th>
                <th className="px-6 py-4 text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLogements.map((logement) => (
                <tr key={logement.id} className="transition hover:bg-gray-50/80">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={logement.photos[0]}
                        alt={logement.nom}
                        className="h-14 w-20 rounded-lg object-cover shadow-sm"
                      />
                      <span className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-600">
                        <ImagePlus className="h-3.5 w-3.5" />
                        {logement.photos.length}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-brand-dark">{logement.nom}</p>
                    <p className="mt-1 line-clamp-1 max-w-sm text-xs text-gray-500">
                      {logement.description}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-600">
                    {logement.type}
                  </td>
                  <td className="px-6 py-4 font-black text-brand-red">
                    {logement.prix.toLocaleString('fr-FR')} FCFA
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={logement.statut}
                      onChange={(event) =>
                        updateStatus(logement, event.target.value as LogementStatus)
                      }
                      className={`rounded-lg px-3 py-2 text-xs font-bold outline-none ring-1 ${statusClasses(
                        logement.statut,
                      )}`}
                    >
                      <option value="disponible">Disponible</option>
                      <option value="occupe">Occupe</option>
                      <option value="maintenance">En maintenance</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setPreviewLogement(logement)}
                        className="rounded-lg border border-gray-200 bg-white p-2.5 text-gray-500 shadow-sm transition hover:border-gray-300 hover:bg-gray-50 hover:text-brand-dark"
                        aria-label={`Voir les photos de ${logement.nom}`}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => duplicateLogement(logement)}
                        className="rounded-lg border border-gray-200 bg-white p-2.5 text-gray-500 shadow-sm transition hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700"
                        aria-label={`Dupliquer ${logement.nom}`}
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => openEditModal(logement)}
                        className="rounded-lg border border-gray-200 bg-white p-2.5 text-gray-500 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                        aria-label={`Modifier ${logement.nom}`}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteLogement.mutate(logement.id)}
                        className="rounded-lg border border-gray-200 bg-white p-2.5 text-gray-500 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-brand-red"
                        aria-label={`Supprimer ${logement.nom}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 py-6">
          <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
              <h2 className="text-xl font-extrabold text-brand-dark">
                {editingLogement ? 'Modifier le logement' : 'Ajouter un logement'}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-brand-dark"
                aria-label="Fermer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-5 p-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-bold text-gray-700">
                  Nom du bien
                  <input
                    value={form.nom}
                    onChange={(event) => setForm({ ...form, nom: event.target.value })}
                    placeholder="Montserrat"
                    className="h-12 rounded-lg bg-gray-50 px-4 font-medium outline-none ring-1 ring-gray-200 focus:bg-white focus:ring-2 focus:ring-brand-red"
                    required
                  />
                </label>
                <label className="grid gap-2 text-sm font-bold text-gray-700">
                  Type
                  <select
                    value={form.type}
                    onChange={(event) => setForm({ ...form, type: event.target.value })}
                    className="h-12 rounded-lg bg-gray-50 px-4 font-medium outline-none ring-1 ring-gray-200 focus:bg-white focus:ring-2 focus:ring-brand-red"
                  >
                    <option>Studio</option>
                    <option>Appartement</option>
                    <option>Villa</option>
                    <option>Chambre</option>
                  </select>
                </label>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-bold text-gray-700">
                  Prix par nuit (FCFA)
                  <input
                    type="number"
                    min="0"
                    value={form.prix}
                    onChange={(event) => setForm({ ...form, prix: event.target.value })}
                    placeholder="75000"
                    className="h-12 rounded-lg bg-gray-50 px-4 font-medium outline-none ring-1 ring-gray-200 focus:bg-white focus:ring-2 focus:ring-brand-red"
                    required
                  />
                </label>
                <label className="grid gap-2 text-sm font-bold text-gray-700">
                  Statut
                  <select
                    value={form.statut}
                    onChange={(event) =>
                      setForm({ ...form, statut: event.target.value as LogementStatus })
                    }
                    className="h-12 rounded-lg bg-gray-50 px-4 font-medium outline-none ring-1 ring-gray-200 focus:bg-white focus:ring-2 focus:ring-brand-red"
                  >
                    <option value="disponible">Disponible</option>
                    <option value="occupe">Occupe</option>
                    <option value="maintenance">En maintenance</option>
                  </select>
                </label>
              </div>

              <label className="grid gap-2 text-sm font-bold text-gray-700">
                Description detaillee
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(event) => setForm({ ...form, description: event.target.value })}
                  placeholder="Decrivez le confort, l'emplacement et les equipements du logement."
                  className="resize-none rounded-lg bg-gray-50 px-4 py-3 font-medium outline-none ring-1 ring-gray-200 focus:bg-white focus:ring-2 focus:ring-brand-red"
                  required
                />
              </label>

              <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-extrabold text-brand-dark">Images du logement</h3>
                    <p className="mt-1 text-sm font-medium text-gray-500">
                      Ajoutez plusieurs photos depuis votre ordinateur ou avec une URL.
                    </p>
                  </div>
                  <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-brand-dark px-4 py-3 text-sm font-bold text-white transition hover:bg-black">
                    <Upload className="h-4 w-4" />
                    Importer images
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFiles}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_auto]">
                  <div className="relative">
                    <Link2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="url"
                      value={form.newPhotoUrl}
                      onChange={(event) => setForm({ ...form, newPhotoUrl: event.target.value })}
                      placeholder="Coller une URL d'image"
                      className="h-12 w-full rounded-lg bg-white pl-10 pr-4 font-medium outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-brand-red"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={addPhotoUrl}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
                  >
                    <ImagePlus className="h-4 w-4" />
                    Ajouter URL
                  </button>
                </div>

                {form.photos.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {form.photos.map((photo, index) => (
                      <div key={`${photo}-${index}`} className="group relative overflow-hidden rounded-lg bg-white ring-1 ring-gray-200">
                        <img
                          src={photo}
                          alt={`Photo ${index + 1}`}
                          className="h-32 w-full object-cover"
                        />
                        {index === 0 && (
                          <span className="absolute left-2 top-2 rounded-md bg-brand-red px-2 py-1 text-xs font-bold text-white">
                            Principale
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          className="absolute right-2 top-2 rounded-md bg-white/95 p-1.5 text-gray-600 shadow-sm transition hover:text-brand-red"
                          aria-label="Supprimer cette image"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-gray-300 bg-white px-6 py-10 text-center">
                    <ImagePlus className="mx-auto h-8 w-8 text-gray-300" />
                    <p className="mt-3 text-sm font-bold text-gray-500">
                      Aucune image ajoutee pour ce logement.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg border border-gray-200 px-5 py-3 font-bold text-gray-600 transition hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={form.photos.length === 0}
                  className="rounded-lg bg-brand-red px-5 py-3 font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {editingLogement ? 'Enregistrer' : 'Creer le logement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {previewLogement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 py-6">
          <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
              <div>
                <h2 className="text-xl font-extrabold text-brand-dark">{previewLogement.nom}</h2>
                <p className="mt-1 text-sm font-medium text-gray-500">
                  {previewLogement.photos.length} photo{previewLogement.photos.length > 1 ? 's' : ''}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewLogement(null)}
                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-brand-dark"
                aria-label="Fermer la galerie"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid gap-4 p-6 sm:grid-cols-2">
              {previewLogement.photos.map((photo, index) => (
                <img
                  key={`${photo}-${index}`}
                  src={photo}
                  alt={previewLogement.nom}
                  className="h-64 w-full rounded-lg object-cover ring-1 ring-gray-100"
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
