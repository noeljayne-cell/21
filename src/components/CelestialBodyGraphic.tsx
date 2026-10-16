import React from 'react';
import { StellarObject } from '../types/game';

interface CelestialBodyGraphicProps {
  obj: StellarObject;
  sunAngle: number; // Angle in radians from this body towards the central sun
  isSelected: boolean;
  isLanded: boolean;
}

export const CelestialBodyGraphic: React.FC<CelestialBodyGraphicProps> = ({
  obj,
  sunAngle,
  isSelected,
  isLanded,
}) => {
  const size = obj.size || 20;
  const uid = obj.id.replace(/[^a-zA-Z0-9_-]/g, '_');

  // Sun-facing direction vector
  const hlX = Math.cos(sunAngle) * (size * 0.42);
  const hlY = Math.sin(sunAngle) * (size * 0.42);
  const shadowX = -Math.cos(sunAngle) * (size * 0.35);
  const shadowY = -Math.sin(sunAngle) * (size * 0.35);
  const sunDeg = (sunAngle * 180) / Math.PI;

  // Determine visual classification
  const visualType = (() => {
    if (obj.type === 'station') return 'station';
    if (obj.id === 'earth') return 'earth';
    if (obj.id === 'mars') return 'mars';
    if (obj.id === 'luna') return 'luna';
    if (obj.type === 'moon') return 'moon';

    const desc = (obj.description || '').toLowerCase();
    const img = obj.customImage || obj.imageType || '';

    if (obj.rings || desc.includes('ring') || img.includes('10023')) return 'ringed';
    if (desc.includes('ice') || desc.includes('glacier') || img.includes('10013')) return 'ice';
    if (desc.includes('volcan') || desc.includes('seismic') || desc.includes('quake') || img.includes('10011')) return 'volcanic';
    if (desc.includes('dry') || desc.includes('desert') || desc.includes('sand') || img.includes('10005') || img.includes('10006')) return 'desert';
    if (desc.includes('ocean') || desc.includes('water') || desc.includes('sea') || img.includes('10009')) return 'oceanic';
    if (desc.includes('forest') || desc.includes('tree') || img.includes('10031') || img.includes('10032')) return 'forest';

    return 'continental';
  })();

  // Render Space Station
  if (visualType === 'station') {
    return (
      <g className="transition-transform group-hover:scale-110">
        <defs>
          <linearGradient id={`solarGrad-${uid}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0c4a6e" />
            <stop offset="50%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#0369a1" />
          </linearGradient>
          <filter id={`stationGlow-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Docking Beacon Ring when selected */}
        {isSelected && (
          <circle
            r={size + 8}
            fill="none"
            stroke="#38bdf8"
            strokeWidth={1}
            strokeDasharray="3 3"
            opacity={0.8}
            className="animate-spin"
            style={{ animationDuration: '12s' }}
          />
        )}

        {/* Solar Panel Wing Left */}
        <g transform={`translate(${-size * 1.55}, ${-size * 0.45})`}>
          <rect
            width={size * 1.05}
            height={size * 0.9}
            rx={1.5}
            fill={`url(#solarGrad-${uid})`}
            stroke="#0ea5e9"
            strokeWidth={0.8}
          />
          {/* Solar cell division grid */}
          <line x1={size * 0.52} y1={0} x2={size * 0.52} y2={size * 0.9} stroke="#38bdf8" strokeWidth={0.6} opacity={0.6} />
          <line x1={0} y1={size * 0.3} x2={size * 1.05} y2={size * 0.3} stroke="#38bdf8" strokeWidth={0.5} opacity={0.5} />
          <line x1={0} y1={size * 0.6} x2={size * 1.05} y2={size * 0.6} stroke="#38bdf8" strokeWidth={0.5} opacity={0.5} />
          {/* Gold structural truss */}
          <line x1={size * 1.05} y1={size * 0.45} x2={size * 1.55} y2={size * 0.45} stroke="#f59e0b" strokeWidth={1.5} />
          {/* Red Port Navigation Strobe */}
          <circle cx={2} cy={2} r={1.8} fill="#f43f5e" className="animate-pulse" />
        </g>

        {/* Solar Panel Wing Right */}
        <g transform={`translate(${size * 0.5}, ${-size * 0.45})`}>
          <rect
            width={size * 1.05}
            height={size * 0.9}
            rx={1.5}
            fill={`url(#solarGrad-${uid})`}
            stroke="#0ea5e9"
            strokeWidth={0.8}
          />
          <line x1={size * 0.52} y1={0} x2={size * 0.52} y2={size * 0.9} stroke="#38bdf8" strokeWidth={0.6} opacity={0.6} />
          <line x1={0} y1={size * 0.3} x2={size * 1.05} y2={size * 0.3} stroke="#38bdf8" strokeWidth={0.5} opacity={0.5} />
          <line x1={0} y1={size * 0.6} x2={size * 1.05} y2={size * 0.6} stroke="#38bdf8" strokeWidth={0.5} opacity={0.5} />
          <line x1={0} y1={size * 0.45} x2={-size * 0.5} y2={size * 0.45} stroke="#f59e0b" strokeWidth={1.5} />
          {/* Green Starboard Navigation Strobe */}
          <circle cx={size * 1.05 - 2} cy={2} r={1.8} fill="#10b981" className="animate-pulse" />
        </g>

        {/* Rotating Toroidal Habitat Ring */}
        <ellipse
          rx={size * 0.9}
          ry={size * 0.38}
          fill="none"
          stroke="#475569"
          strokeWidth={size * 0.3}
          strokeLinecap="round"
        />
        <ellipse
          rx={size * 0.9}
          ry={size * 0.38}
          fill="none"
          stroke="#0f172a"
          strokeWidth={size * 0.14}
        />
        {/* Habitat Viewport Windows */}
        <circle cx={-size * 0.72} cy={0} r={1.3} fill="#38bdf8" />
        <circle cx={-size * 0.38} cy={size * 0.28} r={1.3} fill="#38bdf8" />
        <circle cx={size * 0.38} cy={size * 0.28} r={1.3} fill="#38bdf8" />
        <circle cx={size * 0.72} cy={0} r={1.3} fill="#38bdf8" />

        {/* Central Spindle Hub */}
        <rect
          x={-size * 0.22}
          y={-size * 0.88}
          width={size * 0.44}
          height={size * 1.76}
          rx={size * 0.12}
          fill="#334155"
          stroke="#94a3b8"
          strokeWidth={1}
        />

        {/* Central Command Sphere & Docking Core */}
        <circle
          r={size * 0.38}
          fill="#1e293b"
          stroke="#38bdf8"
          strokeWidth={1.2}
          filter={`url(#stationGlow-${uid})`}
        />
        {/* Docking Bay Air-lock Port (Warm amber light) */}
        <circle r={size * 0.18} fill="#f59e0b" opacity={0.9} />
        <circle r={size * 0.08} fill="#ffffff" />

        {/* Top Antenna Mast & Blinking Cyan Avionics Strobe */}
        <line x1={0} y1={-size * 0.88} x2={0} y2={-size * 1.35} stroke="#cbd5e1" strokeWidth={1.2} />
        <circle cx={0} cy={-size * 1.35} r={2.2} fill="#38bdf8" className="animate-ping" />
        <circle cx={0} cy={-size * 1.35} r={1.8} fill="#ffffff" />
      </g>
    );
  }

  // Render Planets & Moons with 3D Spherical Shading & Detailed Surface Features
  return (
    <g className="transition-transform group-hover:scale-110">
      <defs>
        {/* Spherical Clip Path to keep landmasses and textures on planet disk */}
        <clipPath id={`planetClip-${uid}`}>
          <circle cx={0} cy={0} r={size} />
        </clipPath>

        {/* Atmospheric Glow Filter */}
        <filter id={`atmoFilter-${uid}`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation={size * 0.14} result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        {/* 3D Sunlit Hemisphere Spherical Lighting Radial Gradient */}
        <radialGradient
          id={`sunShade-${uid}`}
          cx={`${50 + (hlX / size) * 45}%`}
          cy={`${50 + (hlY / size) * 45}%`}
          r="80%"
        >
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
          <stop offset="25%" stopColor="#ffffff" stopOpacity="0.1" />
          <stop offset="55%" stopColor="#000000" stopOpacity="0.0" />
          <stop offset="85%" stopColor="#020617" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#010206" stopOpacity="0.94" />
        </radialGradient>

        {/* Earth Ocean Base Gradient */}
        <linearGradient id={`earthOcean-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="50%" stopColor="#1d4ed8" />
          <stop offset="100%" stopColor="#172554" />
        </linearGradient>

        {/* Mars Iron Oxide Crust Gradient */}
        <radialGradient id={`marsCrust-${uid}`} cx="40%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#ea580c" />
          <stop offset="45%" stopColor="#c2410c" />
          <stop offset="85%" stopColor="#9a3412" />
          <stop offset="100%" stopColor="#7c2d12" />
        </radialGradient>

        {/* Luna Moon Regolith Gradient */}
        <radialGradient id={`lunaRegolith-${uid}`} cx="40%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="50%" stopColor="#64748b" />
          <stop offset="85%" stopColor="#475569" />
          <stop offset="100%" stopColor="#334155" />
        </radialGradient>

        {/* Desert Ochre Gradient */}
        <radialGradient id={`desertGrad-${uid}`} cx="40%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="45%" stopColor="#d97706" />
          <stop offset="85%" stopColor="#b45309" />
          <stop offset="100%" stopColor="#78350f" />
        </radialGradient>

        {/* Oceanic Deep Cyan Gradient */}
        <radialGradient id={`oceanicGrad-${uid}`} cx="40%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#0c4a6e" />
        </radialGradient>

        {/* Volcanic Magma Crust Gradient */}
        <radialGradient id={`volcanicGrad-${uid}`} cx="40%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="60%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </radialGradient>

        {/* Glacial Ice Gradient */}
        <radialGradient id={`iceGrad-${uid}`} cx="35%" cy="35%" r="75%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#e2e8f0" />
          <stop offset="75%" stopColor="#7dd3fc" />
          <stop offset="100%" stopColor="#0284c7" />
        </radialGradient>
      </defs>

      {/* ========================================================
          1. ATMOSPHERIC SCATTERING RIM (Glowing halo outside disk)
          ======================================================== */}
      {visualType !== 'luna' && visualType !== 'moon' && (
        <circle
          r={size * 1.15}
          fill="none"
          stroke={
            visualType === 'mars'
              ? '#f97316'
              : visualType === 'desert'
              ? '#fbbf24'
              : visualType === 'volcanic'
              ? '#ea580c'
              : visualType === 'ice'
              ? '#38bdf8'
              : obj.atmosphereColor || '#38bdf8'
          }
          strokeWidth={size * 0.18}
          opacity={visualType === 'mars' ? 0.35 : 0.55}
          filter={`url(#atmoFilter-${uid})`}
        />
      )}

      {/* ========================================================
          2. BASE PLANET GLOBE & SURFACE FEATURES (CLIPPED)
          ======================================================== */}
      <g clipPath={`url(#planetClip-${uid})`}>
        
        {/* --- EARTH SPECIFIC TEXTURE --- */}
        {visualType === 'earth' && (
          <g>
            {/* Deep Royal Ocean */}
            <circle cx={0} cy={0} r={size} fill={`url(#earthOcean-${uid})`} />

            {/* Earth Continents (North America, South America, Eurasia, Africa) */}
            {/* Eurasia / Africa */}
            <path
              d={`M ${size * 0.1} ${-size * 0.7} Q ${size * 0.6} ${-size * 0.4}, ${size * 0.75} ${-size * 0.1} Q ${size * 0.8} ${size * 0.4}, ${size * 0.45} ${size * 0.65} Q ${size * 0.15} ${size * 0.55}, ${size * 0.05} ${size * 0.2} Q ${-size * 0.1} ${-size * 0.2}, ${size * 0.1} ${-size * 0.7} Z`}
              fill="#15803d"
            />
            {/* Sahara Desert Ochre Patch in Africa */}
            <path
              d={`M ${size * 0.15} ${-size * 0.05} Q ${size * 0.5} ${-size * 0.15}, ${size * 0.6} ${size * 0.15} Q ${size * 0.35} ${size * 0.25}, ${size * 0.15} ${-size * 0.05} Z`}
              fill="#b45309"
              opacity={0.85}
            />
            {/* Americas */}
            <path
              d={`M ${-size * 0.8} ${-size * 0.55} Q ${-size * 0.45} ${-size * 0.4}, ${-size * 0.4} ${-size * 0.15} Q ${-size * 0.6} ${size * 0.1}, ${-size * 0.35} ${size * 0.55} Q ${-size * 0.65} ${size * 0.75}, ${-size * 0.75} ${size * 0.4} Q ${-size * 0.85} ${-size * 0.1}, ${-size * 0.8} ${-size * 0.55} Z`}
              fill="#166534"
            />
            {/* Cordillera Mountain Ridge */}
            <path
              d={`M ${-size * 0.7} ${-size * 0.5} Q ${-size * 0.55} ${-size * 0.2}, ${-size * 0.45} ${size * 0.4}`}
              fill="none"
              stroke="#78350f"
              strokeWidth={1.5}
            />
            {/* Polar Ice Caps */}
            <ellipse cx={0} cy={-size * 0.9} rx={size * 0.6} ry={size * 0.22} fill="#f8fafc" opacity={0.95} />
            <ellipse cx={0} cy={size * 0.9} rx={size * 0.55} ry={size * 0.2} fill="#f8fafc" opacity={0.95} />

            {/* Dynamic Swirling Clouds */}
            <path
              d={`M ${-size * 0.85} ${-size * 0.15} Q ${-size * 0.4} ${-size * 0.35}, ${size * 0.2} ${-size * 0.1} Q ${size * 0.7} ${-size * 0.3}, ${size * 0.9} ${-size * 0.05}`}
              fill="none"
              stroke="#ffffff"
              strokeWidth={size * 0.18}
              strokeLinecap="round"
              opacity={0.8}
            />
            <path
              d={`M ${-size * 0.65} ${size * 0.3} Q ${-size * 0.15} ${size * 0.45}, ${size * 0.4} ${size * 0.25} Q ${size * 0.75} ${size * 0.45}, ${size * 0.85} ${size * 0.2}`}
              fill="none"
              stroke="#ffffff"
              strokeWidth={size * 0.14}
              strokeLinecap="round"
              opacity={0.7}
            />
            {/* Weather Front Spiral Vortex */}
            <circle cx={size * 0.3} cy={-size * 0.35} r={size * 0.18} fill="none" stroke="#ffffff" strokeWidth={1.5} opacity={0.75} strokeDasharray="3 2" />

            {/* Night-Side City Lights (Megalopolis golden specks on the dark side) */}
            <g transform={`translate(${shadowX * 0.7}, ${shadowY * 0.7})`} opacity={0.85}>
              <circle cx={-size * 0.35} cy={-size * 0.15} r={1.0} fill="#fde047" />
              <circle cx={-size * 0.25} cy={-size * 0.08} r={1.2} fill="#fbbf24" />
              <circle cx={-size * 0.42} cy={size * 0.05} r={0.9} fill="#fde047" />
              <circle cx={size * 0.1} cy={size * 0.3} r={1.1} fill="#fbbf24" />
              <circle cx={size * 0.22} cy={size * 0.2} r={0.9} fill="#fde047" />
            </g>
          </g>
        )}

        {/* --- MARS RED PLANET SPECIFIC TEXTURE --- */}
        {visualType === 'mars' && (
          <g>
            {/* Rust Red Iron Oxide Crust */}
            <circle cx={0} cy={0} r={size} fill={`url(#marsCrust-${uid})`} />

            {/* Dark Volcanic Maria Plains (Syrtis Major & Acidalia Planitia) */}
            <path
              d={`M ${-size * 0.65} ${-size * 0.2} Q ${-size * 0.3} ${-size * 0.4}, ${size * 0.1} ${-size * 0.15} Q ${size * 0.55} ${-size * 0.35}, ${size * 0.75} ${0} Q ${size * 0.4} ${size * 0.35}, ${-size * 0.1} ${size * 0.2} Q ${-size * 0.5} ${size * 0.35}, ${-size * 0.65} ${-size * 0.2} Z`}
              fill="#431407"
              opacity={0.8}
            />
            <path
              d={`M ${-size * 0.4} ${size * 0.15} Q ${0} ${size * 0.5}, ${size * 0.45} ${size * 0.3} Q ${size * 0.1} ${size * 0.1}, ${-size * 0.4} ${size * 0.15} Z`}
              fill="#5f1a07"
              opacity={0.85}
            />

            {/* Valles Marineris Canyon Rift */}
            <path
              d={`M ${-size * 0.5} ${size * 0.05} Q ${-size * 0.1} ${size * 0.12}, ${size * 0.35} ${size * 0.02}`}
              fill="none"
              stroke="#260904"
              strokeWidth={1.8}
              strokeLinecap="round"
            />

            {/* Olympus Mons Caldera Ring */}
            <circle cx={-size * 0.4} cy={-size * 0.25} r={size * 0.14} fill="#9a3412" stroke="#431407" strokeWidth={1} />
            <circle cx={-size * 0.4} cy={-size * 0.25} r={size * 0.05} fill="#260904" />

            {/* Brilliant White Northern Polar Ice Cap */}
            <ellipse cx={0} cy={-size * 0.9} rx={size * 0.48} ry={size * 0.2} fill="#f8fafc" opacity={0.96} />
            {/* Southern Polar Frost */}
            <ellipse cx={0} cy={size * 0.9} rx={size * 0.35} ry={size * 0.15} fill="#fed7aa" opacity={0.85} />

            {/* Faint Night-side Martian Dome Colony Lights */}
            <g transform={`translate(${shadowX * 0.65}, ${shadowY * 0.65})`} opacity={0.8}>
              <circle cx={size * 0.15} cy={-size * 0.05} r={1.1} fill="#38bdf8" />
              <circle cx={size * 0.28} cy={size * 0.05} r={0.9} fill="#fde047" />
              <circle cx={-size * 0.1} cy={size * 0.25} r={1.0} fill="#38bdf8" />
            </g>
          </g>
        )}

        {/* --- LUNA & AIRLESS MOONS SPECIFIC TEXTURE --- */}
        {(visualType === 'luna' || visualType === 'moon') && (
          <g>
            {/* Grey Ash & Regolith Base */}
            <circle cx={0} cy={0} r={size} fill={`url(#lunaRegolith-${uid})`} />

            {/* Basaltic Lunar Maria Basins */}
            <circle cx={-size * 0.35} cy={-size * 0.25} r={size * 0.35} fill="#1e293b" opacity={0.65} />
            <circle cx={size * 0.25} cy={-size * 0.15} r={size * 0.4} fill="#1e293b" opacity={0.7} />
            <circle cx={-size * 0.15} cy={size * 0.35} r={size * 0.3} fill="#1e293b" opacity={0.6} />

            {/* Distinct Impact Craters with Bright Reflective Rims */}
            <circle cx={size * 0.3} cy={size * 0.35} r={size * 0.16} fill="#334155" stroke="#cbd5e1" strokeWidth={1.2} />
            <circle cx={size * 0.3} cy={size * 0.35} r={1.2} fill="#ffffff" />

            <circle cx={-size * 0.45} cy={size * 0.1} r={size * 0.12} fill="#334155" stroke="#94a3b8" strokeWidth={1} />
            <circle cx={size * 0.05} cy={-size * 0.45} r={size * 0.1} fill="#334155" stroke="#94a3b8" strokeWidth={0.8} />

            {/* Ejecta Ray Splashes */}
            <line x1={size * 0.3} y1={size * 0.35} x2={size * 0.65} y2={size * 0.55} stroke="#cbd5e1" strokeWidth={0.7} opacity={0.7} strokeDasharray="2 1" />
            <line x1={size * 0.3} y1={size * 0.35} x2={size * 0.1} y2={size * 0.65} stroke="#cbd5e1" strokeWidth={0.7} opacity={0.7} strokeDasharray="2 1" />

            {/* Luna Naval Yard Surface Beacon */}
            {obj.id === 'luna' && (
              <circle cx={-size * 0.2} cy={-size * 0.1} r={1.5} fill="#38bdf8" className="animate-pulse" />
            )}
          </g>
        )}

        {/* --- DESERT / ARID WORLDS --- */}
        {visualType === 'desert' && (
          <g>
            <circle cx={0} cy={0} r={size} fill={`url(#desertGrad-${uid})`} />
            {/* Dune Ridges & Canyon Craters */}
            <path
              d={`M ${-size * 0.8} ${-size * 0.3} Q ${-size * 0.2} ${-size * 0.45}, ${size * 0.5} ${-size * 0.2} Q ${size * 0.8} ${size * 0.1}, ${size * 0.5} ${size * 0.4} Q ${-size * 0.3} ${size * 0.2}, ${-size * 0.8} ${-size * 0.3} Z`}
              fill="#78350f"
              opacity={0.65}
            />
            <path
              d={`M ${-size * 0.7} ${size * 0.1} Q ${0} ${size * 0.25}, ${size * 0.7} ${size * 0.05}`}
              fill="none"
              stroke="#92400e"
              strokeWidth={2}
            />
            {/* Atmospheric Dust Bands */}
            <path
              d={`M ${-size * 0.85} ${-size * 0.1} Q ${0} ${-size * 0.25}, ${size * 0.85} ${-size * 0.15}`}
              fill="none"
              stroke="#fde68a"
              strokeWidth={size * 0.12}
              opacity={0.5}
            />
          </g>
        )}

        {/* --- OCEANIC WORLDS --- */}
        {visualType === 'oceanic' && (
          <g>
            <circle cx={0} cy={0} r={size} fill={`url(#oceanicGrad-${uid})`} />
            {/* Archipelago Islands */}
            <circle cx={-size * 0.3} cy={-size * 0.2} r={size * 0.22} fill="#059669" />
            <circle cx={size * 0.35} cy={size * 0.25} r={size * 0.28} fill="#10b981" />
            <circle cx={size * 0.1} cy={-size * 0.4} r={size * 0.15} fill="#047857" />
            {/* Cloud Vortexes */}
            <path
              d={`M ${-size * 0.7} ${size * 0.1} Q ${-size * 0.2} ${-size * 0.15}, ${size * 0.5} ${size * 0.2} Q ${size * 0.8} ${-size * 0.05}, ${size * 0.9} ${size * 0.1}`}
              fill="none"
              stroke="#ffffff"
              strokeWidth={size * 0.16}
              opacity={0.8}
            />
          </g>
        )}

        {/* --- VOLCANIC WORLDS --- */}
        {visualType === 'volcanic' && (
          <g>
            <circle cx={0} cy={0} r={size} fill={`url(#volcanicGrad-${uid})`} />
            {/* Glowing Magma Fissures & Lava Veins */}
            <path
              d={`M ${-size * 0.7} ${-size * 0.4} Q ${-size * 0.2} ${-size * 0.1}, ${size * 0.1} ${-size * 0.3} Q ${size * 0.4} ${size * 0.1}, ${size * 0.7} ${size * 0.4}`}
              fill="none"
              stroke="#ea580c"
              strokeWidth={2.4}
              strokeLinecap="round"
            />
            <path
              d={`M ${-size * 0.7} ${-size * 0.4} Q ${-size * 0.2} ${-size * 0.1}, ${size * 0.1} ${-size * 0.3} Q ${size * 0.4} ${size * 0.1}, ${size * 0.7} ${size * 0.4}`}
              fill="none"
              stroke="#fbbf24"
              strokeWidth={1.2}
              strokeLinecap="round"
            />
            <path
              d={`M ${-size * 0.1} ${-size * 0.1} Q ${-size * 0.4} ${size * 0.3}, ${size * 0.2} ${size * 0.5}`}
              fill="none"
              stroke="#f97316"
              strokeWidth={1.8}
            />
            {/* Caldera Magma Lake */}
            <circle cx={-size * 0.2} cy={-size * 0.1} r={size * 0.16} fill="#dc2626" />
            <circle cx={-size * 0.2} cy={-size * 0.1} r={size * 0.08} fill="#fef08a" />
          </g>
        )}

        {/* --- GLACIAL / ICE WORLDS --- */}
        {visualType === 'ice' && (
          <g>
            <circle cx={0} cy={0} r={size} fill={`url(#iceGrad-${uid})`} />
            {/* Deep Blue Ice Crevasses */}
            <path
              d={`M ${-size * 0.65} ${-size * 0.3} L ${-size * 0.2} ${-size * 0.1} L ${size * 0.1} ${-size * 0.4} L ${size * 0.55} ${-size * 0.2} L ${size * 0.7} ${size * 0.2}`}
              fill="none"
              stroke="#0284c7"
              strokeWidth={1.5}
            />
            <path
              d={`M ${-size * 0.4} ${size * 0.2} L ${size * 0.1} ${size * 0.35} L ${size * 0.45} ${size * 0.1}`}
              fill="none"
              stroke="#0369a1"
              strokeWidth={1.2}
            />
          </g>
        )}

        {/* --- CONTINENTAL / FOREST WORLDS --- */}
        {(visualType === 'continental' || visualType === 'forest' || visualType === 'ringed') && (
          <g>
            <circle cx={0} cy={0} r={size} fill={obj.color || '#2563eb'} />
            {/* Continental Landmasses */}
            <circle cx={-size * 0.3} cy={-size * 0.2} r={size * 0.4} fill="#059669" opacity={0.9} />
            <circle cx={size * 0.3} cy={size * 0.2} r={size * 0.45} fill="#047857" opacity={0.85} />
            <path
              d={`M ${-size * 0.8} ${0} Q ${0} ${-size * 0.3}, ${size * 0.8} ${0}`}
              fill="none"
              stroke="#ffffff"
              strokeWidth={size * 0.15}
              opacity={0.7}
            />
          </g>
        )}

        {/* ========================================================
            3. REAL-TIME 3D SUNLIT SPHERICAL SHADING & TERMINATOR
            ======================================================== */}
        <circle cx={0} cy={0} r={size} fill={`url(#sunShade-${uid})`} />

        {/* Specular Light Catch on Sun-Facing Rim */}
        <circle
          cx={hlX * 0.8}
          cy={hlY * 0.8}
          r={size * 0.35}
          fill="#ffffff"
          opacity={visualType === 'oceanic' || visualType === 'earth' ? 0.35 : 0.18}
          filter={`url(#atmoFilter-${uid})`}
        />
      </g>

      {/* ========================================================
          4. PLANETARY RINGS (if applicable, e.g. Northstar / ringed)
          ======================================================== */}
      {(obj.rings || visualType === 'ringed') && (
        <g transform={`rotate(-24)`}>
          {/* Ring Back (under planet) is handled by clip, here is front ring */}
          <ellipse
            rx={size * 2.2}
            ry={size * 0.65}
            fill="none"
            stroke="#cbd5e1"
            strokeWidth={size * 0.35}
            opacity={0.65}
          />
          <ellipse
            rx={size * 2.2}
            ry={size * 0.65}
            fill="none"
            stroke="#38bdf8"
            strokeWidth={size * 0.1}
            opacity={0.8}
          />
          {/* Cassini Division Gap */}
          <ellipse
            rx={size * 2.15}
            ry={size * 0.63}
            fill="none"
            stroke="#020617"
            strokeWidth={1.2}
            opacity={0.9}
          />
        </g>
      )}

      {/* Target Reticle if Selected */}
      {isSelected && (
        <g className="animate-spin" style={{ animationDuration: '9s' }}>
          <circle
            r={size + 12}
            fill="none"
            stroke="#38bdf8"
            strokeWidth={1.5}
            strokeDasharray="4 4"
          />
          <line x1={-(size + 16)} y1={0} x2={-(size + 8)} y2={0} stroke="#38bdf8" strokeWidth={2} />
          <line x1={size + 8} y1={0} x2={size + 16} y2={0} stroke="#38bdf8" strokeWidth={2} />
          <line x1={0} y1={-(size + 16)} x2={0} y2={-(size + 8)} stroke="#38bdf8" strokeWidth={2} />
          <line x1={0} y1={size + 8} x2={0} y2={size + 16} stroke="#38bdf8" strokeWidth={2} />
        </g>
      )}

      {/* Landed Indicator Badge */}
      {isLanded && (
        <g transform={`translate(0, ${-(size + 16)})`}>
          <circle r={7} fill="#10b981" />
          <polygon points="-3,-1 0,3 3,-1" fill="#ffffff" />
        </g>
      )}

      {/* Name and Type Label */}
      <text
        y={size + 16}
        textAnchor="middle"
        className={`text-[11px] font-display font-semibold tracking-wider uppercase pointer-events-none select-none ${
          isSelected ? 'fill-cyan-300 drop-shadow-[0_0_6px_rgba(6,182,212,0.8)]' : 'fill-slate-200'
        }`}
      >
        {obj.name}
      </text>

      <text
        y={size + 27}
        textAnchor="middle"
        className="text-[9px] font-mono fill-slate-400 capitalize pointer-events-none select-none"
      >
        {obj.type}
      </text>
    </g>
  );
};
