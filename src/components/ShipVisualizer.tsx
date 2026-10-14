import React from 'react';
import { Ship } from '../types/game';

interface ShipVisualizerProps {
  ship: Ship;
  className?: string;
}

export const ShipVisualizer: React.FC<ShipVisualizerProps> = ({ ship, className = '' }) => {
  // Determine distinct blueprint geometry based on ship id
  const renderShipGraphic = () => {
    switch (ship.id) {
      case 'shuttle':
        return (
          <g>
            {/* Shuttle: Compact wedge shuttlecraft */}
            <polygon points="100,30 135,140 65,140" fill="#0284c7" stroke="#38bdf8" strokeWidth="2.5" />
            <polygon points="100,45 118,125 82,125" fill="#0369a1" stroke="#0ea5e9" strokeWidth="1.5" />
            <polygon points="100,55 110,85 90,85" fill="#facc15" opacity="0.9" /> {/* Cockpit */}
            <rect x="75" y="140" width="16" height="10" fill="#f97316" /> {/* Left thruster */}
            <rect x="109" y="140" width="16" height="10" fill="#f97316" /> {/* Right thruster */}
            <line x1="100" y1="28" x2="100" y2="15" stroke="#ef4444" strokeWidth="2" /> {/* Nose Gun */}
          </g>
        );

      case 'escape_pod':
        return (
          <g>
            {/* Small emergency capsule */}
            <circle cx="100" cy="100" r="28" fill="#e2e8f0" stroke="#f59e0b" strokeWidth="2" />
            <ellipse cx="100" cy="95" rx="14" ry="10" fill="#38bdf8" opacity="0.8" />
            <rect x="92" y="128" width="16" height="8" fill="#f97316" />
          </g>
        );

      case 'scout':
        return (
          <g>
            {/* Scout: Sleek Arrowhead with sensor wings */}
            <polygon points="100,20 125,120 145,150 115,140 100,125 85,140 55,150 75,120" fill="#0f766e" stroke="#2dd4bf" strokeWidth="2.5" />
            <polygon points="100,40 115,100 85,100" fill="#115e59" stroke="#14b8a6" strokeWidth="1.5" />
            <polygon points="100,50 108,75 92,75" fill="#38bdf8" />
            {/* Wingtip sensors */}
            <circle cx="55" cy="150" r="4" fill="#38bdf8" />
            <circle cx="145" cy="150" r="4" fill="#38bdf8" />
            {/* Twin Guns */}
            <line x1="88" y1="90" x2="88" y2="60" stroke="#ef4444" strokeWidth="2" />
            <line x1="112" y1="90" x2="112" y2="60" stroke="#ef4444" strokeWidth="2" />
            {/* Dual Engines */}
            <rect x="88" y="132" width="10" height="14" fill="#f59e0b" />
            <rect x="102" y="132" width="10" height="14" fill="#f59e0b" />
          </g>
        );

      case 'interceptor':
        return (
          <g>
            {/* Interceptor: Agile dogfighter with forward-swept canards */}
            <polygon points="100,15 116,70 155,105 130,135 115,125 100,145 85,125 70,135 45,105 84,70" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="2.5" />
            <polygon points="100,35 112,85 88,85" fill="#1e40af" />
            <polygon points="100,45 107,70 93,70" fill="#fbbf24" />
            {/* Triple Guns */}
            <line x1="100" y1="15" x2="100" y2="4" stroke="#ef4444" strokeWidth="2" />
            <line x1="68" y1="95" x2="68" y2="70" stroke="#ef4444" strokeWidth="2" />
            <line x1="132" y1="95" x2="132" y2="70" stroke="#ef4444" strokeWidth="2" />
            {/* Turret Mount */}
            <circle cx="100" cy="98" r="6" fill="#06b6d4" stroke="#ffffff" strokeWidth="1.5" />
            {/* Engines */}
            <polygon points="90,145 100,165 110,145" fill="#f97316" opacity="0.8" />
          </g>
        );

      case 'courier':
        return (
          <g>
            {/* Fast Courier: Long needle body with side engine booms */}
            <polygon points="100,15 114,80 114,145 86,145 86,80" fill="#334155" stroke="#94a3b8" strokeWidth="2" />
            <polygon points="100,30 108,65 92,65" fill="#38bdf8" />
            {/* Outrigger engine pods */}
            <rect x="52" y="80" width="16" height="55" rx="4" fill="#1e293b" stroke="#0ea5e9" strokeWidth="1.5" />
            <rect x="132" y="80" width="16" height="55" rx="4" fill="#1e293b" stroke="#0ea5e9" strokeWidth="1.5" />
            <line x1="68" y1="105" x2="86" y2="105" stroke="#64748b" strokeWidth="3" />
            <line x1="114" y1="105" x2="132" y2="105" stroke="#64748b" strokeWidth="3" />
            {/* Dual Guns */}
            <line x1="56" y1="80" x2="56" y2="55" stroke="#ef4444" strokeWidth="2" />
            <line x1="144" y1="80" x2="144" y2="55" stroke="#ef4444" strokeWidth="2" />
            {/* Thruster plumes */}
            <rect x="55" y="135" width="10" height="15" fill="#f97316" />
            <rect x="135" y="135" width="10" height="15" fill="#f97316" />
          </g>
        );

      case 'freighter':
        return (
          <g>
            {/* Standard Freighter: Boxy industrial container ship */}
            <polygon points="100,25 125,50 125,145 75,145 75,50" fill="#475569" stroke="#94a3b8" strokeWidth="2.5" />
            {/* Cargo modular bays */}
            <rect x="80" y="55" width="40" height="24" fill="#ca8a04" stroke="#eab308" strokeWidth="1" />
            <rect x="80" y="85" width="40" height="24" fill="#ca8a04" stroke="#eab308" strokeWidth="1" />
            <rect x="80" y="115" width="40" height="24" fill="#ca8a04" stroke="#eab308" strokeWidth="1" />
            <polygon points="100,28 110,45 90,45" fill="#38bdf8" />
            {/* Turret */}
            <circle cx="100" cy="100" r="7" fill="#06b6d4" stroke="#ffffff" strokeWidth="1.5" />
            {/* Heavy twin engines */}
            <rect x="78" y="145" width="18" height="12" fill="#ea580c" />
            <rect x="104" y="145" width="18" height="12" fill="#ea580c" />
          </g>
        );

      case 'starbridge':
        return (
          <g>
            {/* Starbridge: Heavy fighter-freighter with twin mandibles */}
            <polygon points="100,35 120,60 145,50 135,130 115,145 100,135 85,145 65,130 55,50 80,60" fill="#334155" stroke="#38bdf8" strokeWidth="2.5" />
            {/* Forward mandibles */}
            <polygon points="70,50 60,20 75,45" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
            <polygon points="130,50 140,20 125,45" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
            <polygon points="100,45 110,80 90,80" fill="#facc15" />
            {/* Turret Mount */}
            <circle cx="100" cy="105" r="7" fill="#06b6d4" stroke="#ffffff" strokeWidth="1.5" />
            {/* Guns */}
            <line x1="60" y1="20" x2="60" y2="5" stroke="#ef4444" strokeWidth="2" />
            <line x1="140" y1="20" x2="140" y2="5" stroke="#ef4444" strokeWidth="2" />
            <line x1="88" y1="70" x2="88" y2="40" stroke="#ef4444" strokeWidth="2" />
            <line x1="112" y1="70" x2="112" y2="40" stroke="#ef4444" strokeWidth="2" />
            {/* Engines */}
            <rect x="72" y="138" width="16" height="14" fill="#f97316" />
            <rect x="112" y="138" width="16" height="14" fill="#f97316" />
          </g>
        );

      case 'argosy':
        return (
          <g>
            {/* Argosy: Massive armored heavy freighter with side sponsons */}
            <polygon points="100,20 130,55 130,125 155,140 145,160 125,150 100,140 75,150 55,160 45,140 70,125 70,55" fill="#1e293b" stroke="#f59e0b" strokeWidth="2.5" />
            {/* Armored central spine */}
            <rect x="85" y="50" width="30" height="75" fill="#0f172a" stroke="#d97706" strokeWidth="1.5" />
            {/* Dual Turrets */}
            <circle cx="100" cy="70" r="7" fill="#06b6d4" stroke="#ffffff" strokeWidth="1.5" />
            <circle cx="100" cy="115" r="7" fill="#06b6d4" stroke="#ffffff" strokeWidth="1.5" />
            {/* Sponson cargo containers */}
            <rect x="52" y="75" width="16" height="40" rx="2" fill="#ca8a04" opacity="0.85" />
            <rect x="132" y="75" width="16" height="40" rx="2" fill="#ca8a04" opacity="0.85" />
            {/* Heavy Quad Engines */}
            <rect x="74" y="150" width="12" height="14" fill="#ea580c" />
            <rect x="90" y="142" width="20" height="15" fill="#ea580c" />
            <rect x="114" y="150" width="12" height="14" fill="#ea580c" />
          </g>
        );

      case 'gunboat':
        return (
          <g>
            {/* Gunboat: Confederation patrol combatant with armored hammerhead */}
            <polygon points="100,15 130,40 118,75 140,115 125,145 100,135 75,145 60,115 82,75 70,40" fill="#1e3a8a" stroke="#38bdf8" strokeWidth="2.5" />
            {/* Hammerhead bow bridge */}
            <rect x="80" y="32" width="40" height="16" rx="3" fill="#0284c7" stroke="#60a5fa" strokeWidth="1.5" />
            {/* Dual Turrets */}
            <circle cx="100" cy="65" r="6" fill="#06b6d4" stroke="#ffffff" strokeWidth="1.5" />
            <circle cx="100" cy="110" r="6" fill="#06b6d4" stroke="#ffffff" strokeWidth="1.5" />
            {/* 4 Gun Hardpoints */}
            <line x1="72" y1="40" x2="72" y2="15" stroke="#ef4444" strokeWidth="2" />
            <line x1="128" y1="40" x2="128" y2="15" stroke="#ef4444" strokeWidth="2" />
            <line x1="62" y1="110" x2="62" y2="85" stroke="#ef4444" strokeWidth="2" />
            <line x1="138" y1="110" x2="138" y2="85" stroke="#ef4444" strokeWidth="2" />
            {/* Triple Engines */}
            <rect x="80" y="142" width="10" height="12" fill="#f59e0b" />
            <rect x="95" y="137" width="10" height="14" fill="#f59e0b" />
            <rect x="110" y="142" width="10" height="12" fill="#f59e0b" />
          </g>
        );

      case 'corvette':
        return (
          <g>
            {/* Corvette: Long rakish frigate warship */}
            <polygon points="100,10 120,45 130,120 145,150 120,155 100,140 80,155 55,150 70,120 80,45" fill="#1e293b" stroke="#3b82f6" strokeWidth="2.5" />
            <polygon points="100,25 110,65 90,65" fill="#0f172a" />
            <polygon points="100,32 106,50 94,50" fill="#38bdf8" />
            {/* Dual Turrets */}
            <circle cx="100" cy="75" r="7" fill="#06b6d4" stroke="#ffffff" strokeWidth="1.5" />
            <circle cx="100" cy="115" r="7" fill="#06b6d4" stroke="#ffffff" strokeWidth="1.5" />
            {/* 5 Guns */}
            <line x1="100" y1="10" x2="100" y2="-2" stroke="#ef4444" strokeWidth="2" />
            <line x1="84" y1="50" x2="84" y2="25" stroke="#ef4444" strokeWidth="2" />
            <line x1="116" y1="50" x2="116" y2="25" stroke="#ef4444" strokeWidth="2" />
            <line x1="68" y1="115" x2="68" y2="85" stroke="#ef4444" strokeWidth="2" />
            <line x1="132" y1="115" x2="132" y2="85" stroke="#ef4444" strokeWidth="2" />
            {/* Engine Banks */}
            <rect x="85" y="148" width="12" height="15" fill="#f97316" />
            <rect x="103" y="148" width="12" height="15" fill="#f97316" />
          </g>
        );

      case 'marauder':
        return (
          <g>
            {/* Marauder: Asymmetric outlaw raider with red menacing markings */}
            <polygon points="100,15 125,50 150,90 145,145 115,135 100,150 85,135 55,145 50,90 75,50" fill="#3f1313" stroke="#ef4444" strokeWidth="2.5" />
            {/* Outlaw razor mandibles */}
            <line x1="50" y1="90" x2="40" y2="50" stroke="#f87171" strokeWidth="2" />
            <line x1="150" y1="90" x2="160" y2="50" stroke="#f87171" strokeWidth="2" />
            <polygon points="100,30 110,65 90,65" fill="#ef4444" />
            {/* Turret */}
            <circle cx="100" cy="95" r="6" fill="#f43f5e" stroke="#ffffff" strokeWidth="1.5" />
            {/* Aggressive Quad Guns */}
            <line x1="75" y1="50" x2="75" y2="20" stroke="#ef4444" strokeWidth="2" />
            <line x1="125" y1="50" x2="125" y2="20" stroke="#ef4444" strokeWidth="2" />
            <line x1="42" y1="55" x2="42" y2="25" stroke="#ef4444" strokeWidth="2" />
            <line x1="158" y1="55" x2="158" y2="25" stroke="#ef4444" strokeWidth="2" />
            {/* Triple Overclocked Afterburners */}
            <rect x="75" y="140" width="12" height="18" fill="#f97316" />
            <rect x="94" y="145" width="12" height="20" fill="#f97316" />
            <rect x="113" y="140" width="12" height="18" fill="#f97316" />
          </g>
        );

      case 'frigate':
        return (
          <g>
            {/* Frigate: Heavy naval fleet escort */}
            <polygon points="100,10 135,50 140,135 155,160 120,155 100,145 80,155 45,160 60,135 65,50" fill="#0f172a" stroke="#2563eb" strokeWidth="2.5" />
            <rect x="80" y="55" width="40" height="75" fill="#1e293b" stroke="#3b82f6" strokeWidth="1" />
            {/* 3 Turret Mounts */}
            <circle cx="100" cy="50" r="7" fill="#06b6d4" stroke="#ffffff" strokeWidth="1.5" />
            <circle cx="100" cy="85" r="7" fill="#06b6d4" stroke="#ffffff" strokeWidth="1.5" />
            <circle cx="100" cy="120" r="7" fill="#06b6d4" stroke="#ffffff" strokeWidth="1.5" />
            {/* Broadside Batteries */}
            <line x1="62" y1="70" x2="45" y2="70" stroke="#ef4444" strokeWidth="2" />
            <line x1="62" y1="90" x2="45" y2="90" stroke="#ef4444" strokeWidth="2" />
            <line x1="138" y1="70" x2="155" y2="70" stroke="#ef4444" strokeWidth="2" />
            <line x1="138" y1="90" x2="155" y2="90" stroke="#ef4444" strokeWidth="2" />
            {/* Heavy Engines */}
            <rect x="75" y="152" width="14" height="16" fill="#ea580c" />
            <rect x="93" y="148" width="14" height="18" fill="#ea580c" />
            <rect x="111" y="152" width="14" height="16" fill="#ea580c" />
          </g>
        );

      case 'leviathan':
        return (
          <g>
            {/* Leviathan: Massive dreadnought carrier */}
            <polygon points="100,15 150,45 160,140 145,165 100,155 55,165 40,140 50,45" fill="#1e293b" stroke="#eab308" strokeWidth="2.5" />
            {/* Central flight hangar deck */}
            <rect x="88" y="45" width="24" height="95" fill="#020617" stroke="#ca8a04" strokeWidth="1.5" />
            <polygon points="100,50 108,135 92,135" fill="#eab308" opacity="0.3" />
            {/* 4 Heavy Turrets */}
            <circle cx="68" cy="70" r="7" fill="#06b6d4" stroke="#ffffff" strokeWidth="1.5" />
            <circle cx="132" cy="70" r="7" fill="#06b6d4" stroke="#ffffff" strokeWidth="1.5" />
            <circle cx="68" cy="115" r="7" fill="#06b6d4" stroke="#ffffff" strokeWidth="1.5" />
            <circle cx="132" cy="115" r="7" fill="#06b6d4" stroke="#ffffff" strokeWidth="1.5" />
            {/* Massive Engine Thrusters */}
            <rect x="62" y="160" width="20" height="14" fill="#f97316" />
            <rect x="90" y="156" width="20" height="16" fill="#f97316" />
            <rect x="118" y="160" width="20" height="14" fill="#f97316" />
          </g>
        );

      case 'kestrel':
      default:
        return (
          <g>
            {/* Kestrel: The legendary apex warship with forward mandibles and quad wings */}
            <polygon points="100,10 120,40 160,70 170,125 145,155 125,145 100,160 75,145 55,155 30,125 40,70 80,40" fill="#042f2e" stroke="#2dd4bf" strokeWidth="2.5" />
            {/* Swept aerodynamic wings */}
            <polygon points="100,30 115,80 85,80" fill="#134e4a" stroke="#14b8a6" strokeWidth="1.5" />
            <polygon points="100,45 108,70 92,70" fill="#5eead4" />
            {/* Quad Heavy Turrets */}
            <circle cx="82" cy="70" r="6" fill="#06b6d4" stroke="#ffffff" strokeWidth="1.5" />
            <circle cx="118" cy="70" r="6" fill="#06b6d4" stroke="#ffffff" strokeWidth="1.5" />
            <circle cx="75" cy="110" r="6" fill="#06b6d4" stroke="#ffffff" strokeWidth="1.5" />
            <circle cx="125" cy="110" r="6" fill="#06b6d4" stroke="#ffffff" strokeWidth="1.5" />
            {/* 6 Forward Heavy Cannons */}
            <line x1="94" y1="20" x2="94" y2="-2" stroke="#ef4444" strokeWidth="2" />
            <line x1="106" y1="20" x2="106" y2="-2" stroke="#ef4444" strokeWidth="2" />
            <line x1="42" y1="75" x2="42" y2="45" stroke="#ef4444" strokeWidth="2" />
            <line x1="158" y1="75" x2="158" y2="45" stroke="#ef4444" strokeWidth="2" />
            <line x1="32" y1="125" x2="32" y2="95" stroke="#ef4444" strokeWidth="2" />
            <line x1="168" y1="125" x2="168" y2="95" stroke="#ef4444" strokeWidth="2" />
            {/* Apex Antimatter Thrusters */}
            <rect x="70" y="150" width="14" height="18" fill="#06b6d4" />
            <rect x="93" y="158" width="14" height="20" fill="#06b6d4" />
            <rect x="116" y="150" width="14" height="18" fill="#06b6d4" />
          </g>
        );
    }
  };

  return (
    <div className={`relative flex flex-col items-center justify-center p-3 rounded-lg border border-cyan-900/50 bg-slate-950/80 ${className}`}>
      {/* Blueprint Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#06b6d410_1px,transparent_1px),linear-gradient(to_bottom,#06b6d410_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none rounded-lg" />
      
      {/* Top Telemetry Header */}
      <div className="w-full flex items-center justify-between text-[10px] font-mono text-cyan-400 mb-1 z-10">
        <span>SCHEMATIC: {ship.modelClass}</span>
        <span className="text-amber-400 font-bold uppercase">{ship.name}</span>
      </div>

      {/* SVG Ship Canvas */}
      <div className="relative w-48 h-48 flex items-center justify-center">
        {/* Shield Matrix Envelope Glow */}
        <div className="absolute inset-4 rounded-full border border-cyan-500/25 bg-cyan-500/5 animate-pulse" />

        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_0_12px_rgba(6,182,212,0.4)]">
          {/* Alignment Crosshairs */}
          <line x1="100" y1="10" x2="100" y2="190" stroke="#0ea5e9" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.4" />
          <line x1="10" y1="100" x2="190" y2="100" stroke="#0ea5e9" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.4" />

          {/* Ship Graphic */}
          {renderShipGraphic()}
        </svg>
      </div>

      {/* Legend Badges */}
      <div className="w-full flex items-center justify-between text-[9px] font-mono text-slate-400 mt-1 pt-1.5 border-t border-slate-800/80 z-10">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-rose-500" />
          <span>{ship.gunSlots} Gun Mounts</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span>{ship.turretSlots} Turrets</span>
        </span>
        <span className="text-slate-400">
          Mass: {ship.maxMass}t
        </span>
      </div>
    </div>
  );
};
