import { formatDateFr } from '../../utils/availability';
import type { PeriodMatrixRow } from '../../utils/planning';
import { dayStatusLabels } from '../../utils/planning';

const cellStyles: Record<string, string> = {
  libre: 'bg-green-50 text-green-800 ring-green-100',
  reserve: 'bg-red-50 text-red-800 ring-red-100',
  demande: 'bg-amber-50 text-amber-900 ring-amber-100',
  maintenance: 'bg-stone-200 text-stone-700 ring-stone-300',
  occupe: 'bg-orange-50 text-orange-800 ring-orange-100',
  terminee: 'bg-stone-100 text-stone-600 ring-stone-200',
};

interface PlanningGridProps {
  days: string[];
  rows: PeriodMatrixRow[];
}

function formatDayShort(dateStr: string) {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

export default function PlanningGrid({ days, rows }: PlanningGridProps) {
  return (
    <div className="admin-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-stone-200 bg-brand-gray/60">
              <th className="sticky left-0 z-10 min-w-[140px] bg-brand-gray/95 px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-brand-muted">
                Logement
              </th>
              {days.map((day) => (
                <th
                  key={day}
                  className="min-w-[72px] px-1 py-3 text-center text-[10px] font-semibold uppercase tracking-wide text-brand-muted"
                >
                  {formatDayShort(day)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(({ logement, cells }) => (
              <tr key={logement.id} className="border-b border-stone-100 last:border-0">
                <td className="sticky left-0 z-10 bg-white px-4 py-3 font-medium text-brand-dark">
                  <p className="truncate">{logement.nom}</p>
                  <p className="text-[10px] font-normal text-brand-muted">{logement.type}</p>
                </td>
                {cells.map(({ day, status, reservation }) => (
                  <td key={`${logement.id}-${day}`} className="p-1 text-center">
                    <div
                      title={
                        reservation
                          ? `${reservation.client_nom} — ${formatDateFr(reservation.date_arrivee)} → ${formatDateFr(reservation.date_depart)}`
                          : dayStatusLabels[status]
                      }
                      className={`mx-auto flex h-9 w-full max-w-[68px] items-center justify-center rounded-lg text-[10px] font-bold ring-1 ${cellStyles[status]}`}
                    >
                      {status === 'libre' ? '·' : dayStatusLabels[status].slice(0, 3)}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
