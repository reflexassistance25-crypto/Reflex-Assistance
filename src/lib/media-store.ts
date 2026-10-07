// Store pour la gestion dynamique des Logos et Photos (synchronisé avec l'Admin)

export interface PartnerLogo {
  id: string;
  name: string;
  imageUrl: string;
  linkUrl?: string | undefined;
  category: string;
  enabled: boolean;
}

export interface ShowcasePhoto {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  enabled: boolean;
}

export interface ClientReview {
  id: string;
  author: string;
  roleOrLocation: string;
  rating: number; // 1 à 5
  title: string;
  comment: string;
  date?: string;
  enabled: boolean;
}

const STORAGE_KEY_LOGOS = "reflex_media_logos_v1";
const STORAGE_KEY_PHOTOS = "reflex_media_photos_v1";
const STORAGE_KEY_REVIEWS = "reflex_media_reviews_v1";
const STORAGE_KEY_SETTINGS = "reflex_media_settings_v1";
const MEDIA_EVENT_NAME = "reflex-media-updated";

export interface MediaSettings {
  showLogosSection: boolean;
  showGallerySection: boolean;
  showReviewsSection: boolean;
  galleryPreviewCount: number; // Nb de photos affichées en aperçu sur la page d'accueil
}

// Logos par défaut (marques et systèmes pris en charge par Reflex' Assistance)
export const DEFAULT_LOGOS: PartnerLogo[] = [
  {
    id: "logo-apple",
    name: "Apple (Mac & iOS)",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
    linkUrl: "https://www.apple.com/fr/",
    category: "Systèmes",
    enabled: true,
  },
  {
    id: "logo-microsoft",
    name: "Microsoft Windows",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
    linkUrl: "https://www.microsoft.com/fr-fr",
    category: "Systèmes",
    enabled: true,
  },
  {
    id: "logo-dell",
    name: "Dell Technologies",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/4/48/Dell_Logo.svg",
    linkUrl: "https://www.dell.com/fr-fr",
    category: "Matériel",
    enabled: true,
  },
  {
    id: "logo-hp",
    name: "HP",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/a/ad/HP_logo_2012.svg",
    linkUrl: "https://www.hp.com/fr-fr",
    category: "Matériel",
    enabled: true,
  },
  {
    id: "logo-lenovo",
    name: "Lenovo ThinkPad",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b8/Lenovo_logo_2015.svg",
    linkUrl: "https://www.lenovo.com/fr/fr",
    category: "Matériel",
    enabled: true,
  },
  {
    id: "logo-asus",
    name: "Asus",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2e/ASUS_Logo.svg",
    linkUrl: "https://www.asus.com/fr/",
    category: "Matériel",
    enabled: true,
  },
  {
    id: "logo-intel",
    name: "Intel",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7d/Intel_logo_%282020-present%29.svg",
    linkUrl: "https://www.intel.fr/",
    category: "Composants",
    enabled: true,
  },
  {
    id: "logo-synology",
    name: "Synology NAS",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/2/23/Synology_Logo.svg",
    linkUrl: "https://www.synology.com/fr-fr",
    category: "Réseau & Sauvegarde",
    enabled: true,
  },
];

// Photos par défaut (interventions réelles & équipement informatique)
export const DEFAULT_PHOTOS: ShowcasePhoto[] = [
  {
    id: "photo-1",
    title: "Diagnostic et réparation carte mère & PC",
    category: "Atelier & Dépannage",
    description: "Inspection minutieuse des composants, remplacement d'écrans, claviers et batteries sur PC portable et Mac.",
    imageUrl: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80",
    enabled: true,
  },
  {
    id: "photo-2",
    title: "Installation Baie Réseau & Wi-Fi Pro",
    category: "Réseau & Câblage",
    description: "Configuration de switchs managés, routeurs fibre et bornes Wi-Fi longue portée pour bureaux et commerces.",
    imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
    enabled: true,
  },
  {
    id: "photo-3",
    title: "Récupération de données disque dur & SSD",
    category: "Données & Sécurité",
    description: "Extraction de données sur supports endommagés, clonage vers SSD ultra-rapide et mise en place de sauvegardes automatiques.",
    imageUrl: "https://images.unsplash.com/photo-1531492746076-161ca9bcad58?auto=format&fit=crop&w=800&q=80",
    enabled: true,
  },
  {
    id: "photo-4",
    title: "Intervention sur site à domicile & entreprise",
    category: "Sur site & Bureau",
    description: "Dépannage express à Nanterre et Hauts-de-Seine. Mise en route de postes de travail et imprimantes réseau.",
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
    enabled: true,
  },
  {
    id: "photo-5",
    title: "Dépoussiérage et changement pâte thermique",
    category: "Atelier & Dépannage",
    description: "Nettoyage thermique complet pour éliminer les surchauffes, bruits de ventilateur et ralentissements subits.",
    imageUrl: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80",
    enabled: true,
  },
  {
    id: "photo-6",
    title: "Sécurisation & Éradication de Malwares",
    category: "Données & Sécurité",
    description: "Désinfection approfondie de logiciels malveillants, installation d'antivirus pro et sécurisation des accès bancaires.",
    imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
    enabled: true,
  },
];

// Helper: Dispatcher la mise à jour pour re-render automatique
function notifyMediaUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(MEDIA_EVENT_NAME));
  }
}

