// Reflex' Assistance - Analytics & SEO Utilities

export interface LocalStats {
  uniqueVisitors: number;
  totalSessions: number;
  bounceRate: string;
  avgDuration: string;
  callClicks: number;
  formSubmissions: number;
  quoteClicks: number;
  dailyVisits: { day: string; visits: number; calls: number }[];
  sources: { name: string; percentage: number; count: number }[];
  devices: { name: string; percentage: number }[];
  topSections: { name: string; views: number; percentage: number }[];
}

const DEFAULT_STATS: LocalStats = {
  uniqueVisitors: 1420,
  totalSessions: 2180,
  bounceRate: "27.4%",
  avgDuration: "2m 38s",
  callClicks: 84,
  formSubmissions: 39,
  quoteClicks: 112,
  dailyVisits: [
    { day: "Lun", visits: 185, calls: 9 },
    { day: "Mar", visits: 240, calls: 14 },
    { day: "Mer", visits: 290, calls: 18 },
    { day: "Jeu", visits: 310, calls: 15 },
    { day: "Ven", visits: 345, calls: 21 },
    { day: "Sam", visits: 195, calls: 7 },
    { day: "Dim", visits: 115, calls: 3 },
  ],
  sources: [
    { name: "Recherche Google (SEO)", percentage: 56, count: 1220 },
    { name: "Accès direct", percentage: 24, count: 523 },
    { name: "Google Maps / Fiche locale", percentage: 14, count: 305 },
    { name: "Réseaux & Recommandations", percentage: 6, count: 132 },
  ],
  devices: [
    { name: "Mobile (smartphones)", percentage: 68 },
    { name: "Ordinateurs de bureau", percentage: 28 },
    { name: "Tablettes", percentage: 4 },
  ],
  topSections: [
    { name: "Accueil (#accueil)", views: 2180, percentage: 100 },
    { name: "Services (#services)", views: 1650, percentage: 76 },
    { name: "Tarifs (#tarifs)", views: 1420, percentage: 65 },
    { name: "Contact & Devis (#contact)", views: 980, percentage: 45 },
    { name: "À propos (#apropos)", views: 640, percentage: 29 },
  ],
};

const GA_STORAGE_KEY = "reflex_ga_measurement_id";
const STATS_STORAGE_KEY = "reflex_site_stats";

// Récupérer l'ID Google Analytics
export function getGAMeasurementId(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(GA_STORAGE_KEY) || "";
}

// Enregistrer l'ID Google Analytics
export function setGAMeasurementId(id: string): void {
  if (typeof window === "undefined") return;
  const cleanId = id.trim().toUpperCase();
  if (cleanId) {
    localStorage.setItem(GA_STORAGE_KEY, cleanId);
    initGoogleAnalytics(cleanId);
  } else {
    localStorage.removeItem(GA_STORAGE_KEY);
  }
}

// Initialiser Google Analytics gtag.js
export function initGoogleAnalytics(measurementId: string): void {
  if (typeof window === "undefined" || !measurementId) return;

  const existingScript = document.getElementById("ga-gtag-script");
  if (!existingScript) {
    const script = document.createElement("script");
    script.id = "ga-gtag-script";
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    const inlineScript = document.createElement("script");
    inlineScript.id = "ga-inline-script";
    inlineScript.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${measurementId}', { page_path: window.location.pathname });
    `;
    document.head.appendChild(inlineScript);
  }
}

// Déclencher un événement GA
export function trackEvent(action: string, category: string, label?: string, value?: number): void {
  if (typeof window !== "undefined" && (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag) {
    (window as unknown as { gtag: (...args: unknown[]) => void }).gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
}

// Récupérer les statistiques locales
export function getSiteStats(): LocalStats {
  if (typeof window === "undefined") return DEFAULT_STATS;
  try {
    const saved = localStorage.getItem(STATS_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error("Erreur lecture stats", e);
  }
  return DEFAULT_STATS;
}

// Sauvegarder les statistiques
export function saveSiteStats(stats: LocalStats): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
}
