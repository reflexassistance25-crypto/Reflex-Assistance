import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Clock3,
  Cloud,
  HardDrive,
  Laptop,
  Mail,
  MapPin,
  Menu,
  MonitorCog,
  Phone,
  Printer,
  Router,
  ShieldCheck,
  Sparkles,
  Wrench,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import logoImg from "@/assets/reflex-assistance-logo.png";
import { Button } from "@/components/ui/button";

// Logo officiel Reflex Assistance
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

const problems = [
  { icon: Laptop, title: "Ordinateur lent ou en panne", text: "Qui plante ou ne démarre plus, sur PC et Mac." },
  { icon: ShieldCheck, title: "Virus et piratage", text: "Publicités intrusives, mails piratés, comptes compromis." },
  { icon: HardDrive, title: "Récupération de données", text: "Disque dur, clé USB, photos et documents." },
  { icon: Router, title: "Wi-Fi, box, imprimante", text: "Connexion, messagerie et périphériques." },
  { icon: MonitorCog, title: "Installation et configuration", text: "D'un poste, d'un réseau ou d'un nouvel équipement." },
  { icon: Cloud, title: "Assistance petites entreprises", text: "Maintenance, sauvegardes et conseils." },
];

const services = [
  { number: "01", title: "Dépannage informatique", text: "Panne, lenteur, virus : diagnostic et réparation sur site ou à distance, pour limiter l'interruption de votre activité." },
  { number: "02", title: "Assistance technique", text: "Un accompagnement patient et sans jargon pour bien utiliser vos appareils au quotidien." },
  { number: "03", title: "Conseil informatique", text: "Quel matériel choisir ? Comment sécuriser vos données ? Des solutions adaptées à votre budget." },
  { number: "04", title: "Installation de matériel", text: "Mise en place, configuration et tests, avec une prise en main incluse." },
  { number: "05", title: "Pièces et consommables", text: "Composants et consommables sélectionnés pour prolonger la durée de vie de vos appareils." },
];

const faqs = [
  { question: "Combien coûte un dépannage ?", answer: "Le tarif dépend du diagnostic et du type d'intervention. Le prix vous est toujours annoncé avant toute intervention." },
  { question: "En combien de temps pouvez-vous intervenir ?", answer: "Le délai est confirmé lors de votre prise de contact, selon le type de panne et les disponibilités." },
  { question: "Intervenez-vous le week-end ou en soirée ?", answer: "Les disponibilités et les éventuels suppléments sont précisés avant la prise de rendez-vous." },
  { question: "Que se passe-t-il pour mes données ?", answer: "Nous ne consultons pas vos fichiers personnels. Une sauvegarde est proposée avant toute opération risquée." },
  { question: "Puis-je être dépanné à distance ?", answer: "Oui, via un outil sécurisé, avec votre accord à chaque étape." },
];

