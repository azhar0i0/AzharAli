import cutout from "@/assets/avatar-cutout.webp";

/**
 * Portrait that "pops out" of its circle: the circle sits behind, and the
 * cut-out image is clipped by a box whose bottom is rounded to the circle but
 * whose top is open, so the head rises above the rim while the shoulders
 * stay inside it.
 */
export function PopAvatar({
  size,
  alt = "",
  online = false,
}: {
  size: number;
  alt?: string;
  online?: boolean;
}) {
  const rise = Math.round(size * 0.28); // how far the head pokes above the circle
  return (
    <div className="relative shrink-0" style={{ width: size, height: size + rise }}>
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 rounded-full border border-paper-line bg-card shadow-md"
        style={{ height: size }}
      />
      <div
        className="absolute inset-x-0 bottom-0 overflow-hidden"
        style={{ height: size + rise, borderRadius: `0 0 ${size / 2}px ${size / 2}px` }}
      >
        <img
          src={cutout}
          alt={alt}
          width={size * 0.86}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 drop-shadow-[0_4px_6px_rgb(0_0_0/0.18)]"
          style={{ width: size * 0.86, maxWidth: "none" }}
        />
      </div>
      {online && (
        <span
          aria-hidden
          className="absolute h-3.5 w-3.5 rounded-full border-2 border-card bg-online"
          style={{ right: size * 0.06, bottom: size * 0.06 }}
        />
      )}
    </div>
  );
}
