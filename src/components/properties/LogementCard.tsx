import { Link } from 'react-router-dom';

export type LogementStatus = 'disponible' | 'occupe' | 'libere_prochainement';

export interface Logement {
  id: string;
  nom: string;
  type: string;
  surface: number;
  prix_nuit: number;
  statut_actuel: LogementStatus;
  date_liberation?: string;
  photos: string[];
  equipements: string[];
}

interface LogementCardProps {
  logement: Logement;
}

export default function LogementCard({ logement }: LogementCardProps) {
  return (
    <div className="premium-card flex h-full flex-col bg-white group">
      {/* Container de l'image avec gestion des statuts */}
      <div className="relative h-56 w-full overflow-hidden sm:h-64">
        <img 
          src={logement.photos[0]} 
          alt={logement.nom} 
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${
            logement.statut_actuel === 'occupe' ? 'brightness-50 grayscale-[20%]' : ''
          }`}
        />
        
        {/* Badges de statut (Disponible & Libéré prochainement) */}
        <div className="absolute right-3 top-3 z-10 flex max-w-[85%] flex-col items-end gap-2 sm:right-4 sm:top-4">
          {logement.statut_actuel === 'disponible' && (
            <span className="flex items-center gap-2 rounded-full bg-green-500 bg-opacity-90 px-3 py-1.5 text-xs font-semibold text-white shadow-lg backdrop-blur-md sm:px-4 sm:text-sm">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
              Disponible
            </span>
          )}
          {logement.statut_actuel === 'libere_prochainement' && logement.date_liberation && (
            <span className="rounded-full bg-orange-500 bg-opacity-90 px-3 py-1.5 text-right text-xs font-semibold text-white shadow-lg backdrop-blur-md sm:px-4 sm:text-sm">
              Dispo à partir du : {new Date(logement.date_liberation).toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              })}
            </span>
          )}
        </div>
        
        {/* Bandeau OCCUPÉ barrant l'image */}
        {logement.statut_actuel === 'occupe' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            {/* Conteneur rotatif pour le bandeau */}
            <div className="transform -rotate-45 w-[150%] flex justify-center shadow-2xl">
              <div className="w-full border-y-4 border-red-800 bg-brand-red bg-opacity-90 py-2 text-center text-xl font-black uppercase tracking-[0.25em] text-white sm:py-3 sm:text-2xl sm:tracking-[0.3em]">
                Occupé
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Informations du logement */}
      <div className="flex flex-1 flex-col justify-between p-4 sm:p-6">
        <div>
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1 uppercase tracking-wider">
                {logement.type} • {logement.surface} m²
              </p>
              <h3 className="line-clamp-2 text-lg font-bold leading-tight text-brand-dark sm:text-xl">
                {logement.nom}
              </h3>
            </div>
          </div>
          
          {/* Liste des équipements (Aperçu) */}
          <div className="mt-4 flex flex-wrap gap-2">
            {logement.equipements.slice(0, 3).map((eq, index) => (
              <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md font-medium border border-gray-200">
                {eq}
              </span>
            ))}
            {logement.equipements.length > 3 && (
              <span className="text-xs bg-gray-50 text-gray-500 px-2 py-1 rounded-md">
                +{logement.equipements.length - 3}
              </span>
            )}
          </div>
        </div>
        
        {/* Prix et bouton d'action */}
        <div className="mt-6 flex flex-col gap-4 border-t border-gray-100 pt-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 font-medium mb-0.5">À partir de</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-brand-red sm:text-2xl">
                {logement.prix_nuit.toLocaleString('fr-FR')}
              </span>
              <span className="text-sm font-bold text-brand-red">FCFA</span>
              <span className="text-sm text-gray-400 font-medium ml-1">/ nuit</span>
            </div>
          </div>
          
          {logement.statut_actuel === 'occupe' ? (
            <button 
              className="w-full cursor-not-allowed rounded-xl bg-gray-100 px-5 py-2.5 font-semibold text-gray-400 sm:w-auto"
              disabled
            >
              Indisponible
            </button>
          ) : (
            <Link 
              to={`/logements/${logement.id}`}
              className="w-full rounded-xl bg-brand-dark px-5 py-2.5 text-center font-semibold text-white transition-all duration-300 hover:bg-black hover:shadow-lg active:scale-95 sm:w-auto"
            >
              Voir détails
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
