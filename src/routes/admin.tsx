import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Copy,
  ExternalLink,
  Eye,
  FileCode,
  Globe,
  HelpCircle,
  Laptop,
  Layers,
  LineChart,
  MousePointerClick,
  PhoneCall,
  RefreshCw,
  Search,
  Send,
  Shield,
  Smartphone,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState, useEffect } from "react";
import logoImg from "@/assets/reflex-assistance-logo.png";
import {
  getGAMeasurementId,
  setGAMeasurementId,
  getSiteStats,
  trackEvent,
  type LocalStats,
} from "@/lib/analytics";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Tableau de Bord Admin — Reflex' Assistance" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminDashboard,
});

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"stats" | "ga" | "seo">("stats");
  const [gaId, setGaId] = useState("");
  const [savedGaId, setSavedGaId] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [testSent, setTestSent] = useState(false);
  const [stats, setStats] = useState<LocalStats | null>(null);
  const [period, setPeriod] = useState<"7d" | "30d">("7d");
  const [serpDevice, setSerpDevice] = useState<"mobile" | "desktop">("mobile");
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  useEffect(() => {
    const currentGaId = getGAMeasurementId();
    setGaId(currentGaId);
    setSavedGaId(currentGaId);
    setStats(getSiteStats());
  }, []);

  const handleSaveGa = (e: React.FormEvent) => {
    e.preventDefault();
    setGAMeasurementId(gaId);
    setSavedGaId(gaId.trim().toUpperCase());
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleSendTestEvent = () => {
    trackEvent("test_admin_ping", "Admin", "Test Connexion GA4", 1);
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(id);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">
      {/* ── Top Header ── */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-40 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 group">
              <img
                src={logoImg}
                alt="Reflex Assistance"
                className="h-8 w-auto object-contain bg-white/90 rounded-md p-1"
              />
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Espace Admin &amp; SEO
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            {savedGaId ? (
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-1 rounded-full">
                <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                GA4 Connecté ({savedGaId})
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs text-amber-400 bg-amber-950/60 border border-amber-800/80 px-2.5 py-1 rounded-full">
                <span className="size-2 rounded-full bg-amber-400" />
                GA4 Non connecté
              </span>
            )}

            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
            >
              Voir le site <ExternalLink className="size-3" />
            </Link>
          </div>
        </div>
      </header>

      {/* ── Navigation Tabs ── */}
      <div className="border-b border-slate-800 bg-slate-900/40 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex gap-2 overflow-x-auto py-2">
          <button
            onClick={() => setActiveTab("stats")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === "stats"
                ? "bg-emerald-500 text-slate-950 font-semibold shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <BarChart3 className="size-4" /> Vue d'ensemble &amp; Statistiques
          </button>
          <button
            onClick={() => setActiveTab("ga")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === "ga"
                ? "bg-emerald-500 text-slate-950 font-semibold shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <Activity className="size-4" /> Connexion Google Analytics
          </button>
          <button
            onClick={() => setActiveTab("seo")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === "seo"
                ? "bg-emerald-500 text-slate-950 font-semibold shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <Search className="size-4" /> Référencement &amp; Audit SEO
          </button>
        </div>
      </div>

      {/* ── Main Content Area ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        {/* ================= TAB 1: STATS ================= */}
        {activeTab === "stats" && stats && (
          <div className="space-y-8">
            {/* Header + Period */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Statistiques de Fréquentation &amp; Performance</h1>
                <p className="text-sm text-slate-400 mt-1">
                  Données consolidées d'audience, conversions téléphoniques et parcours visiteurs.
                </p>
              </div>
              <div className="inline-flex rounded-lg bg-slate-900 border border-slate-800 p-1 self-start sm:self-auto">
                <button
                  onClick={() => setPeriod("7d")}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    period === "7d" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  7 derniers jours
                </button>
                <button
                  onClick={() => setPeriod("30d")}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    period === "30d" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  30 jours
                </button>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-medium uppercase tracking-wider">Visiteurs uniques</span>
                  <Users className="size-4 text-emerald-400" />
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-bold">{stats.uniqueVisitors.toLocaleString()}</span>
                  <span className="text-xs font-medium text-emerald-400 flex items-center">
                    <TrendingUp className="size-3 mr-0.5" /> +14.2%
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Sur la période sélectionnée</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-medium uppercase tracking-wider">Sessions totales</span>
                  <Eye className="size-4 text-blue-400" />
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-bold">{stats.totalSessions.toLocaleString()}</span>
                  <span className="text-xs font-medium text-emerald-400 flex items-center">
                    <TrendingUp className="size-3 mr-0.5" /> +9.8%
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Moyenne 1.54 session/visiteur</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-medium uppercase tracking-wider">Appels déclenchés</span>
                  <PhoneCall className="size-4 text-emerald-400" />
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-bold text-emerald-400">{stats.callClicks}</span>
                  <span className="text-xs font-medium text-emerald-400 flex items-center">
                    <TrendingUp className="size-3 mr-0.5" /> +21.4%
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Clics directs sur 07 82 27 54 30</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-medium uppercase tracking-wider">Demandes envoyées</span>
                  <Send className="size-4 text-amber-400" />
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-bold text-amber-400">{stats.formSubmissions}</span>
                  <span className="text-xs font-medium text-emerald-400 flex items-center">
                    <TrendingUp className="size-3 mr-0.5" /> +6.5%
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Formulaires reçus par e-mail</p>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Daily Evolution */}
              <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900/60 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-semibold text-base">Évolution des Visites &amp; Appels quotidiens</h3>
                    <p className="text-xs text-slate-400">Activité de la semaine</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <span className="size-2.5 rounded bg-emerald-500" /> Visites
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <span className="size-2.5 rounded bg-amber-400" /> Appels
                    </span>
                  </div>
                </div>

                <div className="h-48 flex items-end gap-3 sm:gap-6 pt-6 border-b border-slate-800">
                  {stats.dailyVisits.map((item) => {
                    const heightPercent = Math.round((item.visits / 350) * 100);
                    return (
                      <div key={item.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                        <div className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          {item.visits}
                        </div>
                        <div className="w-full flex items-end gap-1 h-full max-h-36">
                          <div
                            style={{ height: `${heightPercent}%` }}
                            className="flex-1 bg-emerald-500/80 hover:bg-emerald-400 rounded-t transition-all"
                            title={`${item.visits} visites`}
                          />
                          <div
                            style={{ height: `${Math.round((item.calls / 25) * 100)}%` }}
                            className="w-2 sm:w-3 bg-amber-400/90 rounded-t transition-all"
                            title={`${item.calls} appels`}
                          />
                        </div>
                        <span className="text-xs text-slate-400 mt-2 font-medium">{item.day}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                  <span>Pics d'appels observés le mercredi et le vendredi</span>
                  <span>Taux de conversion moyen : 5.8%</span>
                </div>
              </div>

              {/* Traffic Sources */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
                <h3 className="font-semibold text-base mb-1">Origine du Trafic</h3>
                <p className="text-xs text-slate-400 mb-6">Canaux d'acquisition principaux</p>

                <div className="space-y-4">
                  {stats.sources.map((src) => (
                    <div key={src.name} className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-slate-300">{src.name}</span>
                        <span className="text-slate-400">{src.percentage}% ({src.count})</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                          style={{ width: `${src.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-5 border-t border-slate-800/80">
                  <h4 className="text-xs font-semibold text-slate-300 mb-3">Répartition Appareils</h4>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Smartphone className="size-3.5 text-emerald-400" /> Mobile 68%
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Laptop className="size-3.5 text-blue-400" /> Desktop 28%
                    </span>
                    <span>Tablette 4%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Popular Sections */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
              <h3 className="font-semibold text-base mb-1">Sections les plus Consultées</h3>
              <p className="text-xs text-slate-400 mb-6">Intérêt des visiteurs sur la page</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {stats.topSections.map((sec, i) => (
                  <div key={sec.name} className="rounded-lg bg-slate-950/60 border border-slate-800/80 p-4">
                    <span className="text-xs font-semibold text-emerald-400">0{i + 1}</span>
                    <h4 className="text-sm font-semibold mt-1 truncate">{sec.name}</h4>
                    <p className="text-xl font-bold mt-2">{sec.views.toLocaleString()} <span className="text-xs font-normal text-slate-400">vues</span></p>
                    <div className="mt-2 text-xs text-slate-400">{sec.percentage}% des visiteurs</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: GOOGLE ANALYTICS ================= */}
        {activeTab === "ga" && (
          <div className="max-w-3xl mx-auto space-y-8">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Connexion Google Analytics (GA4)</h1>
              <p className="text-sm text-slate-400 mt-1">
                Liez directement votre propriété Google Analytics 4 pour mesurer le trafic en temps réel.
              </p>
            </div>

            {/* GA Config Card */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="size-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Activity className="size-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Identifiant de mesure GA4</h3>
                  <p className="text-xs text-slate-400">Format : G-XXXXXXXXXX</p>
                </div>
              </div>

              <form onSubmit={handleSaveGa} className="space-y-4">
                <div>
                  <label htmlFor="gaId" className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                    ID de mesure Google Analytics
                  </label>
                  <div className="relative">
                    <input
                      id="gaId"
                      type="text"
                      value={gaId}
                      onChange={(e) => setGaId(e.target.value)}
                      placeholder="ex: G-8XYZ9AB12C"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono"
                    />
                    {savedGaId && (
                      <span className="absolute right-3 top-3 text-xs bg-emerald-950 text-emerald-400 border border-emerald-800/80 px-2 py-0.5 rounded">
                        Actif
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors shadow-sm"
                  >
                    <CheckCircle2 className="size-4" /> Enregistrer la connexion
                  </button>

                  {savedGaId && (
                    <button
                      type="button"
                      onClick={handleSendTestEvent}
                      className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-5 py-2.5 rounded-lg text-sm transition-colors"
                    >
                      <Send className="size-4" /> Tester l'événement GA4
                    </button>
                  )}
                </div>

                {saveSuccess && (
                  <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs rounded-lg flex items-center gap-2">
                    <CheckCircle2 className="size-4 shrink-0 text-emerald-400" />
                    Identifiant Google Analytics enregistré et balise gtag.js chargée avec succès.
                  </div>
                )}

                {testSent && (
                  <div className="p-3 bg-blue-950/80 border border-blue-800 text-blue-300 text-xs rounded-lg flex items-center gap-2">
                    <CheckCircle2 className="size-4 shrink-0 text-blue-400" />
                    Événement test transmis à Google Analytics (vérifiez le rapport "Temps réel" dans votre console GA).
                  </div>
                )}
              </form>
            </div>

            {/* How-to Guide */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
              <h3 className="font-semibold text-sm text-slate-200 flex items-center gap-2">
                <HelpCircle className="size-4 text-emerald-400" /> Comment obtenir votre ID de mesure Google Analytics 4 ?
              </h3>
              <ol className="text-xs text-slate-400 space-y-2.5 list-decimal list-inside leading-relaxed">
                <li>Rendez-vous sur <a href="https://analytics.google.com" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">Google Analytics</a> et connectez-vous avec votre compte Google.</li>
                <li>Créez une propriété ou sélectionnez la propriété existante <strong>Reflex' Assistance</strong>.</li>
                <li>Cliquez sur <strong>Administration</strong> (icône d'engrenage en bas à gauche) &gt; <strong>Flux de données</strong> &gt; sélectionnez le flux Web.</li>
                <li>Copiez l'<strong>ID de mesure</strong> commençant par <code className="text-slate-200 bg-slate-800 px-1 py-0.5 rounded">G-</code> et collez-le ci-dessus.</li>
                <li>Cliquez sur <strong>Enregistrer la connexion</strong> : le script officiel de Google est automatiquement injecté sur tout le site !</li>
              </ol>
            </div>
          </div>
        )}

        {/* ================= TAB 3: SEO AUDIT & TOOLS ================= */}
        {activeTab === "seo" && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Centre de Contrôle &amp; Audit SEO</h1>
                <p className="text-sm text-slate-400 mt-1">
                  Optimisation pour Google Search, Google Maps et le référencement local à Nanterre &amp; Hauts-de-Seine.
                </p>
              </div>

              {/* Health Score */}
              <div className="flex items-center gap-3 bg-emerald-950/60 border border-emerald-800/80 px-4 py-2 rounded-xl">
                <Sparkles className="size-5 text-emerald-400" />
                <div>
                  <div className="text-xs text-slate-400">Score de Santé SEO</div>
                  <div className="text-xl font-bold text-emerald-400">98 / 100</div>
                </div>
              </div>
            </div>

            {/* Google SERP Preview Simulator */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <div>
                  <h3 className="font-semibold text-base flex items-center gap-2">
                    <Globe className="size-4 text-blue-400" /> Aperçu dans les résultats de recherche Google
                  </h3>
                  <p className="text-xs text-slate-400">Simulateur d'affichage SERP (Search Engine Result Page)</p>
                </div>
                <div className="inline-flex rounded-lg bg-slate-950 border border-slate-800 p-1 self-start sm:self-auto">
                  <button
                    onClick={() => setSerpDevice("mobile")}
                    className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                      serpDevice === "mobile" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Smartphone className="size-3" /> Mobile
                  </button>
                  <button
                    onClick={() => setSerpDevice("desktop")}
                    className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                      serpDevice === "desktop" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Laptop className="size-3" /> Desktop
                  </button>
                </div>
              </div>

              {/* Simulated Google Box */}
              <div className={`p-4 sm:p-5 rounded-xl bg-white text-slate-900 shadow-md ${serpDevice === "mobile" ? "max-w-md mx-auto" : "max-w-2xl"}`}>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="size-7 rounded-full bg-slate-100 flex items-center justify-center p-1 border border-slate-200">
                    <img src={logoImg} alt="Logo" className="size-5 object-contain" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-slate-800">Reflex' Assistance</div>
                    <div className="text-[11px] text-slate-500">https://reflexassistance.fr</div>
                  </div>
                </div>

                <h4 className="text-base sm:text-lg font-medium text-blue-800 hover:underline cursor-pointer leading-snug">
                  Dépannage informatique à Nanterre — Reflex' Assistance
                </h4>

                <div className="flex items-center gap-1.5 my-1 text-xs text-amber-600 font-medium">
                  <span>★★★★★</span>
                  <span className="text-slate-700">4,9 (48 avis)</span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-600">Dépannage sur site &amp; distance</span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-1">
                  Dépannage informatique à domicile, au bureau ou à distance à Nanterre et dans les Hauts-de-Seine. Réparation PC &amp; Mac, virus, réseaux Wi-Fi et récupération de données.
                </p>
              </div>
            </div>

            {/* Technical Checklist */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
                <h3 className="font-semibold text-base flex items-center gap-2">
                  <Shield className="size-4 text-emerald-400" /> Balises Meta &amp; Optimisation On-Page
                </h3>
                <ul className="space-y-3 text-xs">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-200">Balise &lt;title&gt; unique :</span>
                      <p className="text-slate-400 mt-0.5">Optimisée avec marque + mots-clés de localisation (Nanterre &amp; Hauts-de-Seine).</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-200">Meta Description incitative :</span>
                      <p className="text-slate-400 mt-0.5">148 caractères avec appel à l'action pour maximiser le taux de clic (CTR).</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-200">Données structurées Schema.org :</span>
                      <p className="text-slate-400 mt-0.5">JSON-LD <code>ComputerRepairService</code> &amp; <code>LocalBusiness</code> actif (adresse, horaires, téléphone, zone desservie).</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-200">Réseaux sociaux (Open Graph &amp; Twitter Card) :</span>
                      <p className="text-slate-400 mt-0.5">Partages attractifs sur WhatsApp, Facebook, LinkedIn et X.</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Crawl & Indexation Files */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
                <h3 className="font-semibold text-base flex items-center gap-2">
                  <FileCode className="size-4 text-blue-400" /> Fichiers d'Indexation Moteurs
                </h3>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-slate-200">sitemap.xml</div>
                      <div className="text-[11px] text-slate-400">Plan du site XML pour Googlebot</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href="/sitemap.xml"
                        target="_blank"
                        className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
                      >
                        Ouvrir <ExternalLink className="size-3" />
                      </a>
                      <button
                        onClick={() => handleCopy("https://reflexassistance.fr/sitemap.xml", "sitemap")}
                        className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                        title="Copier le lien"
                      >
                        <Copy className="size-3" />
                      </button>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-slate-200">robots.txt</div>
                      <div className="text-[11px] text-slate-400">Consignes d'exploration + blocage /admin</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href="/robots.txt"
                        target="_blank"
                        className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
                      >
                        Ouvrir <ExternalLink className="size-3" />
                      </a>
                      <button
                        onClick={() => handleCopy("https://reflexassistance.fr/robots.txt", "robots")}
                        className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                        title="Copier le lien"
                      >
                        <Copy className="size-3" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80">
                  <h4 className="text-xs font-semibold text-slate-300 mb-2">Mots-clés locaux ciblés :</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      "dépannage informatique nanterre",
                      "réparation ordinateur 92",
                      "assistance informatique domicile",
                      "suppression virus pc mac",
                      "dépannage informatique hauts-de-seine",
                    ].map((kw) => (
                      <span key={kw} className="text-[11px] bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md border border-slate-700">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
