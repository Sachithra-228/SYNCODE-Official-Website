import { ComponentType, ReactNode, Suspense, lazy, useEffect } from "react";
import { Route } from "react-router-dom";

// Work-in-progress pages that exist only in a local checkout and must not ship.
// The glob matches nothing when the file is absent, and DEV is false in production
// builds, so none of this reaches the deployed site.

const TACTICAL_PATH = "/tactical-dashboard";
const TACTICAL_FONT =
  "https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap";

const buildLocalRoutes = (): ReactNode => {
  const load = import.meta.glob<{ default: ComponentType }>("./pages/TacticalDashboard.tsx")[
    "./pages/TacticalDashboard.tsx"
  ];
  if (!load) return null;

  const TacticalDashboardPage = lazy(load);
  const TacticalDashboardRoute = () => {
    useEffect(() => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = TACTICAL_FONT;
      document.head.appendChild(link);
      return () => link.remove();
    }, []);

    return (
      <Suspense fallback={null}>
        <TacticalDashboardPage />
      </Suspense>
    );
  };

  return <Route path={TACTICAL_PATH} element={<TacticalDashboardRoute />} />;
};

export const localRoutes = import.meta.env.DEV ? buildLocalRoutes() : null;

// Local pages that render without the site navbar and floating buttons.
export const isLocalFullScreen = (pathname: string) =>
  import.meta.env.DEV && pathname === TACTICAL_PATH;
