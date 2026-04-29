import { create } from "zustand";
import { persist } from "zustand/middleware";
import { initialTeams } from "./teamsData";

export const useStore = create(
  persist(
    (set) => ({
      theme: "light",
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),

      teams: initialTeams,
      stickers: {}, // { teamId: { stickerIndex: imageDataUrl } }

      updateTeamDescription: (teamId, description) =>
        set((state) => {
          // Evitar actualizaciones si la descripción es exactamente la misma
          const team = state.teams.find((t) => t.id === teamId);
          if (team && team.description === description) return state;

          return {
            teams: state.teams.map((t) =>
              t.id === teamId ? { ...t, description } : t,
            ),
          };
        }),

      addSticker: (teamId, index, imageDataUrl) =>
        set((state) => {
          const teamStickers = state.stickers[teamId] || {};
          return {
            stickers: {
              ...state.stickers,
              [teamId]: {
                ...teamStickers,
                [index]: imageDataUrl,
              },
            },
          };
        }),

      removeSticker: (teamId, index) =>
        set((state) => {
          if (!state.stickers[teamId]) return state;
          const teamStickers = { ...state.stickers[teamId] };
          delete teamStickers[index];
          return {
            stickers: {
              ...state.stickers,
              [teamId]: teamStickers,
            },
          };
        }),

      swapStickers: (teamId, indexA, indexB) =>
        set((state) => {
          if (!state.stickers[teamId]) return state;
          const teamStickers = { ...state.stickers[teamId] };

          const temp = teamStickers[indexA];
          if (teamStickers[indexB]) {
            teamStickers[indexA] = teamStickers[indexB];
          } else {
            delete teamStickers[indexA];
          }

          if (temp) {
            teamStickers[indexB] = temp;
          } else {
            delete teamStickers[indexB];
          }

          return {
            stickers: {
              ...state.stickers,
              [teamId]: teamStickers,
            },
          };
        }),
    }),
    {
      name: "album-digital-storage-v2", // Modificado para refrescar la lista de equipos nueva en el localStorage
    },
  ),
);
