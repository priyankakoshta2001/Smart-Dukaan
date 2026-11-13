import { Injectable, inject, signal } from "@angular/core";
import { ToastService } from "./toast.service";

interface InstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

/**
 * Wraps the browser's native "install app" (PWA) flow so every
 * "Download App" button in the UI does something real.
 */
@Injectable({ providedIn: "root" })
export class PwaService {
  private readonly toast = inject(ToastService);

  readonly canInstall = signal(false);
  readonly installed = signal(false);
  readonly dialogOpen = signal(false);

  private deferredPrompt: InstallPromptEvent | null = null;

  constructor() {
    if (typeof window === "undefined") return;

    window.addEventListener("beforeinstallprompt", (event) => {
      event.preventDefault();
      this.deferredPrompt = event as InstallPromptEvent;
      this.canInstall.set(true);
    });

    window.addEventListener("appinstalled", () => {
      this.installed.set(true);
      this.canInstall.set(false);
      this.dialogOpen.set(false);
      this.toast.show("Smart Dukaan app installed successfully!");
    });

    if (window.matchMedia("(display-mode: standalone)").matches) {
      this.installed.set(true);
    }
  }

  openDialog(): void {
    this.dialogOpen.set(true);
  }

  closeDialog(): void {
    this.dialogOpen.set(false);
  }

  async install(): Promise<void> {
    if (this.installed()) {
      this.toast.show("Smart Dukaan is already installed on this device.", "info");
      this.dialogOpen.set(false);
      return;
    }
    if (!this.deferredPrompt) {
      this.toast.show(
        "Install option browser se aata hai — address bar ke ⋮ menu se 'Install app' try karein.",
        "info",
      );
      return;
    }
    await this.deferredPrompt.prompt();
    const choice = await this.deferredPrompt.userChoice;
    if (choice.outcome === "accepted") {
      this.dialogOpen.set(false);
      this.toast.show("Installing Smart Dukaan…");
    }
    this.deferredPrompt = null;
    this.canInstall.set(false);
  }
}
