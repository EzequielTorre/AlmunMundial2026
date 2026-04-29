import { useRef } from "react";
import { useStore } from "../store/useStore";
import { Trash2, MoveHorizontal } from "lucide-react";

function StickerSlot({ teamId, index }) {
  const stickers = useStore((state) => state.stickers[teamId]);
  const addSticker = useStore((state) => state.addSticker);
  const removeSticker = useStore((state) => state.removeSticker);
  const swapStickers = useStore((state) => state.swapStickers);

  const fileInputRef = useRef();
  const imageData = stickers ? stickers[index] : null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        addSticker(teamId, index, event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragStart = (e) => {
    if (imageData) {
      e.dataTransfer.setData("text/plain", index.toString());
    } else {
      e.preventDefault();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const sourceIndex = parseInt(e.dataTransfer.getData("text/plain"));
    if (!isNaN(sourceIndex) && sourceIndex !== index) {
      swapStickers(teamId, sourceIndex, index);
    }
  };

  return (
    <div
      className={`position-relative rounded-3 overflow-hidden transition-all sticker-slot bg-body-tertiary ${
        imageData
          ? "shadow-sm border border-secondary-subtle"
          : "border border-2 border-secondary border-dashed"
      }`}
      style={{ aspectRatio: "3/4", cursor: imageData ? "default" : "pointer" }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {imageData ? (
        <>
          <img
            src={imageData}
            alt={`Jugador ${index + 1}`}
            className="w-100 h-100 object-fit-cover"
          />
          <div className="position-absolute top-0 end-0 p-2 d-flex gap-2 sticker-actions opacity-0 transition-opacity">
            <div
              className="btn btn-light btn-sm rounded-circle shadow-sm d-flex align-items-center justify-content-center text-primary"
              style={{ width: "32px", height: "32px", cursor: "grab" }}
              draggable
              onDragStart={handleDragStart}
              title="Arrastrar para mover"
            >
              <MoveHorizontal size={16} />
            </div>
            <button
              className="btn btn-light btn-sm rounded-circle shadow-sm d-flex align-items-center justify-content-center text-danger"
              style={{ width: "32px", height: "32px" }}
              onClick={() => removeSticker(teamId, index)}
              title="Eliminar figurita"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </>
      ) : (
        <div
          className="d-flex flex-column align-items-center justify-content-center h-100 text-body-secondary w-100 sticker-hover-bg"
          onClick={() => fileInputRef.current.click()}
        >
          <div className="display-4 fw-bold opacity-25 mb-3">{index + 1}</div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="d-none"
            onChange={handleFileChange}
          />
          <button className="btn btn-outline-primary btn-sm fw-semibold rounded-pill px-3 shadow-sm">
            Pegar Figurita
          </button>
        </div>
      )}
    </div>
  );
}

export default StickerSlot;
