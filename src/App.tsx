import { lazy, Suspense, useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { initializeAuthSession, isAuthenticated, subscribeToAuthChanges } from "@/lib/auth";
import LoadingSpinner from "@/components/LoadingSpinner";

const Index = lazy(() => import("./pages/Index"));
const Learn = lazy(() => import("./pages/Learn"));
const Game = lazy(() => import("./pages/Game"));
const ScenarioGame = lazy(() => import("./pages/ScenarioGame"));
const KnnGame = lazy(() => import("./pages/KnnGame"));
const GradientGame = lazy(() => import("./pages/GradientGame"));
const Quiz = lazy(() => import("./pages/Quiz"));
const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Simulation = lazy(() => import("./pages/Simulation"));
const Leaderboard = lazy(() => import("./pages/Leaderboard"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner />
  </div>
);

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

const App = () => {
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    let active = true;

    initializeAuthSession()
      .catch(() => {
        // Keep app usable even if session restore fails.
      })
      .finally(() => {
        if (active) setAuthReady(true);
      });

    const unsubscribe = subscribeToAuthChanges(() => {
      if (active) setAuthReady(true);
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  if (!authReady) return <PageLoader />;

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/learn" element={<Learn />} />
              <Route path="/game" element={<Game />} />
              <Route path="/game/scenario" element={<ScenarioGame />} />
              <Route path="/game/knn" element={<KnnGame />} />
              <Route path="/game/gradient" element={<GradientGame />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/simulation" element={<Simulation />} />
              <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
