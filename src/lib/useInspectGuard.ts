import { useEffect } from "react";

/**
 * Best-effort deterrent against casual "inspect element" access: blocks the
 * browser's right-click menu and the common DevTools / view-source keyboard
 * shortcuts across the whole app.
 *
 * NOTE: this cannot truly prevent DevTools. A determined user can open DevTools
 * before the page loads, disable JavaScript, or use the browser's own menu.
 * It only stops the casual right-click → Inspect / F12 path.
 */
export function useInspectGuard() {
  useEffect(() => {
    const onContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      // F12 — open DevTools
      if (e.key === "F12") {
        e.preventDefault();
        return;
      }

      // Ctrl/Cmd + Shift + I/J/C/K — DevTools panels (inspector, console, picker)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && ["i", "j", "c", "k"].includes(key)) {
        e.preventDefault();
        return;
      }

      // Ctrl/Cmd + U — view source
      if ((e.ctrlKey || e.metaKey) && key === "u") {
        e.preventDefault();
        return;
      }

      // macOS: Cmd + Option + I/J/C/U — DevTools / view source
      if (e.metaKey && e.altKey && ["i", "j", "c", "u"].includes(key)) {
        e.preventDefault();
        return;
      }
    };

    // Capture phase so we intercept before other handlers.
    window.addEventListener("contextmenu", onContextMenu, { capture: true });
    window.addEventListener("keydown", onKeyDown, { capture: true });

    return () => {
      window.removeEventListener("contextmenu", onContextMenu, { capture: true });
      window.removeEventListener("keydown", onKeyDown, { capture: true });
    };
  }, []);
}
