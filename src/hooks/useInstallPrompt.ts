import { useEffect, useState } from "react";

// The beforeinstallprompt event isn't in the standard TS lib types yet
interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

// Detect standalone (already-installed) once.
const detectInstalled = () =>
    window.matchMedia("(display-mode: standalone)").matches
    || (window.navigator as unknown as { standalone?: boolean }).standalone === true;

// Detect iOS
const detectIOS = () => {
    const ua = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(ua)
        // iPadOS 13+ reports as Mac, so also check for touch support
        || (ua.includes("mac") && "ontouchend" in document);
};

const useInstallPrompt = () => {
    // Saved browser event (Android/Chrome). Null until the browser fires it.
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    // Lazy initializers: computed once on first render, not on every render
    const [isInstalled, setIsInstalled] = useState(detectInstalled);
    const isIOS = detectIOS();

    useEffect(() => {
        // Listen for the Android/Chrome install event. We preventDefault to
        // stop the browser's own mini-banner and save the event so we can
        // trigger it later from our own button.
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
        };
        window.addEventListener("beforeinstallprompt", handler);

        // If the user installs, clear the prompt and mark as installed.
        const installedHandler = () => {
            setIsInstalled(true);
            setDeferredPrompt(null);
        };
        window.addEventListener("appinstalled", installedHandler);

        return () => {
            window.removeEventListener("beforeinstallprompt", handler);
            window.removeEventListener("appinstalled", installedHandler);
        };
    }, []);

    // Called when the user taps our install button (Android/Chrome).
    const promptInstall = async () => {
        if (!deferredPrompt) return;
        await deferredPrompt.prompt();
        await deferredPrompt.userChoice;
        // The event can only be used once. clear it after.
        setDeferredPrompt(null);
    };

    return {
        isInstalled,
        isIOS,
        // Android install button shows only when we have a saved prompt.
        canInstall: deferredPrompt !== null,
        promptInstall,
    };
};

export default useInstallPrompt;