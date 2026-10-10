import React, { useState, useRef } from 'react';
import { JournalEntry } from '@fieldnote/shared';
import { BotanicalWaxSeal, BotanicalLeafSprig } from './BotanicalIllustrations.js';
import { TactileButton } from './TactileButton.js';
import { X, Download, Share2, Printer, Check } from 'lucide-react';

interface HerbariumModalProps {
  entry: JournalEntry;
  onClose: () => void;
}

export const HerbariumModal: React.FC<HerbariumModalProps> = ({ entry, onClose }) => {
  const [plateTheme, setPlateTheme] = useState<'antique' | 'cyanotype'>('antique');
  const [isCopied, setIsCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const formattedDate = new Date(entry.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const formattedSeq = String(entry.investigation.sequenceNumber).padStart(3, '0');

  const getHerbariumPhotoUrl = (e: JournalEntry): string | null => {
    const uri = e.observation.photoUri;
    if (uri && !uri.startsWith('specimen:')) return uri;
    const key = uri ? uri.replace('specimen:', '') : '';
    const t = e.investigation.title.toLowerCase();
    if (key === 'moss_on_stone' || t.includes('moss')) return '/images/moss-on-stone.jpg';
    if (key === 'weathering' || key === 'weathering_shale' || t.includes('weather') || t.includes('shale') || (t.includes('stone') && !t.includes('moss')) || t.includes('rock')) return '/images/weathering-shale.jpg';
    if (key === 'rainwater_flow' || t.includes('rain') || t.includes('water')) return '/images/rainwater-flow.jpg';
    if (key === 'lichen_crusts' || t.includes('lichen')) return '/images/lichen-crusts.jpg';
    if (key === 'ant_trails' || t.includes('ant')) return '/images/ant-trails.jpg';
    if (key === 'diurnal_leaves' || t.includes('diurnal') || t.includes('movement')) return '/images/diurnal-leaves.jpg';
    if (key === 'leaf_venation' || t.includes('leaf') || t.includes('vein')) return '/images/leaf-veins.jpg';
    return '/images/leaf-veins.jpg';
  };

  // Text wrapping helper
  const wrapText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
  ) => {
    const words = text.split(' ');
    let line = '';
    let currY = y;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line, x, currY);
        line = words[n] + ' ';
        currY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, currY);
  };

  // Reusable canvas generator for export and sharing
  const generateCanvas = (): Promise<HTMLCanvasElement> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 1600;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(canvas);
        return;
      }

      const isCyan = plateTheme === 'cyanotype';

      // Background
      ctx.fillStyle = isCyan ? '#0F2B48' : '#FAF6ED';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Decorative Borders
      ctx.strokeStyle = isCyan ? 'rgba(255, 255, 255, 0.4)' : '#12372A';
      ctx.lineWidth = 4;
      ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);

      ctx.strokeStyle = isCyan ? 'rgba(255, 255, 255, 0.2)' : '#CEC5B5';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(62, 62, canvas.width - 124, canvas.height - 124);

      // Header Masthead
      ctx.fillStyle = isCyan ? '#FFFFFF' : '#12372A';
      ctx.textAlign = 'center';
      ctx.font = '600 36px serif';
      ctx.fillText('HORTUS SICCUS & HERBARIUM SPECIMEN', canvas.width / 2, 130);

      ctx.font = '400 20px monospace';
      ctx.fillStyle = isCyan ? '#8EC5FC' : '#C96B4B';
      ctx.fillText(
        `FOLIO NO. ${formattedSeq} • ${entry.discovery?.fieldCategory?.toUpperCase() || 'BOTANICAL STUDY'}`,
        canvas.width / 2,
        175
      );

      // Title
      ctx.fillStyle = isCyan ? '#FFFFFF' : '#17201B';
      ctx.font = 'bold 50px serif';
      ctx.fillText(entry.investigation.title.toUpperCase(), canvas.width / 2, 260);

      // Frame
      const frameX = 140;
      const frameY = 320;
      const frameW = canvas.width - 280;
      const frameH = 680;

      ctx.strokeStyle = isCyan ? 'rgba(255, 255, 255, 0.3)' : '#CEC5B5';
      ctx.strokeRect(frameX, frameY, frameW, frameH);

      const finalizeDraw = () => {
        // Body Observation
        ctx.fillStyle = isCyan ? '#E0ECF8' : '#17201B';
        ctx.textAlign = 'left';
        ctx.font = 'italic 28px serif';
        const notes = `“${entry.observation.rawNotes}”`;
        wrapText(ctx, notes, 140, 1070, canvas.width - 280, 42);

        // Reflection Insight
        ctx.font = '400 22px serif';
        ctx.fillStyle = isCyan ? '#AFCDE7' : '#4F6F52';
        const insight = `Ecological Synthesis: ${entry.reflection.syntheticInsight}`;
        wrapText(ctx, insight, 140, 1260, canvas.width - 280, 34);

        // Footer
        ctx.strokeStyle = isCyan ? 'rgba(255, 255, 255, 0.2)' : '#CEC5B5';
        ctx.beginPath();
        ctx.moveTo(140, 1450);
        ctx.lineTo(canvas.width - 140, 1450);
        ctx.stroke();

        ctx.font = '400 18px monospace';
        ctx.fillStyle = isCyan ? '#8EC5FC' : '#859189';
        ctx.fillText(
          `COLLECTED: ${formattedDate.toUpperCase()} • SCREEN-AWAY: ${entry.observation.actualDurationSeconds}s`,
          140,
          1490
        );
        ctx.textAlign = 'right';
        ctx.fillText('NATURALIST AI ENGINE • ON-DEVICE SPECIMEN', canvas.width - 140, 1490);

        resolve(canvas);
      };

      const photoSrc = getHerbariumPhotoUrl(entry);
      if (photoSrc) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          ctx.drawImage(img, frameX + 10, frameY + 10, frameW - 20, frameH - 20);
          finalizeDraw();
        };
        img.onerror = () => {
          finalizeDraw();
        };
        img.src = photoSrc;
      } else {
        ctx.fillStyle = isCyan ? 'rgba(255, 255, 255, 0.1)' : '#F2EDE2';
        ctx.fillRect(frameX + 10, frameY + 10, frameW - 20, frameH - 20);
        ctx.fillStyle = isCyan ? '#8EC5FC' : '#859189';
        ctx.font = 'italic 28px serif';
        ctx.fillText('[ Tactile Field Observation Sealed ]', canvas.width / 2, frameY + frameH / 2);
        finalizeDraw();
      }
    });
  };

  // Download high-resolution PNG
  const handleDownloadImage = async () => {
    const canvas = await generateCanvas();
    const link = document.createElement('a');
    link.download = `herbarium-specimen-${formattedSeq}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // Native Web Share with image file support (iOS AirDrop/Instagram/WhatsApp + Android Share)
  const handleShare = async () => {
    try {
      const canvas = await generateCanvas();
      if (canvas.toBlob) {
        canvas.toBlob(async (blob) => {
          if (blob) {
            const file = new File(
              [blob],
              `herbarium-specimen-${formattedSeq}.png`,
              { type: 'image/png' }
            );

            // Attempt rich native file sharing
            if (
              typeof navigator.canShare === 'function' &&
              navigator.canShare({ files: [file] })
            ) {
              try {
                await navigator.share({
                  title: `FIELDNOTE: ${entry.investigation.title}`,
                  text: `Folio No. ${formattedSeq}: “${entry.observation.rawNotes}” — FIELDNOTE Naturalist Journal`,
                  files: [file],
                });
                return;
              } catch {
                // User cancelled or aborted
                return;
              }
            }
          }

          // Fallback to text/URL share if file share not supported
          if (navigator.share) {
            try {
              await navigator.share({
                title: `FIELDNOTE: ${entry.investigation.title}`,
                text: `FIELDNOTE Folio No. ${formattedSeq}: ${entry.investigation.title}\n“${entry.observation.rawNotes}”\n\n${window.location.href}`,
              });
              return;
            } catch {}
          }

          // Fallback to clipboard
          await navigator.clipboard.writeText(
            `FIELDNOTE • Folio No. ${formattedSeq}: ${entry.investigation.title}\n“${entry.observation.rawNotes}”\nEcological Synthesis: ${entry.reflection.syntheticInsight}\n${window.location.href}`
          );
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2500);
        }, 'image/png');
        return;
      }
    } catch (err) {
      console.warn('[Share] Fallback triggered:', err);
    }

    navigator.clipboard.writeText(
      `FIELDNOTE • Folio No. ${formattedSeq}: ${entry.investigation.title}\n“${entry.observation.rawNotes}”\n${window.location.href}`
    );
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const isCyan = plateTheme === 'cyanotype';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Herbarium Specimen Sheet"
      className="fixed inset-0 z-50 bg-ink/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        ref={cardRef}
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-xl rounded-sm border p-6 sm:p-10 shadow-2xl space-y-6 relative transition-colors duration-300 ${
          isCyan
            ? 'bg-[#0E2843] border-[#2E5884] text-[#E0ECF8]'
            : 'bg-[#FAF6ED] border-stone-deep text-ink'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-full min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors ${
            isCyan ? 'text-paper-deep hover:text-paper' : 'text-ink-muted hover:text-ink'
          }`}
          aria-label="Close herbarium modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Theme Toggles */}
        <div className="flex items-center space-x-2 border-b border-stone-deep/30 pb-3">
          <span className="font-mono text-[10px] uppercase tracking-wider opacity-75">
            Plate Style:
          </span>
          <button
            type="button"
            onClick={() => setPlateTheme('antique')}
            className={`px-3 py-1 rounded-[2px] text-xs font-mono tracking-wide transition-all ${
              !isCyan
                ? 'bg-forest text-paper font-semibold shadow-sm'
                : 'bg-paper/10 text-paper border border-white/20'
            }`}
          >
            Antique Linen
          </button>
          <button
            type="button"
            onClick={() => setPlateTheme('cyanotype')}
            className={`px-3 py-1 rounded-[2px] text-xs font-mono tracking-wide transition-all ${
              isCyan
                ? 'bg-[#8EC5FC] text-[#0F2B48] font-semibold shadow-sm'
                : 'bg-stone-light/80 text-ink border border-stone-deep/40'
            }`}
          >
            Prussian Cyanotype
          </button>
        </div>

        {/* Specimen Sheet Content */}
        <div
          className={`p-5 sm:p-7 rounded border space-y-5 ${
            isCyan ? 'border-white/25 bg-[#091F35]' : 'border-stone-deep/60 bg-[#FCFBF7]'
          }`}
        >
          {/* Header */}
          <div className="text-center space-y-1 border-b border-stone-deep/30 pb-3">
            <span
              className={`font-mono text-[10px] tracking-[0.25em] uppercase font-bold block ${
                isCyan ? 'text-[#8EC5FC]' : 'text-terracotta'
              }`}
            >
              HERBARIUM SPECIMEN • NO. {formattedSeq}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight">
              {entry.investigation.title}
            </h2>
            <span className="font-serif italic text-xs opacity-75 block">
              {entry.discovery?.fieldCategory || 'Physical Flora & Micro-Habitat Study'}
            </span>
          </div>

          {/* Photo / Specimen Centerpiece */}
          {getHerbariumPhotoUrl(entry) ? (
            <div className="rounded overflow-hidden border border-stone-deep/40 max-h-72">
              <img
                src={getHerbariumPhotoUrl(entry)!}
                alt={entry.investigation.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div
              className={`p-8 text-center rounded border border-dashed flex flex-col items-center justify-center space-y-2 ${
                isCyan ? 'border-white/20 bg-white/5' : 'border-stone-deep/40 bg-paper'
              }`}
            >
              <BotanicalLeafSprig className="w-8 h-8 opacity-60" />
              <span className="font-serif italic text-xs opacity-70">
                Sensory touch recorded in physical fieldwork
              </span>
            </div>
          )}

          {/* Observation Quote */}
          <div className="space-y-1 border-l-2 border-forest pl-3.5 py-1">
            <span className="font-mono text-[9px] uppercase tracking-wider opacity-70 block">
              Direct Observer Evidence
            </span>
            <p className="font-serif text-sm sm:text-base leading-relaxed italic">
              “{entry.observation.rawNotes}”
            </p>
          </div>

          {/* Synthesis Note */}
          <div className="text-xs font-serif leading-relaxed opacity-85 pt-1 border-t border-stone-deep/20">
            <strong>Ecological Synthesis:</strong> {entry.reflection.syntheticInsight}
          </div>

          {/* Provenance Footer */}
          <div className="pt-3 border-t border-stone-deep/30 flex items-center justify-between text-[10px] font-mono opacity-75">
            <div>
              <span>COLLECTED: {formattedDate.toUpperCase()}</span>
              {entry.observation.actualDurationSeconds > 0 && (
                <span> • {entry.observation.actualDurationSeconds}s SILENT NOTICE</span>
              )}
            </div>
            <BotanicalWaxSeal className="w-9 h-9" label="AUTHENTIC" />
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <TactileButton
            onClick={handleDownloadImage}
            variant="primary"
            className="flex-1 min-h-[44px] text-xs font-semibold"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Herbarium Plate (.PNG)
          </TactileButton>

          <button
            type="button"
            onClick={handleShare}
            className={`px-4 py-2.5 rounded-[2px] border text-xs font-mono uppercase tracking-wider min-h-[44px] flex items-center ${
              isCyan
                ? 'bg-white/10 text-paper border-white/30 hover:bg-white/20'
                : 'bg-paper text-ink border-stone-deep/60 hover:bg-stone-light/60'
            }`}
          >
            {isCopied ? <Check className="w-3.5 h-3.5 mr-1.5 text-moss" /> : <Share2 className="w-3.5 h-3.5 mr-1.5" />}
            {isCopied ? 'Copied' : 'Share'}
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className={`p-2.5 rounded-[2px] border min-h-[44px] min-w-[44px] flex items-center justify-center ${
              isCyan
                ? 'bg-white/10 text-paper border-white/30'
                : 'bg-paper text-ink border-stone-deep/60 hover:bg-stone-light/60'
            }`}
            title="Print Herbarium Sheet"
            aria-label="Print"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
