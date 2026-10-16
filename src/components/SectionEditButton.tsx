import React, { useState, useRef, useEffect } from 'react';
import { Edit3, Check, Type, Minus, Plus, AlignLeft } from 'lucide-react';
import { sound } from '../audio/soundFx';

interface SectionEditButtonProps {
  label?: string;
  className?: string;
  targetSelector?: string;
}

export const SectionEditButton: React.FC<SectionEditButtonProps> = ({
  label = 'Edit Text',
  className = '',
  targetSelector,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [fontScale, setFontScale] = useState<number>(100);
  const [spacingIndex, setSpacingIndex] = useState<number>(0);
  const btnRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLElement | null>(null);

  const SPACING_MODES = [
    { label: 'Normal', letterSpacing: 'normal', lineHeight: 'normal' },
    { label: 'Compact', letterSpacing: '-0.02em', lineHeight: '1.3' },
    { label: 'Relaxed', letterSpacing: '0.04em', lineHeight: '1.75' },
  ];

  const getContainer = (): HTMLElement | null => {
    if (targetSelector) {
      const el = document.querySelector<HTMLElement>(targetSelector);
      if (el) return el;
    }
    return (
      btnRef.current?.closest<HTMLElement>(
        '.ev-panel, .ev-panel-inset, [data-section], section, article, .space-y-4, .space-y-5, div[class*="rounded"]'
      ) || null
    );
  };

  const applyTextEditingState = (container: HTMLElement, active: boolean) => {
    // Select all potential text elements
    const selectors = [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 
      'p', 'span', 'strong', 'em', 'b', 'i', 
      'div.font-mono', 'div.font-sans', 'div.font-display', 'div.text-xs', 'div.text-sm',
      'label', 'td', 'th', 'li'
    ];
    const elements = container.querySelectorAll<HTMLElement>(selectors.join(', '));
    elements.forEach((el) => {
      // Never edit inside the edit button controls itself
      if (btnRef.current?.parentElement?.contains(el)) return;
      if (el.closest('.ev-no-edit')) return;

      // Only make leaf or near-leaf text elements editable
      const hasBlockChildren = el.querySelector('div, p, h1, h2, h3, h4, table, ul, ol');
      if (hasBlockChildren) return;

      if (active) {
        el.setAttribute('contenteditable', 'true');
        el.setAttribute('spellcheck', 'false');
        el.classList.add('ev-user-editing');
      } else {
        el.removeAttribute('contenteditable');
        el.classList.remove('ev-user-editing');
      }
    });
  };

  // Prevent button / navigation clicks while editing text inside them
  useEffect(() => {
    if (!isEditing) return;
    const container = containerRef.current;
    if (!container) return;

    const handleContainerClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      // If clicking inside the edit toolbar, allow it
      if (btnRef.current?.parentElement?.contains(target)) return;
      
      // If clicking on an editable element, stop propagation so it doesn't trigger parent button clicks
      if (target.getAttribute('contenteditable') === 'true' || target.closest('[contenteditable="true"]')) {
        e.stopPropagation();
      }
    };

    container.addEventListener('click', handleContainerClick, true);
    return () => {
      container.removeEventListener('click', handleContainerClick, true);
    };
  }, [isEditing]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playSelect();

    const container = getContainer();
    if (!container) {
      setIsEditing(!isEditing);
      return;
    }
    containerRef.current = container;

    const nextState = !isEditing;
    setIsEditing(nextState);
    applyTextEditingState(container, nextState);

    if (nextState) {
      // Focus first editable text element
      setTimeout(() => {
        const first = container.querySelector<HTMLElement>('[contenteditable="true"]');
        first?.focus();
      }, 50);
    }
  };

  const handleAdjustFontSize = (delta: number, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playSelect();
    const container = containerRef.current || getContainer();
    if (!container) return;
    containerRef.current = container;

    const nextScale = Math.max(70, Math.min(160, fontScale + delta));
    setFontScale(nextScale);
    container.style.fontSize = `${nextScale}%`;
  };

  const handleCycleSpacing = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playSelect();
    const container = containerRef.current || getContainer();
    if (!container) return;
    containerRef.current = container;

    const nextIdx = (spacingIndex + 1) % SPACING_MODES.length;
    setSpacingIndex(nextIdx);
    const mode = SPACING_MODES[nextIdx];
    container.style.letterSpacing = mode.letterSpacing;
    container.style.lineHeight = mode.lineHeight;
  };

  return (
    <div className={`ev-no-edit inline-flex items-center gap-1 shrink-0 z-30 select-none ${className}`}>
      {/* Active Section Font & Spacing Micro-Controls */}
      {isEditing && (
        <div className="flex items-center gap-1 bg-black/90 border border-emerald-500/60 rounded px-1.5 py-0.5 shadow-md">
          <button
            type="button"
            onClick={(e) => handleAdjustFontSize(-5, e)}
            className="px-1 py-0.5 rounded text-[10px] font-mono text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer"
            title="Decrease font size in this section"
          >
            <Minus className="w-2.5 h-2.5" />
          </button>
          
          <span className="text-[9px] font-mono font-bold text-emerald-300 tabular-nums min-w-[28px] text-center">
            {fontScale}%
          </span>

          <button
            type="button"
            onClick={(e) => handleAdjustFontSize(5, e)}
            className="px-1 py-0.5 rounded text-[10px] font-mono text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer"
            title="Increase font size in this section"
          >
            <Plus className="w-2.5 h-2.5" />
          </button>

          <div className="w-[1px] h-3 bg-slate-700 mx-0.5" />

          <button
            type="button"
            onClick={handleCycleSpacing}
            className="px-1.5 py-0.5 rounded text-[9px] font-mono text-cyan-300 hover:text-white hover:bg-cyan-950 cursor-pointer flex items-center gap-0.5"
            title={`Cycle spacing (${SPACING_MODES[spacingIndex].label})`}
          >
            <AlignLeft className="w-2.5 h-2.5" />
            <span>{SPACING_MODES[spacingIndex].label[0]}</span>
          </button>
        </div>
      )}

      {/* Main Toggle Button */}
      <button
        ref={btnRef}
        type="button"
        onClick={handleToggle}
        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all flex items-center gap-1 cursor-pointer select-none shadow-sm shrink-0 ${
          isEditing
            ? 'bg-emerald-950 border border-emerald-400 text-emerald-300 ring-1 ring-emerald-400/50 shadow-emerald-950/50'
            : 'bg-amber-950/90 hover:bg-amber-900 border border-amber-500/60 text-amber-300 hover:text-white'
        }`}
        title={
          isEditing
            ? 'Click Done when finished editing text in this section'
            : 'Click to directly edit text, font size, and spacing in this section'
        }
      >
        {isEditing ? (
          <>
            <Check className="w-3 h-3 text-emerald-400 shrink-0" />
            <span>Done</span>
          </>
        ) : (
          <>
            <Edit3 className="w-3 h-3 text-amber-400 shrink-0" />
            <span>{label}</span>
          </>
        )}
      </button>
    </div>
  );
};

