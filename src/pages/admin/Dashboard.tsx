import { Home, CheckCircle, XCircle, Clock } from 'lucide-react';

const mockReservations = [
  { id: 1, nom: 'Jean Dupont', logement: 'Appartement VIP Bastos', dates: '10 - 15 Juin 2026', statut: 'En attente' },
  { id: 2, nom: 'Marie Claire', logement: 'Studio Premium Golf', dates: '12 - 14 Juin 2026', statut: 'Confirmée' },
  { id: 3, nom: 'Paul Atangana', logement: 'Villa Océan Omnisport', dates: '20 - 30 Juin 2026', statut: 'En attente' },
  { id: 4, nom: 'Sarah Mvondo', logement: 'Chambre Executive', dates: '05 - 08 Juil 2026', statut: 'Annulée' },
  { id: 5, nom: 'Luc Eto', logement: 'Appartement VIP Bastos', dates: '01 - 10 Août 2026', statut: 'Confirmée' },
];

export default function Dashboard() {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-extrabold text-brand-dark mb-10 tracking-tight">Vue d'ensemble</h1>

      {/* Cartes Statistiques Rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 flex items-center gap-5">
          <div className="p-4 bg-gray-50 rounded-2xl text-gray-700"><Home className="w-8 h-8" /></div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Total Logements</p>
            <p className="text-3xl font-black text-brand-dark">12</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 flex items-center gap-5">
          <div className="p-4 bg-green-50 rounded-2xl text-green-600"><CheckCircle className="w-8 h-8" /></div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Disponibles</p>
            <p className="text-3xl font-black text-brand-dark">8</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 flex items-center gap-5">
          <div className="p-4 bg-red-50 rounded-2xl text-brand-red"><XCircle className="w-8 h-8" /></div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Occupés</p>
            <p className="text-3xl font-black text-brand-dark">4</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 flex items-center gap-5">
          <div className="p-4 bg-orange-50 rounded-2xl text-orange-500"><Clock className="w-8 h-8" /></div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Demandes (Attente)</p>
            <p className="text-3xl font-black text-brand-dark">3</p>
          </div>
        </div>
      </div>

      {/* Tableau des Dernières Réservations */}
      <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-xl font-bold text-brand-dark">Dernières demandes de réservation</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-gray-400 text-xs uppercase tracking-widest border-b border-gray-100">
                <th className="px-8 py-5 font-bold">Client</th>
                <th className="px-8 py-5 font-bold">Logement</th>
                <th className="px-8 py-5 font-bold">Dates</th>
                <th className="px-8 py-5 font-bold">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {mockReservations.map((res) => (
                <tr key={res.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-5 font-bold text-brand-dark text-sm">{res.nom}</td>
                  <td className="px-8 py-5 text-gray-600 font-medium text-sm">{res.logement}</td>
                  <td className="px-8 py-5 text-gray-500 text-sm">{res.dates}</td>
                  <td className="px-8 py-5">
                    <span className={`px-4 py-1.5 rounded-lg text-xs font-bold ${
                      res.statut === 'Confirmée' ? 'bg-green-100 text-green-700' :
                      res.statut === 'En attente' ? 'bg-orange-100 text-orange-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {res.statut}
                    </span>
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
