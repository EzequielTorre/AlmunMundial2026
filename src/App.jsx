import { useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./components/Home";
import TeamPage from "./components/TeamPage";
import { BookOpen, Sun, Moon } from "lucide-react";
import { useStore } from "./store/useStore";

function App() {
  const theme = useStore((state) => state.theme);
  const toggleTheme = useStore((state) => state.toggleTheme);

  // Aplicar el tema globalmente en el elemento raíz del HTML (requerido por Bootstrap 5.3)
  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", theme);
  }, [theme]);

  return (
    <div className="d-flex flex-column min-vh-100 bg-body-tertiary theme-transition">
      {/* Navbar profesional y sticky */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary bg-gradient shadow-sm sticky-top">
        <div className="container py-1">
          {/* Logo y Branding */}
          <Link
            to="/"
            className="navbar-brand d-flex align-items-center gap-2 fw-bolder fs-4 text-uppercase"
          >
            <div className="bg-white text-primary p-1 rounded shadow-sm d-flex align-items-center justify-content-center">
              <BookOpen size={24} strokeWidth={2.5} />
            </div>
            <span className="text-white text-shadow-sm">Álbum 2026</span>
          </Link>

          {/* Toggle para móvil */}
          <button
            className="navbar-toggler border-0 shadow-none"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Enlaces y controles */}
          <div
            className="collapse navbar-collapse justify-content-end"
            id="navbarNav"
          >
            <ul className="navbar-nav align-items-lg-center gap-3 mt-3 mt-lg-0">
              <li className="nav-item">
                <Link
                  to="/"
                  className="nav-link text-white fw-semibold px-3 py-2 rounded-pill hover-bg-white-10 transition-all"
                >
                  Inicio
                </Link>
              </li>
              <li className="nav-item ms-lg-2">
                {/* Botón de cambio de tema Claro/Oscuro */}
                <button
                  onClick={toggleTheme}
                  className="btn btn-light rounded-circle shadow-sm d-flex align-items-center justify-content-center p-2 theme-toggle-btn"
                  title={
                    theme === "light"
                      ? "Cambiar a modo oscuro"
                      : "Cambiar a modo claro"
                  }
                  aria-label="Alternar tema"
                >
                  {theme === "light" ? (
                    <Moon size={20} className="text-primary" />
                  ) : (
                    <Sun size={20} className="text-warning" />
                  )}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Contenido Principal */}
      <main className="container flex-grow-1 py-5">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/team/:id" element={<TeamPage />} />
        </Routes>
      </main>

      {/* Footer minimalista */}
      <footer className="bg-body border-top py-4 mt-auto theme-transition">
        <div className="container text-center text-secondary small">
          <p className="mb-0">
            © 2026 Álbum Digital. Creado para los fanáticos del fútbol.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
