import Image from 'next/image';

export function HeroVisualSystem() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[#020817]">
      {/* Clean background — no text, no logo, pure visual atmosphere */}
      <Image
        src="/assets/geyun/hero/hero-clean-bg.png"
        alt=""
        fill
        priority
        aria-hidden="true"
        className="hero-bg-kenburns object-cover object-[60%_44%] brightness-[0.82] contrast-[1.06] saturate-[1.08]"
        sizes="110vw"
      />

      {/* Left text zone: heavy dark gradient — keeps all HTML text sharp */}
      <div className="absolute inset-0 z-[5] bg-[linear-gradient(90deg,rgba(2,6,23,.99)_0%,rgba(2,8,23,.97)_20%,rgba(2,8,23,.82)_38%,rgba(2,6,23,.42)_54%,rgba(2,6,23,.10)_68%,transparent_80%)]" />

      {/* Top edge — nav clearance */}
      <div className="absolute inset-x-0 top-0 z-[6] h-40 bg-gradient-to-b from-[#020817]/72 to-transparent" />

      {/* Bottom edge — stats bar base */}
      <div className="absolute bottom-0 left-0 right-0 z-[7] h-64 bg-gradient-to-t from-[#020617] via-[#020617]/70 to-transparent" />

      {/* Ambient glow — cyan on globe zone, gold on ship zone */}
      <div className="absolute inset-0 z-[8] bg-[radial-gradient(circle_at_68%_28%,rgba(34,211,238,.10),transparent_28%),radial-gradient(circle_at_72%_62%,rgba(244,179,91,.08),transparent_22%)]" />

      {/* Grid + noise texture */}
      <div className="hero-grid absolute inset-0 z-[9] opacity-[0.05]" />
      <div className="hero-noise absolute inset-0 z-[10] opacity-[0.04]" />

      {/* Animated route lines overlay */}
      <svg
        className="absolute inset-0 z-[11] hidden h-full w-full md:block"
        viewBox="0 0 1440 900"
        aria-hidden="true"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="bgGold" x1="0" x2="1">
            <stop stopColor="#f4b35b" stopOpacity="0" />
            <stop offset="0.5" stopColor="#fcd58d" stopOpacity="0.65" />
            <stop offset="1" stopColor="#22d3ee" stopOpacity="0.12" />
          </linearGradient>
          <linearGradient id="bgCyan" x1="0" x2="1">
            <stop stopColor="#22d3ee" stopOpacity="0" />
            <stop offset="0.5" stopColor="#7dd3fc" stopOpacity="0.58" />
            <stop offset="1" stopColor="#f4b35b" stopOpacity="0.28" />
          </linearGradient>
        </defs>
        <path className="cinematic-route" d="M760 190 C 955 82, 1135 102, 1315 206" stroke="url(#bgCyan)" strokeWidth="1.8" fill="none" opacity="0.44" />
        <path className="cinematic-route cinematic-route-delay" d="M704 375 C 926 198, 1116 240, 1376 378" stroke="url(#bgGold)" strokeWidth="1.4" fill="none" opacity="0.36" />
        <path className="cinematic-route cinematic-route-delay-2" d="M820 540 C 1020 420, 1180 440, 1390 530" stroke="url(#bgCyan)" strokeWidth="1.2" fill="none" opacity="0.28" />
      </svg>
    </div>
  );
}
