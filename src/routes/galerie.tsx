import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  ChevronLeft,
  ChevronRight,
  HardDrive,
  Laptop,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  Wrench,
  X,
  ZoomIn,
} from "lucide-react";
import { useEffect, useState } from "react";
import logoImg from "@/assets/reflex-assistance-logo.png";
import { Button } from "@/components/ui/button";
import {
  getStoredPhotos,
  subscribeToMediaUpdates,
  type ShowcasePhoto,
} from "@/lib/media-store";

export const Route = createFileRoute("/galerie")({
  head: () => ({
    meta: [
      { title: "Galerie de Réalisations & Dépannages — Reflex' Assistance" },
      {
        name: "description",
        content:
          "Découvrez en images nos interventions informatiques : dépannage PC, Mac, réseaux d'entreprise, microsoudure et récupération de données à Nanterre.",
      },
      {
        property: "og:title",
        content: "Galerie & Atelier Technique — Reflex' Assistance",
      },
      {
        property: "og:description",
        content:
          "Portfolio photo de nos dépannages informatiques réalisés à Nanterre et en Île-de-France.",
      },
    ],
  }),
  component: GaleriePage,
});

function Logo({ className = "" }: { className?: string }) {
  return (
    <img
      src={logoImg}
      alt="Reflex Assistance"
      className={`h-8 sm:h-9 w-auto max-h-9 object-contain ${className}`}
      loading="eager"
    />
  );
}

