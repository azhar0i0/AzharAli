import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useIconStore, useSettingsStore, useWindowStore, type AppId } from "@/lib/desktop/store";
import { APP_META } from "@/lib/desktop/apps";
import { AppIcon } from "./AppIcon";

const SIZE_MAP = {
  sm: { grid: 82, cell: 86, icon: 36, font: "text-[11px]", w: "w-[74px]" },
  md: { grid: 96, cell: 100, icon: 44, font: "text-xs", w: "w-20" },
  lg: { grid: 112, cell: 118, icon: 56, font: "text-sm", w: "w-24" },
} as const;

const ORIGIN_X = 20;
const ORIGIN_Y = 20;
const DRAG_THRESHOLD = 4;

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
  const iconSize = useSettingsStore((s) => s.iconSize);
  const S = SIZE_MAP[iconSize];

  const basePos = { x: ORIGIN_X + col * S.grid, y: ORIGIN_Y + row * S.cell };
  const [pos, setPos] = useState(basePos);
  const [dragging, setDragging] = useState(false);
  const [selected, setSelected] = useState(false);
  const stateRef = useRef({
    startMX: 0,
    startMY: 0,
    startX: 0,
    startY: 0,
    moved: false,
    lastClick: 0,
    pointerId: -1,
  });

  useEffect(() => {
    setPos({ x: ORIGIN_X + col * S.grid, y: ORIGIN_Y + row * S.cell });
  }, [col, row, S.grid, S.cell]);

  const onPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0) return;
    setSelected(true);
    const st = stateRef.current;
    st.startMX = e.clientX;
    st.startMY = e.clientY;
    st.startX = pos.x;
    st.startY = pos.y;
    st.moved = false;
    st.pointerId = e.pointerId;
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const st = stateRef.current;
    if (st.pointerId !== e.pointerId) return;
    const dx = e.clientX - st.startMX;
    const dy = e.clientY - st.startMY;
    if (!st.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
    st.moved = true;
    setDragging(true);
    setPos({ x: st.startX + dx, y: st.startY + dy });
  };

  const onPointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    const st = stateRef.current;
    if (st.pointerId !== e.pointerId) return;
    (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
    st.pointerId = -1;
    if (st.moved) {
      const c = Math.max(0, Math.round((pos.x - ORIGIN_X) / S.grid));
      const r = Math.max(0, Math.round((pos.y - ORIGIN_Y) / S.cell));
      move(appId, c, r);
      setDragging(false);
      return;
    }
    // Click / double-click logic (works reliably across desktop + touch)
    const now = Date.now();
    if (now - st.lastClick < 320) {
      openApp(appId);
      st.lastClick = 0;
    } else {
      st.lastClick = now;
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openApp(appId);
    }
  };

  return (
    <motion.button
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onDoubleClick={() => openApp(appId)}
      onKeyDown={onKeyDown}
      onBlur={() => setSelected(false)}
      style={{ left: pos.x, top: pos.y, touchAction: "none" }}
      animate={{ scale: dragging ? 1.06 : 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className={`absolute flex ${S.w} cursor-pointer flex-col items-center gap-1 rounded-md p-2 text-center outline-none focus-visible:ring-2 focus-visible:ring-orange ${
        selected ? "bg-orange/20 ring-1 ring-orange/50" : "hover:bg-white/25 dark:hover:bg-white/5"
      }`}
      aria-label={`Open ${APP_META[appId].label}`}
    >
      <AppIcon appId={appId} size={S.icon} />
      <span
        className={`desktop-label max-w-full break-words rounded-sm px-1 ${S.font} leading-tight`}
      >
        {label}
      </span>
    </motion.button>
  );
}
