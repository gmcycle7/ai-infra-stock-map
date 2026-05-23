import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import { ThemeProvider } from "./context/ThemeContext";
import { WatchlistProvider } from "./context/WatchlistContext";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/Home";
import { CategoriesPage } from "./pages/Categories";
import { CategoryDetailPage } from "./pages/CategoryDetail";
import { CompaniesPage } from "./pages/Companies";
import { CompanyDetailPage } from "./pages/CompanyDetail";
import { GlossaryPage } from "./pages/Glossary";
import { SupplyChainPage } from "./pages/SupplyChain";
import { BottlenecksPage } from "./pages/Bottlenecks";
import { RiskMapPage } from "./pages/RiskMap";
import { MoatsPage } from "./pages/Moats";
import { KpiDashboardPage } from "./pages/KpiDashboard";
import { KpiMethodPage } from "./pages/KpiMethod";
import { ComparePage } from "./pages/Compare";
import { KpiValidationPage } from "./pages/KpiValidation";
import { ScoringRubricPage } from "./pages/ScoringRubric";
import { HeatmapPage } from "./pages/Heatmap";
import { LeadershipRubricPage } from "./pages/LeadershipRubric";
import { WatchlistPage } from "./pages/Watchlist";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <WatchlistProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/category/:slug" element={<CategoryDetailPage />} />
            <Route path="/companies" element={<CompaniesPage />} />
            <Route path="/company/:id" element={<CompanyDetailPage />} />
            <Route path="/glossary" element={<GlossaryPage />} />
            <Route path="/supply-chain" element={<SupplyChainPage />} />
            <Route path="/bottlenecks" element={<BottlenecksPage />} />
            <Route path="/risk-map" element={<RiskMapPage />} />
            <Route path="/moats" element={<MoatsPage />} />
            <Route path="/kpi-dashboard" element={<KpiDashboardPage />} />
            <Route path="/kpi-method" element={<KpiMethodPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/kpi-validation" element={<KpiValidationPage />} />
            <Route path="/scoring-rubric" element={<ScoringRubricPage />} />
            <Route path="/leadership-rubric" element={<LeadershipRubricPage />} />
            <Route path="/heatmap" element={<HeatmapPage />} />
            <Route path="/watchlist" element={<WatchlistPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
      </WatchlistProvider>
    </ThemeProvider>
  </StrictMode>,
);
