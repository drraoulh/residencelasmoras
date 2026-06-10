import { useMemo, useState } from 'react';
import { CheckCheck, Mail, MailOpen, Search, Trash2 } from 'lucide-react';
import { useLocalStorageStore } from '../../hooks/useLocalStorageStore';

export default function ManageContacts() {
  const {
    messages,
    markMessageAsRead,
    markAllMessagesAsRead,
    deleteMessage,
    deleteReadMessages,
  } = useLocalStorageStore();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'tous' | 'non-lus' | 'lus'>('tous');

  const filteredMessages = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return messages.filter((message) => {
      const matchesSearch =
        !normalizedQuery ||
        message.nom.toLowerCase().includes(normalizedQuery) ||
        message.email.toLowerCase().includes(normalizedQuery) ||
        message.sujet.toLowerCase().includes(normalizedQuery) ||
        message.message.toLowerCase().includes(normalizedQuery);
      const matchesStatus =
        statusFilter === 'tous' ||
        (statusFilter === 'non-lus' && !message.lu) ||
        (statusFilter === 'lus' && message.lu);

      return matchesSearch && matchesStatus;
    });
  }, [messages, query, statusFilter]);

  const unreadCount = messages.filter((message) => !message.lu).length;
  const readCount = messages.length - unreadCount;

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-brand-dark">
            Messages de contact
          </h1>
          <p className="mt-2 text-sm font-medium text-gray-500">
            Consultez et traitez les demandes envoyées depuis le formulaire public.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={markAllMessagesAsRead}
            disabled={unreadCount === 0}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CheckCheck className="h-4 w-4" />
            Tout marquer lu
          </button>
          <button
            type="button"
            onClick={deleteReadMessages}
            disabled={readCount === 0}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-brand-red transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            Supprimer les lus
          </button>
        </div>
      </div>

      <div className="mb-6 grid gap-4 rounded-lg border border-gray-100 bg-white p-4 shadow-sm md:grid-cols-[1fr_180px]">
        <label className="relative block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Rechercher un nom, email, sujet ou message"
            className="h-11 w-full rounded-lg bg-gray-50 pl-10 pr-4 text-sm font-medium outline-none ring-1 ring-gray-200 focus:bg-white focus:ring-2 focus:ring-brand-red"
          />
        </label>
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}
          className="h-11 rounded-lg bg-gray-50 px-3 text-sm font-bold text-gray-700 outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-brand-red"
        >
          <option value="tous">Tous</option>
          <option value="non-lus">Non lus</option>
          <option value="lus">Lus</option>
        </select>
      </div>

      {messages.length === 0 ? (
        <div className="rounded-lg border border-gray-100 bg-white px-6 py-14 text-center shadow-sm">
          <p className="text-lg font-bold text-brand-dark">Aucun message pour le moment.</p>
          <p className="mt-2 text-gray-500">Les futurs messages apparaîtront ici.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-6 py-4 text-sm font-bold text-gray-600">
            {filteredMessages.length} message{filteredMessages.length > 1 ? 's' : ''} affiché
            {filteredMessages.length > 1 ? 's' : ''} - {unreadCount} non lu
            {unreadCount > 1 ? 's' : ''}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-xs uppercase tracking-widest text-gray-500">
                  <th className="px-6 py-4 font-bold">Client</th>
                  <th className="px-6 py-4 font-bold">Sujet</th>
                  <th className="px-6 py-4 font-bold">Message</th>
                  <th className="px-6 py-4 font-bold">Date</th>
                  <th className="px-6 py-4 font-bold">Statut</th>
                  <th className="px-6 py-4 text-right font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredMessages.map((message) => (
                  <tr key={message.id} className="align-top transition hover:bg-gray-50/80">
                    <td className="px-6 py-5">
                      <p className="font-bold text-brand-dark">{message.nom}</p>
                      <a
                        href={`mailto:${message.email}?subject=${encodeURIComponent(message.sujet)}`}
                        className="mt-1 block text-sm font-medium text-brand-red"
                      >
                        {message.email}
                      </a>
                    </td>
                    <td className="px-6 py-5 text-sm font-bold text-gray-700">{message.sujet}</td>
                    <td className="max-w-md px-6 py-5 text-sm leading-relaxed text-gray-600">
                      {message.message}
                    </td>
                    <td className="px-6 py-5 text-sm font-medium text-gray-500">
                      {new Date(message.date).toLocaleString('fr-FR', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`rounded-lg px-3 py-1.5 text-xs font-bold ring-1 ${
                          message.lu
                            ? 'bg-gray-50 text-gray-600 ring-gray-100'
                            : 'bg-red-50 text-brand-red ring-red-100'
                        }`}
                      >
                        {message.lu ? 'Lu' : 'Non lu'}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-end gap-2">
                        <a
                          href={`mailto:${message.email}?subject=${encodeURIComponent(message.sujet)}`}
                          className="rounded-lg border border-gray-200 bg-white p-2.5 text-gray-500 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                          aria-label="Répondre par email"
                        >
                          <Mail className="h-4 w-4" />
                        </a>
                        {!message.lu && (
                          <button
                            type="button"
                            onClick={() => markMessageAsRead(message.id)}
                            className="rounded-lg border border-gray-200 bg-white p-2.5 text-gray-500 shadow-sm transition hover:border-green-200 hover:bg-green-50 hover:text-green-700"
                            aria-label="Marquer comme lu"
                          >
                            <MailOpen className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => deleteMessage(message.id)}
                          className="rounded-lg border border-gray-200 bg-white p-2.5 text-gray-500 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-brand-red"
                          aria-label="Supprimer le message"
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
      )}
    </div>
  );
}
