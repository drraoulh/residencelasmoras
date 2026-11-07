import { Link } from "react-router-dom";
import {
  Building2,
  CircleCheck,
  BedDouble,
  Clock3,
  ArrowUpRight,
  Plus,
  SlidersHorizontal,
} from "lucide-react";
import { useProperties } from "../../context/Properties";
export default function Dashboard() {
  const { logements, loading, error } = useProperties();
  const available = logements.filter(
    (l) => l.statut_actuel === "disponible",
  ).length;
  const occupied = logements.filter((l) => l.statut_actuel === "occupe").length;
  const soon = logements.filter(
    (l) => l.statut_actuel === "libere_prochainement",
  ).length;
  const total = logements.length;
  const stats = [
    {
      label: "Total des logements",
      value: total,
      icon: Building2,
      tone: "neutral",
      note: "Votre parc immobilier",
    },
    {
      label: "Disponibles",
      value: available,
      icon: CircleCheck,
      tone: "green",
      note: "Prêts à accueillir vos clients",
    },
    {
      label: "Occupés",
      value: occupied,
      icon: BedDouble,
      tone: "red",
      note: "Séjours actuellement en cours",
    },
    {
      label: "Bientôt disponibles",
      value: soon,
      icon: Clock3,
      tone: "amber",
      note: "À préparer pour le prochain séjour",
    },
  ];
  return (
    <div className="admin-page">
      <div className="admin-page-heading">
        <div>
          <p className="admin-eyebrow">PILOTAGE DE LA RÉSIDENCE</p>
          <h1>Vue d’ensemble</h1>
          <p className="admin-description">
            Bienvenue dans votre espace. Gardez le cap sur l’essentiel.
          </p>
        </div>
        <Link to="/admin/logements" className="btn-primary">
          <Plus size={15} />
          Gérer les logements
        </Link>
      </div>
      {error && (
        <p role="alert" className="notice">
          {error}
        </p>
      )}
      {loading && (
        <p role="status" className="admin-description">
          Chargement de votre résidence…
        </p>
      )}
      <div className="admin-stat-grid">
        {stats.map(({ label, value, icon: Icon, tone, note }) => (
          <div className="admin-stat" data-tone={tone} key={label}>
            <div className="admin-stat-top">
              <span>{label}</span>
              <span className="admin-stat-icon">
                <Icon size={17} />
              </span>
            </div>
            <strong>
              {loading || error ? "—" : value.toString().padStart(2, "0")}
            </strong>
            <small>{note}</small>
          </div>
        ))}
      </div>
      <div className="admin-overview-grid">
        <section className="panel">
          <h2 className="admin-card-title">
            <SlidersHorizontal size={17} />
            Disponibilité de la résidence
          </h2>
          <div className="admin-availability-number">
            {loading || error
              ? "—"
              : total
                ? Math.round((available / total) * 100)
                : 0}
            %<span>des logements disponibles</span>
          </div>
          <div
            className="admin-progress"
            role="img"
            aria-label={`${available} disponibles, ${occupied} occupés, ${soon} bientôt disponibles`}
          >
            <span
              style={{
                width: `${total ? (available / total) * 100 : 0}%`,
                background: "#67b799",
              }}
            />
            <span
              style={{
                width: `${total ? (occupied / total) * 100 : 0}%`,
                background: "#e0847a",
              }}
            />
            <span
              style={{
                width: `${total ? (soon / total) * 100 : 0}%`,
                background: "#e1bb72",
              }}
            />
          </div>
          <div className="admin-legend">
            <span>
              <i style={{ background: "#67b799" }} />
              Disponibles · {available}
            </span>
            <span>
              <i style={{ background: "#e0847a" }} />
              Occupés · {occupied}
            </span>
            <span>
              <i style={{ background: "#e1bb72" }} />
              Prochainement · {soon}
            </span>
          </div>
        </section>
        <section className="panel admin-quick">
          <Building2 />
          <p
            className="admin-eyebrow"
            style={{ marginTop: 0, color: "#b7c1d0" }}
          >
            CHAQUE SÉJOUR COMPTE
          </p>
          <h2>
            Une résidence accueillante,
            <br />
            une gestion sereine.
          </h2>
          <p>
            Retrouvez les demandes de vos visiteurs et préparez leur prochain
            séjour.
          </p>
          <Link to="/admin/reservations">
            Consulter les réservations
            <ArrowUpRight size={15} />
          </Link>
        </section>
      </div>
      <div className="admin-section-heading">
        <div>
          <h2>Vos derniers logements</h2>
          <p>Un aperçu de votre résidence, en un coup d’œil.</p>
        </div>
        <Link to="/admin/logements">
          Tout voir
          <ArrowUpRight size={14} />
        </Link>
      </div>
      <div className="admin-property-grid">
        {logements.slice(0, 3).map((l) => (
          <Link
            to="/admin/logements"
            className="admin-property-card"
            key={l.id}
          >
            <img src={l.photos[0]} alt={l.nom} />
            <div className="admin-property-card-body">
              <h3>{l.nom}</h3>
              <p>
                {l.type}
                {l.surface > 0 ? ` · ${l.surface} m²` : ""}
              </p>
              <div className="admin-property-card-footer">
                <strong>
                  {l.prix_nuit.toLocaleString("fr-FR")} FCFA{" "}
                  <small>/ nuit</small>
                </strong>
                <span className="admin-badge" data-status={l.statut_actuel}>
                  {l.statut_actuel === "disponible"
                    ? "Disponible"
                    : l.statut_actuel === "occupe"
                      ? "Occupé"
                      : "Prochainement"}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {!loading && !error && !total && (
        <div className="panel">
          <p>Votre résidence prend forme ici.</p>
          <Link className="admin-description" to="/admin/logements">
            Ajoutez votre premier logement pour commencer.
          </Link>
        </div>
      )}
    </div>
  );
}
