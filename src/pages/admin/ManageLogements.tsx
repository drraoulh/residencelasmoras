import { useState } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';
import type { Logement, LogementStatus } from '../../components/properties/LogementCard';

// On réutilise le mock pour le moment
const initialLogements: Logement[] = [
  {
    id: '1', nom: 'Appartement VIP Bastos', type: 'Appartement', surface: 120, prix_nuit: 75000,
    statut_actuel: 'disponible', photos: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=200'], equipements: []
  },
  {
    id: '2', nom: 'Studio Premium Golf', type: 'Studio', surface: 45, prix_nuit: 35000,
    statut_actuel: 'occupe', photos: ['https://images.unsplash.com/photo-1502672260266-1c1e52f1590c?auto=format&fit=crop&q=80&w=200'], equipements: []
  },
  {
    id: '3', nom: 'Villa Océan Omnisport', type: 'Villa', surface: 200, prix_nuit: 150000,
    statut_actuel: 'libere_prochainement', photos: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=200'], equipements: []
  },
];

export default function ManageLogements() {
  const [logements, setLogements] = useState(initialLogements);

  const handleStatusChange = (id: string, newStatus: LogementStatus) => {
    // Changement de statut local pour la démo
    setLogements(logements.map(l => l.id === id ? { ...l, statut_actuel: newStatus } : l));
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <h1 className="text-3xl font-extrabold text-brand-dark tracking-tight">Gestion des Logements</h1>
        <button className="flex items-center gap-2 bg-brand-red text-white px-6 py-3 rounded-xl font-bold hover:bg-red-700 transition-all duration-300 active:scale-95 shadow-md">
          <Plus className="w-5 h-5" /> Ajouter un logement
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 text-gray-500 text-xs uppercase tracking-widest border-b border-gray-100">
                <th className="px-6 py-5 font-bold">Photo</th>
                <th className="px-6 py-5 font-bold">Nom & Type</th>
                <th className="px-6 py-5 font-bold">Prix / Nuit</th>
                <th className="px-6 py-5 font-bold">Statut Visuel</th>
                <th className="px-6 py-5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {logements.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <img src={log.photos[0]} alt={log.nom} className="w-20 h-14 object-cover rounded-lg shadow-sm" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-brand-dark text-base">{log.nom}</div>
                    <div className="text-xs font-semibold text-gray-500 mt-1 uppercase tracking-wider">{log.type} • {log.surface} m²</div>
                  </td>
                  <td className="px-6 py-4 font-black text-brand-red text-base">
                    {log.prix_nuit.toLocaleString('fr-FR')} <span className="text-xs">FCFA</span>
                  </td>
                  <td className="px-6 py-4">
                    {/* Le Select dynamique pour changer le statut */}
                    <select
                      value={log.statut_actuel}
                      onChange={(e) => handleStatusChange(log.id, e.target.value as LogementStatus)}
                      className={`text-xs font-bold rounded-xl px-4 py-2 border-2 outline-none cursor-pointer transition-colors shadow-sm appearance-none ${
                        log.statut_actuel === 'disponible' ? 'bg-green-50 text-green-700 border-green-100 focus:border-green-400' :
                        log.statut_actuel === 'occupe' ? 'bg-red-50 text-red-700 border-red-100 focus:border-brand-red' :
                        'bg-orange-50 text-orange-700 border-orange-100 focus:border-orange-400'
                      }`}
                    >
                      <option value="disponible">🟢 Disponible</option>
                      <option value="occupe">🔴 Occupé</option>
                      <option value="libere_prochainement">🟠 Libéré proc.</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
                      <button className="p-2.5 text-gray-500 hover:text-blue-600 bg-white border border-gray-200 rounded-xl shadow-sm transition-all hover:border-blue-200 hover:bg-blue-50">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2.5 text-gray-500 hover:text-brand-red bg-white border border-gray-200 rounded-xl shadow-sm transition-all hover:border-red-200 hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
