import { useState, useEffect } from "react";
import {
  ShieldCheck,
  Lock,
  Smartphone,
  KeyRound,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  QrCode,
  Copy,
  Check,
  Eye,
  EyeOff,
  LogOut,
  Sparkles,
} from "lucide-react";
import logoImg from "@/assets/reflex-assistance-logo.png";
import {
  verifyAdminPassword,
  verifyTotpCode,
  isFullyAuthenticated,
  saveAdminSession,
  logoutAdmin,
  getAdminTotpSecret,
  getQrCodeImageUrl,
  getAdminSlug,
} from "@/lib/admin-auth";

interface AdminAuthGateProps {
  children: React.ReactNode;
}

export function AdminAuthGate({ children }: AdminAuthGateProps) {
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Étape en cours (1: Mot de passe, 2: 2FA TOTP)
  const [step, setStep] = useState<1 | 2>(1);

  // Form states
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [totpCode, setTotpCode] = useState<string>("");

  // UI helpers
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [verifying, setVerifying] = useState<boolean>(false);
  const [showQrSetup, setShowQrSetup] = useState<boolean>(false);
  const [copiedSecret, setCopiedSecret] = useState<boolean>(false);

  // Vérifier si déjà authentifié
  useEffect(() => {
    setAuthenticated(isFullyAuthenticated());
    setLoading(false);
  }, []);

  // Étape 1 : Valider le mot de passe principal
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!password.trim()) {
      setErrorMsg("Veuillez saisir votre mot de passe administrateur.");
      return;
    }

    if (verifyAdminPassword(password)) {
      setStep(2);
      setErrorMsg(null);
    } else {
      setErrorMsg("Mot de passe administrateur incorrect.");
    }
  };

  // Étape 2 : Valider le code 2FA TOTP
  const handleTotpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanCode = totpCode.trim().replace(/\s+/g, "");
    if (cleanCode.length !== 6) {
      setErrorMsg("Le code 2FA doit comporter exactement 6 chiffres.");
      return;
    }

    setVerifying(true);
    try {
      const isValid = await verifyTotpCode(cleanCode);
      if (isValid) {
        saveAdminSession({
          authenticated: true,
          timestamp: Date.now(),
          factor1Passed: true,
          factor2Passed: true,
        });
        setSuccessMsg("Authentification 2FA réussie ! Redirection...");
        setTimeout(() => {
          setAuthenticated(true);
        }, 500);
      } else {
        setErrorMsg("Code 2FA invalide ou expiré. Vérifiez l'heure de votre appareil.");
      }
    } catch {
      setErrorMsg("Erreur de validation 2FA.");
    } finally {
      setVerifying(false);
    }
  };

  const handleCopySecret = () => {
    navigator.clipboard.writeText(getAdminTotpSecret());
    setCopiedSecret(true);
    setTimeout(() => setCopiedSecret(false), 2000);
  };

  const handleLogout = () => {
    logoutAdmin();
    setAuthenticated(false);
    setStep(1);
    setPassword("");
    setTotpCode("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="animate-pulse flex items-center gap-2">
          <ShieldCheck className="size-5 text-emerald-400" />
          <span>Vérification de sécurité...</span>
        </div>
      </div>
    );
  }

  // Si authentifié, afficher le dashboard avec bandeau de déconnexion 2FA
  if (authenticated) {
    return (
      <div>
        {/* Bandeau d'en-tête de session sécurisée */}
        <div className="bg-slate-950/90 border-b border-emerald-900/40 px-4 py-2 text-xs flex items-center justify-between backdrop-blur-md sticky top-0 z-50">
          <div className="flex items-center gap-2 text-emerald-400 font-medium">
            <span className="flex size-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Session 2FA Active · Accès Administrateur Autorisé</span>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-900 hover:bg-red-950/80 text-slate-300 hover:text-red-300 border border-slate-800 hover:border-red-800 transition-colors cursor-pointer"
          >
            <LogOut className="size-3" />
            <span>Verrouiller / Déconnexion</span>
          </button>
        </div>
        {children}
      </div>
    );
  }

  // Écran de connexion 2FA
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-6 text-slate-100">
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        {/* Lueur de fond décorative */}
        <div className="absolute -top-24 -left-24 size-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 size-48 rounded-full bg-brand/10 blur-3xl pointer-events-none" />

        {/* Logo & Titre */}
        <div className="text-center mb-6">
          <div className="inline-block p-3 rounded-2xl bg-slate-950 border border-slate-800 shadow-inner mb-3">
            <img src={logoImg} alt="Reflex Assistance" className="h-8 w-auto mx-auto object-contain" />
          </div>
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-400 uppercase tracking-widest mt-1">
            <ShieldCheck className="size-4" />
            <span>Portail Administrateur Sécurisé</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
            Double Authentification (2FA)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Accès restreint aux techniciens agréés Reflex' Assistance
          </p>
        </div>

        {/* Indicateur d'étape */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          <div
            className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-medium border transition-colors ${
              step === 1
                ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-300"
                : "bg-slate-950/50 border-slate-800 text-slate-500"
            }`}
          >
            <Lock className="size-3" />
            <span>1. Mot de passe</span>
          </div>
          <div
            className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-medium border transition-colors ${
              step === 2
                ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-300"
                : "bg-slate-950/50 border-slate-800 text-slate-500"
            }`}
          >
            <Smartphone className="size-3" />
            <span>2. Code 2FA (TOTP)</span>
          </div>
        </div>

        {/* Alertes erreurs / succès */}
        {errorMsg && (
          <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-red-950/70 border border-red-800 text-red-300 text-xs animate-in fade-in">
            <AlertCircle className="size-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-xs animate-in fade-in">
            <CheckCircle2 className="size-4 shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* ──────── ÉTAPE 1 : MOT DE PASSE ──────── */}
        {step === 1 && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Mot de passe maître d'administration *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoFocus
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Saisissez votre mot de passe..."
                  className="w-full h-11 rounded-xl bg-slate-950 border border-slate-800 px-4 pr-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-11 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
            >
              <span>Continuer vers l'étape 2FA</span>
              <ArrowRight className="size-4" />
            </button>
          </form>
        )}

        {/* ──────── ÉTAPE 2 : CODE 2FA TOTP ──────── */}
        {step === 2 && (
          <form onSubmit={handleTotpSubmit} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-slate-300">
                  Code de sécurité à 6 chiffres *
                </label>
                <button
                  type="button"
                  onClick={() => setShowQrSetup(!showQrSetup)}
                  className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <QrCode className="size-3" />
                  <span>{showQrSetup ? "Masquer le QR code" : "Scanner QR code / Clé"}</span>
                </button>
              </div>

              <input
                type="text"
                required
                autoFocus
                maxLength={6}
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ""))}
                placeholder="123456"
                className="w-full h-12 rounded-xl bg-slate-950 border border-slate-800 px-4 text-center text-2xl font-mono tracking-widest text-emerald-400 placeholder-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
              />
              <p className="text-[11px] text-slate-400 mt-1.5 text-center">
                Ouvrez Google Authenticator, Microsoft Authenticator ou Apple Passwords.
              </p>
            </div>

            {/* Volet de configuration / Scan QR Code */}
            {showQrSetup && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center animate-in fade-in">
                <p className="text-xs font-medium text-slate-200 mb-2">
                  Scannez ce QR Code dans votre application 2FA :
                </p>
                <div className="inline-block p-2 bg-white rounded-xl mx-auto shadow-md">
                  <img
                    src={getQrCodeImageUrl()}
                    alt="QR Code 2FA"
                    className="size-36 mx-auto object-contain"
                  />
                </div>
                <div className="mt-3">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 block mb-1">
                    Ou saisissez la clé manuelle :
                  </span>
                  <div className="flex items-center justify-center gap-1.5">
                    <code className="text-xs bg-slate-900 px-2 py-1 rounded text-emerald-400 font-mono select-all">
                      {getAdminTotpSecret()}
                    </code>
                    <button
                      type="button"
                      onClick={handleCopySecret}
                      className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white"
                      title="Copier la clé secrète"
                    >
                      {copiedSecret ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setErrorMsg(null);
                }}
                className="w-1/3 h-11 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-colors cursor-pointer"
              >
                ← Retour
              </button>
              <button
                type="submit"
                disabled={verifying}
                className="w-2/3 h-11 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20 disabled:opacity-50"
              >
                {verifying ? (
                  <span>Vérification...</span>
                ) : (
                  <>
                    <KeyRound className="size-4" />
                    <span>Déverrouiller l'accès</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
          <p className="text-[10px] text-slate-500">
            Protégé par chiffrement AES &amp; TOTP RFC 6238 · Reflex' Assistance © 2026
          </p>
        </div>
      </div>
    </div>
  );
}
