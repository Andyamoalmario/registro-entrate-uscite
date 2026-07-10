"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(
    null
  );
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading browser-only APIs (matchMedia, userAgent, localStorage), must run client-side after mount
    setIsStandalone(standalone);
    setIsIOS(/iphone|ipad|ipod/i.test(window.navigator.userAgent));
    setDismissed(localStorage.getItem("saldo-install-dismissed") === "1");

    function handler(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    }
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  function dismiss() {
    setDismissed(true);
    localStorage.setItem("saldo-install-dismissed", "1");
  }

  async function install() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  }

  if (isStandalone || dismissed) return null;
  if (!isIOS && !deferredPrompt) return null;

  return (
    <div className="md:hidden bg-accent-soft border-b border-rule px-4 py-2.5 flex items-center gap-3">
      {isIOS ? (
        <p className="text-xs text-ink flex-1">
          Per installarla: tocca <strong>Condividi</strong> (il quadrato con la
          freccia) e poi <strong>&ldquo;Aggiungi alla schermata Home&rdquo;</strong>.
        </p>
      ) : (
        <>
          <p className="text-xs text-ink flex-1">
            Installa Saldo sulla schermata Home per aprirla come un&rsquo;app vera.
          </p>
          <button
            onClick={install}
            className="text-xs px-3 py-1.5 rounded-full bg-ink text-paper-raised font-medium shrink-0"
          >
            Installa
          </button>
        </>
      )}
      <button
        onClick={dismiss}
        aria-label="Chiudi"
        className="text-ink-soft text-xs px-1 shrink-0"
      >
        ✕
      </button>
    </div>
  );
}
