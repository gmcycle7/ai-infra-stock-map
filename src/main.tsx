import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import { ThemeProvider } from "./context/ThemeContext";
import { WatchlistProvider } from "./context/WatchlistContext";
import { WeightsProvider } from "./context/WeightsContext";
import { JournalProvider } from "./context/JournalContext";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/Home";

// 高頻使用：直接 bundle
import { CompaniesPage } from "./pages/Companies";
import { CompanyDetailPage } from "./pages/CompanyDetail";

// 低頻 / 重 chunk：lazy load 以縮小首頁 bundle
const CategoriesPage = lazy(() => import("./pages/Categories").then((m) => ({ default: m.CategoriesPage })));
const CategoryDetailPage = lazy(() => import("./pages/CategoryDetail").then((m) => ({ default: m.CategoryDetailPage })));
const GlossaryPage = lazy(() => import("./pages/Glossary").then((m) => ({ default: m.GlossaryPage })));
const SupplyChainPage = lazy(() => import("./pages/SupplyChain").then((m) => ({ default: m.SupplyChainPage })));
const BottlenecksPage = lazy(() => import("./pages/Bottlenecks").then((m) => ({ default: m.BottlenecksPage })));
const RiskMapPage = lazy(() => import("./pages/RiskMap").then((m) => ({ default: m.RiskMapPage })));
const MoatsPage = lazy(() => import("./pages/Moats").then((m) => ({ default: m.MoatsPage })));
const KpiDashboardPage = lazy(() => import("./pages/KpiDashboard").then((m) => ({ default: m.KpiDashboardPage })));
const KpiMethodPage = lazy(() => import("./pages/KpiMethod").then((m) => ({ default: m.KpiMethodPage })));
const ComparePage = lazy(() => import("./pages/Compare").then((m) => ({ default: m.ComparePage })));
const KpiValidationPage = lazy(() => import("./pages/KpiValidation").then((m) => ({ default: m.KpiValidationPage })));
const ScoringRubricPage = lazy(() => import("./pages/ScoringRubric").then((m) => ({ default: m.ScoringRubricPage })));
const HeatmapPage = lazy(() => import("./pages/Heatmap").then((m) => ({ default: m.HeatmapPage })));
const LeadershipRubricPage = lazy(() => import("./pages/LeadershipRubric").then((m) => ({ default: m.LeadershipRubricPage })));
const WatchlistPage = lazy(() => import("./pages/Watchlist").then((m) => ({ default: m.WatchlistPage })));
const KpiTuningPage = lazy(() => import("./pages/KpiTuning").then((m) => ({ default: m.KpiTuningPage })));
const DataQualityPage = lazy(() => import("./pages/DataQuality").then((m) => ({ default: m.DataQualityPage })));
const BacktestPage = lazy(() => import("./pages/Backtest").then((m) => ({ default: m.BacktestPage })));
const JournalPage = lazy(() => import("./pages/Journal").then((m) => ({ default: m.JournalPage })));
const ChangesPage = lazy(() => import("./pages/Changes").then((m) => ({ default: m.ChangesPage })));

function PageLoading() {
  return (
    <div className="card flex h-64 items-center justify-center text-sm text-slate-500 dark:text-slate-400">
      載入中...
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <WatchlistProvider>
        <WeightsProvider>
          <JournalProvider>
          <BrowserRouter basename={import.meta.env.BASE_URL}>
            <Routes>
              <Route element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="/companies" element={<CompaniesPage />} />
                <Route path="/company/:id" element={<CompanyDetailPage />} />
                <Route
                  path="/categories"
                  element={
                    <Suspense fallback={<PageLoading />}>
                      <CategoriesPage />
                    </Suspense>
                  }
                />
                <Route
                  path="/category/:slug"
                  element={
                    <Suspense fallback={<PageLoading />}>
                      <CategoryDetailPage />
                    </Suspense>
                  }
                />
                <Route
                  path="/glossary"
                  element={
                    <Suspense fallback={<PageLoading />}>
                      <GlossaryPage />
                    </Suspense>
                  }
                />
                <Route
                  path="/supply-chain"
                  element={
                    <Suspense fallback={<PageLoading />}>
                      <SupplyChainPage />
                    </Suspense>
                  }
                />
                <Route
                  path="/bottlenecks"
                  element={
                    <Suspense fallback={<PageLoading />}>
                      <BottlenecksPage />
                    </Suspense>
                  }
                />
                <Route
                  path="/risk-map"
                  element={
                    <Suspense fallback={<PageLoading />}>
                      <RiskMapPage />
                    </Suspense>
                  }
                />
                <Route
                  path="/moats"
                  element={
                    <Suspense fallback={<PageLoading />}>
                      <MoatsPage />
                    </Suspense>
                  }
                />
                <Route
                  path="/kpi-dashboard"
                  element={
                    <Suspense fallback={<PageLoading />}>
                      <KpiDashboardPage />
                    </Suspense>
                  }
                />
                <Route
                  path="/kpi-method"
                  element={
                    <Suspense fallback={<PageLoading />}>
                      <KpiMethodPage />
                    </Suspense>
                  }
                />
                <Route
                  path="/compare"
                  element={
                    <Suspense fallback={<PageLoading />}>
                      <ComparePage />
                    </Suspense>
                  }
                />
                <Route
                  path="/kpi-validation"
                  element={
                    <Suspense fallback={<PageLoading />}>
                      <KpiValidationPage />
                    </Suspense>
                  }
                />
                <Route
                  path="/scoring-rubric"
                  element={
                    <Suspense fallback={<PageLoading />}>
                      <ScoringRubricPage />
                    </Suspense>
                  }
                />
                <Route
                  path="/leadership-rubric"
                  element={
                    <Suspense fallback={<PageLoading />}>
                      <LeadershipRubricPage />
                    </Suspense>
                  }
                />
                <Route
                  path="/heatmap"
                  element={
                    <Suspense fallback={<PageLoading />}>
                      <HeatmapPage />
                    </Suspense>
                  }
                />
                <Route
                  path="/watchlist"
                  element={
                    <Suspense fallback={<PageLoading />}>
                      <WatchlistPage />
                    </Suspense>
                  }
                />
                <Route
                  path="/kpi-tuning"
                  element={
                    <Suspense fallback={<PageLoading />}>
                      <KpiTuningPage />
                    </Suspense>
                  }
                />
                <Route
                  path="/data-quality"
                  element={
                    <Suspense fallback={<PageLoading />}>
                      <DataQualityPage />
                    </Suspense>
                  }
                />
                <Route
                  path="/backtest"
                  element={
                    <Suspense fallback={<PageLoading />}>
                      <BacktestPage />
                    </Suspense>
                  }
                />
                <Route
                  path="/journal"
                  element={
                    <Suspense fallback={<PageLoading />}>
                      <JournalPage />
                    </Suspense>
                  }
                />
                <Route
                  path="/changes"
                  element={
                    <Suspense fallback={<PageLoading />}>
                      <ChangesPage />
                    </Suspense>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </BrowserRouter>
          </JournalProvider>
        </WeightsProvider>
      </WatchlistProvider>
    </ThemeProvider>
  </StrictMode>,
);
