import { createFileRoute, redirect } from "@tanstack/react-router";
import { AdminAuthGate } from "@/components/AdminAuthGate";
import { AdminDashboardContent } from "@/components/AdminDashboardContent";
import { getAdminSlug } from "@/lib/admin-auth";

export const Route = createFileRoute("/$adminSlug")({
  head: () => ({
    meta: [
      { title: "Tableau de Bord — Reflex' Assistance" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  beforeLoad: ({ params }) => {
    const expectedSlug = getAdminSlug();
    if (params.adminSlug !== expectedSlug) {
      // Slug ne correspond pas → retourner 404 furtif (rediriger vers /)
      throw redirect({ to: "/", replace: true });
    }
  },
  component: AdminRoute,
});

function AdminRoute() {
  return (
    <AdminAuthGate>
      <AdminDashboardContent />
    </AdminAuthGate>
  );
}
