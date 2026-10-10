'use client';

import { Suspense, lazy, useEffect, useState } from 'react';

const Spline = lazy(() => import('@splinetool/react-spline'));

interface SplineSceneProps {
  scene: string;
  className?: string;
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  // The Spline runtime needs a browser, so it is only loaded after mount.
  // Pre-rendered HTML shows the same loader the Suspense fallback uses.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const loader = (
    <div className="flex h-full w-full items-center justify-center">
      <span className="loader" />
    </div>
  );

  return (
    <Suspense fallback={loader}>
      {mounted ? <Spline scene={scene} className={className} /> : loader}
    </Suspense>
  );
}
