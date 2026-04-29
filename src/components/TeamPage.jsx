import { useParams, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { useStore } from "../store/useStore";
import StickerSlot from "./StickerSlot";
import { Download, Share2, ArrowLeft, ArrowRight } from "lucide-react";
import html2pdf from "html2pdf.js";
import JSZip from "jszip";
import { saveAs } from "file-saver";

function TeamPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const pageRef = useRef();

  const teams = useStore((state) => state.teams);
  const updateDescription = useStore((state) => state.updateTeamDescription);

  const teamIndex = teams.findIndex((t) => t.id === id);
  const team = teams[teamIndex];

  const prevTeam = teamIndex > 0 ? teams[teamIndex - 1] : null;
  const nextTeam = teamIndex < teams.length - 1 ? teams[teamIndex + 1] : null;

  if (!team) {
    return <div>Equipo no encontrado</div>;
  }

  const handleDescriptionChange = (e) => {
    const newText = e.target.innerText;
    if (team.description !== newText) {
      updateDescription(team.id, newText);
    }
  };

  const exportPDF = () => {
    const element = pageRef.current;
    const opt = {
      margin: 10,
      filename: `album-${team.name.toLowerCase()}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();
  };

  const exportZip = async () => {
    const state = useStore.getState();
    const teamStickers = state.stickers[team.id] || {};

    if (Object.keys(teamStickers).length === 0) {
      alert("No hay figuritas para exportar");
      return;
    }

    const zip = new JSZip();
    const folder = zip.folder(`Figuritas_${team.name}`);

    Object.entries(teamStickers).forEach(([index, dataUrl]) => {
      // Extraer base64 de dataUrl
      const base64Data = dataUrl.split(",")[1];
      folder.file(`jugador_${parseInt(index) + 1}.jpg`, base64Data, {
        base64: true,
      });
    });

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, `album-${team.name.toLowerCase()}-figuritas.zip`);
  };

  const shareSocial = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `Mi álbum de ${team.name}`,
          text: `¡Mira mi colección de figuritas de ${team.name} en el Álbum Digital 2026!`,
          url: window.location.href,
        })
        .catch(console.error);
    } else {
      alert(
        "La función de compartir no está soportada en este navegador. Puedes copiar la URL manualmente.",
      );
    }
  };

  // Generar 11 espacios para los jugadores (11 titular)
  const slots = Array.from({ length: 11 }, (_, i) => i);

  return (
    <div className="container py-4">
      {/* Barra de controles premium */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center bg-body p-3 rounded-4 shadow-sm border border-secondary-subtle mb-4 gap-3 theme-transition">
        <div className="d-flex gap-2 w-100 w-md-auto justify-content-center justify-content-md-start">
          <button
            className="btn btn-outline-secondary d-flex align-items-center gap-2 rounded-pill px-4"
            onClick={() => navigate(prevTeam ? `/team/${prevTeam.id}` : "/")}
            disabled={!prevTeam && teamIndex === 0}
          >
            <ArrowLeft size={18} /> <span className="d-none d-sm-inline fw-medium">Anterior</span>
          </button>
          <button
            className="btn btn-outline-secondary d-flex align-items-center gap-2 rounded-pill px-4"
            onClick={() => navigate(nextTeam ? `/team/${nextTeam.id}` : "/")}
            disabled={!nextTeam}
          >
            <span className="d-none d-sm-inline fw-medium">Siguiente</span> <ArrowRight size={18} />
          </button>
        </div>
        <div className="d-flex gap-2 w-100 w-md-auto justify-content-center justify-content-md-end flex-wrap">
          <button className="btn btn-primary d-flex align-items-center gap-2 rounded-pill shadow-sm" onClick={exportPDF}>
            <Download size={18} /> <span className="fw-medium">PDF</span>
          </button>
          <button className="btn btn-success d-flex align-items-center gap-2 rounded-pill shadow-sm" onClick={exportZip}>
            <Download size={18} /> <span className="fw-medium">ZIP</span>
          </button>
          <button className="btn btn-info text-white d-flex align-items-center gap-2 rounded-pill shadow-sm" onClick={shareSocial}>
            <Share2 size={18} /> <span className="fw-medium">Compartir</span>
          </button>
        </div>
      </div>

      {/* Revista / Álbum (fondo simula papel que se adapta al modo oscuro) */}
      <div className="d-flex justify-content-center">
        <div className="bg-body border border-secondary-subtle w-100 shadow-lg rounded-4 p-4 p-md-5 position-relative magazine-page theme-transition" ref={pageRef} style={{ maxWidth: '950px', minHeight: '1100px' }}>
          
          <div className="text-center mb-5 border-bottom border-primary border-4 pb-4">
            <h2 className="display-3 fw-black text-body text-uppercase mb-3 tracking-tight">
              {team.name} <span className="drop-shadow-flag ms-2">{team.flag}</span>
            </h2>
            <div
              className="lead text-body-secondary mx-auto editable-description p-3 rounded-3"
              style={{ maxWidth: '750px', border: '1px dashed transparent', outline: 'none' }}
              contentEditable
              suppressContentEditableWarning
              onBlur={handleDescriptionChange}
              dangerouslySetInnerHTML={{ __html: team.description }}
            ></div>
          </div>

          <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-4 mt-4">
            {slots.map((index) => (
              <div className="col" key={index}>
                <StickerSlot teamId={team.id} index={index} />
              </div>
            ))}
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default TeamPage;
