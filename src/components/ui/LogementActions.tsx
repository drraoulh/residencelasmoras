import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle } from 'lucide-react';
import ReservationRequestModal from '../booking/ReservationRequestModal';

interface LogementActionsProps {
  logementId: string;
  logementNom: string;
  logementType: string;
  prixParNuit: number;
  detailUrl: string;
  arrivee?: string;
  depart?: string;
  showReserve?: boolean;
  className?: string;
}

export default function LogementActions({
  logementId,
  logementNom,
  logementType,
  prixParNuit,
  detailUrl,
  arrivee,
  depart,
  showReserve = true,
  className = '',
}: LogementActionsProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div
        className={`grid w-full gap-2 ${
          showReserve ? 'grid-cols-1 min-[420px]:grid-cols-2' : 'grid-cols-1'
        } ${className}`}
      >
        <Link
          to={detailUrl}
          className="btn-ghost w-full justify-center !px-3 !py-2.5 text-xs sm:!px-4 sm:text-sm"
        >
          Voir les détails
          <ArrowRight className="h-3.5 w-3.5 shrink-0" />
        </Link>

        {showReserve && (
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="btn-accent w-full justify-center !px-3 !py-2.5 text-xs sm:!px-4 sm:text-sm"
          >
            <MessageCircle className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">Réserver sur WhatsApp</span>
          </button>
        )}
      </div>

      <ReservationRequestModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        logementId={logementId}
        logementNom={logementNom}
        logementType={logementType}
        prixParNuit={prixParNuit}
        arrivee={arrivee}
        depart={depart}
      />
    </>
  );
}
