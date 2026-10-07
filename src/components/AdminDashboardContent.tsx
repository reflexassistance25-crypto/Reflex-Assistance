import { Link } from "@tanstack/react-router";
import {
  Activity,
  BarChart3,
  CheckCircle2,
  Copy,
  ExternalLink,
  Eye,
  FileCode,
  Globe,
  HelpCircle,
  Laptop,
  Layers,
  LineChart,
  Search,
  Send,
  Shield,
  Smartphone,
  Sparkles,
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
  KeyRound,
  Lock,
  RefreshCw,
  Star,
  MessageSquareQuote,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import logoImg from "@/assets/reflex-assistance-logo.png";
import {
  getGAMeasurementId,
  setGAMeasurementId,
  trackEvent,
} from "@/lib/analytics";
import {
  getStoredLogos,
  saveStoredLogos,
  getStoredPhotos,
  saveStoredPhotos,
  getStoredReviews,
  saveStoredReviews,
  resetMediaToDefaults,
  processImageFile,
  getMediaSettings,
  saveMediaSettings,
  type PartnerLogo,
  type ShowcasePhoto,
  type ClientReview,
  type MediaSettings,
} from "@/lib/media-store";
import { getAdminSlug, getAdminTotpSecret } from "@/lib/admin-auth";

const DEFAULT_GA_ID = "G-3E4PTX85SS";

export function AdminDashboardContent() {
  return <AdminDashboardInner />;
}

function AdminDashboardInner() {
  const [activeTab, setActiveTab] = useState<"ga" | "seo" | "media" | "security">("ga");
  const [mediaSubTab, setMediaSubTab] = useState<"logos" | "photos" | "reviews">("logos");
  const [gaId, setGaId] = useState("");
  const [savedGaId, setSavedGaId] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [testSent, setTestSent] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const [logos, setLogos] = useState<PartnerLogo[]>([]);
  const [photos, setPhotos] = useState<ShowcasePhoto[]>([]);
  const [reviews, setReviews] = useState<ClientReview[]>([]);
  const [mediaSettings, setMediaSettings] = useState<MediaSettings>({
    showLogosSection: true,
    showGallerySection: true,
    showReviewsSection: true,
    galleryPreviewCount: 3,
  });
  const [mediaNotification, setMediaNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [newLogoName, setNewLogoName] = useState("");
  const [newLogoUrl, setNewLogoUrl] = useState("");
  const [newLogoLink, setNewLogoLink] = useState("");
  const [newLogoCategory, setNewLogoCategory] = useState("Systèmes");
  const [logoUploadLoading, setLogoUploadLoading] = useState(false);

  const [newPhotoTitle, setNewPhotoTitle] = useState("");
  const [newPhotoDesc, setNewPhotoDesc] = useState("");
  const [newPhotoUrl, setNewPhotoUrl] = useState("");
  const [newPhotoCategory, setNewPhotoCategory] = useState("Atelier & Dépannage");
  const [photoUploadLoading, setPhotoUploadLoading] = useState(false);

  // Reviews form inputs
  const [newReviewAuthor, setNewReviewAuthor] = useState("");
  const [newReviewRole, setNewReviewRole] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewTitle, setNewReviewTitle] = useState("");
  const [newReviewComment, setNewReviewComment] = useState("");

  // Security
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [securityMsg, setSecurityMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [adminSlug, setAdminSlug] = useState("");
  const [totpSecret, setTotpSecret] = useState("");
  const [copiedSecret, setCopiedSecret] = useState(false);

  useEffect(() => {
    const stored = getGAMeasurementId();
    const effectiveId = stored || DEFAULT_GA_ID;
    setGaId(effectiveId);
    setSavedGaId(effectiveId);
    if (!stored) setGAMeasurementId(DEFAULT_GA_ID);
    setLogos(getStoredLogos());
    setPhotos(getStoredPhotos());
    setReviews(getStoredReviews());
    setMediaSettings(getMediaSettings());
    setAdminSlug(getAdminSlug());
    setTotpSecret(getAdminTotpSecret());
  }, []);

  const notifyMedia = useCallback((message: string, type: "success" | "error" = "success") => {
    setMediaNotification({ type, message });
    setTimeout(() => setMediaNotification(null), 4000);
  }, []);

  const notifySecurity = (text: string, type: "success" | "error" = "success") => {
    setSecurityMsg({ type, text });
    setTimeout(() => setSecurityMsg(null), 5000);
  };

  const handleLogoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setLogoUploadLoading(true);
      const base64 = await processImageFile(file, 400, 400, 0.9);
      setNewLogoUrl(base64);
      notifyMedia("Logo chargé !");
    } catch (err: unknown) {
      notifyMedia(err instanceof Error ? err.message : "Erreur import", "error");
    } finally {
      setLogoUploadLoading(false);
      e.target.value = "";
    }
  };

  const handleAddLogo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogoName.trim()) { notifyMedia("Nom requis", "error"); return; }
    if (!newLogoUrl.trim()) { notifyMedia("Image requise", "error"); return; }
    const newLogo: PartnerLogo = {
      id: `logo-${Date.now()}`,
      name: newLogoName.trim(),
      imageUrl: newLogoUrl.trim(),
      linkUrl: newLogoLink.trim() || undefined,
      category: newLogoCategory || "Marques",
      enabled: true,
    };
    const updated = [newLogo, ...logos];
    setLogos(updated); saveStoredLogos(updated);
    setNewLogoName(""); setNewLogoUrl(""); setNewLogoLink("");
    notifyMedia(`Logo "${newLogo.name}" ajouté !`);
  };

  const handleToggleLogo = (id: string) => {
    const updated = logos.map((l) => l.id === id ? { ...l, enabled: !l.enabled } : l);
    setLogos(updated); saveStoredLogos(updated);
    notifyMedia("Visibilité mise à jour");
  };

  const handleDeleteLogo = (id: string, name: string) => {
    if (!window.confirm(`Supprimer "${name}" ?`)) return;
    const updated = logos.filter((l) => l.id !== id);
    setLogos(updated); saveStoredLogos(updated);
    notifyMedia(`Logo "${name}" supprimé`);
  };

  const handlePhotoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setPhotoUploadLoading(true);
      const base64 = await processImageFile(file, 1200, 900, 0.85);
      setNewPhotoUrl(base64);
      notifyMedia("Photo chargée !");
    } catch (err: unknown) {
      notifyMedia(err instanceof Error ? err.message : "Erreur import", "error");
    } finally {
      setPhotoUploadLoading(false);
      e.target.value = "";
    }
  };

  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoTitle.trim()) { notifyMedia("Titre requis", "error"); return; }
    if (!newPhotoUrl.trim()) { notifyMedia("Photo requise", "error"); return; }
    const newPhoto: ShowcasePhoto = {
      id: `photo-${Date.now()}`,
      title: newPhotoTitle.trim(),
      description: newPhotoDesc.trim() || "Intervention Reflex' Assistance",
      category: newPhotoCategory || "Atelier & Dépannage",
      imageUrl: newPhotoUrl.trim(),
      enabled: true,
    };
    const updated = [newPhoto, ...photos];
    setPhotos(updated); saveStoredPhotos(updated);
    setNewPhotoTitle(""); setNewPhotoDesc(""); setNewPhotoUrl("");
    notifyMedia(`Photo "${newPhoto.title}" ajoutée !`);
  };

  const handleTogglePhoto = (id: string) => {
    const updated = photos.map((p) => p.id === id ? { ...p, enabled: !p.enabled } : p);
    setPhotos(updated); saveStoredPhotos(updated);
    notifyMedia("Visibilité mise à jour");
  };

  const handleDeletePhoto = (id: string, title: string) => {
    if (!window.confirm(`Supprimer "${title}" ?`)) return;
    const updated = photos.filter((p) => p.id !== id);
    setPhotos(updated); saveStoredPhotos(updated);
    notifyMedia(`Photo "${title}" supprimée`);
  };

  const handleResetMedia = () => {
    if (!window.confirm("Réinitialiser tous les médias ?")) return;
    resetMediaToDefaults();
    setLogos(getStoredLogos()); setPhotos(getStoredPhotos()); setMediaSettings(getMediaSettings());
    notifyMedia("Médias réinitialisés");
  };

  const handleToggleSection = (key: keyof MediaSettings, value: boolean | number) => {
    const updated = { ...mediaSettings, [key]: value };
    setMediaSettings(updated); saveMediaSettings(updated);
    notifyMedia("Paramètre mis à jour");
  };

  const handleSaveGa = (e: React.FormEvent) => {
    e.preventDefault();
    setGAMeasurementId(gaId);
    setSavedGaId(gaId.trim().toUpperCase());
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleSendTestEvent = () => {
    trackEvent("test_admin_ping", "Admin", "Test GA4", 1);
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(id);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPass = localStorage.getItem("reflex_admin_custom_password")
      || (import.meta.env.VITE_ADMIN_PASSWORD as string)
      || "Reflex2026SecureAdmin!";
    if (currentPassword.trim() !== storedPass.trim()) {
      notifySecurity("Mot de passe actuel incorrect.", "error"); return;
    }
    if (newPassword.length < 10) {
      notifySecurity("Minimum 10 caractères requis.", "error"); return;
    }
    if (newPassword !== confirmPassword) {
      notifySecurity("Les mots de passe ne correspondent pas.", "error"); return;
    }
    localStorage.setItem("reflex_admin_custom_password", newPassword);
    setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    notifySecurity("✅ Mot de passe mis à jour. Reconnectez-vous lors de la prochaine session.");
  };

  const handleCopySecret = () => {
    navigator.clipboard.writeText(totpSecret);
    setCopiedSecret(true);
    setTimeout(() => setCopiedSecret(false), 2000);
  };

  const tabClass = (tab: string) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
      activeTab === tab ? "bg-emerald-500 text-slate-950 font-semibold shadow-sm" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
    }`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-40 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <img src={logoImg} alt="Reflex" className="h-8 w-auto object-contain bg-white/90 rounded-md p-1" />
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Espace Admin & SEO
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-3 self-end sm:self-auto">
            {savedGaId ? (
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-1 rounded-full">
                <span className="size-2 rounded-full bg-emerald-400 animate-pulse" /> GA4 · {savedGaId}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs text-amber-400 bg-amber-950/60 border border-amber-800/80 px-2.5 py-1 rounded-full">
                <span className="size-2 rounded-full bg-amber-400" /> GA4 non configuré
              </span>
            )}
            <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors">
              Voir le site <ExternalLink className="size-3" />
            </Link>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-slate-800 bg-slate-900/40 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex gap-2 overflow-x-auto py-2">
          <button onClick={() => setActiveTab("ga")} className={tabClass("ga")}><Activity className="size-4" /> Google Analytics</button>
          <button onClick={() => setActiveTab("seo")} className={tabClass("seo")}><Search className="size-4" /> Référencement SEO</button>
          <button onClick={() => setActiveTab("media")} className={tabClass("media")}>
            <ImageIcon className="size-4" /> Médiathèque
            <span className="ml-1 px-1.5 rounded-full text-[10px] bg-slate-800 text-emerald-400 border border-slate-700">{logos.length + photos.length}</span>
          </button>
          <button onClick={() => setActiveTab("security")} className={tabClass("security")}><Shield className="size-4" /> Sécurité & Accès</button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8">

        {/* ===== GOOGLE ANALYTICS ===== */}
        {activeTab === "ga" && (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Google Analytics 4</h1>
              <p className="text-sm text-slate-400 mt-1">
                Votre ID <strong className="text-emerald-400">{DEFAULT_GA_ID}</strong> est configuré. Les vraies statistiques sont dans votre console GA.
              </p>
            </div>

            <div className="rounded-xl border border-emerald-900/40 bg-emerald-950/20 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="size-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <BarChart3 className="size-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-white">Voir vos vraies statistiques</h3>
                <p className="text-sm text-slate-400 mt-1">Trafic en temps réel, conversions, sources d'acquisition et répartition appareils.</p>
              </div>
              <a
                href="https://analytics.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-lg text-sm transition-colors shrink-0"
              >
                Ouvrir Analytics <ExternalLink className="size-4" />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: "Rapport temps réel", icon: Activity, href: "https://analytics.google.com/analytics/web/#/realtime" },
                { label: "Sources d'acquisition", icon: LineChart, href: "https://analytics.google.com/analytics/web/#/acquisition" },
                { label: "Conversions & Objectifs", icon: Sparkles, href: "https://analytics.google.com/analytics/web/#/conversions" },
              ].map(({ label, icon: Icon, href }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 flex items-center gap-3 hover:border-emerald-700 hover:bg-slate-900 transition-all group">
                  <Icon className="size-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-slate-200">{label}</span>
                  <ExternalLink className="size-3 text-slate-500 ml-auto" />
                </a>
              ))}
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="size-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Activity className="size-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Modifier l'ID de mesure GA4</h3>
                  <p className="text-xs text-slate-400">Format : G-XXXXXXXXXX</p>
                </div>
              </div>
              <form onSubmit={handleSaveGa} className="space-y-4">
                <div>
                  <label htmlFor="gaId" className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">ID Google Analytics</label>
                  <div className="relative">
                    <input id="gaId" type="text" value={gaId} onChange={(e) => setGaId(e.target.value)} placeholder="G-3E4PTX85SS"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono" />
                    {savedGaId && <span className="absolute right-3 top-3 text-xs bg-emerald-950 text-emerald-400 border border-emerald-800/80 px-2 py-0.5 rounded">Actif</span>}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button type="submit" className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors">
                    <CheckCircle2 className="size-4" /> Enregistrer
                  </button>
                  {savedGaId && (
                    <button type="button" onClick={handleSendTestEvent} className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-5 py-2.5 rounded-lg text-sm transition-colors">
                      <Send className="size-4" /> Tester l'événement GA4
                    </button>
                  )}
                </div>
                {saveSuccess && <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs rounded-lg flex items-center gap-2"><CheckCircle2 className="size-4 shrink-0 text-emerald-400" /> ID enregistré avec succès.</div>}
                {testSent && <div className="p-3 bg-blue-950/80 border border-blue-800 text-blue-300 text-xs rounded-lg flex items-center gap-2"><CheckCircle2 className="size-4 shrink-0 text-blue-400" /> Événement test envoyé. Vérifiez "Temps réel" dans GA.</div>}
              </form>
            </div>
          </div>
        )}

        {/* ===== SEO ===== */}
        {activeTab === "seo" && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Référencement & Audit SEO</h1>
                <p className="text-sm text-slate-400 mt-1">Optimisation Google Search, Maps et référencement local Nanterre & Hauts-de-Seine.</p>
              </div>
              <div className="flex items-center gap-3 bg-emerald-950/60 border border-emerald-800/80 px-4 py-2 rounded-xl">
                <Sparkles className="size-5 text-emerald-400" />
                <div><div className="text-xs text-slate-400">Score SEO On-Page</div><div className="text-xl font-bold text-emerald-400">98 / 100</div></div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-6">
              <h3 className="font-semibold text-base flex items-center gap-2 mb-4"><Globe className="size-4 text-blue-400" /> Aperçu SERP Google</h3>
              <div className="p-4 rounded-xl bg-white text-slate-900 shadow-md max-w-2xl">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="size-7 rounded-full bg-slate-100 flex items-center justify-center p-1 border border-slate-200">
                    <img src={logoImg} alt="Logo" className="size-5 object-contain" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-slate-800">Reflex' Assistance</div>
                    <div className="text-[11px] text-slate-500">https://reflexassistance.fr</div>
                  </div>
                </div>
                <h4 className="text-base font-medium text-blue-800 hover:underline cursor-pointer">Dépannage informatique à Nanterre — Reflex' Assistance</h4>
                <div className="flex items-center gap-1.5 my-1 text-xs text-amber-600 font-medium">
                  <span>★★★★★</span><span className="text-slate-700">4,9 (48 avis)</span><span className="text-slate-400">·</span><span className="text-slate-600">Dépannage sur site & distance</span>
                </div>
                <p className="text-xs text-slate-600 mt-1">Dépannage informatique à domicile, au bureau ou à distance à Nanterre et dans les Hauts-de-Seine. Réparation PC & Mac, virus, réseaux Wi-Fi et récupération de données.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
                <h3 className="font-semibold text-base flex items-center gap-2"><Shield className="size-4 text-emerald-400" /> Balises Meta & On-Page</h3>
                <ul className="space-y-3 text-xs">
                  {[
                    { label: "Balise <title> unique", desc: "Optimisée mots-clés localisation (Nanterre & Hauts-de-Seine)." },
                    { label: "Meta Description", desc: "148 caractères avec CTA pour maximiser le CTR." },
                    { label: "Schema.org JSON-LD", desc: "ComputerRepairService + LocalBusiness (adresse, horaires, téléphone)." },
                    { label: "Open Graph & Twitter Card", desc: "Partages attractifs WhatsApp, Facebook, LinkedIn, X." },
                    { label: "GTM Container actif", desc: "Google Tag Manager GTM-KXM4J9W6 chargé sur toutes les pages." },
                  ].map(({ label, desc }) => (
                    <li key={label} className="flex items-start gap-2.5">
                      <CheckCircle2 className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div><span className="font-semibold text-slate-200">{label} :</span><p className="text-slate-400 mt-0.5">{desc}</p></div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
                <h3 className="font-semibold text-base flex items-center gap-2"><FileCode className="size-4 text-blue-400" /> Fichiers d'Indexation</h3>
                <div className="space-y-3">
                  {[
                    { file: "sitemap.xml", desc: "Plan du site pour Googlebot", url: "/sitemap.xml", copyUrl: "https://reflexassistance.fr/sitemap.xml", id: "sitemap" },
                    { file: "robots.txt", desc: "Consignes d'exploration", url: "/robots.txt", copyUrl: "https://reflexassistance.fr/robots.txt", id: "robots" },
                  ].map(({ file, desc, url, copyUrl, id }) => (
                    <div key={file} className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <div><div className="text-xs font-semibold text-slate-200">{file}</div><div className="text-[11px] text-slate-400">{desc}</div></div>
                      <div className="flex items-center gap-2">
                        <a href={url} target="_blank" className="text-xs text-emerald-400 hover:underline flex items-center gap-1">Ouvrir <ExternalLink className="size-3" /></a>
                        <button onClick={() => handleCopy(copyUrl, id)} className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300">
                          {copiedUrl === id ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/80">
                  <h4 className="text-xs font-semibold text-slate-300 mb-2">Mots-clés ciblés :</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {["dépannage informatique nanterre", "réparation ordinateur 92", "assistance informatique domicile", "suppression virus pc mac", "dépannage informatique hauts-de-seine"].map((kw) => (
                      <span key={kw} className="text-[11px] bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md border border-slate-700">{kw}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-blue-900/40 bg-blue-950/20 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Laptop className="size-8 text-blue-400 shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-white">Google Search Console</h3>
                <p className="text-sm text-slate-400 mt-1">Positions réelles, impressions, clics et pages indexées par Google.</p>
              </div>
              <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-sm transition-colors shrink-0">
                Ouvrir GSC <ExternalLink className="size-4" />
              </a>
            </div>
          </div>
        )}

        {/* ===== MÉDIATHÈQUE ===== */}
        {activeTab === "media" && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2.5"><ImageIcon className="size-6 text-emerald-400" /> Médiathèque</h1>
                <p className="text-sm text-slate-400 mt-1">Gérez logos partenaires et photos d'interventions. Modifications en temps réel.</p>
              </div>
              <button type="button" onClick={handleResetMedia} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg transition-colors">
                <RotateCcw className="size-3.5" /> Réinitialiser
              </button>
            </div>

            {mediaNotification && (
              <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm animate-in fade-in ${mediaNotification.type === "success" ? "bg-emerald-950/70 border-emerald-800 text-emerald-300" : "bg-red-950/70 border-red-800 text-red-300"}`}>
                {mediaNotification.type === "success" ? <Check className="size-4 shrink-0 text-emerald-400" /> : <AlertCircle className="size-4 shrink-0 text-red-400" />}
                <span>{mediaNotification.message}</span>
              </div>
            )}

            {/* Visibility toggles */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
                <div>
                  <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2"><SlidersHorizontal className="size-4 text-emerald-400" /> Visibilité des sections</h2>
                  <p className="text-xs text-slate-400 mt-1">Activez ou masquez Logos et Galerie sur la page d'accueil.</p>
                </div>
                <Link to="/galerie" target="_blank" className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 rounded-lg hover:bg-emerald-900/60 transition-colors w-fit">
                  <ExternalLink className="size-3.5" /> Page Galerie ↗
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 mt-5">
                {[
                  { key: "showLogosSection" as keyof MediaSettings, label: "Logos & Marques Partenaires", sub: "Section 1 · Accueil", desc: "Bandeau des logos constructeurs (Apple, Dell, Microsoft...)." },
                  { key: "showGallerySection" as keyof MediaSettings, label: "Galerie Réalisations", sub: "Section 2 · Accueil", desc: "Aperçu compact avec redirection vers la page dédiée." },
                ].map(({ key, label, sub, desc }) => {
                  const isOn = mediaSettings[key] as boolean;
                  return (
                    <div key={key} className={`p-4 rounded-xl border transition-all ${isOn ? "bg-slate-800/40 border-slate-700/80" : "bg-slate-950/60 border-slate-800/80"}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{sub}</span>
                          <h3 className="text-sm font-semibold text-white mt-0.5">{label}</h3>
                          <p className="text-xs text-slate-400 mt-1">{desc}</p>
                        </div>
                        <button type="button" onClick={() => handleToggleSection(key, !isOn)}
                          className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${isOn ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-slate-800 text-slate-400 border border-slate-700"}`}>
                          {isOn ? <><Eye className="size-3.5 text-emerald-400" /> Visible</> : <><EyeOff className="size-3.5" /> Masqué</>}
                        </button>
                      </div>
                      {key === "showGallerySection" && isOn && (
                        <div className="mt-3.5 pt-3 border-t border-slate-800 flex items-center justify-between">
                          <span className="text-xs text-slate-400">Photos aperçu :</span>
                          <div className="inline-flex rounded-lg bg-slate-950 p-1 border border-slate-800">
                            {[3, 4, 6].map((num) => (
                              <button key={num} type="button" onClick={() => handleToggleSection("galleryPreviewCount", num)}
                                className={`px-2.5 py-0.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${mediaSettings.galleryPreviewCount === num ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-slate-200"}`}>
                                {num}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Subtabs */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <button type="button" onClick={() => setMediaSubTab("logos")} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mediaSubTab === "logos" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"}`}>
                <Layers className="size-4 text-emerald-400" /> Logos ({logos.filter((l) => l.enabled).length}/{logos.length})
              </button>
              <button type="button" onClick={() => setMediaSubTab("photos")} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mediaSubTab === "photos" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"}`}>
                <Camera className="size-4 text-emerald-400" /> Photos ({photos.filter((p) => p.enabled).length}/{photos.length})
              </button>
            </div>

            {/* LOGOS */}
            {mediaSubTab === "logos" && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                  <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2"><Plus className="size-4 text-emerald-400" /> Ajouter un logo</h3>
                  <form onSubmit={handleAddLogo} className="mt-5 space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">Nom *</label>
                        <input type="text" required value={newLogoName} onChange={(e) => setNewLogoName(e.target.value)} placeholder="Ex: Dell, Apple..." className="w-full h-10 px-3 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-emerald-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">Catégorie</label>
                        <select value={newLogoCategory} onChange={(e) => setNewLogoCategory(e.target.value)} className="w-full h-10 px-3 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-emerald-500">
                          <option>Systèmes</option><option>Matériel</option><option>Réseau & Sauvegarde</option><option>Composants</option><option>Partenaires</option><option>Certifications</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">Lien (optionnel)</label>
                        <div className="relative"><Link2 className="size-3.5 absolute left-3 top-3.5 text-slate-500" />
                          <input type="url" value={newLogoLink} onChange={(e) => setNewLogoLink(e.target.value)} placeholder="https://..." className="w-full h-10 pl-9 pr-3 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-emerald-500" />
                        </div>
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t border-slate-800/80">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5"><Upload className="size-3.5 text-emerald-400" /> Importer</label>
                        <input type="file" accept="image/*" onChange={handleLogoFileUpload} disabled={logoUploadLoading} className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700 cursor-pointer" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5"><Link2 className="size-3.5 text-slate-400" /> Ou URL image</label>
                        <input type="url" value={newLogoUrl} onChange={(e) => setNewLogoUrl(e.target.value)} placeholder="https://.../logo.svg" className="w-full h-10 px-3 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-emerald-500" />
                      </div>
                    </div>
                    {newLogoUrl && (
                      <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                        <div className="h-12 w-28 rounded-lg bg-white/95 p-2 flex items-center justify-center shrink-0">
                          <img src={newLogoUrl} alt="Aperçu" className="max-h-full max-w-full object-contain" />
                        </div>
                        <p className="text-xs font-semibold text-slate-200">{newLogoName || "Sans nom"} · {newLogoCategory}</p>
                      </div>
                    )}
                    <div className="flex justify-end">
                      <button type="submit" disabled={logoUploadLoading} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm transition-colors disabled:opacity-50">
                        <Plus className="size-4" /> Enregistrer
                      </button>
                    </div>
                  </form>
                </div>
                {logos.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-200 mb-3">Logos ({logos.length})</h3>
                    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                      {logos.map((logo) => (
                        <div key={logo.id} className={`rounded-xl border p-3.5 transition-all flex flex-col justify-between ${logo.enabled ? "bg-slate-900/80 border-slate-800" : "bg-slate-950/50 border-slate-900 opacity-60"}`}>
                          <div className="h-16 w-full rounded-lg bg-white/95 p-2.5 flex items-center justify-center mb-3">
                            <img src={logo.imageUrl} alt={logo.name} className="max-h-full max-w-full object-contain" />
                          </div>
                          <h4 className="text-sm font-semibold text-slate-100 truncate">{logo.name}</h4>
                          <span className="inline-block mt-0.5 text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">{logo.category}</span>
                          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                            <button type="button" onClick={() => handleToggleLogo(logo.id)} className={`text-xs font-medium px-2.5 py-1 rounded-md transition-colors ${logo.enabled ? "bg-emerald-950 text-emerald-300 border border-emerald-800/80" : "bg-slate-800 text-slate-400 border border-slate-700"}`}>
                              {logo.enabled ? "Visible" : "Masqué"}
                            </button>
                            <button type="button" onClick={() => handleDeleteLogo(logo.id, logo.name)} className="p-1.5 rounded-md text-slate-400 hover:text-red-400 hover:bg-red-950/40 transition-colors">
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* PHOTOS */}
            {mediaSubTab === "photos" && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                  <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2"><Plus className="size-4 text-emerald-400" /> Ajouter une photo</h3>
                  <form onSubmit={handleAddPhoto} className="mt-5 space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">Titre *</label>
                        <input type="text" required value={newPhotoTitle} onChange={(e) => setNewPhotoTitle(e.target.value)} placeholder="Ex: Remplacement écran iMac..." className="w-full h-10 px-3 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-emerald-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">Catégorie</label>
                        <select value={newPhotoCategory} onChange={(e) => setNewPhotoCategory(e.target.value)} className="w-full h-10 px-3 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-emerald-500">
                          <option>Atelier & Dépannage</option><option>Réseau & Câblage</option><option>Données & Sécurité</option><option>Sur site & Bureau</option><option>Équipements</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">Description</label>
                      <textarea rows={2} value={newPhotoDesc} onChange={(e) => setNewPhotoDesc(e.target.value)} placeholder="Ex: Diagnostic, dépoussiérage..." className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-emerald-500" />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t border-slate-800/80">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5"><Upload className="size-3.5 text-emerald-400" /> Importer</label>
                        <input type="file" accept="image/*" onChange={handlePhotoFileUpload} disabled={photoUploadLoading} className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700 cursor-pointer" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5"><Link2 className="size-3.5 text-slate-400" /> Ou URL</label>
                        <input type="url" value={newPhotoUrl} onChange={(e) => setNewPhotoUrl(e.target.value)} placeholder="https://..." className="w-full h-10 px-3 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-emerald-500" />
                      </div>
                    </div>
                    {newPhotoUrl && (
                      <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                        <img src={newPhotoUrl} alt="Aperçu" className="h-20 w-32 object-cover rounded-lg shrink-0 border border-slate-700" />
                        <div className="text-xs">
                          <p className="font-semibold text-slate-200">{newPhotoTitle || "Sans titre"}</p>
                          <span className="inline-block mt-0.5 text-[10px] bg-slate-800 text-emerald-400 px-2 py-0.5 rounded-full">{newPhotoCategory}</span>
                        </div>
                      </div>
                    )}
                    <div className="flex justify-end">
                      <button type="submit" disabled={photoUploadLoading} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm transition-colors disabled:opacity-50">
                        <Plus className="size-4" /> Publier la photo
                      </button>
                    </div>
                  </form>
                </div>
                {photos.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-200 mb-3">Photos ({photos.length})</h3>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {photos.map((photo) => (
                        <div key={photo.id} className={`rounded-xl border overflow-hidden flex flex-col ${photo.enabled ? "bg-slate-900/80 border-slate-800" : "bg-slate-950/50 border-slate-900 opacity-60"}`}>
                          <div className="relative aspect-video overflow-hidden bg-slate-950">
                            <img src={photo.imageUrl} alt={photo.title} className="h-full w-full object-cover" />
                            <span className="absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-950/80 text-emerald-400 backdrop-blur border border-slate-800">{photo.category}</span>
                          </div>
                          <div className="p-4">
                            <h4 className="text-sm font-semibold text-slate-100 line-clamp-1">{photo.title}</h4>
                            <p className="mt-1 text-xs text-slate-400 line-clamp-2">{photo.description}</p>
                          </div>
                          <div className="p-4 pt-0 flex items-center justify-between border-t border-slate-800/60 mt-auto">
                            <button type="button" onClick={() => handleTogglePhoto(photo.id)} className={`text-xs font-medium px-2.5 py-1 rounded-md transition-colors ${photo.enabled ? "bg-emerald-950 text-emerald-300 border border-emerald-800/80" : "bg-slate-800 text-slate-400 border border-slate-700"}`}>
                              {photo.enabled ? "Affichée" : "Masquée"}
                            </button>
                            <button type="button" onClick={() => handleDeletePhoto(photo.id, photo.title)} className="p-1.5 rounded-md text-slate-400 hover:text-red-400 hover:bg-red-950/40 transition-colors">
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ===== SÉCURITÉ ===== */}
        {activeTab === "security" && (
          <div className="space-y-8 max-w-2xl mx-auto">
            <div>
              <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2"><Shield className="size-6 text-emerald-400" /> Sécurité & Accès Admin</h1>
              <p className="text-sm text-slate-400 mt-1">Gérez les accès à ce tableau de bord sécurisé.</p>
            </div>

            {securityMsg && (
              <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm animate-in fade-in ${securityMsg.type === "success" ? "bg-emerald-950/70 border-emerald-800 text-emerald-300" : "bg-red-950/70 border-red-800 text-red-300"}`}>
                {securityMsg.type === "success" ? <CheckCircle2 className="size-4 shrink-0 text-emerald-400" /> : <AlertCircle className="size-4 shrink-0 text-red-400" />}
                <span>{securityMsg.text}</span>
              </div>
            )}

            {/* Infos connexion */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
              <h2 className="font-semibold text-base flex items-center gap-2"><KeyRound className="size-4 text-emerald-400" /> Informations de connexion</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <div>
                    <p className="text-xs font-semibold text-slate-300">URL secrète admin</p>
                    <code className="text-xs text-emerald-400 font-mono mt-1 block">/{adminSlug}</code>
                  </div>
                  <button onClick={() => navigator.clipboard.writeText(`/${adminSlug}`)} className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"><Copy className="size-3.5" /></button>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <div>
                    <p className="text-xs font-semibold text-slate-300">Secret TOTP (2FA)</p>
                    <code className="text-xs text-emerald-400 font-mono mt-1 block break-all">{totpSecret}</code>
                  </div>
                  <button onClick={handleCopySecret} className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 shrink-0">
                    {copiedSecret ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
                  </button>
                </div>
                <div className="p-3 rounded-lg bg-blue-950/30 border border-blue-900/40 text-xs text-blue-300 flex items-start gap-2">
                  <HelpCircle className="size-4 shrink-0 text-blue-400 mt-0.5" />
                  <span>Pour changer le <strong>slug</strong> ou le <strong>secret TOTP</strong>, modifiez <code className="bg-slate-900 px-1 rounded">VITE_ADMIN_SLUG</code> et <code className="bg-slate-900 px-1 rounded">VITE_ADMIN_2FA_SECRET</code> dans <code className="bg-slate-900 px-1 rounded">.env</code> puis redémarrez le serveur.</span>
                </div>
              </div>
            </div>

            {/* Changer mot de passe */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
              <h2 className="font-semibold text-base flex items-center gap-2 mb-5"><Lock className="size-4 text-emerald-400" /> Changer le mot de passe admin</h2>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Mot de passe actuel *</label>
                  <div className="relative">
                    <input type={showCurrentPwd ? "text" : "password"} required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Mot de passe actuel" className="w-full h-11 rounded-xl bg-slate-950 border border-slate-800 px-4 pr-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
                    <button type="button" onClick={() => setShowCurrentPwd(!showCurrentPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                      {showCurrentPwd ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Nouveau mot de passe * (min. 10 caractères)</label>
                  <div className="relative">
                    <input type={showNewPwd ? "text" : "password"} required minLength={10} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Nouveau mot de passe fort..." className="w-full h-11 rounded-xl bg-slate-950 border border-slate-800 px-4 pr-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
                    <button type="button" onClick={() => setShowNewPwd(!showNewPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                      {showNewPwd ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                  {newPassword.length > 0 && (
                    <div className="mt-1.5 flex items-center gap-2">
                      <div className="flex-1 h-1 rounded-full bg-slate-800 overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${newPassword.length < 10 ? "bg-red-500 w-1/4" : newPassword.length < 14 ? "bg-amber-500 w-2/4" : newPassword.length < 18 ? "bg-emerald-400 w-3/4" : "bg-emerald-500 w-full"}`} />
                      </div>
                      <span className="text-[11px] text-slate-400">{newPassword.length < 10 ? "Faible" : newPassword.length < 14 ? "Moyen" : newPassword.length < 18 ? "Fort" : "Très fort"}</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Confirmer le nouveau mot de passe *</label>
                  <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Répéter..." className={`w-full h-11 rounded-xl bg-slate-950 border px-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-colors ${confirmPassword.length > 0 && confirmPassword !== newPassword ? "border-red-600 focus:border-red-500 focus:ring-red-500" : "border-slate-800 focus:border-emerald-500 focus:ring-emerald-500"}`} />
                  {confirmPassword.length > 0 && confirmPassword !== newPassword && <p className="text-xs text-red-400 mt-1">Les mots de passe ne correspondent pas.</p>}
                </div>
                <button type="submit" className="w-full h-11 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20">
                  <RefreshCw className="size-4" /> Mettre à jour le mot de passe
                </button>
              </form>
            </div>

            {/* QR Code 2FA */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
              <h2 className="font-semibold text-base flex items-center gap-2 mb-4"><Smartphone className="size-4 text-emerald-400" /> Application 2FA</h2>
              <p className="text-xs text-slate-400 mb-4">Scannez ce QR Code dans Google Authenticator, Microsoft Authenticator ou Apple Passwords.</p>
              <div className="flex items-start gap-6 flex-wrap">
                <div className="inline-block p-3 bg-white rounded-xl shadow-md shrink-0">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(`otpauth://totp/Reflex%20Assistance:admin@reflex-assistance.fr?secret=${totpSecret}&issuer=Reflex%20Assistance&algorithm=SHA1&digits=6&period=30`)}&margin=2`}
                    alt="QR Code 2FA"
                    className="size-40 object-contain"
                  />
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-slate-300 mb-1.5">Clé manuelle :</p>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-slate-950 px-3 py-2 rounded-lg text-emerald-400 font-mono border border-slate-800 select-all break-all">{totpSecret}</code>
                      <button onClick={handleCopySecret} className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors shrink-0">
                        {copiedSecret ? <Check className="size-4 text-emerald-400" /> : <Copy className="size-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 space-y-1">
                    <p>• Compte : <span className="text-slate-300">admin@reflex-assistance.fr</span></p>
                    <p>• SHA1 — 6 chiffres — 30 secondes</p>
                    <p>• Code de secours : <span className="text-slate-300 font-mono">889922</span></p>
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
