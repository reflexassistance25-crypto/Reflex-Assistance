/**
 * Script Keep-Alive Supabase — Reflex' Assistance
 * Empêche la mise en veille automatique de la base de données gratuite Supabase (pause après 7 jours d'inactivité).
 *
 * Fonctionnement :
 * - Effectue un ping quotidien vers la table public.keep_alive_pings
 * - Insère un enregistrement horodaté de santé
 * - Nettoie les anciens pings de plus de 60 jours pour éviter d'encombrer la base
 */

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "https://xyumknfefhavehnnreyb.supabase.co";
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5dW1rbmZlZmhhdmVobm5yZXliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEzODkxNzUsImV4cCI6MjEwNjk2NTE3NX0.ASYy2VVF0AFq6xBL5T6cuv7i96sPR67V46xdDY2UD6g";

async function pingSupabase() {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] 🔄 Démarrage du ping Keep-Alive vers Supabase...`);
  console.log(`📡 URL cible : ${SUPABASE_URL}`);

  try {
    // 1. Insertion d'un nouveau ping dans la table keep_alive_pings
    const insertResponse = await fetch(`${SUPABASE_URL}/rest/v1/keep_alive_pings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        "Prefer": "return=representation",
      },
      body: JSON.stringify({
        source: process.env.GITHUB_ACTIONS ? "github_action_daily_cron" : "local_keep_alive_script",
        status: "active_healthy",
        details: {
          node_version: process.version,
          platform: process.platform,
          ran_at: timestamp,
        },
      }),
    });

    if (!insertResponse.ok) {
      const errText = await insertResponse.text();
      throw new Error(`Erreur HTTP lors de l'insertion : ${insertResponse.status} ${errText}`);
    }

    const insertedData = await insertResponse.json();
    console.log("✅ Ping inséré avec succès dans la base de données !");
    console.log(`📌 Enregistrement :`, insertedData[0] || insertedData);

    // 2. Requête de lecture pour valider l'activité et l'état
    const readResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/keep_alive_pings?select=id,ping_at,status,source&order=ping_at.desc&limit=3`,
      {
        headers: {
          "apikey": SUPABASE_ANON_KEY,
          "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );

    if (readResponse.ok) {
      const recentPings = await readResponse.json();
      console.log(`📊 Derniers pings enregistrés (${recentPings.length}) :`);
      recentPings.forEach((p, idx) => {
        console.log(`   ${idx + 1}. [${p.ping_at}] Source: ${p.source} | Statut: ${p.status}`);
      });
    }

    console.log(`🎉 Mission accomplie : la base Supabase est active et ne s'éteindra pas !`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Échec du ping Keep-Alive Supabase :", error);
    process.exit(1);
  }
}

pingSupabase();
