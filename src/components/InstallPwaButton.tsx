"use client";

import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import InstallMobileRoundedIcon from "@mui/icons-material/InstallMobileRounded";

// O evento beforeinstallprompt só existe em navegadores baseados em Chromium
// (Chrome/Edge no Android e desktop). O TypeScript não conhece esse tipo por
// padrão, então declaramos o mínimo necessário aqui.
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export default function InstallPwaButton() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    function handler(e: Event) {
      e.preventDefault();
      setInstallEvent(e as BeforeInstallPromptEvent);
    }
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!installEvent) return null;

  async function handleInstall() {
    if (!installEvent) return;
    await installEvent.prompt();
    await installEvent.userChoice;
    setInstallEvent(null);
  }

  return (
    <Button
      size="small"
      variant="outlined"
      startIcon={<InstallMobileRoundedIcon />}
      onClick={handleInstall}
      sx={{ display: { xs: "none", sm: "inline-flex" } }}
    >
      Instalar app
    </Button>
  );
}
