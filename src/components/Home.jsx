import { Link } from "react-router-dom";
import { useStore } from "../store/useStore";
import { Download, Share2 } from "lucide-react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

function Home() {
  const teams = useStore((state) => state.teams);
  const stickers = useStore((state) => state.stickers);

  const downloadFullAlbumZip = async () => {
    const zip = new JSZip();
    let hasData = false;

    Object.entries(stickers).forEach(([teamId, teamStickers]) => {
      const team = teams.find((t) => t.id === teamId);
      if (team && Object.keys(teamStickers).length > 0) {
        hasData = true;
        const folder = zip.folder(team.name);
        Object.entries(teamStickers).forEach(([index, dataUrl]) => {
          const base64Data = dataUrl.split(",")[1];
          folder.file(`jugador_${parseInt(index) + 1}.jpg`, base64Data, {
            base64: true,
          });
        });
      }
    });

    if (!hasData) {
      alert("Tu álbum está vacío. ¡Empieza a pegar figuritas primero!");
      return;
    }

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "album-completo-mundial-2026.zip");
  };

  const shareFullAlbum = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Mi Álbum Digital Mundial 2026",
          text: "¡Mira cómo va mi colección de figuritas para el Mundial 2026!",
          url: window.location.href,
        })
        .catch(console.error);
    } else {
      alert("Copia el enlace de esta página para compartir tu álbum.");
    }
  };

  return (
    <div className="text-center py-4">
      <div className="mb-5">
        <h2 className="display-4 fw-bolder text-body mb-3 text-shadow-sm">
          Colección Oficial <span className="text-primary">Mundial 2026</span>
        </h2>
        <p
          className="lead text-body-secondary mx-auto mb-4"
          style={{ maxWidth: "600px" }}
        >
          Selecciona un equipo para ver sus páginas, conocer su historia y pegar
          tus figuritas virtuales.
        </p>

        {/* Acciones del Álbum Completo */}
        <div className="d-flex justify-content-center gap-3 mb-5">
          <button
            className="btn btn-success btn-lg rounded-pill px-4 shadow-sm d-flex align-items-center gap-2"
            onClick={downloadFullAlbumZip}
          >
            <Download size={20} />{" "}
            <span className="fw-bold">Descargar Álbum (.ZIP)</span>
          </button>
          <button
            className="btn btn-info btn-lg text-white rounded-pill px-4 shadow-sm d-flex align-items-center gap-2"
            onClick={shareFullAlbum}
          >
            <Share2 size={20} />{" "}
            <span className="fw-bold">Compartir Colección</span>
          </button>
        </div>
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
                    <span
                      className={`fi fi-${team.flagCode} rounded shadow-sm`}
                    ></span>
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
