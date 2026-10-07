/**
 * ROUTE /admin — Redirection sécurisée vers le slug admin dynamique.
 *
 * Cette route est intentionnellement visible dans le routeur mais redirige
 * silencieusement vers la page d'accueil. Le vrai dashboard est accessible
 * uniquement via le slug configuré dans VITE_ADMIN_SLUG.
 *
 * Cela empêche toute découverte par force-brute de l'interface d'administration.
 */
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "404 — Page introuvable" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  beforeLoad: () => {
    // Redirection silencieuse vers la page d'accueil
    throw redirect({ to: "/", replace: true });
  },
  component: () => null,
});
