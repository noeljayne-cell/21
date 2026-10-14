import React, { useState } from 'react';
import { Ship } from '../types/game';
import { Shield, Crosshair, Zap, Compass, RotateCcw, Eye, Sparkles } from 'lucide-react';

interface ShipVisualBlueprintProps {
  ship: Ship;
  className?: string;
}

export const ShipVisualBlueprint: React.FC<ShipVisualBlueprintProps> = ({ ship, className = '' }) => {
  const [viewMode, setViewMode] = useState<'schematic' | 'tactical'>('tactical');
  const [rotation, setRotation] = useState<number>(0);

  // SVG Hull rendering by ship ID
  const renderShipHull = () => {
    const isWireframe = viewMode === 'schematic';
    const strokeColor = isWireframe ? '#22d3ee' : '#38bdf8';
    const fillColor = isWireframe ? 'rgba(6, 182, 212, 0.08)' : 'rgba(15, 23, 42, 0.9)';
    const accentColor = isWireframe ? '#06b6d4' : '#f59e0b';

    switch (ship.id) {
      case 'shuttle':
        return (
          <g transform="translate(150, 150)">
            {/* Engine glow */}
            <ellipse cx="0" cy="52" rx="14" ry="6" fill="#f59e0b" opacity="0.6" filter="blur(2px)" />
            {/* Hull */}
            <path
              d="M 0 -55 L 28 35 L 18 48 L -18 48 L -28 35 Z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth="2.5"
            />
            {/* Wing fins */}
            <path d="M 28 35 L 42 45 L 20 48" fill="none" stroke={strokeColor} strokeWidth="2" />
            <path d="M -28 35 L -42 45 L -20 48" fill="none" stroke={strokeColor} strokeWidth="2" />
            {/* Cockpit Canopy */}
            <ellipse cx="0" cy="-25" rx="7" ry="12" fill={isWireframe ? 'none' : '#38bdf8'} stroke="#0284c7" strokeWidth="1.5" />
            {/* Centerline Gun Mount */}
            <line x1="0" y1="-55" x2="0" y2="-68" stroke="#ef4444" strokeWidth="2.5" />
            <circle cx="0" cy="-68" r="2.5" fill="#ef4444" />
            {/* Thruster exhaust */}
            <rect x="-12" y="48" width="24" height="6" fill="#334155" stroke={strokeColor} strokeWidth="1.5" />
          </g>
        );

      case 'scout':
        return (
          <g transform="translate(150, 150)">
            {/* Twin Nacelles */}
            <ellipse cx="-26" cy="38" rx="8" ry="4" fill="#38bdf8" opacity="0.8" filter="blur(2px)" />
            <ellipse cx="26" cy="38" rx="8" ry="4" fill="#38bdf8" opacity="0.8" filter="blur(2px)" />
            {/* Left Nacelle */}
            <rect x="-32" y="-20" width="12" height="55" rx="4" fill={fillColor} stroke={strokeColor} strokeWidth="2" />
            {/* Right Nacelle */}
            <rect x="20" y="-20" width="12" height="55" rx="4" fill={fillColor} stroke={strokeColor} strokeWidth="2" />
            {/* Wings / Struts */}
            <path d="M -20 10 L -6 5 L 6 5 L 20 10" fill="none" stroke={strokeColor} strokeWidth="2.5" />
            <path d="M -20 -5 L -8 -15 L 8 -15 L 20 -5" fill="none" stroke={strokeColor} strokeWidth="2" />
            {/* Center Fuselage */}
            <path d="M 0 -60 L 14 -10 L 10 32 L -10 32 L -14 -10 Z" fill={fillColor} stroke={strokeColor} strokeWidth="2" />
            {/* Canopy */}
            <ellipse cx="0" cy="-30" rx="5" ry="10" fill={isWireframe ? 'none' : '#0284c7'} stroke="#38bdf8" strokeWidth="1.5" />
            {/* Twin forward lasers on nacelle tips */}
            <line x1="-26" y1="-20" x2="-26" y2="-38" stroke="#ef4444" strokeWidth="2" />
            <line x1="26" y1="-20" x2="26" y2="-38" stroke="#ef4444" strokeWidth="2" />
            <circle cx="-26" cy="-38" r="2" fill="#ef4444" />
            <circle cx="26" cy="-38" r="2" fill="#ef4444" />
          </g>
        );

      case 'interceptor':
        return (
          <g transform="translate(150, 150)">
            {/* Engine plume */}
            <ellipse cx="0" cy="50" rx="16" ry="6" fill="#f59e0b" opacity="0.7" filter="blur(2px)" />
            {/* Sleek Delta Wing Hull */}
            <path
              d="M 0 -68 L 12 -25 L 48 28 L 32 44 L 14 36 L 0 46 L -14 36 L -32 44 L -48 28 L -12 -25 Z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth="2.5"
            />
            {/* Forward nose canards */}
            <path d="M 0 -45 L 18 -32 L 0 -22 L -18 -32 Z" fill="none" stroke={strokeColor} strokeWidth="1.5" />
            {/* Cockpit Canopy */}
            <ellipse cx="0" cy="-28" rx="6" ry="14" fill={isWireframe ? 'none' : '#38bdf8'} stroke="#0284c7" strokeWidth="1.5" />
            {/* Wingtip Hardpoints (Guns) */}
            <line x1="42" y1="20" x2="42" y2="2" stroke="#ef4444" strokeWidth="2" />
            <line x1="-42" y1="20" x2="-42" y2="2" stroke="#ef4444" strokeWidth="2" />
            <circle cx="42" cy="2" r="2" fill="#ef4444" />
            <circle cx="-42" cy="2" r="2" fill="#ef4444" />
            {/* Nose Cannon */}
            <line x1="0" y1="-68" x2="0" y2="-78" stroke="#ef4444" strokeWidth="2" />
            <circle cx="0" cy="-78" r="2" fill="#ef4444" />
            {/* Dorsal Turret Ring */}
            <circle cx="0" cy="10" r="7" fill="none" stroke={accentColor} strokeWidth="1.8" />
            <circle cx="0" cy="10" r="2" fill={accentColor} />
          </g>
        );

      case 'valkyrie':
        return (
          <g transform="translate(150, 150)">
            {/* Engine plumes */}
            <ellipse cx="-16" cy="48" rx="10" ry="5" fill="#f59e0b" opacity="0.7" filter="blur(2px)" />
            <ellipse cx="16" cy="48" rx="10" ry="5" fill="#f59e0b" opacity="0.7" filter="blur(2px)" />
            {/* Swept-Forward Avian Wing Profile */}
            <path
              d="M 0 -62 L 14 -30 L 52 -18 L 46 22 L 24 38 L 0 44 L -24 38 L -46 22 L -52 -18 L -14 -30 Z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth="2.5"
            />
            {/* Forward Wing extensions */}
            <path d="M 52 -18 L 62 -35 L 50 -25" fill="none" stroke={strokeColor} strokeWidth="2" />
            <path d="M -52 -18 L -62 -35 L -50 -25" fill="none" stroke={strokeColor} strokeWidth="2" />
            {/* Cockpit Canopy */}
            <ellipse cx="0" cy="-24" rx="7" ry="15" fill={isWireframe ? 'none' : '#0284c7'} stroke="#38bdf8" strokeWidth="1.5" />
            {/* Wingtip Cannons */}
            <line x1="62" y1="-35" x2="62" y2="-48" stroke="#ef4444" strokeWidth="2" />
            <line x1="-62" y1="-35" x2="-62" y2="-48" stroke="#ef4444" strokeWidth="2" />
            <circle cx="62" cy="-48" r="2" fill="#ef4444" />
            <circle cx="-62" cy="-48" r="2" fill="#ef4444" />
            {/* Dorsal Turret Ring */}
            <circle cx="0" cy="8" r="8" fill="none" stroke={accentColor} strokeWidth="2" />
            <circle cx="0" cy="8" r="2.5" fill={accentColor} />
          </g>
        );

      case 'freighter':
        return (
          <g transform="translate(150, 150)">
            {/* Engines */}
            <ellipse cx="-20" cy="62" rx="12" ry="5" fill="#f59e0b" opacity="0.7" filter="blur(2px)" />
            <ellipse cx="20" cy="62" rx="12" ry="5" fill="#f59e0b" opacity="0.7" filter="blur(2px)" />
            {/* Main Spine & Hull */}
            <path
              d="M -24 -65 L 24 -65 L 28 -40 L 34 50 L -34 50 L -28 -40 Z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth="2.5"
            />
            {/* Cargo Container modules */}
            <rect x="-26" y="-30" width="52" height="22" rx="3" fill={isWireframe ? 'none' : '#1e293b'} stroke={strokeColor} strokeWidth="1.5" />
            <rect x="-26" y="-2" width="52" height="22" rx="3" fill={isWireframe ? 'none' : '#1e293b'} stroke={strokeColor} strokeWidth="1.5" />
            <rect x="-26" y="26" width="52" height="20" rx="3" fill={isWireframe ? 'none' : '#1e293b'} stroke={strokeColor} strokeWidth="1.5" />
            {/* Cockpit Forward Bridge */}
            <rect x="-14" y="-62" width="28" height="14" rx="2" fill={isWireframe ? 'none' : '#38bdf8'} stroke="#0284c7" strokeWidth="1.5" />
            {/* Dorsal Turret Ring on Bridge Section */}
            <circle cx="0" cy="-38" r="8" fill="none" stroke={accentColor} strokeWidth="2" />
            <circle cx="0" cy="-38" r="2.5" fill={accentColor} />
            <line x1="0" y1="-38" x2="0" y2="-50" stroke={accentColor} strokeWidth="2" />
          </g>
        );

      case 'lightning':
        return (
          <g transform="translate(150, 150)">
            {/* Engine plume */}
            <ellipse cx="-14" cy="52" rx="8" ry="4" fill="#38bdf8" opacity="0.8" filter="blur(2px)" />
            <ellipse cx="14" cy="52" rx="8" ry="4" fill="#38bdf8" opacity="0.8" filter="blur(2px)" />
            {/* Angular High-Speed Dart Hull */}
            <path
              d="M 0 -72 L 18 -20 L 56 22 L 40 46 L 18 36 L 0 48 L -18 36 L -40 46 L -56 22 L -18 -20 Z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth="2.5"
            />
            {/* Aggressive internal panelling */}
            <path d="M 0 -50 L 14 -10 L 0 25 L -14 -10 Z" fill="none" stroke={strokeColor} strokeWidth="1.5" />
            {/* Cockpit */}
            <ellipse cx="0" cy="-25" rx="6" ry="16" fill={isWireframe ? 'none' : '#38bdf8'} stroke="#0284c7" strokeWidth="1.5" />
            {/* Heavy Wing Guns */}
            <line x1="48" y1="15" x2="48" y2="-12" stroke="#ef4444" strokeWidth="2.5" />
            <line x1="-48" y1="15" x2="-48" y2="-12" stroke="#ef4444" strokeWidth="2.5" />
            <circle cx="48" cy="-12" r="2.5" fill="#ef4444" />
            <circle cx="-48" cy="-12" r="2.5" fill="#ef4444" />
            {/* Dorsal Turret */}
            <circle cx="0" cy="12" r="8" fill="none" stroke={accentColor} strokeWidth="2" />
            <circle cx="0" cy="12" r="2.5" fill={accentColor} />
          </g>
        );

      case 'argosy':
        return (
          <g transform="translate(150, 150)">
            {/* Heavy Quad Engine Glow */}
            <ellipse cx="-28" cy="62" rx="10" ry="4" fill="#f59e0b" opacity="0.7" filter="blur(2px)" />
            <ellipse cx="-10" cy="64" rx="8" ry="4" fill="#f59e0b" opacity="0.7" filter="blur(2px)" />
            <ellipse cx="10" cy="64" rx="8" ry="4" fill="#f59e0b" opacity="0.7" filter="blur(2px)" />
            <ellipse cx="28" cy="62" rx="10" ry="4" fill="#f59e0b" opacity="0.7" filter="blur(2px)" />
            {/* The Legendary Argosy Outrigger Hull */}
            <path
              d="M 0 -68 L 22 -40 L 58 -10 L 62 38 L 44 58 L 24 50 L 0 54 L -24 50 L -44 58 L -62 38 L -58 -10 L -22 -40 Z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth="2.8"
            />
            {/* Cargo Bay Central Bulkhead */}
            <rect x="-24" y="-20" width="48" height="50" rx="4" fill={isWireframe ? 'none' : '#1e293b'} stroke={strokeColor} strokeWidth="2" />
            {/* Bridge Canopy */}
            <polygon points="0,-60 14,-42 -14,-42" fill={isWireframe ? 'none' : '#38bdf8'} stroke="#0284c7" strokeWidth="1.5" />
            {/* Twin Outrigger Turrets (Classic EV feature!) */}
            <circle cx="-45" cy="12" r="10" fill="none" stroke={accentColor} strokeWidth="2.5" />
            <circle cx="-45" cy="12" r="3" fill={accentColor} />
            <line x1="-45" y1="12" x2="-45" y2="-5" stroke={accentColor} strokeWidth="2.5" />

            <circle cx="45" cy="12" r="10" fill="none" stroke={accentColor} strokeWidth="2.5" />
            <circle cx="45" cy="12" r="3" fill={accentColor} />
            <line x1="45" y1="12" x2="45" y2="-5" stroke={accentColor} strokeWidth="2.5" />

            {/* Nose Forward Guns */}
            <line x1="-12" y1="-45" x2="-12" y2="-62" stroke="#ef4444" strokeWidth="2" />
            <line x1="12" y1="-45" x2="12" y2="-62" stroke="#ef4444" strokeWidth="2" />
          </g>
        );

      case 'heavy_freighter':
        return (
          <g transform="translate(150, 150)">
            {/* Massive Engine Bank */}
            <ellipse cx="-32" cy="72" rx="12" ry="5" fill="#f59e0b" opacity="0.7" filter="blur(2px)" />
            <ellipse cx="0" cy="74" rx="16" ry="6" fill="#f59e0b" opacity="0.7" filter="blur(2px)" />
            <ellipse cx="32" cy="72" rx="12" ry="5" fill="#f59e0b" opacity="0.7" filter="blur(2px)" />
            {/* Colossal Bulk Freighter Hull */}
            <path
              d="M -34 -72 L 34 -72 L 44 -40 L 48 60 L -48 60 L -44 -40 Z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth="3"
            />
            {/* 4 Multi-Container Modular Cargo Holds */}
            <rect x="-36" y="-38" width="72" height="22" rx="3" fill={isWireframe ? 'none' : '#1e293b'} stroke={strokeColor} strokeWidth="2" />
            <rect x="-36" y="-10" width="72" height="22" rx="3" fill={isWireframe ? 'none' : '#1e293b'} stroke={strokeColor} strokeWidth="2" />
            <rect x="-36" y="18" width="72" height="22" rx="3" fill={isWireframe ? 'none' : '#1e293b'} stroke={strokeColor} strokeWidth="2" />
            <rect x="-36" y="44" width="72" height="18" rx="3" fill={isWireframe ? 'none' : '#1e293b'} stroke={strokeColor} strokeWidth="2" />
            {/* Bridge */}
            <rect x="-18" y="-70" width="36" height="15" rx="3" fill={isWireframe ? 'none' : '#38bdf8'} stroke="#0284c7" strokeWidth="2" />
            {/* Dual Defense Turrets Fore and Aft */}
            <circle cx="0" cy="-48" r="9" fill="none" stroke={accentColor} strokeWidth="2.2" />
            <circle cx="0" cy="-48" r="3" fill={accentColor} />
            <circle cx="0" cy="30" r="9" fill="none" stroke={accentColor} strokeWidth="2.2" />
            <circle cx="0" cy="30" r="3" fill={accentColor} />
          </g>
        );

      case 'gunboat':
        return (
          <g transform="translate(150, 150)">
            {/* Twin Engines */}
            <ellipse cx="-18" cy="54" rx="10" ry="5" fill="#38bdf8" opacity="0.8" filter="blur(2px)" />
            <ellipse cx="18" cy="54" rx="10" ry="5" fill="#38bdf8" opacity="0.8" filter="blur(2px)" />
            {/* Military Wedge Hull */}
            <path
              d="M 0 -68 L 22 -30 L 38 18 L 28 48 L -28 48 L -38 18 L -22 -30 Z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth="2.5"
            />
            {/* Armored nose wedge */}
            <polygon points="0,-68 12,-38 -12,-38" fill={isWireframe ? 'none' : '#334155'} stroke={strokeColor} strokeWidth="2" />
            {/* Bridge */}
            <ellipse cx="0" cy="-24" rx="7" ry="12" fill={isWireframe ? 'none' : '#0284c7'} stroke="#38bdf8" strokeWidth="1.5" />
            {/* Dual Turrets */}
            <circle cx="-16" cy="10" r="8" fill="none" stroke={accentColor} strokeWidth="2" />
            <circle cx="-16" cy="10" r="2.5" fill={accentColor} />
            <circle cx="16" cy="10" r="8" fill="none" stroke={accentColor} strokeWidth="2" />
            <circle cx="16" cy="10" r="2.5" fill={accentColor} />
            {/* Heavy Quad Nose Cannons */}
            <line x1="-8" y1="-60" x2="-8" y2="-75" stroke="#ef4444" strokeWidth="2.5" />
            <line x1="8" y1="-60" x2="8" y2="-75" stroke="#ef4444" strokeWidth="2.5" />
            <line x1="-16" y1="-45" x2="-16" y2="-65" stroke="#ef4444" strokeWidth="2" />
            <line x1="16" y1="-45" x2="16" y2="-65" stroke="#ef4444" strokeWidth="2" />
          </g>
        );

      case 'corvette':
        return (
          <g transform="translate(150, 150)">
            {/* Triple Heavy Thrusters */}
            <ellipse cx="-24" cy="68" rx="10" ry="5" fill="#38bdf8" opacity="0.8" filter="blur(2px)" />
            <ellipse cx="0" cy="72" rx="12" ry="5" fill="#38bdf8" opacity="0.8" filter="blur(2px)" />
            <ellipse cx="24" cy="68" rx="10" ry="5" fill="#38bdf8" opacity="0.8" filter="blur(2px)" />
            {/* Heavy Confederation Escort Warship Hull */}
            <path
              d="M 0 -82 L 20 -40 L 42 10 L 36 60 L -36 60 L -42 10 L -20 -40 Z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth="2.8"
            />
            {/* Armor Belts */}
            <path d="M -36 10 L 36 10" stroke={strokeColor} strokeWidth="2" />
            <path d="M -32 35 L 32 35" stroke={strokeColor} strokeWidth="2" />
            {/* Armored Command Bridge */}
            <rect x="-14" y="-35" width="28" height="20" rx="3" fill={isWireframe ? 'none' : '#1e293b'} stroke="#38bdf8" strokeWidth="2" />
            {/* Twin Heavy Turrets */}
            <circle cx="0" cy="-6" r="10" fill="none" stroke={accentColor} strokeWidth="2.5" />
            <circle cx="0" cy="-6" r="3" fill={accentColor} />
            <circle cx="0" cy="28" r="10" fill="none" stroke={accentColor} strokeWidth="2.5" />
            <circle cx="0" cy="28" r="3" fill={accentColor} />
            {/* Forward Battery Launchers */}
            <line x1="-12" y1="-80" x2="-12" y2="-92" stroke="#ef4444" strokeWidth="3" />
            <line x1="12" y1="-80" x2="12" y2="-92" stroke="#ef4444" strokeWidth="3" />
          </g>
        );

      case 'cruiser':
        return (
          <g transform="translate(150, 150)">
            {/* Quad Capital Engines */}
            <ellipse cx="-34" cy="78" rx="12" ry="5" fill="#38bdf8" opacity="0.8" filter="blur(2px)" />
            <ellipse cx="-12" cy="82" rx="10" ry="5" fill="#38bdf8" opacity="0.8" filter="blur(2px)" />
            <ellipse cx="12" cy="82" rx="10" ry="5" fill="#38bdf8" opacity="0.8" filter="blur(2px)" />
            <ellipse cx="34" cy="78" rx="12" ry="5" fill="#38bdf8" opacity="0.8" filter="blur(2px)" />
            {/* Mammoth Capital Cruiser Hull */}
            <path
              d="M 0 -96 L 28 -40 L 58 20 L 48 72 L -48 72 L -58 20 L -28 -40 Z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth="3.2"
            />
            {/* Central Armored Citadel */}
            <polygon points="0,-80 22,-20 0,40 -22,-20" fill={isWireframe ? 'none' : '#1e293b'} stroke={strokeColor} strokeWidth="2" />
            {/* Command Tower */}
            <rect x="-16" y="-15" width="32" height="24" rx="4" fill={isWireframe ? 'none' : '#0f172a'} stroke="#38bdf8" strokeWidth="2" />
            {/* Quad Heavy Turrets */}
            <circle cx="-28" cy="0" r="11" fill="none" stroke={accentColor} strokeWidth="2.5" />
            <circle cx="-28" cy="0" r="3.5" fill={accentColor} />
            <circle cx="28" cy="0" r="11" fill="none" stroke={accentColor} strokeWidth="2.5" />
            <circle cx="28" cy="0" r="3.5" fill={accentColor} />
            <circle cx="0" cy="-45" r="11" fill="none" stroke={accentColor} strokeWidth="2.5" />
            <circle cx="0" cy="-45" r="3.5" fill={accentColor} />
            <circle cx="0" cy="45" r="11" fill="none" stroke={accentColor} strokeWidth="2.5" />
            <circle cx="0" cy="45" r="3.5" fill={accentColor} />
            {/* Prow Torpedo Tubes */}
            <line x1="-8" y1="-95" x2="-8" y2="-108" stroke="#ef4444" strokeWidth="3" />
            <line x1="8" y1="-95" x2="8" y2="-108" stroke="#ef4444" strokeWidth="3" />
          </g>
        );

      case 'carrier':
        return (
          <g transform="translate(150, 150)">
            {/* Massive Engine Array */}
            <ellipse cx="-40" cy="85" rx="14" ry="5" fill="#38bdf8" opacity="0.8" filter="blur(2px)" />
            <ellipse cx="-16" cy="88" rx="12" ry="5" fill="#38bdf8" opacity="0.8" filter="blur(2px)" />
            <ellipse cx="16" cy="88" rx="12" ry="5" fill="#38bdf8" opacity="0.8" filter="blur(2px)" />
            <ellipse cx="40" cy="85" rx="14" ry="5" fill="#38bdf8" opacity="0.8" filter="blur(2px)" />
            {/* Broad Flanked Fleet Carrier Hull */}
            <path
              d="M -52 -80 L 52 -80 L 64 65 L 45 80 L -45 80 L -64 65 Z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth="3.5"
            />
            {/* Centerline Flight Deck Runway */}
            <rect x="-18" y="-75" width="36" height="145" rx="4" fill={isWireframe ? 'none' : '#020617'} stroke="#38bdf8" strokeWidth="2" />
            <line x1="0" y1="-70" x2="0" y2="65" stroke="#f59e0b" strokeWidth="2" strokeDasharray="6,4" />
            {/* Flight Bay Catapult Arcs */}
            <path d="M -18 -60 L 0 -72 L 18 -60" fill="none" stroke="#ef4444" strokeWidth="2" />
            {/* Island Bridge on Starboard Flank */}
            <rect x="24" y="-25" width="22" height="45" rx="3" fill={isWireframe ? 'none' : '#1e293b'} stroke="#38bdf8" strokeWidth="2" />
            {/* Flank Point Defense Turrets */}
            <circle cx="-42" cy="-35" r="9" fill="none" stroke={accentColor} strokeWidth="2" />
            <circle cx="-42" cy="-35" r="2.5" fill={accentColor} />
            <circle cx="-42" cy="25" r="9" fill="none" stroke={accentColor} strokeWidth="2" />
            <circle cx="-42" cy="25" r="2.5" fill={accentColor} />
          </g>
        );

      case 'kestrel':
        return (
          <g transform="translate(150, 150)">
            {/* Glowing Alien Hyper-Shield Envelope */}
            <ellipse cx="0" cy="0" rx="95" ry="115" fill="none" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="4,6" opacity="0.7" />
            {/* Quad Violet Ion Drive Plumes */}
            <ellipse cx="-28" cy="72" rx="10" ry="5" fill="#c084fc" opacity="0.9" filter="blur(2px)" />
            <ellipse cx="-10" cy="75" rx="8" ry="4" fill="#c084fc" opacity="0.9" filter="blur(2px)" />
            <ellipse cx="10" cy="75" rx="8" ry="4" fill="#c084fc" opacity="0.9" filter="blur(2px)" />
            <ellipse cx="28" cy="72" rx="10" ry="5" fill="#c084fc" opacity="0.9" filter="blur(2px)" />
            {/* Predatory Avian Apex Kestrel Hull */}
            <path
              d="M 0 -105 L 18 -55 L 75 -10 L 60 45 L 34 68 L 0 55 L -34 68 L -60 45 L -75 -10 L -18 -55 Z"
              fill={isWireframe ? fillColor : '#090d16'}
              stroke="#a855f7"
              strokeWidth="3"
            />
            {/* Swept-Forward Wing Blades */}
            <path d="M 75 -10 L 88 -35 L 70 -20" fill="none" stroke="#c084fc" strokeWidth="2.5" />
            <path d="M -75 -10 L -88 -35 L -70 -20" fill="none" stroke="#c084fc" strokeWidth="2.5" />
            {/* Central Bio-Mechanical Fuselage */}
            <polygon points="0,-95 24,-20 0,35 -24,-20" fill={isWireframe ? 'none' : '#1e1b4b'} stroke="#c084fc" strokeWidth="2" />
            {/* Precursor Crystal Core */}
            <circle cx="0" cy="-12" r="10" fill="#a855f7" opacity="0.8" filter="blur(2px)" />
            <circle cx="0" cy="-12" r="6" fill="#f3e8ff" />
            {/* Multi-Aspect Turret Platforms */}
            <circle cx="-32" cy="18" r="10" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
            <circle cx="-32" cy="18" r="3" fill="#f59e0b" />
            <circle cx="32" cy="18" r="10" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
            <circle cx="32" cy="18" r="3" fill="#f59e0b" />
            <circle cx="0" cy="-55" r="9" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
            <circle cx="0" cy="-55" r="3" fill="#f59e0b" />
            {/* Wing Heavy Particle Beams */}
            <line x1="88" y1="-35" x2="88" y2="-55" stroke="#ef4444" strokeWidth="3" />
            <line x1="-88" y1="-35" x2="-88" y2="-55" stroke="#ef4444" strokeWidth="3" />
            <line x1="0" y1="-105" x2="0" y2="-120" stroke="#ef4444" strokeWidth="3" />
          </g>
        );

      default:
        // Generic fallback starship
        return (
          <g transform="translate(150, 150)">
            <ellipse cx="0" cy="55" rx="16" ry="6" fill="#f59e0b" opacity="0.7" />
            <path d="M 0 -70 L 32 30 L 0 50 L -32 30 Z" fill={fillColor} stroke={strokeColor} strokeWidth="2.5" />
            <ellipse cx="0" cy="-20" rx="8" ry="16" fill="#38bdf8" />
          </g>
        );
    }
  };

  return (
    <div className={`relative bg-slate-950/90 border border-slate-800 rounded-xl overflow-hidden shadow-inner ${className}`}>
      {/* Blueprint Grid Background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, #0ea5e9 1px, transparent 1px),
            linear-gradient(to bottom, #0ea5e9 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Radial Target Reticle */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-56 h-56 rounded-full border border-cyan-500/15" />
        <div className="w-40 h-40 rounded-full border border-dashed border-cyan-500/20 absolute" />
      </div>

      {/* Top Header Controls */}
      <div className="relative z-10 p-3 bg-slate-900/80 border-b border-slate-800/80 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2">
          <Crosshair className="w-4 h-4 text-cyan-400" />
          <span className="font-display font-bold text-slate-200 uppercase tracking-wider text-[11px]">
            HULL SCHEMATICS // {ship.name.toUpperCase()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode(viewMode === 'tactical' ? 'schematic' : 'tactical')}
            className={`px-2.5 py-1 rounded text-[10px] font-mono border transition-colors cursor-pointer flex items-center gap-1 ${
              viewMode === 'tactical'
                ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>{viewMode === 'tactical' ? 'Tactical Top-Down' : 'Wireframe Blueprint'}</span>
          </button>

          <button
            onClick={() => setRotation((prev) => (prev + 90) % 360)}
            className="p-1 text-slate-400 hover:text-cyan-300 bg-slate-900 hover:bg-slate-800 rounded border border-slate-800 transition-colors cursor-pointer"
            title="Rotate Vessel 90°"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Central SVG Starship Blueprint Canvas */}
      <div className="relative w-full h-72 flex items-center justify-center overflow-hidden">
        <svg
          viewBox="0 0 300 300"
          className="w-full h-full max-w-[280px] max-h-[280px] transition-transform duration-500"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {/* Subtle Coordinate Axis */}
          <line x1="150" y1="20" x2="150" y2="280" stroke="rgba(14, 165, 233, 0.15)" strokeWidth="1" strokeDasharray="4,4" />
          <line x1="20" y1="150" x2="280" y2="150" stroke="rgba(14, 165, 233, 0.15)" strokeWidth="1" strokeDasharray="4,4" />

          {/* Ship Vector Model */}
          {renderShipHull()}
        </svg>

        {/* Tactical Telemetry HUD Tags on Overlay */}
        <div className="absolute top-2 left-3 text-[10px] font-mono text-cyan-400/80 space-y-0.5 pointer-events-none">
          <div>CLASS: {ship.modelClass}</div>
          <div>ROLE: {ship.role}</div>
          <div>BEARING: {rotation}°</div>
        </div>

        <div className="absolute bottom-2 right-3 text-right text-[10px] font-mono text-slate-400 pointer-events-none">
          <div className="text-amber-400 font-bold">HARDPOINTS:</div>
          <div>{ship.gunSlots} Gun Mounts · {ship.turretSlots} Turrets</div>
          <div className="text-cyan-300">SHIELDS: {ship.baseShields} MW</div>
        </div>

        <div className="absolute bottom-2 left-3 flex items-center gap-1.5 text-[10px] font-mono text-slate-400 pointer-events-none">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>DRYDOCK CLEARANCE: OK</span>
        </div>
      </div>
    </div>
  );
};
