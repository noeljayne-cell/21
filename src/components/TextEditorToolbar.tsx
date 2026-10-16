import React, { useState, useEffect } from 'react';
import { 
  Edit3, 
  Type, 
  Maximize2, 
  Minimize2, 
  Copy, 
  Check, 
  RotateCcw, 
  Sparkles, 
  X,
  Sliders,
  AlignLeft
} from 'lucide-react';
import { sound } from '../audio/soundFx';

interface TextEditorToolbarProps {
  isGlobalEditMode: boolean;
  onToggleGlobalEditMode: () => void;
}

export const TextEditorToolbar: React.FC<TextEditorToolbarProps> = ({
  isGlobalEditMode,
  onToggleGlobalEditMode,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [fontSizePercent, setFontSizePercent] = useState<number>(100);
  const [spacingMode, setSpacingMode] = useState<'compact' | 'normal' | 'relaxed'>('normal');
  const [copied, setCopied] = useState<boolean>(false);

  // Apply font size scale to root document
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSizePercent}%`;
  }, [fontSizePercent]);

  // Apply spacing mode to body
  useEffect(() => {
    if (spacingMode === 'compact') {
      document.body.style.letterSpacing = '-0.015em';
      document.body.style.lineHeight = '1.35';
    } else if (spacingMode === 'relaxed') {
      document.body.style.letterSpacing = '0.035em';
      document.body.style.lineHeight = '1.7';
    } else {
      document.body.style.letterSpacing = 'normal';
      document.body.style.lineHeight = 'normal';
    }
  }, [spacingMode]);

  // Handle global design mode
  useEffect(() => {
    try {
      if (isGlobalEditMode) {
        document.designMode = 'on';
      } else {
        document.designMode = 'off';
      }
    } catch {
      // Fallback
    }
  }, [isGlobalEditMode]);

  const handleDecreaseFont = () => {
    sound.playSelect();
    setFontSizePercent((prev) => Math.max(75, prev - 5));
  };

  const handleIncreaseFont = () => {
    sound.playSelect();
    setFontSizePercent((prev) => Math.min(140, prev + 5));
  };

  const handleReset = () => {
    sound.playSelect();
    setFontSizePercent(100);
    setSpacingMode('normal');
    document.documentElement.style.fontSize = '100%';
    document.body.style.letterSpacing = 'normal';
    document.body.style.lineHeight = 'normal';
  };

  const handleCopySummary = async () => {
    sound.playCredit();
    const promptMessage = `I have adjusted the text, font size, and spacing:\n- Font Size Scale: ${fontSizePercent}%\n- Spacing Mode: ${spacingMode}\n- Global inline editing was tested. Please permanently bake in my layout/font adjustments and remove the edit feature and buttons as requested.`;
    try {
      await navigator.clipboard.writeText(promptMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // fallback
    }
  };

  return (
    <aside 
      aria-label="Text & Design Studio"
      className="fixed top-14 right-3 sm:right-6 z-[60] select-none"
    >
      {!isExpanded ? (
        <button
          onClick={() => {
            sound.playMenu();
            setIsExpanded(true);
          }}
          className="bg-amber-950/95 hover:bg-amber-900 border-2 border-amber-500/80 text-amber-300 px-3 py-1.5 rounded-full shadow-2xl flex items-center gap-2 cursor-pointer font-mono text-xs backdrop-blur-md transition-all hover:scale-105"
        >
          <Edit3 className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-bold">Text Editor {isGlobalEditMode ? '(ON)' : ''}</span>
          <span className="text-[10px] text-amber-200/70">{fontSizePercent}%</span>
        </button>
      ) : (
        <div className="w-80 sm:w-96 ev-panel border-2 border-amber-500/80 bg-[#070b13]/98 rounded-xl p-3.5 sm:p-4 shadow-[0_8px_32px_rgba(0,0,0,0.9)] backdrop-blur-md space-y-3">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-300 uppercase tracking-wider">
              <Sliders className="w-4 h-4 text-amber-400" />
              <span>Text &amp; Design Studio</span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleReset}
                className="ev-btn px-2 py-0.5 text-[10px] text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer"
                title="Reset font size and spacing to default (100%)"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
              <button
                onClick={() => {
                  sound.playMenu();
                  setIsExpanded(false);
                }}
                className="ev-btn p-1 text-slate-400 hover:text-white cursor-pointer"
                title="Collapse editor toolbar"
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Master Edit Mode Toggle */}
          <div className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-black/70 border border-slate-800">
            <div>
              <span className="text-xs font-mono font-bold text-slate-200 block">
                Direct Inline Text Editing
              </span>
              <span className="text-[10px] font-sans text-slate-400">
                {isGlobalEditMode 
                  ? 'Active: click anywhere on any text to type & edit'
                  : 'Off: click small section buttons or enable here'}
              </span>
            </div>

            <button
              onClick={() => {
                sound.playSelect();
                onToggleGlobalEditMode();
              }}
              className={`px-3 py-1.5 rounded-md font-display font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md ${
                isGlobalEditMode
                  ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300 shadow-amber-500/40'
                  : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
              }`}
            >
              {isGlobalEditMode ? 'EDIT: ON' : 'EDIT: OFF'}
            </button>
          </div>

          {/* Controls: Font Size */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono text-slate-300">
              <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                <Type className="w-3.5 h-3.5" /> Font Size Scale
              </span>
              <span className="text-amber-300 font-bold tabular-nums">{fontSizePercent}%</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleDecreaseFont}
                className="flex-1 py-1 px-2 ev-btn text-xs text-slate-200 flex items-center justify-center gap-1 cursor-pointer"
                title="Decrease font size"
              >
                <span>A-</span>
                <span className="text-[10px] text-slate-400">Smaller</span>
              </button>

              <button
                onClick={() => setFontSizePercent(100)}
                className={`px-3 py-1 rounded text-xs font-mono font-bold cursor-pointer transition-colors ${
                  fontSizePercent === 100 
                    ? 'bg-cyan-950 border border-cyan-500/80 text-cyan-300' 
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
                title="Default font size (100%)"
              >
                100%
              </button>

              <button
                onClick={handleIncreaseFont}
                className="flex-1 py-1 px-2 ev-btn text-xs text-slate-200 flex items-center justify-center gap-1 cursor-pointer"
                title="Increase font size"
              >
                <span>A+</span>
                <span className="text-[10px] text-slate-400">Larger</span>
              </button>
            </div>
          </div>

          {/* Controls: Text Spacing & Line Height */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono text-slate-300">
              <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                <AlignLeft className="w-3.5 h-3.5" /> Text Spacing
              </span>
              <span className="text-amber-300 font-bold capitalize">{spacingMode}</span>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              {(['compact', 'normal', 'relaxed'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => {
                    sound.playSelect();
                    setSpacingMode(mode);
                  }}
                  className={`py-1 px-2 rounded text-xs font-mono capitalize transition-all cursor-pointer text-center ${
                    spacingMode === mode
                      ? 'bg-cyan-950 border border-cyan-400 text-cyan-200 font-bold shadow-sm'
                      : 'bg-slate-900/90 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Copy Tool to easily prompt when finished */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
            <button
              onClick={handleCopySummary}
              className="flex-1 py-1.5 px-3 ev-btn-amber text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              title="Copy font settings to clipboard to easily instruct me to lock them in"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-slate-950" />
                  <span className="text-slate-950 font-bold">Copied Settings!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-950" />
                  <span className="text-slate-950 font-bold">Copy Settings for AI</span>
                </>
              )}
            </button>
          </div>
          
          <div className="text-[10px] font-sans text-slate-400 leading-normal text-center">
            Tip: Click any small <strong className="text-amber-300 font-mono">[Edit Text]</strong> button in any section to edit that specific box directly, or leave master edit mode ON to click and type anywhere!
          </div>
        </div>
      )}
    </aside>
  );
};
