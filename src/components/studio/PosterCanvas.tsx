import React, { useRef, useEffect } from 'react';
import { Candidate, LayoutStyle, FormatDimension } from '../../types';

interface PosterCanvasProps {
  candidate: Candidate;
  symbol: string;
  symbolName: string;
  layout: LayoutStyle;
  format: FormatDimension;
  slogan: string;
  customHeadline?: string;
  accentColor?: string;
  onExportReady?: (canvas: HTMLCanvasElement) => void;
}

export const PosterCanvas: React.FC<PosterCanvasProps> = ({
  candidate,
  symbol,
  symbolName,
  layout,
  format,
  slogan,
  customHeadline,
  accentColor = '#0284c7'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = format.width;
    canvas.height = format.height;

    const w = canvas.width;
    const h = canvas.height;

    // Background base
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);

    // Decorative gradient background
    const bgGrad = ctx.createLinearGradient(0, 0, w, h);
    bgGrad.addColorStop(0, '#f8fafc');
    bgGrad.addColorStop(1, '#e2e8f0');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Border Frame
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = Math.max(6, Math.floor(w * 0.015));
    ctx.strokeRect(10, 10, w - 20, h - 20);

    // Header Banner Strip
    ctx.fillStyle = accentColor;
    ctx.fillRect(10, 10, w - 20, Math.floor(h * 0.12));

    // Header Text
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.font = `bold ${Math.floor(w * 0.04)}px "Outfit", sans-serif`;
    ctx.fillText('॥ जय जवान • जय किसान • जय ग्राम पंचायत ॥', w / 2, Math.floor(h * 0.05));

    ctx.font = `bold ${Math.floor(w * 0.052)}px "Outfit", sans-serif`;
    const headline = customHeadline || 'ग्राम पंचायत चुनाव 2026';
    ctx.fillText(headline, w / 2, Math.floor(h * 0.095));

    // Symbol Badge Box
    const symbolBoxSize = Math.floor(w * 0.22);
    const symbolX = w - symbolBoxSize - 25;
    const symbolY = Math.floor(h * 0.16);

    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(symbolX, symbolY, symbolBoxSize, symbolBoxSize, 16);
    ctx.fill();
    ctx.stroke();

    // Draw Symbol emoji
    ctx.font = `${Math.floor(symbolBoxSize * 0.52)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(symbol, symbolX + symbolBoxSize / 2, symbolY + symbolBoxSize / 2 - 8);

    ctx.font = `bold ${Math.max(10, Math.floor(symbolBoxSize * 0.14))}px sans-serif`;
    ctx.fillStyle = '#0f172a';
    ctx.fillText(symbolName.split(' ')[0], symbolX + symbolBoxSize / 2, symbolY + symbolBoxSize - 12);
    ctx.textBaseline = 'alphabetic';

    // Candidate Photo Placeholder / Circle
    const photoSize = Math.floor(w * 0.38);
    const photoX = Math.floor(w * 0.08);
    const photoY = Math.floor(h * 0.16);

    ctx.save();
    ctx.beginPath();
    ctx.arc(photoX + photoSize / 2, photoY + photoSize / 2, photoSize / 2, 0, Math.PI * 2);
    ctx.fillStyle = '#e2e8f0';
    ctx.fill();
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.clip();

    // Fallback initials or image
    ctx.font = `bold ${Math.floor(photoSize * 0.35)}px sans-serif`;
    ctx.fillStyle = accentColor;
    ctx.textAlign = 'center';
    ctx.fillText(candidate.name.charAt(0), photoX + photoSize / 2, photoY + photoSize / 2 + Math.floor(photoSize * 0.12));
    ctx.restore();

    // Candidate Information Section
    const textStartY = photoY + photoSize + Math.floor(h * 0.05);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#0f172a';
    ctx.font = `bold ${Math.floor(w * 0.065)}px "Outfit", sans-serif`;
    ctx.fillText(candidate.hindiName || candidate.name, w / 2, textStartY);

    ctx.fillStyle = '#475569';
    ctx.font = `600 ${Math.floor(w * 0.038)}px sans-serif`;
    ctx.fillText(candidate.post, w / 2, textStartY + Math.floor(h * 0.035));

    ctx.fillStyle = accentColor;
    ctx.font = `bold ${Math.floor(w * 0.035)}px sans-serif`;
    ctx.fillText(candidate.constituency, w / 2, textStartY + Math.floor(h * 0.065));

    // Slogan Ribbon
    const ribbonY = textStartY + Math.floor(h * 0.09);
    const ribbonH = Math.floor(h * 0.1);

    ctx.fillStyle = '#fef3c7';
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(20, ribbonY, w - 40, ribbonH, 12);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#92400e';
    ctx.font = `bold italic ${Math.floor(w * 0.036)}px sans-serif`;
    ctx.fillText(`"${slogan}"`, w / 2, ribbonY + ribbonH / 2 + 5);

    // Footer Voting Appeal Strip
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(10, h - Math.floor(h * 0.12) - 10, w - 20, Math.floor(h * 0.12));

    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${Math.floor(w * 0.04)}px "Outfit", sans-serif`;
    ctx.fillText(`चुनाव चिह्न "${symbolName}" के सामने वाला बटन दबाकर भारी मतों से विजयी बनाएं!`, w / 2, h - Math.floor(h * 0.05));

  }, [candidate, symbol, symbolName, layout, format, slogan, customHeadline, accentColor]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `ElectWin_Poster_${candidate.name.replace(/\s+/g, '_')}_${format.id}.png`;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="relative rounded-2xl overflow-hidden shadow-modal border border-slate-200 max-w-full flex justify-center bg-slate-900/5 p-2">
        <canvas
          ref={canvasRef}
          className="max-w-full h-auto object-contain rounded-xl shadow-lg"
          style={{ maxHeight: '540px' }}
        />
      </div>
      <button
        onClick={handleDownload}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer min-h-[44px]"
      >
        📥 Download High-Resolution Poster (PNG)
      </button>
    </div>
  );
};
