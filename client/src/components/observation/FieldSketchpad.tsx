import React, { useRef, useState, useEffect } from 'react';
import { TactileButton } from '../common/TactileButton.js';
import { Eraser, RotateCcw, Check, X } from 'lucide-react';

interface FieldSketchpadProps {
  onSaveSketch: (dataUrl: string) => void;
  onCancel: () => void;
  initialImage?: string;
}

export const FieldSketchpad: React.FC<FieldSketchpadProps> = ({
  onSaveSketch,
  onCancel,
  initialImage,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState<'#17201B' | '#C96B4B' | '#4F6F52'>('#17201B');
  const [lineWidth, setLineWidth] = useState<number>(2.5);
  const [isEraser, setIsEraser] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  // Initialize canvas with warm paper background and optional initial image
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill with warm clean ivory paper background
    ctx.fillStyle = '#FCFBF7';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle paper ledger grid lines
    ctx.strokeStyle = 'rgba(231, 224, 211, 0.45)';
    ctx.lineWidth = 1;
    for (let y = 30; y < canvas.height; y += 24) {
      ctx.beginPath();
      ctx.moveTo(10, y);
      ctx.lineTo(canvas.width - 10, y);
      ctx.stroke();
    }

    if (initialImage) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        setHasDrawn(true);
      };
      img.src = initialImage;
    }
  }, [initialImage]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

    ctx.strokeStyle = isEraser ? '#FCFBF7' : color;
    ctx.lineWidth = isEraser ? 16 : lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.lineTo(x, y);
    ctx.stroke();
    setHasDrawn(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FCFBF7';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Redraw subtle lines
    ctx.strokeStyle = 'rgba(231, 224, 211, 0.45)';
    ctx.lineWidth = 1;
    for (let y = 30; y < canvas.height; y += 24) {
      ctx.beginPath();
      ctx.moveTo(10, y);
      ctx.lineTo(canvas.width - 10, y);
      ctx.stroke();
    }
    setHasDrawn(false);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    onSaveSketch(dataUrl);
  };

  return (
    <div className="p-4 sm:p-6 rounded-sm bg-paper-bright border border-stone-deep/60 shadow-journal space-y-4 animate-journal-entry">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-stone-deep/30 pb-3">
        <div className="flex items-center space-x-2">
          <span className="text-terracotta text-sm">✦</span>
          <div>
            <h3 className="font-serif text-lg text-ink font-medium leading-tight">
              Field Charcoal Sketchpad & Leaf Rubbing
            </h3>
            <p className="font-serif italic text-xs text-ink-muted">
              Trace leaf venation angles, bark ridges, or contour lines with your finger.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="p-1.5 text-ink-muted hover:text-ink rounded min-h-[36px]"
          aria-label="Cancel sketching"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Drawing Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        {/* Pigment Swatches */}
        <div className="flex items-center space-x-2">
          <span className="text-ink-muted uppercase tracking-wider text-[10px]">Pigment:</span>
          {[
            { id: '#17201B' as const, label: 'Charcoal', bg: 'bg-[#17201B]' },
            { id: '#4F6F52' as const, label: 'Moss', bg: 'bg-[#4F6F52]' },
            { id: '#C96B4B' as const, label: 'Terracotta', bg: 'bg-[#C96B4B]' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setColor(item.id);
                setIsEraser(false);
              }}
              className={`w-6 h-6 rounded-full border-2 transition-transform ${item.bg} ${
                !isEraser && color === item.id ? 'border-forest scale-110 shadow-sm' : 'border-paper'
              }`}
              title={item.label}
              aria-label={item.label}
            />
          ))}
        </div>

        {/* Stroke Width */}
        <div className="flex items-center space-x-2">
          <span className="text-ink-muted uppercase tracking-wider text-[10px]">Weight:</span>
          {[
            { w: 1.5, label: 'Fine' },
            { w: 3, label: 'Medium' },
            { w: 6, label: 'Broad' },
          ].map((item) => (
            <button
              key={item.w}
              type="button"
              onClick={() => {
                setLineWidth(item.w);
                setIsEraser(false);
              }}
              className={`px-2 py-0.5 rounded-[2px] border text-[11px] ${
                !isEraser && lineWidth === item.w
                  ? 'bg-forest text-paper border-forest font-semibold'
                  : 'bg-paper text-ink border-stone-deep/40'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Tools */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setIsEraser(!isEraser)}
            className={`inline-flex items-center px-2.5 py-1 rounded-[2px] border text-xs ${
              isEraser
                ? 'bg-terracotta text-paper border-terracotta font-semibold'
                : 'bg-paper text-ink-muted border-stone-deep/40'
            }`}
          >
            <Eraser className="w-3.5 h-3.5 mr-1" />
            Eraser
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex items-center px-2 py-1 rounded-[2px] border border-stone-deep/40 bg-paper text-ink-muted hover:text-ink text-xs"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Clear
          </button>
        </div>
      </div>

      {/* Interactive Canvas Area */}
      <div className="border border-stone-deep/70 rounded-sm overflow-hidden bg-[#FCFBF7] shadow-inner touch-none relative">
        <canvas
          ref={canvasRef}
          width={600}
          height={320}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-56 sm:h-72 cursor-crosshair block"
        />
        {!hasDrawn && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-center p-4">
            <span className="font-serif italic text-xs sm:text-sm text-ink-muted/50 select-none">
              Draw leaf venation or rubbing here with your finger...
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-stone-deep/20">
        <button
          type="button"
          onClick={onCancel}
          className="text-xs font-mono text-ink-muted hover:text-ink min-h-[38px] px-3"
        >
          Cancel
        </button>

        <TactileButton
          type="button"
          onClick={handleSave}
          disabled={!hasDrawn}
          variant="primary"
          className="text-xs py-2 px-5 min-h-[38px] font-semibold"
        >
          <Check className="w-3.5 h-3.5 mr-1.5" />
          Attach Sketch to Folio
        </TactileButton>
      </div>
    </div>
  );
};