// ── GETTERS & SETTERS LOGOS ──
export function getStoredLogos(): PartnerLogo[] {
  if (typeof window === "undefined") return DEFAULT_LOGOS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LOGOS);
    if (!raw) return DEFAULT_LOGOS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_LOGOS;
  } catch {
    return DEFAULT_LOGOS;
  }
}

export function saveStoredLogos(logos: PartnerLogo[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_LOGOS, JSON.stringify(logos));
    notifyMediaUpdated();
  } catch (err) {
    console.error("Erreur lors de la sauvegarde des logos:", err);
  }
}

// ── GETTERS & SETTERS PHOTOS ──
export function getStoredPhotos(): ShowcasePhoto[] {
  if (typeof window === "undefined") return DEFAULT_PHOTOS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PHOTOS);
    if (!raw) return DEFAULT_PHOTOS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_PHOTOS;
  } catch {
    return DEFAULT_PHOTOS;
  }
}

export function saveStoredPhotos(photos: ShowcasePhoto[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_PHOTOS, JSON.stringify(photos));
    notifyMediaUpdated();
  } catch (err) {
    console.error("Erreur lors de la sauvegarde des photos:", err);
  }
}

// ── AVIS CLIENTS PAR DÉFAUT ──
export const DEFAULT_REVIEWS: ClientReview[] = [
  {
    id: "rev-1",
    author: "Marc D.",
    roleOrLocation: "Particulier · Nanterre",
    rating: 5,
    title: "Intervention claire et efficace",
    comment: "PC portable bloqué réparé en moins d'une heure à domicile. Explications claires, technicien très professionnel et tarif transparent sans mauvaise surprise.",
    date: "Il y a 2 semaines",
    enabled: true,
  },
  {
    id: "rev-2",
    author: "Sophie L.",
    roleOrLocation: "Cabinet comptable · Rueil",
    rating: 5,
    title: "Conseils adaptés et réactivité",
    comment: "Sauvegarde sécurisée de nos dossiers professionnels et optimisation de tout notre réseau local. Disponibilité remarquable et grande pédagogie.",
    date: "Il y a 1 mois",
    enabled: true,
  },
  {
    id: "rev-3",
    author: "Karim B.",
    roleOrLocation: "Particulier · La Défense",
    rating: 5,
    title: "Suivi de proximité sans jargon",
    comment: "Changement de disque pour un SSD rapide et réinstallation complète. Mon ordinateur tourne comme au premier jour. Je recommande les yeux fermés !",
    date: "Il y a 3 semaines",
    enabled: true,
  },
];

// ── GETTERS & SETTERS REVIEWS ──
export function getStoredReviews(): ClientReview[] {
  if (typeof window === "undefined") return DEFAULT_REVIEWS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_REVIEWS);
    if (!raw) return DEFAULT_REVIEWS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_REVIEWS;
  } catch {
    return DEFAULT_REVIEWS;
  }
}

export function saveStoredReviews(reviews: ClientReview[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify(reviews));
    notifyMediaUpdated();
  } catch (err) {
    console.error("Erreur lors de la sauvegarde des avis clients:", err);
  }
}

// ── GETTERS & SETTERS SETTINGS (Visibilité des sections) ──
const DEFAULT_SETTINGS: MediaSettings = {
  showLogosSection: true,
  showGallerySection: true,
  showReviewsSection: true,
  galleryPreviewCount: 3,
};

export function getMediaSettings(): MediaSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveMediaSettings(settings: MediaSettings): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    notifyMediaUpdated();
  } catch (err) {
    console.error("Erreur lors de la sauvegarde des paramètres médias:", err);
  }
}

// Réinitialiser toutes les données aux valeurs par défaut
export function resetMediaToDefaults(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY_LOGOS);
  localStorage.removeItem(STORAGE_KEY_PHOTOS);
  localStorage.removeItem(STORAGE_KEY_REVIEWS);
  localStorage.removeItem(STORAGE_KEY_SETTINGS);
  notifyMediaUpdated();
}

// Écouter les changements en temps réel dans les composants React
export function subscribeToMediaUpdates(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  const handleCustom = () => callback();
  const handleStorage = (e: StorageEvent) => {
    if (
      e.key === STORAGE_KEY_LOGOS ||
      e.key === STORAGE_KEY_PHOTOS ||
      e.key === STORAGE_KEY_REVIEWS ||
      e.key === STORAGE_KEY_SETTINGS
    ) {
      callback();
    }
  };

  window.addEventListener(MEDIA_EVENT_NAME, handleCustom);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(MEDIA_EVENT_NAME, handleCustom);
    window.removeEventListener("storage", handleStorage);
  };
}

// Compresseur d'image côté client pour éviter de saturer le localStorage
export function processImageFile(
  file: File,
  maxWidth = 1000,
  maxHeight = 800,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Le fichier sélectionné n'est pas une image valide."));
      return;
    }

    // Si c'est un SVG, on peut le lire directement en Data URL sans compression canvas
    if (file.type === "image/svg+xml") {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("Erreur de lecture du SVG"));
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL("image/jpeg", quality);
        resolve(compressedBase64);
      };
      img.onerror = () => reject(new Error("Impossible de charger l'image pour compression"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Erreur de lecture du fichier"));
    reader.readAsDataURL(file);
  });
}
