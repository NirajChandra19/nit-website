/**
 * DiwaliBanner — Slim festive banner that sits above the Navbar.
 * Pure Server Component: no hooks, no browser APIs needed.
 * The shimmer sweep is driven entirely by a CSS @keyframes animation.
 */
export default function DiwaliBanner() {
  return (
    <div className="relative z-[60] w-full overflow-hidden">
      {/* Warm festive gradient base */}
      <div className="relative bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 py-2 px-4 text-center overflow-hidden">
        {/* Shimmer overlay — pure CSS transform, zero JS, GPU-accelerated */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -translate-x-full animate-[shimmer_2.8s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"
        />
        <p className="relative text-sm font-medium text-white drop-shadow-sm tracking-wide">
          ✨ Wishing the NIT community a very Happy and Prosperous Diwali! 🪔
        </p>
      </div>
    </div>
  );
}
