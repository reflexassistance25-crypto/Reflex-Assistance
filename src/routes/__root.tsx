import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Reflex' Assistance — Dépannage informatique à Nanterre & Hauts-de-Seine" },
      { name: "description", content: "Dépannage informatique à domicile, en entreprise ou à distance à Nanterre (92) et Paris. Réparation PC & Mac, virus, réseaux Wi-Fi et récupération de données." },
      { name: "keywords", content: "dépannage informatique nanterre, réparation ordinateur hauts-de-seine, assistance informatique domicile 92, dépannage pc mac paris, récupération données disque dur, installation wifi entreprise" },
      { name: "author", content: "Reflex' Assistance" },
      { name: "robots", content: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" },
      { name: "geo.region", content: "FR-92" },
      { name: "geo.placename", content: "Nanterre" },
      { name: "geo.position", content: "48.8924;2.2071" },
      { name: "ICBM", content: "48.8924, 2.2071" },
      { property: "og:site_name", content: "Reflex' Assistance" },
      { property: "og:locale", content: "fr_FR" },
      { property: "og:title", content: "Reflex' Assistance — Dépannage informatique à Nanterre" },
      { property: "og:description", content: "Dépannage rapide pour particuliers et professionnels. À domicile, au bureau ou à distance. Prix annoncé avant intervention." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://reflexassistance.fr/" },
      { property: "og:image", content: "https://reflexassistance.fr/reflex-assistance-logo.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Reflex' Assistance — Dépannage informatique" },
      { name: "twitter:description", content: "Technicien informatique à Nanterre et Hauts-de-Seine. Domicile & distance." },
      { name: "twitter:image", content: "https://reflexassistance.fr/reflex-assistance-logo.png" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "canonical", href: "https://reflexassistance.fr/" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap" },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

const schemaOrgJsonLd = {
  "@context": "https://schema.org",
  "@type": "ComputerRepairService",
  "name": "Reflex' Assistance",
  "image": "https://reflexassistance.fr/reflex-assistance-logo.png",
  "@id": "https://reflexassistance.fr",
  "url": "https://reflexassistance.fr",
  "telephone": "+33782275430",
  "priceRange": "€€",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "59 rue de Ponthieu, Bureau 326",
    "addressLocality": "Paris",
    "postalCode": "75008",
    "addressCountry": "FR"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 48.8924,
    "longitude": 2.2071
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "opens": "09:00",
      "closes": "19:00"
    }
  ],
  "areaServed": [
    { "@type": "City", "name": "Nanterre" },
    { "@type": "AdministrativeArea", "name": "Hauts-de-Seine" },
    { "@type": "City", "name": "Paris" },
    { "@type": "Country", "name": "France" }
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "48"
  }
};

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <HeadContent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrgJsonLd) }}
        />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  // Initialisation automatique de Google Analytics si configuré
  useEffect(() => {
    try {
      const gaId = localStorage.getItem("reflex_ga_measurement_id");
      if (gaId) {
        import("../lib/analytics").then(({ initGoogleAnalytics }) => {
          initGoogleAnalytics(gaId);
        });
      }
    } catch (e) {
      // Ignorer si local storage non accessible
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
