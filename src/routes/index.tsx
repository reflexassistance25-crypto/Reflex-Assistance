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
  MonitorCog,
  Phone,
  Printer,
  Router,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";
import { useState } from "react";

import logoAsset from "@/assets/reflex-assistance-logo.png.asset.json";
import { Button } from "@/components/ui/button";

const problems = [
  { icon: Laptop, title: "Ordinateur lent ou en panne", text: "Qui plante ou ne démarre plus, sur PC et Mac." },
  { icon: ShieldCheck, title: "Virus et piratage", text: "Publicités intrusives, mails piratés, comptes compromis." },
  { icon: HardDrive, title: "Récupération de données", text: "Disque dur, clé USB, photos et documents." },
  { icon: Router, title: "Wi-Fi, box, imprimante", text: "Connexion, messagerie et périphériques." },
  { icon: MonitorCog, title: "Installation et configuration", text: "D’un poste, d’un réseau ou d’un nouvel équipement." },
  { icon: Cloud, title: "Assistance petites entreprises", text: "Maintenance, sauvegardes et conseils." },
];

const services = [
  { number: "01", title: "Dépannage informatique", text: "Panne, lenteur, virus : diagnostic et réparation sur site ou à distance, pour limiter l’interruption de votre activité." },
  { number: "02", title: "Assistance technique", text: "Un accompagnement patient et sans jargon pour bien utiliser vos appareils au quotidien." },
  { number: "03", title: "Conseil informatique", text: "Quel matériel choisir ? Comment sécuriser vos données ? Des solutions adaptées à votre budget." },
  { number: "04", title: "Installation de matériel", text: "Mise en place, configuration et tests, avec une prise en main incluse." },
  { number: "05", title: "Pièces et consommables", text: "Composants et consommables sélectionnés pour prolonger la durée de vie de vos appareils." },
];

