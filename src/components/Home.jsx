import { Link } from "react-router-dom";
import { useStore } from "../store/useStore";

function Home() {
  const teams = useStore((state) => state.teams);

  return (
    <div className="text-center py-4">
      <div className="mb-5">
        <h2 className="display-4 fw-bolder text-body mb-3 text-shadow-sm">
          Colección Oficial <span className="text-primary">Mundial 2026</span>
        </h2>
        <p
          className="lead text-body-secondary mx-auto"
          style={{ maxWidth: "600px" }}
        >
          Selecciona un equipo para ver sus páginas, conocer su historia y pegar
          tus figuritas virtuales.
        </p>
      </div>

      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 px-2">
        {teams.map((team) => (
          <div className="col" key={team.id}>
            <Link to={`/team/${team.id}`} className="text-decoration-none">
              <div className="card h-100 shadow-sm border border-secondary-subtle team-card-hover transition-all bg-body theme-transition">
                <div className="card-body d-flex flex-column align-items-center justify-content-center py-5">
                  <div
                    className="display-1 mb-4 drop-shadow-flag transition-all"
                    style={{ fontSize: "5rem" }}
                  >
                    {team.flag}
                  </div>
                  <h5 className="card-title fw-bold text-body m-0 text-uppercase tracking-wide text-center">
                    {team.name}
                  </h5>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