function GaleriePage() {
  const [photos, setPhotos] = useState<ShowcasePhoto[]>(() => getStoredPhotos());
  const [activeCategory, setActiveCategory] = useState<string>("Tous");
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  // Synchronisation dynamique avec la médiathèque de l'Admin
  useEffect(() => {
    setPhotos(getStoredPhotos());

    const unsubscribe = subscribeToMediaUpdates(() => {
      setPhotos(getStoredPhotos());
    });

    return unsubscribe;
  }, []);

  // Clavier pour naviguer dans la lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedPhotoIndex === null) return;
      if (e.key === "Escape") {
        setSelectedPhotoIndex(null);
      } else if (e.key === "ArrowLeft") {
        handlePrevPhoto();
      } else if (e.key === "ArrowRight") {
        handleNextPhoto();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  const activePhotos = photos.filter((p) => p.enabled);

  // Catégories uniques
  const categories = [
    "Tous",
    ...Array.from(new Set(activePhotos.map((p) => p.category))),
  ];

  // Photos filtrées
  const filteredPhotos =
    activeCategory === "Tous"
      ? activePhotos
      : activePhotos.filter((p) => p.category === activeCategory);

  const selectedPhoto =
    selectedPhotoIndex !== null && filteredPhotos[selectedPhotoIndex]
      ? filteredPhotos[selectedPhotoIndex]
      : null;

  const handlePrevPhoto = () => {
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((prev) =>
      prev !== null
        ? (prev - 1 + filteredPhotos.length) % filteredPhotos.length
        : null
    );
  };

  const handleNextPhoto = () => {
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((prev) =>
      prev !== null ? (prev + 1) % filteredPhotos.length : null
    );
  };

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-brand/20">
      {/* ── HEADER NAVIGATION ── */}
      <header className="sticky top-0 z-40 border-b border-border/80 bg-card/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors group"
            >
              <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
              <span>Accueil</span>
            </Link>
            <span className="text-border">/</span>
            <Link to="/" className="flex shrink-0 items-center no-underline">
              <Logo className="text-sm sm:text-base" />
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="hidden sm:inline-flex h-9 rounded-full text-xs font-medium"
            >
              <a href="tel:+33782275430">
                <Phone className="size-3.5 mr-1.5" /> 07 82 27 54 30
              </a>
            </Button>
            <Button
              asChild
              size="sm"
              className="h-9 rounded-full bg-[#25D366] hover:bg-[#1ebe5d] text-white text-xs font-semibold shadow-xs"
            >
              <a
                href="https://wa.me/33782275430"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="size-3.5 mr-1.5" /> WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </header>

      {/* ── HERO BANNER ── */}
      <section className="border-b border-border/80 bg-gradient-to-b from-card/80 to-background py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-semibold mb-4">
              <Camera className="size-3.5" />
              <span>Galerie de Réalisations &amp; Atelier Technique</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-medium tracking-tight text-foreground leading-[1.15]">
              Toutes nos interventions en images.
            </h1>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
              Dépannage d'ordinateurs PC &amp; Apple Mac, maintenance de serveurs NAS, câblage réseau et récupération de disques durs : découvrez le travail réalisé par Reflex' Assistance sur le terrain et en atelier.
            </p>
          </div>

          {/* Badges de Réassurance */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-6 border-t border-border/60">
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-card border border-border/80">
              <Wrench className="size-4 text-brand shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-semibold truncate text-foreground">Diagnostic précis</p>
                <p className="text-[10px] text-muted-foreground truncate">Devis préalable transparent</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-card border border-border/80">
              <Laptop className="size-4 text-brand shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-semibold truncate text-foreground">PC &amp; Apple Mac</p>
                <p className="text-[10px] text-muted-foreground truncate">Tous systèmes &amp; marques</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-card border border-border/80">
              <HardDrive className="size-4 text-brand shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-semibold truncate text-foreground">Sauvegarde garantie</p>
                <p className="text-[10px] text-muted-foreground truncate">Protection des données</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-card border border-border/80">
              <ShieldCheck className="size-4 text-brand shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-semibold truncate text-foreground">Nanterre &amp; 92</p>
                <p className="text-[10px] text-muted-foreground truncate">Atelier &amp; sur site</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FILTRES ET GRILLE DE PHOTOS ── */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          {/* Barre de filtres par catégorie */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 mb-8 border-b border-border/80">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Filtrer par type d'intervention
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {categories.map((cat) => {
                  const count =
                    cat === "Tous"
                      ? activePhotos.length
                      : activePhotos.filter((p) => p.category === cat).length;
                  const isActive = activeCategory === cat;

                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setActiveCategory(cat)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-full transition-all cursor-pointer ${
                        isActive
                          ? "bg-ink text-ink-foreground shadow-sm"
                          : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-mist"
                      }`}
                    >
                      <span>{cat}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-medium ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="text-xs text-muted-foreground shrink-0 self-start sm:self-end">
              <strong>{filteredPhotos.length}</strong> photo
              {filteredPhotos.length > 1 ? "s" : ""} affichée
              {filteredPhotos.length > 1 ? "s" : ""}
            </div>
          </div>

          {/* Grille principale */}
          {filteredPhotos.length === 0 ? (
            <div className="py-20 text-center rounded-3xl border border-dashed border-border bg-card/40 p-8">
              <Camera className="size-10 text-muted-foreground mx-auto mb-3 opacity-60" />
              <h3 className="text-base font-semibold text-foreground">
                Aucune photo trouvée dans cette catégorie
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Sélectionnez "Tous" pour afficher l'ensemble de notre catalogue d'interventions.
              </p>
              <button
                type="button"
                onClick={() => setActiveCategory("Tous")}
                className="mt-4 px-4 py-2 text-xs font-semibold rounded-full bg-ink text-ink-foreground hover:bg-ink/85 transition-colors cursor-pointer"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPhotos.map((photo, index) => (
                <article
                  key={photo.id}
                  onClick={() => setSelectedPhotoIndex(index)}
                  className="group relative cursor-pointer overflow-hidden rounded-2xl sm:rounded-3xl border border-border bg-card shadow-panel transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
                    <img
                      src={photo.imageUrl}
                      alt={photo.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-108"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

                    {/* Badge catégorie */}
                    <span className="absolute top-3 left-3 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-black/60 text-emerald-400 border border-white/20 backdrop-blur-md">
                      {photo.category}
                    </span>

                    {/* Loupe au survol */}
                    <div className="absolute top-3 right-3 flex size-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                      <ZoomIn className="size-4" />
                    </div>

                    {/* Titre et description en bas de l'image */}
                    <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 text-white">
                      <h3 className="text-base sm:text-lg font-semibold leading-snug line-clamp-1">
                        {photo.title}
                      </h3>
                      <p className="mt-1 text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">
                        {photo.description}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── BANDEAU APPEL À L'ACTION ── */}
      <section className="bg-ink px-4 py-14 sm:px-6 sm:py-20 text-ink-foreground border-t border-ink-border">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-highlight/15 text-highlight border border-highlight/30 text-xs font-semibold mb-4">
            <Sparkles className="size-3.5" />
            Besoin d'une réparation similaire ?
          </span>
          <h2 className="text-2xl sm:text-4xl font-medium tracking-tight">
            Confiez votre matériel informatique à un expert.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-ink-muted max-w-xl mx-auto leading-relaxed">
            Panne d'écran, lenteur, surchauffe ou récupération de données : nous établissons un diagnostic clair et vous accompagnons pas à pas.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Button
              asChild
              className="h-12 w-full sm:w-auto rounded-full bg-card text-ink font-semibold hover:bg-card/90 px-6"
            >
              <a href="tel:+33782275430">
                <Phone className="size-4 mr-2" /> Appeler le 07 82 27 54 30
              </a>
            </Button>
            <Button
              asChild
              className="h-12 w-full sm:w-auto rounded-full bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold px-6 shadow-md"
            >
              <a
                href="https://wa.me/33782275430"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="size-4 mr-2" /> Discuter sur WhatsApp
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-12 w-full sm:w-auto rounded-full border-ink-border text-white hover:bg-ink-soft px-6"
            >
              <Link to="/">
                <ArrowLeft className="size-4 mr-2" /> Retour à l'accueil
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-border bg-card px-4 py-8 sm:px-6 sm:py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-center sm:text-left">
          <Link to="/" className="inline-block self-center sm:self-auto">
            <Logo className="text-base" />
          </Link>
          <div className="text-xs sm:text-sm leading-relaxed text-muted-foreground sm:text-right">
            <p>Reflex' Assistance · © 2026</p>
            <p>Dépannage &amp; assistance informatique à Nanterre (92)</p>
          </div>
        </div>
      </footer>

      {/* ── BOUTON WHATSAPP FLOTTANT ── */}
      <a
        href="https://wa.me/33782275430"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Nous contacter sur WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-full bg-[#25D366] px-4 py-3.5 text-sm font-semibold text-white shadow-[0_4px_24px_rgba(37,211,102,0.45)] transition-all duration-300 hover:scale-105 hover:bg-[#1ebe5d] hover:shadow-[0_6px_32px_rgba(37,211,102,0.55)] sm:px-5"
      >
        <MessageCircle className="size-5 shrink-0" />
        <span className="hidden sm:inline">WhatsApp</span>
      </a>

      {/* ── MODALE LIGHTBOX ENRICHIE (NAVIGATION PREV / NEXT) ── */}
      {selectedPhoto && selectedPhotoIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedPhotoIndex(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Bouton Fermer */}
            <button
              type="button"
              onClick={() => setSelectedPhotoIndex(null)}
              aria-label="Fermer"
              className="absolute top-4 right-4 z-20 size-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md transition-transform hover:scale-110 cursor-pointer"
            >
              <X className="size-5" />
            </button>

            {/* Boutons Suivant / Précédent */}
            {filteredPhotos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevPhoto}
                  aria-label="Photo précédente"
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 size-11 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md transition-all hover:scale-110 cursor-pointer"
                >
                  <ChevronLeft className="size-6" />
                </button>
                <button
                  type="button"
                  onClick={handleNextPhoto}
                  aria-label="Photo suivante"
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 size-11 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md transition-all hover:scale-110 cursor-pointer"
                >
                  <ChevronRight className="size-6" />
                </button>
              </>
            )}

            {/* Image en grand */}
            <div className="relative max-h-[65vh] w-full flex items-center justify-center bg-black/60 overflow-hidden">
              <img
                src={selectedPhoto.imageUrl}
                alt={selectedPhoto.title}
                className="max-h-[65vh] w-auto max-w-full object-contain"
              />
            </div>

            {/* Légende détaillée et pagination */}
            <div className="p-6 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-4 bg-slate-900">
              <div className="max-w-xl">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {selectedPhoto.category}
                  </span>
                  <span className="text-xs text-slate-400">
                    Photo {selectedPhotoIndex + 1} sur {filteredPhotos.length}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold">
                  {selectedPhoto.title}
                </h3>
                <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
                  {selectedPhoto.description}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href="https://wa.me/33782275430"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#1ebe5d] text-white text-xs font-semibold transition-colors"
                >
                  <MessageCircle className="size-3.5" /> Poser une question
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