const faqs = [
  { question: "Combien coûte un dépannage ?", answer: "Le tarif dépend du diagnostic et du type d’intervention. Le prix vous est toujours annoncé avant toute intervention." },
  { question: "En combien de temps pouvez-vous intervenir ?", answer: "Le délai est confirmé lors de votre prise de contact, selon le type de panne et les disponibilités." },
  { question: "Intervenez-vous le week-end ou en soirée ?", answer: "Les disponibilités et les éventuels suppléments sont précisés avant la prise de rendez-vous." },
  { question: "Que se passe-t-il pour mes données ?", answer: "Nous ne consultons pas vos fichiers personnels. Une sauvegarde est proposée avant toute opération risquée." },
  { question: "Puis-je être dépanné à distance ?", answer: "Oui, via un outil sécurisé, avec votre accord à chaque étape." },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dépannage informatique à Nanterre — Reflex’ Assistance" },
      { name: "description", content: "Dépannage informatique à domicile, au bureau ou à distance à Nanterre et dans les Hauts-de-Seine." },
      { property: "og:title", content: "Reflex’ Assistance — Dépannage informatique à Nanterre" },
      { property: "og:description", content: "Un technicien pour les particuliers et petites entreprises, à domicile, au bureau ou à distance." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <main className="overflow-hidden bg-background text-foreground">
      <header className="fixed left-1/2 top-4 z-50 flex h-14 w-[min(94%,780px)] -translate-x-1/2 items-center justify-between rounded-full border border-border/70 bg-card/95 px-3 shadow-float backdrop-blur-xl md:top-6 md:px-4">
        <a href="#accueil" aria-label="Retour à l’accueil" className="flex min-w-0 items-center">
          <img src={logoAsset.url} alt="Reflex Assistance" className="h-9 w-auto max-w-[148px] object-contain md:max-w-[185px]" />
        </a>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex" aria-label="Navigation principale">
          <a className="transition-colors hover:text-brand" href="#services">Services</a>
          <a className="transition-colors hover:text-brand" href="#tarifs">Tarifs</a>
          <a className="transition-colors hover:text-brand" href="#apropos">À propos</a>
          <a className="transition-colors hover:text-brand" href="#faq">FAQ</a>
        </nav>
        <Button asChild className="h-10 rounded-full bg-ink px-3 text-ink-foreground shadow-button hover:bg-ink/85 md:px-5">
          <a href="tel:+33782275430"><span className="hidden sm:inline">Nous appeler</span><Phone className="sm:hidden" /><span className="flex size-6 items-center justify-center rounded-full bg-card text-ink"><ArrowRight /></span></a>
        </Button>
      </header>

      <section id="accueil" className="paper-grid relative min-h-[790px] px-5 pb-16 pt-32 md:min-h-[880px] md:pt-40">
        <div className="mx-auto grid max-w-6xl items-center gap-14 md:grid-cols-[0.9fr_1.1fr] md:gap-8">
          <div className="relative z-10">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold uppercase text-muted-foreground shadow-sm"><MapPin className="size-3.5 text-brand" />Nanterre & Hauts-de-Seine</p>
            <h1 className="max-w-xl text-5xl font-medium leading-[0.98] text-ink sm:text-6xl lg:text-[4.8rem]">Dépannage informatique, simplement.</h1>
            <p className="mt-7 max-w-lg text-base leading-7 text-muted-foreground md:text-lg">Un technicien joignable rapidement pour particuliers et petites entreprises. Intervention à domicile, au bureau ou à distance.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-12 rounded-full bg-ink px-5 text-ink-foreground shadow-button hover:bg-ink/85">
                <a href="tel:+33782275430">Appeler maintenant <span className="flex size-7 items-center justify-center rounded-full bg-card text-ink"><ArrowRight /></span></a>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 rounded-full border-ink bg-transparent px-5 shadow-none hover:bg-card">
                <a href="#contact">Devis gratuit</a>
              </Button>
            </div>
            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-xs font-medium text-muted-foreground">
              <span className="flex items-center gap-2"><Check className="size-4 text-brand" />Prix annoncé avant intervention</span>
              <span className="flex items-center gap-2"><Check className="size-4 text-brand" />À domicile ou à distance</span>
            </div>
          </div>

          <div className="relative mx-auto h-[390px] w-full max-w-[600px] md:h-[470px]">
            <div className="absolute left-2 top-1 w-[85%] rotate-[2deg] rounded-[28px] border border-border bg-card p-5 shadow-panel md:left-8 md:p-7">
              <div className="mb-6 flex items-center justify-between"><span className="font-semibold">Votre assistance</span><span className="text-xs text-muted-foreground">Diagnostic rapide</span></div>
              <div className="space-y-3">
                {[{ icon: Laptop, name: "Ordinateur", color: "bg-highlight" }, { icon: Router, name: "Connexion Wi-Fi", color: "bg-soft-blue" }, { icon: Printer, name: "Périphériques", color: "bg-soft-green" }].map((item, index) => (
                  <div key={item.name} className={`flex items-center gap-3 rounded-2xl ${item.color} p-3.5`}>
                    <div className="flex size-10 items-center justify-center rounded-full bg-card"><item.icon className="size-5" /></div>
                    <div className="min-w-0 flex-1"><p className="text-sm font-semibold">{item.name}</p><p className="text-xs text-muted-foreground">{index === 0 ? "Diagnostic et dépannage" : index === 1 ? "Configuration sécurisée" : "Installation et prise en main"}</p></div>
                    <Check className="size-5" />
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-[62%] -rotate-[3deg] rounded-[25px] border border-border bg-card p-5 shadow-panel md:p-6">
              <div className="mb-7 flex items-start justify-between"><div><p className="text-xs text-muted-foreground">Intervention</p><p className="mt-1 text-3xl font-semibold">Sur mesure</p></div><div className="rounded-full bg-soft-green p-2"><Wrench className="size-5 text-brand" /></div></div>
              <div className="flex h-24 items-end gap-2" aria-hidden="true">{[42, 70, 54, 86, 63, 92, 76].map((height, index) => <div key={height} className={`flex-1 rounded-t-md ${index % 2 ? "bg-brand" : "bg-highlight"}`} style={{ height: `${height}%` }} />)}</div>
              <div className="mt-3 flex justify-between text-[10px] text-muted-foreground"><span>L</span><span>M</span><span>M</span><span>J</span><span>V</span><span>S</span><span>D</span></div>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-16 flex max-w-5xl flex-wrap items-center justify-center gap-x-10 gap-y-4 border-y border-border/60 py-6 text-sm font-semibold text-muted-foreground/65 md:mt-12 md:text-base">
          <span className="flex items-center gap-2"><Laptop className="size-5" />PC & Mac</span><span className="flex items-center gap-2"><HardDrive className="size-5" />Données</span><span className="flex items-center gap-2"><Router className="size-5" />Réseau</span><span className="flex items-center gap-2"><ShieldCheck className="size-5" />Sécurité</span><span className="flex items-center gap-2"><Printer className="size-5" />Équipements</span>
        </div>
      </section>

      <section className="bg-ink px-5 py-24 text-ink-foreground md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 grid gap-5 md:grid-cols-2 md:items-end"><h2 className="text-4xl font-medium leading-tight md:text-6xl">Un problème de ce type&nbsp;?</h2><p className="max-w-lg text-base leading-7 text-ink-muted md:justify-self-end">Nous remettons vos outils en état sans jargon inutile, avec une solution claire et adaptée.</p></div>
          <div className="grid gap-px overflow-hidden rounded-2xl bg-ink-border sm:grid-cols-2 lg:grid-cols-3">
            {problems.map((problem) => <article key={problem.title} className="group min-h-52 bg-ink p-7 transition-colors hover:bg-ink-soft"><problem.icon className="mb-10 size-7 text-highlight" /><h3 className="text-lg font-semibold">{problem.title}</h3><p className="mt-3 text-sm leading-6 text-ink-muted">{problem.text}</p></article>)}
          </div>
        </div>
      </section>

      <section id="services" className="px-5 py-24 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl"><p className="eyebrow">Nos services</p><h2 className="mt-5 text-4xl font-medium leading-tight md:text-6xl">Tout ce qu’il faut pour rester connecté.</h2><p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">Du dépannage ponctuel au suivi de votre parc, Reflex’ Assistance vous accompagne à chaque étape.</p></div>
          <div className="mt-16 border-t border-border">
            {services.map((service) => <article key={service.number} className="grid gap-4 border-b border-border py-8 md:grid-cols-[100px_1fr_1fr] md:items-start"><span className="text-sm font-semibold text-brand">{service.number}</span><h3 className="text-2xl font-medium">{service.title}</h3><p className="max-w-lg leading-7 text-muted-foreground">{service.text}</p></article>)}
          </div>
        </div>
      </section>

      <section id="tarifs" className="bg-mist px-5 py-24 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div className="lg:sticky lg:top-28"><p className="eyebrow">Des tarifs clairs</p><h2 className="mt-5 text-4xl font-medium leading-tight md:text-6xl">Le prix est annoncé avant toute intervention.</h2><p className="mt-6 text-lg text-muted-foreground">Aucune surprise.</p></div>
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-panel">
              {["Diagnostic", "Dépannage à distance", "Intervention à domicile (Nanterre)", "Forfait entreprise / maintenance"].map((item, index) => <div key={item} className="flex min-h-24 flex-col justify-center gap-2 border-b border-border px-6 py-5 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><span className="flex size-8 items-center justify-center rounded-full bg-mist text-xs font-semibold">0{index + 1}</span><span className="font-semibold">{item}</span></div><span className="text-sm text-muted-foreground">{index === 3 ? "Sur devis" : "Tarif communiqué après diagnostic"}</span></div>)}
              <div className="bg-highlight p-6"><p className="flex items-center gap-2 font-semibold"><Sparkles className="size-5" />Un devis clair, avant de commencer.</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-24 md:py-32">
        <div className="mx-auto max-w-6xl"><p className="eyebrow">Comment ça marche</p><h2 className="mt-5 max-w-3xl text-4xl font-medium leading-tight md:text-6xl">Une prise en charge simple, du premier appel à la solution.</h2>
          <div className="mt-16 grid gap-10 md:grid-cols-4">{[
            ["01", "Vous nous contactez", "Par téléphone ou via le formulaire."],
            ["02", "Diagnostic et tarif", "Nous établissons un diagnostic et annonçons le prix."],
            ["03", "Nous intervenons", "À domicile, au bureau ou à distance."],
            ["04", "Tout fonctionne", "Vous repartez avec des conseils utiles."],
          ].map(([number, title, text]) => <article key={number} className="border-t border-border pt-6"><span className="text-4xl font-medium text-brand">{number}</span><h3 className="mt-8 text-lg font-semibold">{title}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p></article>)}</div>
        </div>
      </section>

      <section id="apropos" className="bg-soft-green px-5 py-24 md:py-32">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div className="relative min-h-[420px] overflow-hidden rounded-[28px] bg-ink p-8 text-ink-foreground shadow-panel md:p-12"><div className="absolute -bottom-24 -right-20 size-80 rounded-full border-[54px] border-brand/60" /><div className="absolute right-14 top-12 size-20 rounded-full bg-highlight" /><img src={logoAsset.url} alt="Reflex Assistance" className="relative z-10 h-16 w-auto rounded-md bg-card p-2" /><div className="absolute bottom-10 left-8 z-10 md:left-12"><p className="text-sm text-ink-muted">Votre expert de proximité</p><p className="mt-2 text-3xl font-medium">Nanterre<br />& Hauts-de-Seine</p></div></div>
          <div><p className="eyebrow">Qui sommes-nous ?</p><h2 className="mt-5 text-4xl font-medium leading-tight md:text-6xl">Une assistance rapide, honnête et expliquée simplement.</h2><p className="mt-7 text-lg leading-8 text-muted-foreground">Reflex’ Assistance accompagne les particuliers et les petites structures pour garder leurs équipements informatiques performants et fiables.</p><p className="mt-5 leading-7 text-muted-foreground"><strong className="text-foreground">Zone d’intervention :</strong> Nanterre et les Hauts-de-Seine. À distance partout en France.</p><Button asChild className="mt-8 h-12 rounded-full bg-ink px-5 text-ink-foreground hover:bg-ink/85"><a href="#contact">Parler à un technicien <ArrowRight /></a></Button></div>
        </div>
      </section>

      <section className="px-5 py-24 md:py-32"><div className="mx-auto max-w-6xl"><div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="eyebrow">Avis clients</p><h2 className="mt-5 text-4xl font-medium md:text-6xl">Votre confiance compte.</h2></div><p className="max-w-sm leading-7 text-muted-foreground">Les témoignages vérifiés de nos clients seront bientôt disponibles ici.</p></div><div className="mt-14 grid gap-5 md:grid-cols-3">{["Intervention claire", "Conseils adaptés", "Suivi de proximité"].map((title, index) => <div key={title} className={`min-h-64 rounded-2xl border border-border p-7 ${index === 1 ? "bg-highlight" : "bg-card"}`}><div className="mb-16 flex gap-1">{Array.from({ length: 5 }).map((_, star) => <span key={star} className="text-lg">★</span>)}</div><h3 className="text-xl font-semibold">{title}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">Témoignage client à venir.</p></div>)}</div></div></section>

      <section id="faq" className="bg-ink px-5 py-24 text-ink-foreground md:py-32"><div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[0.75fr_1.25fr]"><div><p className="eyebrow text-highlight">Questions fréquentes</p><h2 className="mt-5 text-4xl font-medium leading-tight md:text-6xl">Vos questions, nos réponses.</h2><Button asChild variant="outline" className="mt-8 h-11 rounded-full border-ink-border bg-transparent px-5 text-ink-foreground hover:bg-ink-soft hover:text-ink-foreground"><a href="#contact">Nous contacter</a></Button></div><div className="border-t border-ink-border">{faqs.map((faq, index) => <div key={faq.question} className="border-b border-ink-border"><button type="button" onClick={() => setOpenFaq(openFaq === index ? -1 : index)} className="flex w-full items-center justify-between gap-4 py-6 text-left font-semibold" aria-expanded={openFaq === index}><span>{faq.question}</span><ChevronDown className={`size-5 shrink-0 transition-transform ${openFaq === index ? "rotate-180" : ""}`} /></button>{openFaq === index && <p className="max-w-2xl pb-6 pr-8 text-sm leading-7 text-ink-muted">{faq.answer}</p>}</div>)}</div></div></section>

      <section id="contact" className="paper-grid px-5 py-24 md:py-32"><div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-2"><div><p className="eyebrow">Contact</p><h2 className="mt-5 max-w-lg text-5xl font-medium leading-tight md:text-7xl">Besoin d’aide avec votre informatique&nbsp;?</h2><p className="mt-7 max-w-lg text-lg leading-8 text-muted-foreground">Contactez Reflex’ Assistance et profitez d’un service rapide, fiable et personnalisé.</p><div className="mt-10 space-y-4"><a className="flex items-center gap-4 text-lg font-semibold hover:text-brand" href="tel:+33782275430"><span className="flex size-11 items-center justify-center rounded-full bg-ink text-ink-foreground"><Phone /></span>07 82 27 54 30</a><p className="flex items-start gap-4 text-muted-foreground"><span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-card shadow-sm"><MapPin className="size-5" /></span><span className="pt-2">59 rue de Ponthieu, Bureau 326<br />75008 Paris</span></p><p className="flex items-center gap-4 text-muted-foreground"><span className="flex size-11 items-center justify-center rounded-full bg-card shadow-sm"><Clock3 className="size-5" /></span>Intervention sur rendez-vous</p></div></div>
          <form className="rounded-[28px] border border-border bg-card p-6 shadow-panel md:p-9" onSubmit={(event) => event.preventDefault()}><div className="grid gap-5 sm:grid-cols-2"><label className="text-sm font-medium">Prénom<input required className="mt-2 h-12 w-full rounded-lg border border-input bg-background px-4 outline-none transition-shadow focus:ring-2 focus:ring-ring" /></label><label className="text-sm font-medium">E-mail<input required type="email" className="mt-2 h-12 w-full rounded-lg border border-input bg-background px-4 outline-none transition-shadow focus:ring-2 focus:ring-ring" /></label></div><label className="mt-5 block text-sm font-medium">Téléphone<input type="tel" className="mt-2 h-12 w-full rounded-lg border border-input bg-background px-4 outline-none transition-shadow focus:ring-2 focus:ring-ring" /></label><label className="mt-5 block text-sm font-medium">Votre problème<textarea required rows={5} className="mt-2 w-full resize-none rounded-lg border border-input bg-background p-4 outline-none transition-shadow focus:ring-2 focus:ring-ring" /></label><label className="mt-5 flex items-start gap-3 text-xs leading-5 text-muted-foreground"><input required type="checkbox" className="mt-1 size-4 accent-current" />J’accepte que mes données soient utilisées pour répondre à ma demande.</label><Button type="submit" className="mt-6 h-12 w-full rounded-full bg-ink text-ink-foreground hover:bg-ink/85">Envoyer la demande <Mail /></Button></form>
        </div></section>

      <footer className="border-t border-border bg-card px-5 py-10"><div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-center md:justify-between"><img src={logoAsset.url} alt="Reflex Assistance" className="h-12 w-auto self-start" /><div className="text-sm leading-6 text-muted-foreground md:text-right"><p>Reflex’ Assistance · © 2026</p><p>Mentions légales · Politique de confidentialité</p></div></div></footer>
    </main>
  );
}