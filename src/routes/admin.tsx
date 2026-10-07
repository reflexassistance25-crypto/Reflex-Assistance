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
  Image as ImageIcon,
  Camera,
  Plus,
  Trash2,
  Upload,
  Link2,
  RotateCcw,
  AlertCircle,
  Check,
  EyeOff,
  SlidersHorizontal,
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
import {
  getStoredLogos,
  saveStoredLogos,
  getStoredPhotos,
  saveStoredPhotos,
  resetMediaToDefaults,
  processImageFile,
  getMediaSettings,
  saveMediaSettings,
  type PartnerLogo,
  type ShowcasePhoto,
  type MediaSettings,
} from "@/lib/media-store";

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
  const [activeTab, setActiveTab] = useState<"stats" | "ga" | "seo" | "media">("stats");
  const [mediaSubTab, setMediaSubTab] = useState<"logos" | "photos">("logos");
  const [gaId, setGaId] = useState("");
  const [savedGaId, setSavedGaId] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [testSent, setTestSent] = useState(false);
  const [stats, setStats] = useState<LocalStats | null>(null);
  const [period, setPeriod] = useState<"7d" | "30d">("7d");
  const [serpDevice, setSerpDevice] = useState<"mobile" | "desktop">("mobile");
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // ── MÉDIATHÈQUE STATE ──
  const [logos, setLogos] = useState<PartnerLogo[]>([]);
  const [photos, setPhotos] = useState<ShowcasePhoto[]>([]);
  const [mediaSettings, setMediaSettings] = useState<MediaSettings>({
    showLogosSection: true,
    showGallerySection: true,
    galleryPreviewCount: 3,
  });
  const [mediaNotification, setMediaNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Form states for Logos
  const [newLogoName, setNewLogoName] = useState("");
  const [newLogoUrl, setNewLogoUrl] = useState("");
  const [newLogoLink, setNewLogoLink] = useState("");
  const [newLogoCategory, setNewLogoCategory] = useState("Systèmes");
  const [logoUploadLoading, setLogoUploadLoading] = useState(false);

  // Form states for Photos
  const [newPhotoTitle, setNewPhotoTitle] = useState("");
  const [newPhotoDesc, setNewPhotoDesc] = useState("");
  const [newPhotoUrl, setNewPhotoUrl] = useState("");
  const [newPhotoCategory, setNewPhotoCategory] = useState("Atelier & Dépannage");
  const [photoUploadLoading, setPhotoUploadLoading] = useState(false);

  useEffect(() => {
    const currentGaId = getGAMeasurementId();
    setGaId(currentGaId);
    setSavedGaId(currentGaId);
    setStats(getSiteStats());
    setLogos(getStoredLogos());
    setPhotos(getStoredPhotos());
    setMediaSettings(getMediaSettings());
  }, []);

  const notifyMedia = (message: string, type: "success" | "error" = "success") => {
    setMediaNotification({ type, message });
    setTimeout(() => setMediaNotification(null), 4000);
  };

  const handleLogoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setLogoUploadLoading(true);
      const base64 = await processImageFile(file, 400, 400, 0.9);
      setNewLogoUrl(base64);
      notifyMedia("Logo chargé et optimisé avec succès !");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur lors de l'import";
      notifyMedia(msg, "error");
    } finally {
      setLogoUploadLoading(false);
      e.target.value = "";
    }
  };

  const handleAddLogo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogoName.trim()) {
      notifyMedia("Veuillez saisir le nom de la marque ou du partenaire", "error");
      return;
    }
    if (!newLogoUrl.trim()) {
      notifyMedia("Veuillez importer une image ou fournir un lien d'image", "error");
      return;
    }
    const newLogo: PartnerLogo = {
      id: `logo-${Date.now()}`,
      name: newLogoName.trim(),
      imageUrl: newLogoUrl.trim(),
      linkUrl: newLogoLink.trim() || undefined,
      category: newLogoCategory.trim() || "Marques",
      enabled: true,
    };
    const updated = [newLogo, ...logos];
    setLogos(updated);
    saveStoredLogos(updated);
    setNewLogoName("");
    setNewLogoUrl("");
    setNewLogoLink("");
    notifyMedia(`Logo "${newLogo.name}" ajouté et activé sur le site !`);
  };

  const handleToggleLogo = (id: string) => {
    const updated = logos.map((l) => (l.id === id ? { ...l, enabled: !l.enabled } : l));
    setLogos(updated);
    saveStoredLogos(updated);
    notifyMedia("Visibilité du logo mise à jour");
  };

  const handleDeleteLogo = (id: string, name: string) => {
    if (!window.confirm(`Supprimer définitivement le logo "${name}" ?`)) return;
    const updated = logos.filter((l) => l.id !== id);
    setLogos(updated);
    saveStoredLogos(updated);
    notifyMedia(`Logo "${name}" retiré`);
  };

  const handlePhotoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setPhotoUploadLoading(true);
      const base64 = await processImageFile(file, 1200, 900, 0.85);
      setNewPhotoUrl(base64);
      notifyMedia("Photo chargée et optimisée avec succès !");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur lors de l'import";
      notifyMedia(msg, "error");
    } finally {
      setPhotoUploadLoading(false);
      e.target.value = "";
    }
  };

  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoTitle.trim()) {
      notifyMedia("Veuillez saisir un titre pour la photo", "error");
      return;
    }
    if (!newPhotoUrl.trim()) {
      notifyMedia("Veuillez importer une photo ou fournir une URL", "error");
      return;
    }
    const newPhoto: ShowcasePhoto = {
      id: `photo-${Date.now()}`,
      title: newPhotoTitle.trim(),
      description: newPhotoDesc.trim() || "Intervention réalisée par Reflex' Assistance",
      category: newPhotoCategory.trim() || "Atelier & Dépannage",
      imageUrl: newPhotoUrl.trim(),
      enabled: true,
    };
    const updated = [newPhoto, ...photos];
    setPhotos(updated);
    saveStoredPhotos(updated);
    setNewPhotoTitle("");
    setNewPhotoDesc("");
    setNewPhotoUrl("");
    notifyMedia(`Photo "${newPhoto.title}" ajoutée à la galerie !`);
  };

  const handleTogglePhoto = (id: string) => {
    const updated = photos.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p));
    setPhotos(updated);
    saveStoredPhotos(updated);
    notifyMedia("Visibilité de la photo mise à jour");
  };

  const handleDeletePhoto = (id: string, title: string) => {
    if (!window.confirm(`Supprimer définitivement la photo "${title}" ?`)) return;
    const updated = photos.filter((p) => p.id !== id);
    setPhotos(updated);
    saveStoredPhotos(updated);
    notifyMedia(`Photo "${title}" retirée`);
  };

  const handleResetMedia = () => {
    if (!window.confirm("Réinitialiser tous les logos et photos aux valeurs par défaut d'origine ? Vos ajouts personnalisés seront effacés.")) return;
    resetMediaToDefaults();
    setLogos(getStoredLogos());
    setPhotos(getStoredPhotos());
    setMediaSettings(getMediaSettings());
    notifyMedia("Médias réinitialisés aux valeurs d'origine");
  };

  const handleToggleSection = (key: keyof MediaSettings, value: boolean | number) => {
    const updated = { ...mediaSettings, [key]: value };
    setMediaSettings(updated);
    saveMediaSettings(updated);
    const labels: Record<string, string> = {
      showLogosSection: "Section Logos & Marques",
      showGallerySection: "Section Galerie Photos",
      galleryPreviewCount: "Nombre de photos en aperçu",
    };
    notifyMedia(`${labels[key] ?? key} mis à jour`);
  };

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
          <button
            onClick={() => setActiveTab("media")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === "media"
                ? "bg-emerald-500 text-slate-950 font-semibold shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <ImageIcon className="size-4" /> Médiathèque (Logos &amp; Photos)
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-emerald-400 border border-slate-700">
              {logos.length + photos.length}
            </span>
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

        {/* ================= TAB 4: MÉDIATHÈQUE (LOGOS & PHOTOS) ================= */}
        {activeTab === "media" && (
          <div className="space-y-8">
            {/* Header + Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2.5">
                  <ImageIcon className="size-6 text-emerald-400" />
                  Médiathèque Dynamique (Logos &amp; Photos)
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                  Ajoutez, masquez ou retirez les logos de partenaires et les photos de vos interventions. Les modifications sont répercutées en temps réel sur la page d'accueil.
                </p>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={handleResetMedia}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg transition-colors"
                >
                  <RotateCcw className="size-3.5" /> Réinitialiser par défaut
                </button>
              </div>
            </div>

            {/* Toast Notification */}
            {mediaNotification && (
              <div
                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm transition-all duration-300 animate-in fade-in slide-in-from-top-2 ${
                  mediaNotification.type === "success"
                    ? "bg-emerald-950/70 border-emerald-800 text-emerald-300"
                    : "bg-red-950/70 border-red-800 text-red-300"
                }`}
              >
                {mediaNotification.type === "success" ? (
                  <Check className="size-4 shrink-0 text-emerald-400" />
                ) : (
                  <AlertCircle className="size-4 shrink-0 text-red-400" />
                )}
                <span>{mediaNotification.message}</span>
              </div>
            )}

            {/* 🎛️ Panneau de Contrôle & Visibilité des Sections sur le Site */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 backdrop-blur-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
                <div>
                  <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                    <SlidersHorizontal className="size-4 text-emerald-400" />
                    Affichage &amp; Visibilité des sections sur le site
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Activez ou masquez les sections Logos et Galerie sur la page d'accueil d'un simple clic.
                  </p>
                </div>
                <Link
                  to="/galerie"
                  target="_blank"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 rounded-lg hover:bg-emerald-900/60 transition-colors w-fit"
                >
                  <ExternalLink className="size-3.5" />
                  Ouvrir la page dédiée Galerie ↗
                </Link>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 mt-5">
                {/* Section Logos */}
                <div
                  className={`p-4 rounded-xl border transition-all ${
                    mediaSettings.showLogosSection
                      ? "bg-slate-800/40 border-slate-700/80"
                      : "bg-slate-950/60 border-slate-800/80 opacity-90"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        Section 1 · Accueil
                      </span>
                      <h3 className="text-sm font-semibold text-white mt-0.5 flex items-center gap-2">
                        Logos &amp; Marques Partenaires
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        Bandeau présentant les logos et constructeurs pris en charge (Apple, Dell, Microsoft...).
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleSection("showLogosSection", !mediaSettings.showLogosSection)}
                      className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        mediaSettings.showLogosSection
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30"
                          : "bg-slate-800 text-slate-400 border border-slate-700 hover:text-slate-200"
                      }`}
                    >
                      {mediaSettings.showLogosSection ? (
                        <>
                          <Eye className="size-3.5 text-emerald-400" />
                          Visible sur l'accueil
                        </>
                      ) : (
                        <>
                          <EyeOff className="size-3.5 text-slate-400" />
                          Masqué du site
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Section Galerie */}
                <div
                  className={`p-4 rounded-xl border transition-all ${
                    mediaSettings.showGallerySection
                      ? "bg-slate-800/40 border-slate-700/80"
                      : "bg-slate-950/60 border-slate-800/80 opacity-90"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        Section 2 · Accueil
                      </span>
                      <h3 className="text-sm font-semibold text-white mt-0.5 flex items-center gap-2">
                        Galerie Réalisations (Aperçu)
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        Aperçu compact sur la page d'accueil avec redirection vers la page dédiée complète.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleSection("showGallerySection", !mediaSettings.showGallerySection)}
                      className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        mediaSettings.showGallerySection
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30"
                          : "bg-slate-800 text-slate-400 border border-slate-700 hover:text-slate-200"
                      }`}
                    >
                      {mediaSettings.showGallerySection ? (
                        <>
                          <Eye className="size-3.5 text-emerald-400" />
                          Visible sur l'accueil
                        </>
                      ) : (
                        <>
                          <EyeOff className="size-3.5 text-slate-400" />
                          Masqué de l'accueil
                        </>
                      )}
                    </button>
                  </div>

                  {mediaSettings.showGallerySection && (
                    <div className="mt-3.5 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                      <span className="text-xs text-slate-400">Photos affichées en aperçu :</span>
                      <div className="inline-flex rounded-lg bg-slate-950 p-1 border border-slate-800">
                        {[3, 4, 6].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => handleToggleSection("galleryPreviewCount", num)}
                            className={`px-2.5 py-0.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                              mediaSettings.galleryPreviewCount === num
                                ? "bg-emerald-600 text-white shadow-xs"
                                : "text-slate-400 hover:text-slate-200"
                            }`}
                          >
                            {num} {num === 3 ? "photos" : ""}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Subtabs Switcher */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <button
                type="button"
                onClick={() => setMediaSubTab("logos")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  mediaSubTab === "logos"
                    ? "bg-slate-800 text-white font-semibold"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
              >
                <Layers className="size-4 text-emerald-400" />
                Logos &amp; Marques ({logos.filter((l) => l.enabled).length}/{logos.length} actifs)
              </button>
              <button
                type="button"
                onClick={() => setMediaSubTab("photos")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  mediaSubTab === "photos"
                    ? "bg-slate-800 text-white font-semibold"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
              >
                <Camera className="size-4 text-emerald-400" />
                Galerie Photos &amp; Atelier ({photos.filter((p) => p.enabled).length}/{photos.length} actives)
              </button>
            </div>

            {/* ──────── SUBTAB 1 : LOGOS ──────── */}
            {mediaSubTab === "logos" && (
              <div className="space-y-6">
                {!mediaSettings.showLogosSection && (
                  <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs">
                    <div className="flex items-center gap-2">
                      <EyeOff className="size-4 shrink-0 text-amber-400" />
                      <span>
                        <strong>Information :</strong> La section Logos &amp; Marques est actuellement <u>masquée</u> sur la page d'accueil.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleSection("showLogosSection", true)}
                      className="underline hover:text-white font-medium shrink-0 cursor-pointer"
                    >
                      Afficher sur l'accueil
                    </button>
                  </div>
                )}

                {/* Formulaire d'ajout de logo */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                  <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                    <Plus className="size-4 text-emerald-400" />
                    Ajouter un logo de partenaire ou de marque
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Le logo apparaîtra automatiquement dans le bandeau de confiance et la section dédiée sur la page d'accueil.
                  </p>

                  <form onSubmit={handleAddLogo} className="mt-5 space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">
                          Nom de la marque / partenaire *
                        </label>
                        <input
                          type="text"
                          required
                          value={newLogoName}
                          onChange={(e) => setNewLogoName(e.target.value)}
                          placeholder="Ex: Dell, Apple, Cisco..."
                          className="w-full h-10 px-3 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">
                          Catégorie
                        </label>
                        <select
                          value={newLogoCategory}
                          onChange={(e) => setNewLogoCategory(e.target.value)}
                          className="w-full h-10 px-3 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                        >
                          <option value="Systèmes">Systèmes</option>
                          <option value="Matériel">Matériel</option>
                          <option value="Réseau & Sauvegarde">Réseau &amp; Sauvegarde</option>
                          <option value="Composants">Composants</option>
                          <option value="Partenaires">Partenaires</option>
                          <option value="Certifications">Certifications</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">
                          Lien web optionnel (redirection)
                        </label>
                        <div className="relative">
                          <Link2 className="size-3.5 absolute left-3 top-3.5 text-slate-500" />
                          <input
                            type="url"
                            value={newLogoLink}
                            onChange={(e) => setNewLogoLink(e.target.value)}
                            placeholder="https://..."
                            className="w-full h-10 pl-9 pr-3 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Sélection de l'image (Upload ou URL) */}
                    <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t border-slate-800/80">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                          <Upload className="size-3.5 text-emerald-400" /> Option A : Importer une image (SVG, PNG, JPG)
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoFileUpload}
                          disabled={logoUploadLoading}
                          className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700 cursor-pointer"
                        />
                        <p className="text-[11px] text-slate-500 mt-1">
                          L'image est automatiquement optimisée pour le navigateur.
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                          <Link2 className="size-3.5 text-slate-400" /> Option B : Ou coller l'URL directe de l'image
                        </label>
                        <input
                          type="url"
                          value={newLogoUrl}
                          onChange={(e) => setNewLogoUrl(e.target.value)}
                          placeholder="https://.../logo.svg"
                          className="w-full h-10 px-3 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    {/* Aperçu en direct */}
                    {newLogoUrl && (
                      <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                        <div className="h-12 w-28 rounded-lg bg-white/95 p-2 flex items-center justify-center shrink-0 shadow-sm">
                          <img
                            src={newLogoUrl}
                            alt="Aperçu logo"
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <div className="text-xs">
                          <p className="font-semibold text-slate-200">Aperçu du logo : {newLogoName || "Sans nom"}</p>
                          <p className="text-slate-400 text-[11px] truncate max-w-md">{newLogoCategory}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        disabled={logoUploadLoading}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm transition-colors shadow-sm disabled:opacity-50"
                      >
                        <Plus className="size-4" /> Enregistrer le logo
                      </button>
                    </div>
                  </form>
                </div>

                {/* Liste des logos existants */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-slate-200">
                      Logos enregistrés ({logos.length})
                    </h3>
                    <span className="text-xs text-slate-500">
                      Cliquez sur l'interrupteur pour masquer ou afficher un logo sans le supprimer.
                    </span>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {logos.map((logo) => (
                      <div
                        key={logo.id}
                        className={`rounded-xl border p-3.5 transition-all flex flex-col justify-between ${
                          logo.enabled
                            ? "bg-slate-900/80 border-slate-800 hover:border-slate-700"
                            : "bg-slate-950/50 border-slate-900 opacity-60"
                        }`}
                      >
                        <div>
                          {/* Conteneur d'image blanc pour lisibilité des logos */}
                          <div className="h-16 w-full rounded-lg bg-white/95 p-2.5 flex items-center justify-center mb-3 shadow-inner">
                            <img
                              src={logo.imageUrl}
                              alt={logo.name}
                              className="max-h-full max-w-full object-contain"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "https://via.placeholder.com/120x60?text=Logo";
                              }}
                            />
                          </div>

                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <h4 className="text-sm font-semibold text-slate-100 truncate">
                                {logo.name}
                              </h4>
                              <span className="inline-block mt-0.5 text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                                {logo.category}
                              </span>
                            </div>
                            {logo.linkUrl && (
                              <a
                                href={logo.linkUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-slate-400 hover:text-emerald-400 p-1"
                                title="Ouvrir le lien"
                              >
                                <ExternalLink className="size-3.5" />
                              </a>
                            )}
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => handleToggleLogo(logo.id)}
                            className={`text-xs font-medium px-2.5 py-1 rounded-md transition-colors ${
                              logo.enabled
                                ? "bg-emerald-950 text-emerald-300 border border-emerald-800/80"
                                : "bg-slate-800 text-slate-400 border border-slate-700"
                            }`}
                          >
                            {logo.enabled ? "Visible sur le site" : "Masqué"}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteLogo(logo.id, logo.name)}
                            className="p-1.5 rounded-md text-slate-400 hover:text-red-400 hover:bg-red-950/40 transition-colors"
                            title="Supprimer ce logo"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ──────── SUBTAB 2 : PHOTOS ──────── */}
            {mediaSubTab === "photos" && (
              <div className="space-y-6">
                {!mediaSettings.showGallerySection && (
                  <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs">
                    <div className="flex items-center gap-2">
                      <EyeOff className="size-4 shrink-0 text-amber-400" />
                      <span>
                        <strong>Information :</strong> La section Galerie Photos est actuellement <u>masquée</u> sur la page d'accueil (la page dédiée /galerie reste toujours accessible).
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleSection("showGallerySection", true)}
                      className="underline hover:text-white font-medium shrink-0 cursor-pointer"
                    >
                      Afficher sur l'accueil
                    </button>
                  </div>
                )}

                {/* Formulaire d'ajout de photo */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                  <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                    <Plus className="size-4 text-emerald-400" />
                    Ajouter une photo d'intervention ou de réalisation
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    La photo apparaîtra dans la section Galerie Photos &amp; Interventions de la page d'accueil avec zoom interactif.
                  </p>

                  <form onSubmit={handleAddPhoto} className="mt-5 space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">
                          Titre de la photo / intervention *
                        </label>
                        <input
                          type="text"
                          required
                          value={newPhotoTitle}
                          onChange={(e) => setNewPhotoTitle(e.target.value)}
                          placeholder="Ex: Remplacement écran iMac & sauvegarde..."
                          className="w-full h-10 px-3 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">
                          Catégorie
                        </label>
                        <select
                          value={newPhotoCategory}
                          onChange={(e) => setNewPhotoCategory(e.target.value)}
                          className="w-full h-10 px-3 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                        >
                          <option value="Atelier & Dépannage">Atelier &amp; Dépannage</option>
                          <option value="Réseau & Câblage">Réseau &amp; Câblage</option>
                          <option value="Données & Sécurité">Données &amp; Sécurité</option>
                          <option value="Sur site & Bureau">Sur site &amp; Bureau</option>
                          <option value="Équipements">Équipements</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Description / Détails de l'intervention
                      </label>
                      <textarea
                        rows={2}
                        value={newPhotoDesc}
                        onChange={(e) => setNewPhotoDesc(e.target.value)}
                        placeholder="Ex: Diagnostic approfondi, dépoussiérage et changement pâte thermique..."
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    {/* Sélection de la photo (Upload ou URL) */}
                    <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t border-slate-800/80">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                          <Upload className="size-3.5 text-emerald-400" /> Option A : Importer votre photo depuis l'appareil
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoFileUpload}
                          disabled={photoUploadLoading}
                          className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700 cursor-pointer"
                        />
                        <p className="text-[11px] text-slate-500 mt-1">
                          La photo est automatiquement redimensionnée et compressée en haute définition.
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                          <Link2 className="size-3.5 text-slate-400" /> Option B : Ou coller l'URL directe d'une photo
                        </label>
                        <input
                          type="url"
                          value={newPhotoUrl}
                          onChange={(e) => setNewPhotoUrl(e.target.value)}
                          placeholder="https://images.unsplash.com/... ou URL image"
                          className="w-full h-10 px-3 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    {/* Aperçu en direct */}
                    {newPhotoUrl && (
                      <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                        <img
                          src={newPhotoUrl}
                          alt="Aperçu photo"
                          className="h-20 w-32 object-cover rounded-lg shrink-0 border border-slate-700"
                        />
                        <div className="text-xs">
                          <p className="font-semibold text-slate-200">Aperçu : {newPhotoTitle || "Sans titre"}</p>
                          <span className="inline-block mt-0.5 text-[10px] bg-slate-800 text-emerald-400 px-2 py-0.5 rounded-full">
                            {newPhotoCategory}
                          </span>
                          <p className="text-slate-400 text-[11px] mt-1 line-clamp-1">{newPhotoDesc}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        disabled={photoUploadLoading}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm transition-colors shadow-sm disabled:opacity-50"
                      >
                        <Plus className="size-4" /> Publier la photo
                      </button>
                    </div>
                  </form>
                </div>

                {/* Liste des photos existantes */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-slate-200">
                      Photos de la galerie ({photos.length})
                    </h3>
                    <span className="text-xs text-slate-500">
                      Cliquez pour masquer ou supprimer une photo.
                    </span>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {photos.map((photo) => (
                      <div
                        key={photo.id}
                        className={`rounded-xl border overflow-hidden transition-all flex flex-col justify-between ${
                          photo.enabled
                            ? "bg-slate-900/80 border-slate-800 hover:border-slate-700"
                            : "bg-slate-950/50 border-slate-900 opacity-60"
                        }`}
                      >
                        <div>
                          <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                            <img
                              src={photo.imageUrl}
                              alt={photo.title}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80";
                              }}
                            />
                            <span className="absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-950/80 text-emerald-400 backdrop-blur border border-slate-800">
                              {photo.category}
                            </span>
                          </div>

                          <div className="p-4">
                            <h4 className="text-sm font-semibold text-slate-100 line-clamp-1">
                              {photo.title}
                            </h4>
                            <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                              {photo.description}
                            </p>
                          </div>
                        </div>

                        <div className="p-4 pt-0 flex items-center justify-between border-t border-slate-800/60 mt-2">
                          <button
                            type="button"
                            onClick={() => handleTogglePhoto(photo.id)}
                            className={`text-xs font-medium px-2.5 py-1 rounded-md transition-colors ${
                              photo.enabled
                                ? "bg-emerald-950 text-emerald-300 border border-emerald-800/80"
                                : "bg-slate-800 text-slate-400 border border-slate-700"
                            }`}
                          >
                            {photo.enabled ? "Affichée" : "Masquée"}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeletePhoto(photo.id, photo.title)}
                            className="p-1.5 rounded-md text-slate-400 hover:text-red-400 hover:bg-red-950/40 transition-colors"
                            title="Supprimer cette photo"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
