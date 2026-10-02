import { Rnd } from "react-rnd";
import { AnimatePresence, motion } from "framer-motion";
import { PiXBold, PiSquareBold, PiMinusBold } from "react-icons/pi";
import { useWindowStore, type WindowState } from "@/lib/desktop/store";
import { APP_COMPONENTS } from "@/lib/desktop/apps";
import { AppGlyph } from "./AppIcon";

export function Window({ w }: { w: WindowState }) {
  const { focus, close, minimize, maximize, updateBounds, activeId } = useWindowStore();
  const isActive = activeId === w.id;
  const Body = APP_COMPONENTS[w.appId];

  return (
    <Rnd
      size={{ width: w.width, height: w.height }}
      position={{ x: w.x, y: w.y }}
      minWidth={360}
      minHeight={260}
      bounds="parent"
      dragHandleClassName="window-drag-handle"
      cancel=".window-no-drag"
      onDragStop={(_e, d) => updateBounds(w.id, { x: d.x, y: d.y })}
      onResizeStop={(_e, _dir, ref, _delta, pos) =>
        updateBounds(w.id, {
          width: parseInt(ref.style.width, 10),
          height: parseInt(ref.style.height, 10),
          x: pos.x,
          y: pos.y,
        })
      }
      style={{ zIndex: w.zIndex, display: w.minimized ? "none" : undefined }}
      className="pointer-events-auto"
      onMouseDown={() => focus(w.id)}
      disableDragging={w.maximized}
      enableResizing={!w.maximized}
    >
      <AnimatePresence>
        <motion.div
          data-window
          initial={{ opacity: 0, scale: 0.94, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 380, damping: 32, mass: 0.8 }}
          className={`flex h-full w-full flex-col overflow-hidden rounded-lg border border-[var(--chrome-border)] shadow-[inset_0_1px_0_rgb(255_255_255/0.1)] transition-colors window-shadow ${
            isActive ? "bg-[var(--chrome)]" : "bg-[var(--chrome-raised)]"
          }`}
        >
          <div
            onDoubleClick={() => maximize(w.id)}
            className={`window-drag-handle flex select-none items-center gap-2 px-3 py-1.5 text-xs transition-colors ${
              isActive ? "text-[var(--chrome-fg)]" : "text-[var(--chrome-fg-dim)]"
            }`}
          >
            <AppGlyph
              appId={w.appId}
              size={14}
              className={isActive ? "text-[var(--chrome-active)]" : ""}
            />
            <span className="truncate font-mono">{w.title}</span>
            <div className="window-no-drag ml-auto flex items-center gap-1">
              <TitleBtn onClick={() => minimize(w.id)} label="Minimize">
                <PiMinusBold className="text-[10px]" />
              </TitleBtn>
              <TitleBtn onClick={() => maximize(w.id)} label="Maximize">
                <PiSquareBold className="text-[10px]" />
              </TitleBtn>
              <TitleBtn onClick={() => close(w.id)} label="Close" danger>
                <PiXBold className="text-[10px]" />
              </TitleBtn>
            </div>
          </div>
          <div className="window-no-drag bezel-core relative mx-[3px] mb-[3px] flex-1 overflow-hidden bg-card">
            <Body />
          </div>
        </motion.div>
      </AnimatePresence>
    </Rnd>
  );
}

function TitleBtn({
  children,
  onClick,
  label,
  danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`grid h-5 w-6 place-items-center rounded-sm border border-[var(--chrome-border)] bg-[var(--chrome-raised)] text-[var(--chrome-fg)] transition hover:brightness-125 active:translate-y-px ${
        danger ? "hover:bg-destructive hover:text-white hover:brightness-100" : ""
      }`}
    >
      {children}
    </button>
  );
}
