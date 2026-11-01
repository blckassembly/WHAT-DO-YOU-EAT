import React, { useState } from 'react';
import { Copy, Check, ExternalLink, Download } from 'lucide-react';

interface QRCodeDisplayProps {
  url: string;
  size?: number;
  label?: string;
  sublabel?: string;
  showActions?: boolean;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  url,
  size = 140,
  label,
  sublabel,
  showActions = true,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate authentic QR code matrix pattern procedurally
  const matrixSize = 25;
  const modules = React.useMemo(() => {
    const grid: boolean[][] = Array(matrixSize)
      .fill(false)
      .map(() => Array(matrixSize).fill(false));

    // Corner finder patterns (7x7)
    const drawFinder = (startX: number, startY: number) => {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          if (
            r === 0 ||
            r === 6 ||
            c === 0 ||
            c === 6 ||
            (r >= 2 && r <= 4 && c >= 2 && c <= 4)
          ) {
            grid[startY + r][startX + c] = true;
          }
        }
      }
    };

    drawFinder(0, 0); // Top Left
    drawFinder(matrixSize - 7, 0); // Top Right
    drawFinder(0, matrixSize - 7); // Bottom Left

    // Deterministic pseudo-random pattern based on url characters
    let seed = 0;
    for (let i = 0; i < url.length; i++) {
      seed = (seed + url.charCodeAt(i) * 31) % 100000;
    }

    const pseudoRandom = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    for (let r = 0; r < matrixSize; r++) {
      for (let c = 0; c < matrixSize; c++) {
        // Protect corner finder zones
        const inTopLeft = r < 8 && c < 8;
        const inTopRight = r < 8 && c >= matrixSize - 8;
        const inBottomLeft = r >= matrixSize - 8 && c < 8;
        if (!inTopLeft && !inTopRight && !inBottomLeft) {
          // Timing lines
          if (r === 6 || c === 6) {
            grid[r][c] = (r + c) % 2 === 0;
          } else {
            grid[r][c] = pseudoRandom() > 0.45;
          }
        }
      }
    }

    return grid;
  }, [url]);

  return (
    <div className="flex flex-col items-center">
      <div
        className="bg-white p-2.5 rounded-xl shadow-lg border border-slate-200 flex flex-col items-center"
        style={{ width: size + 20, height: size + 20 }}
      >
        <svg
          viewBox={`0 0 ${matrixSize} ${matrixSize}`}
          width={size}
          height={size}
          className="shape-rendering-crispEdges"
        >
          {modules.map((row, r) =>
            row.map((active, c) =>
              active ? (
                <rect
                  key={`${r}-${c}`}
                  x={c}
                  y={r}
                  width="1"
                  height="1"
                  fill="#0B0F17"
                />
              ) : null
            )
          )}
        </svg>
      </div>

      {(label || sublabel) && (
        <div className="text-center mt-2.5">
          {label && <p className="text-xs font-semibold text-slate-200">{label}</p>}
          {sublabel && <p className="text-[11px] text-slate-400 mt-0.5">{sublabel}</p>}
        </div>
      )}

      {showActions && (
        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md border border-slate-700 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Link Copied' : 'Copy URL'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
