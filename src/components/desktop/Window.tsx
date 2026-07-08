import { Rnd } from "react-rnd";
import { AnimatePresence, motion } from "framer-motion";
import { FaTimes, FaWindowMaximize, FaWindowMinimize } from "react-icons/fa";
import { useWindowStore, type WindowState } from "@/lib/desktop/store";
import { APP_COMPONENTS } from "@/lib/desktop/apps";
import { AppIcon } from "./AppIcon";

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
      onMouseDown={() => focus(w.id)}
      disableDragging={w.maximized}
      enableResizing={!w.maximized}
    >
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.18 }}
          className="flex h-full w-full flex-col overflow-hidden rounded-lg border border-olive-dark/70 bg-card window-shadow"
        >
          <div
            onDoubleClick={() => maximize(w.id)}
            className={`window-drag-handle flex select-none items-center gap-2 border-b border-olive-dark/60 px-3 py-1.5 text-xs ${
              isActive ? "bg-olive-dark text-paper" : "bg-olive text-paper/80"
            }`}
          >
            <span className="scale-90"><AppIcon appId={w.appId} size={18} /></span>
            <span className="truncate font-mono">{w.title}</span>
            <div className="window-no-drag ml-auto flex items-center gap-1">
              <TitleBtn onClick={() => minimize(w.id)} label="Minimize">
                <FaWindowMinimize className="text-[10px]" />
              </TitleBtn>
              <TitleBtn onClick={() => maximize(w.id)} label="Maximize">
                <FaWindowMaximize className="text-[10px]" />
              </TitleBtn>
              <TitleBtn onClick={() => close(w.id)} label="Close" danger>
                <FaTimes className="text-[10px]" />
              </TitleBtn>
            </div>
          </div>
          <div className="window-no-drag relative flex-1 overflow-hidden bg-card">
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
      className={`grid h-5 w-6 place-items-center rounded-sm border border-black/20 bg-paper/90 text-ink transition hover:bg-paper ${
        danger ? "hover:bg-destructive hover:text-white" : ""
      }`}
    >
      {children}
    </button>
  );
}