const navLinks = [
  { label: "Accueil", href: "#accueil" },
  { label: "Services", href: "#services" },
  { label: "Tarifs", href: "#tarifs" },
  { label: "À propos", href: "#apropos" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dépannage informatique à Nanterre — Reflex' Assistance" },
      { name: "description", content: "Dépannage informatique à domicile, au bureau ou à distance à Nanterre et dans les Hauts-de-Seine." },
      { property: "og:title", content: "Reflex' Assistance — Dépannage informatique à Nanterre" },
      { property: "og:description", content: "Un technicien pour les particuliers et petites entreprises, à domicile, au bureau ou à distance." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [openFaq, setOpenFaq] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for reveal animations
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    }
    if (mobileOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileOpen]);

  // Contact form submit → mailto
  function handleContactSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const prenom = (form.elements.namedItem("prenom") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const telephone = (form.elements.namedItem("telephone") as HTMLInputElement).value;
    const probleme = (form.elements.namedItem("probleme") as HTMLTextAreaElement).value;

    const subject = encodeURIComponent(`Nouvelle demande de ${prenom}`);
    const body = encodeURIComponent(
      `Prénom : ${prenom}\nE-mail : ${email}\nTéléphone : ${telephone || "Non renseigné"}\n\nProblème :\n${probleme}`
    );
    window.location.href = `mailto:reflex.assistance33@gmail.com?subject=${subject}&body=${body}`;
  }

  return (
    <main className="w-full max-w-full overflow-x-hidden bg-background text-foreground">

      {/* ── NAVBAR ── */}
      <div ref={menuRef}>
        <header className="nav-enter fixed inset-x-3 sm:inset-x-4 top-3 sm:top-5 z-50 mx-auto flex h-14 max-w-4xl items-center justify-between rounded-full border border-border/80 bg-card/95 px-4 sm:px-6 shadow-float backdrop-blur-xl">

          {/* Logo */}
          <a href="#accueil" aria-label="Retour à l'accueil" className="flex shrink-0 items-center no-underline">
            <Logo className="text-sm sm:text-base whitespace-nowrap" />
          </a>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex" aria-label="Navigation principale">
            {navLinks.slice(1).map((link) => (
              <a key={link.href} className="transition-colors hover:text-brand" href={link.href}>{link.label}</a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <Button asChild className="action-motion hidden h-10 rounded-full bg-ink px-5 text-ink-foreground shadow-button hover:bg-ink/85 md:flex">
            <a href="tel:+33782275430">
              Nous appeler
              <span className="ml-1 flex size-6 items-center justify-center rounded-full bg-card text-ink"><ArrowRight className="size-3.5" /></span>
            </a>
          </Button>

          {/* Mobile controls */}
          <div className="flex items-center gap-2 md:hidden">
            <Button asChild className="action-motion size-9 rounded-full bg-ink p-0 text-ink-foreground shadow-button hover:bg-ink/85">
              <a href="tel:+33782275430" aria-label="Appeler 07 82 27 54 30"><Phone className="size-4" /></a>
            </Button>
            <button
              type="button"
              aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex size-9 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:bg-mist active:scale-95"
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </header>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <nav
            aria-label="Navigation mobile"
            className="fixed inset-x-3 sm:inset-x-4 top-18 sm:top-20 z-40 mx-auto max-w-4xl overflow-hidden rounded-3xl border border-border/80 bg-card/98 shadow-float backdrop-blur-xl md:hidden"
          >
            <ul className="flex flex-col divide-y divide-border/60 py-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center px-6 py-3.5 text-base font-medium transition-colors hover:bg-mist hover:text-brand"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="border-t border-border/60 p-4">
              <a
                href="tel:+33782275430"
                onClick={() => setMobileOpen(false)}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink text-sm font-semibold text-ink-foreground shadow-button hover:bg-ink/85"
              >
                <Phone className="size-4" /> Appeler le 07 82 27 54 30
              </a>
            </div>
          </nav>
        )}
      </div>

      {/* ── HERO WITH BRIGHT DAYLIGHT BACKGROUND ── */}
      <section id="accueil" className="relative overflow-hidden px-4 pb-12 pt-28 sm:px-6 sm:pb-16 sm:pt-36 md:pt-40 text-foreground">
        {/* Image de fond claire et lumineuse */}
        <div className="absolute inset-0 z-0 pointer-events-none select-none">
          <img
            src="/hero-technicien-clair.jpg"
            alt="Technicien Reflex Assistance dépannage informatique"
            className="h-full w-full object-cover object-[65%_center] sm:object-[60%_center] scale-x-[-1]"
            loading="eager"
          />
          {/* Overlay blanc léger à gauche pour lisibilité du texte — image reste très visible à droite */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/85 via-white/60 to-white/10 sm:from-white/80 sm:via-white/50 sm:to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-white/20" />
        </div>

        <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[0.95fr_1.05fr] md:gap-8">
          <div className="hero-copy relative z-10">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card/85 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand shadow-sm backdrop-blur-md">
              <MapPin className="size-3.5 text-brand" />Nanterre &amp; Hauts-de-Seine
            </p>
            <h1 className="max-w-xl text-3xl font-semibold leading-[1.08] text-ink sm:text-5xl lg:text-[4.5rem]">
              Dépannage informatique, simplement.
            </h1>
            <p className="mt-4 sm:mt-6 max-w-lg text-sm sm:text-base leading-relaxed text-muted-foreground md:text-lg">
              Un technicien joignable rapidement pour particuliers et petites entreprises. Intervention à domicile, au bureau ou à distance.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row flex-wrap gap-3">
              <Button asChild size="lg" className="action-motion h-12 w-full sm:w-auto rounded-full bg-ink px-6 font-semibold text-ink-foreground shadow-button hover:bg-ink/85">
                <a href="tel:+33782275430" className="justify-center">
                  Appeler maintenant <span className="ml-1 flex size-7 items-center justify-center rounded-full bg-card text-ink"><ArrowRight className="size-4" /></span>
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="action-motion h-12 w-full sm:w-auto rounded-full border-ink/20 bg-card/70 px-6 font-medium text-ink shadow-none backdrop-blur-md hover:bg-card">
                <a href="#contact" className="justify-center">Devis gratuit</a>
              </Button>
            </div>
            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2.5 text-xs font-medium text-muted-foreground">
              <span className="flex items-center gap-1.5"><Check className="size-4 text-brand" />Prix annoncé avant intervention</span>
              <span className="flex items-center gap-1.5"><Check className="size-4 text-brand" />À domicile ou à distance</span>
            </div>
          </div>

          {/* Cartes d'assistance flottantes */}
          <div className="hero-visual relative mx-auto h-[320px] sm:h-[390px] md:h-[460px] w-full max-w-[480px] md:max-w-[580px]">
            <div className="float-card-primary absolute left-0 top-0 w-[88%] sm:w-[85%] rotate-[1.5deg] rounded-2xl sm:rounded-[28px] border border-border bg-card/95 backdrop-blur-xl p-4 sm:p-6 shadow-panel text-card-foreground">
              <div className="mb-4 sm:mb-6 flex items-center justify-between">
                <span className="text-xs sm:text-sm font-semibold">Votre assistance</span>
                <span className="text-[11px] sm:text-xs text-muted-foreground">Diagnostic rapide</span>
              </div>
              <div className="space-y-2.5 sm:space-y-3">
                {[
                  { icon: Laptop, name: "Ordinateur", subtitle: "Diagnostic et dépannage", color: "bg-highlight" },
                  { icon: Router, name: "Connexion Wi-Fi", subtitle: "Configuration sécurisée", color: "bg-soft-blue" },
                  { icon: Printer, name: "Périphériques", subtitle: "Installation et prise en main", color: "bg-soft-green" }
                ].map((item) => (
                  <div key={item.name} className={`service-chip flex items-center gap-2.5 sm:gap-3 rounded-xl sm:rounded-2xl ${item.color} p-2.5 sm:p-3.5`}>
                    <div className="flex size-8 sm:size-10 shrink-0 items-center justify-center rounded-full bg-card shadow-sm">
                      <item.icon className="size-4 sm:size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-semibold truncate">{item.name}</p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{item.subtitle}</p>
                    </div>
                    <Check className="size-4 sm:size-5 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
            <div className="float-card-secondary absolute bottom-0 right-0 w-[65%] sm:w-[60%] -rotate-[2deg] rounded-2xl sm:rounded-[25px] border border-border bg-card/95 backdrop-blur-xl p-4 sm:p-5 shadow-panel text-card-foreground">
              <div className="mb-4 sm:mb-6 flex items-start justify-between">
                <div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Intervention</p>
                  <p className="mt-0.5 text-xl sm:text-2xl font-semibold">Sur mesure</p>
                </div>
                <div className="rounded-full bg-soft-green p-1.5 sm:p-2">
                  <Wrench className="size-4 sm:size-5 text-brand" />
                </div>
              </div>
              <div className="flex h-16 sm:h-20 items-end gap-1.5 sm:gap-2" aria-hidden="true">
                {[42, 70, 54, 86, 63, 92, 76].map((height, index) => (
                  <div key={height} className={`meter-bar flex-1 rounded-t-md ${index % 2 ? "bg-brand" : "bg-highlight"}`} style={{ height: `${height}%` }} />
                ))}
              </div>
              <div className="mt-2.5 flex justify-between text-[9px] sm:text-[10px] text-muted-foreground">
                <span>L</span><span>M</span><span>M</span><span>J</span><span>V</span><span>S</span><span>D</span>
              </div>
            </div>
          </div>
        </div>

        {/* Trust strip */}
        <div className="trust-strip relative z-10 mx-auto mt-10 sm:mt-14 flex max-w-5xl flex-wrap items-center justify-center gap-x-6 sm:gap-x-10 gap-y-3 border-y border-border/50 py-4 sm:py-5 text-xs sm:text-sm md:text-base font-semibold text-foreground/70">
          <span className="flex items-center gap-1.5"><Laptop className="size-4 sm:size-5 text-brand" />PC &amp; Mac</span>
          <span className="flex items-center gap-1.5"><HardDrive className="size-4 sm:size-5 text-brand" />Données</span>
          <span className="flex items-center gap-1.5"><Router className="size-4 sm:size-5 text-brand" />Réseau</span>
          <span className="flex items-center gap-1.5"><ShieldCheck className="size-4 sm:size-5 text-brand" />Sécurité</span>
          <span className="flex items-center gap-1.5"><Printer className="size-4 sm:size-5 text-brand" />Équipements</span>
        </div>
      </section>

      {/* ── PROBLEMS ── */}
      <section className="bg-ink px-4 py-16 sm:px-6 sm:py-24 text-ink-foreground md:py-32">
        <div data-reveal className="reveal-section mx-auto max-w-6xl">
          <div className="mb-10 sm:mb-14 grid gap-4 md:grid-cols-2 md:items-end">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-medium leading-tight">Un problème de ce type&nbsp;?</h2>
            <p className="max-w-lg text-sm sm:text-base leading-relaxed text-ink-muted md:justify-self-end">Nous remettons vos outils en état sans jargon inutile, avec une solution claire et adaptée.</p>
          </div>
          <div className="stagger-grid grid gap-px overflow-hidden rounded-2xl bg-ink-border sm:grid-cols-2 lg:grid-cols-3">
            {problems.map((problem) => (
              <article key={problem.title} className="group min-h-44 sm:min-h-52 bg-ink p-5 sm:p-7 transition-colors hover:bg-ink-soft">
                <problem.icon className="mb-6 sm:mb-8 size-6 sm:size-7 text-highlight transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110" />
                <h3 className="text-base sm:text-lg font-semibold">{problem.title}</h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-ink-muted">{problem.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" className="px-4 py-16 sm:px-6 sm:py-24 md:py-32">
        <div data-reveal className="reveal-section mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="eyebrow">Nos services</p>
            <h2 className="mt-3 sm:mt-4 text-2xl sm:text-4xl md:text-5xl font-medium leading-tight">Tout ce qu'il faut pour rester connecté.</h2>
            <p className="mt-4 sm:mt-5 max-w-2xl text-sm sm:text-base md:text-lg leading-relaxed text-muted-foreground">Du dépannage ponctuel au suivi de votre parc, Reflex' Assistance vous accompagne à chaque étape.</p>
          </div>
          <div className="mt-10 sm:mt-14 border-t border-border">
            {services.map((service) => (
              <article key={service.number} className="service-row grid gap-2 sm:gap-4 border-b border-border py-6 sm:py-8 md:grid-cols-[100px_1fr_1fr] md:items-start">
                <span className="text-xs sm:text-sm font-semibold text-brand">{service.number}</span>
                <h3 className="text-lg sm:text-2xl font-medium">{service.title}</h3>
                <p className="max-w-lg text-sm sm:text-base leading-relaxed text-muted-foreground">{service.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── TARIFS ── */}
      <section id="tarifs" className="bg-mist px-4 py-16 sm:px-6 sm:py-24 md:py-32">
        <div data-reveal className="reveal-section mx-auto max-w-6xl">
          <div className="grid gap-8 sm:gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div className="lg:sticky lg:top-28">
              <p className="eyebrow">Des tarifs clairs</p>
              <h2 className="mt-3 sm:mt-4 text-2xl sm:text-4xl md:text-5xl font-medium leading-tight">Le prix est annoncé avant toute intervention.</h2>
              <p className="mt-3 sm:mt-5 text-sm sm:text-base md:text-lg text-muted-foreground">Aucune surprise ni frais caché.</p>
            </div>
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-panel">
              {["Diagnostic", "Dépannage à distance", "Intervention à domicile (Nanterre)", "Forfait entreprise / maintenance"].map((item, index) => (
                <div key={item} className="flex min-h-20 flex-col justify-center gap-2 border-b border-border p-4 sm:px-6 sm:py-5 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex size-7 sm:size-8 shrink-0 items-center justify-center rounded-full bg-mist text-xs font-semibold">0{index + 1}</span>
                    <span className="text-sm sm:text-base font-semibold">{item}</span>
                  </div>
                  <span className="text-xs sm:text-sm text-muted-foreground pl-10 sm:pl-0">{index === 3 ? "Sur devis" : "Tarif communiqué après diagnostic"}</span>
                </div>
              ))}
              <div className="bg-highlight p-4 sm:p-6">
                <p className="flex items-center gap-2 text-sm sm:text-base font-semibold"><Sparkles className="size-4 sm:size-5 shrink-0" />Un devis clair, avant de commencer.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="px-4 py-16 sm:px-6 sm:py-24 md:py-32">
        <div data-reveal className="reveal-section mx-auto max-w-6xl">
          <p className="eyebrow">Comment ça marche</p>
          <h2 className="mt-3 sm:mt-4 max-w-3xl text-2xl sm:text-4xl md:text-5xl font-medium leading-tight">Une prise en charge simple, du premier appel à la solution.</h2>
          <div className="stagger-grid mt-10 sm:mt-14 grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["01", "Vous nous contactez", "Par téléphone ou via le formulaire."],
              ["02", "Diagnostic et tarif", "Nous établissons un diagnostic et annonçons le prix."],
              ["03", "Nous intervenons", "À domicile, au bureau ou à distance."],
              ["04", "Tout fonctionne", "Vous repartez avec des conseils utiles."],
            ].map(([number, title, text]) => (
              <article key={number} className="border-t border-border pt-4 sm:pt-6">
                <span className="text-2xl sm:text-3xl font-semibold text-brand">{number}</span>
                <h3 className="mt-3 sm:mt-4 text-base sm:text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── À PROPOS ── */}
      <section id="apropos" className="bg-soft-green px-4 py-16 sm:px-6 sm:py-24 md:py-32">
        <div data-reveal className="reveal-section mx-auto grid max-w-6xl gap-8 sm:gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div className="about-visual relative min-h-[260px] sm:min-h-[340px] md:min-h-[420px] overflow-hidden rounded-2xl sm:rounded-[28px] bg-ink p-6 sm:p-8 md:p-12 text-ink-foreground shadow-panel">
            <div className="orbit-ring absolute -bottom-24 -right-20 size-80 rounded-full border-[54px] border-brand/60" />
            <div className="orbit-dot absolute right-14 top-12 size-20 rounded-full bg-highlight" />
            <div className="relative z-10 inline-block rounded-md bg-card p-3">
              <Logo className="text-base sm:text-lg text-ink" />
            </div>
            <div className="absolute bottom-6 left-6 z-10 sm:bottom-10 sm:left-8 md:left-12">
              <p className="text-xs sm:text-sm text-ink-muted">Votre expert de proximité</p>
              <p className="mt-1 text-2xl sm:text-3xl font-medium">Nanterre<br />&amp; Hauts-de-Seine</p>
            </div>
          </div>
          <div>
            <p className="eyebrow">Qui sommes-nous ?</p>
            <h2 className="mt-3 sm:mt-4 text-2xl sm:text-4xl md:text-5xl font-medium leading-tight">Une assistance rapide, honnête et expliquée simplement.</h2>
            <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg leading-relaxed text-muted-foreground">Reflex' Assistance accompagne les particuliers et les petites structures pour garder leurs équipements informatiques performants et fiables.</p>
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-muted-foreground"><strong className="text-foreground">Zone d'intervention :</strong> Nanterre et les Hauts-de-Seine. À distance partout en France.</p>
            <Button asChild className="mt-6 sm:mt-8 h-12 w-full sm:w-auto rounded-full bg-ink px-6 text-ink-foreground hover:bg-ink/85">
              <a href="#contact" className="justify-center">Parler à un technicien <ArrowRight className="ml-1 size-4" /></a>
            </Button>
          </div>
        </div>
      </section>

      {/* ── AVIS ── */}
      <section className="px-4 py-16 sm:px-6 sm:py-24 md:py-32">
        <div data-reveal className="reveal-section mx-auto max-w-6xl">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="eyebrow">Avis clients</p>
              <h2 className="mt-3 sm:mt-4 text-2xl sm:text-4xl md:text-5xl font-medium">Votre confiance compte.</h2>
            </div>
            <p className="max-w-sm text-sm sm:text-base leading-relaxed text-muted-foreground">Les témoignages vérifiés de nos clients seront bientôt disponibles ici.</p>
          </div>
          <div className="stagger-grid mt-8 sm:mt-12 grid gap-4 sm:gap-5 sm:grid-cols-2 md:grid-cols-3">
            {["Intervention claire", "Conseils adaptés", "Suivi de proximité"].map((title, index) => (
              <div key={title} className={`review-card min-h-48 sm:min-h-60 rounded-2xl border border-border p-5 sm:p-7 ${index === 1 ? "bg-highlight" : "bg-card"}`}>
                <div className="mb-8 sm:mb-12 flex gap-1 text-amber-500">
                  {Array.from({ length: 5 }).map((_, star) => (
                    <span key={star} className="text-base sm:text-lg">★</span>
                  ))}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold">{title}</h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground">Témoignage client à venir.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="bg-ink px-4 py-16 sm:px-6 sm:py-24 text-ink-foreground md:py-32">
        <div data-reveal className="reveal-section mx-auto grid max-w-6xl gap-8 sm:gap-12 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="eyebrow text-highlight">Questions fréquentes</p>
            <h2 className="mt-3 sm:mt-4 text-2xl sm:text-4xl md:text-5xl font-medium leading-tight">Vos questions, nos réponses.</h2>
            <Button asChild variant="outline" className="action-motion mt-6 sm:mt-8 h-11 w-full sm:w-auto rounded-full border-ink-border bg-transparent px-6 text-ink-foreground hover:bg-ink-soft hover:text-ink-foreground">
              <a href="#contact" className="justify-center">Nous contacter</a>
            </Button>
          </div>
          <div className="border-t border-ink-border">
            {faqs.map((faq, index) => (
              <div key={faq.question} className="border-b border-ink-border">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                  className="flex w-full items-center justify-between gap-3 py-4 sm:py-6 text-left text-sm sm:text-base font-semibold"
                  aria-expanded={openFaq === index}
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`size-4 sm:size-5 shrink-0 transition-transform ${openFaq === index ? "rotate-180" : ""}`} />
                </button>
                {openFaq === index && (
                  <p className="faq-answer max-w-2xl pb-4 sm:pb-6 pr-4 sm:pr-8 text-xs sm:text-sm leading-relaxed text-ink-muted">
                    {faq.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="paper-grid px-4 py-16 sm:px-6 sm:py-24 md:py-32">
        <div data-reveal className="reveal-section mx-auto grid max-w-6xl gap-10 sm:gap-14 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Contact</p>
            <h2 className="mt-3 sm:mt-4 max-w-lg text-2xl sm:text-4xl md:text-6xl font-medium leading-tight">Besoin d'aide avec votre informatique&nbsp;?</h2>
            <p className="mt-4 sm:mt-6 max-w-lg text-sm sm:text-base md:text-lg leading-relaxed text-muted-foreground">Contactez Reflex' Assistance et profitez d'un service rapide, fiable et personnalisé.</p>
            <div className="mt-8 space-y-4">
              <a className="contact-link flex items-center gap-3 sm:gap-4 text-base sm:text-lg font-semibold hover:text-brand" href="tel:+33782275430">
                <span className="flex size-10 sm:size-11 shrink-0 items-center justify-center rounded-full bg-ink text-ink-foreground"><Phone className="size-4 sm:size-5" /></span>
                07 82 27 54 30
              </a>
              <p className="flex items-start gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                <span className="flex size-10 sm:size-11 shrink-0 items-center justify-center rounded-full bg-card shadow-sm"><MapPin className="size-4 sm:size-5" /></span>
                <span className="pt-2">59 rue de Ponthieu, Bureau 326<br />75008 Paris</span>
              </p>
              <p className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                <span className="flex size-10 sm:size-11 shrink-0 items-center justify-center rounded-full bg-card shadow-sm"><Clock3 className="size-4 sm:size-5" /></span>
                Intervention sur rendez-vous
              </p>
            </div>
          </div>

          <form
            className="rounded-2xl sm:rounded-[28px] border border-border bg-card p-5 sm:p-8 shadow-panel"
            onSubmit={handleContactSubmit}
          >
            <div className="grid gap-4 sm:gap-5 sm:grid-cols-2">
              <label className="text-xs sm:text-sm font-medium">
                Prénom
                <input
                  name="prenom"
                  required
                  placeholder="Votre prénom"
                  className="mt-1.5 h-11 sm:h-12 w-full rounded-lg border border-input bg-background px-3.5 sm:px-4 text-base sm:text-sm outline-none transition-shadow focus:ring-2 focus:ring-ring"
                />
              </label>
              <label className="text-xs sm:text-sm font-medium">
                E-mail
                <input
                  name="email"
                  required
                  type="email"
                  placeholder="votre@email.fr"
                  className="mt-1.5 h-11 sm:h-12 w-full rounded-lg border border-input bg-background px-3.5 sm:px-4 text-base sm:text-sm outline-none transition-shadow focus:ring-2 focus:ring-ring"
                />
              </label>
            </div>
            <label className="mt-4 block text-xs sm:text-sm font-medium">
              Téléphone
              <input
                name="telephone"
                type="tel"
                placeholder="06 12 34 56 78"
                className="mt-1.5 h-11 sm:h-12 w-full rounded-lg border border-input bg-background px-3.5 sm:px-4 text-base sm:text-sm outline-none transition-shadow focus:ring-2 focus:ring-ring"
              />
            </label>
            <label className="mt-4 block text-xs sm:text-sm font-medium">
              Votre problème
              <textarea
                name="probleme"
                required
                rows={4}
                placeholder="Décrivez votre souci informatique..."
                className="mt-1.5 w-full resize-none rounded-lg border border-input bg-background p-3.5 sm:p-4 text-base sm:text-sm outline-none transition-shadow focus:ring-2 focus:ring-ring"
              />
            </label>
            <label className="mt-4 flex items-start gap-2.5 text-[11px] sm:text-xs leading-relaxed text-muted-foreground">
              <input required type="checkbox" className="mt-0.5 size-4 accent-current shrink-0" />
              J'accepte que mes données soient utilisées pour répondre à ma demande.
            </label>
            <Button type="submit" className="mt-5 h-12 w-full rounded-full bg-ink text-sm sm:text-base font-semibold text-ink-foreground shadow-button hover:bg-ink/85">
              Envoyer la demande <Mail className="ml-1 size-4" />
            </Button>
          </form>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-border bg-card px-4 py-8 sm:px-6 sm:py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-center sm:text-left">
          <Logo className="text-base self-center sm:self-auto" />
          <div className="text-xs sm:text-sm leading-relaxed text-muted-foreground sm:text-right">
            <p>Reflex' Assistance · © 2026</p>
            <p>Mentions légales · Politique de confidentialité</p>
          </div>
        </div>
      </footer>
    </main>
  );
}