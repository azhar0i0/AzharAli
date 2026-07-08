import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useIconStore, useWindowStore, type AppId } from "@/lib/desktop/store";
import { APP_META } from "@/lib/desktop/apps";
import { AppIcon } from "./AppIcon";

const GRID_W = 96;
const GRID_H = 100;
const ORIGIN_X = 20;
const ORIGIN_Y = 20;

export function DesktopIcon({
  appId,
  label,
  col,
  row,
}: {
  appId: AppId;
  label: string;
  col: number;
  row: number;
}) {
  const move = useIconStore((s) => s.move);
  const openApp = useWindowStore((s) => s.open);
  const [drag, setDrag] = useState<{ dx: number; dy: number } | null>(null);
  const [pos, setPos] = useState({ x: ORIGIN_X + col * GRID_W, y: ORIGIN_Y + row * GRID_H });
  const startRef = useRef<{ mx: number; my: number; ox: number; oy: number } | null>(null);
  const clickRef = useRef({ moved: false });

  useEffect(() => {
    setPos({ x: ORIGIN_X + col * GRID_W, y: ORIGIN_Y + row * GRID_H });
  }, [col, row]);

  useEffect(() => {
    if (!drag) return;
    const onMove = (e: PointerEvent) => {
      if (!startRef.current) return;
      const nx = e.clientX - startRef.current.mx + startRef.current.ox;
      const ny = e.clientY - startRef.current.my + startRef.current.oy;
      if (Math.abs(nx - (ORIGIN_X + col * GRID_W)) > 3 || Math.abs(ny - (ORIGIN_Y + row * GRID_H)) > 3) {
        clickRef.current.moved = true;
      }
      setPos({ x: nx, y: ny });
    };
    const onUp = () => {
      const c = Math.max(0, Math.round((pos.x - ORIGIN_X) / GRID_W));
      const r = Math.max(0, Math.round((pos.y - ORIGIN_Y) / GRID_H));
      move(appId, c, r);
      setDrag(null);
      startRef.current = null;
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [drag, pos, appId, col, row, move]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    e.preventDefault();
    clickRef.current.moved = false;
    startRef.current = { mx: e.clientX, my: e.clientY, ox: pos.x, oy: pos.y };
    setDrag({ dx: 0, dy: 0 });
  };

  const onDouble = () => openApp(appId);

  return (
    <motion.button
      onPointerDown={onPointerDown}
      onDoubleClick={onDouble}
      onClick={() => {
        // single click = focus visual only; open on double-click.
        // On touch, open if it wasn't a drag.
        if (!clickRef.current.moved && "ontouchstart" in window) openApp(appId);
      }}
      style={{ left: pos.x, top: pos.y }}
      animate={{ scale: drag ? 1.05 : 1 }}
      whileHover={{ y: -2 }}
      className="group absolute flex w-20 flex-col items-center gap-1 rounded-md p-2 text-center focus:outline-none"
      aria-label={`Open ${APP_META[appId].label}`}
    >
      <AppIcon appId={appId} size={44} />
      <span className="max-w-full truncate rounded-sm px-1 text-xs font-medium text-ink group-hover:bg-olive-dark/90 group-hover:text-paper">
        {label}
      </span>
    </motion.button>
  );
}
