import React, { useEffect, useRef } from 'react';

interface GenericArcadeGameProps {
  className?: string;
  gameTitle?: string;
  foodTheme?: string;
}

export const GenericArcadeGame: React.FC<GenericArcadeGameProps> = ({
  className = 'w-full h-full',
  gameTitle = 'THE WANDER MEGA FEAST',
  foodTheme = 'Di Fara Pizza & Voodoo Fries',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 500);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Stars background
    const stars: { x: number; y: number; speed: number; size: number }[] = [];
    for (let i = 0; i < 70; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        speed: Math.random() * 2 + 1,
        size: Math.random() * 2 + 1,
      });
    }

    // Player ship
    const player = {
      x: width * 0.25,
      y: height * 0.5,
      targetY: height * 0.5,
      width: 44,
      height: 28,
      speed: 4,
      score: 12480,
      combo: 3,
    };

    // Food collectibles & enemy targets
    interface Entity {
      x: number;
      y: number;
      speed: number;
      type: 'pizza' | 'wing' | 'fry' | 'target';
      icon: string;
      size: number;
    }
    const entities: Entity[] = [];

    // Laser blasts
    interface Laser {
      x: number;
      y: number;
      speed: number;
    }
    const lasers: Laser[] = [];

    // Floating text popups
    interface Popup {
      x: number;
      y: number;
      text: string;
      alpha: number;
    }
    const popups: Popup[] = [];

    let frame = 0;

    const gameLoop = () => {
      frame++;

      // Resize check
      if (canvas.width !== canvas.parentElement?.clientWidth || canvas.height !== canvas.parentElement?.clientHeight) {
        handleResize();
      }

      // Clear with deep arcade nebula tint
      ctx.fillStyle = '#061612';
      ctx.fillRect(0, 0, width, height);

      // Starfield parallax
      ctx.fillStyle = 'rgba(200, 230, 220, 0.7)';
      for (const star of stars) {
        star.x -= star.speed * 1.5;
        if (star.x < 0) {
          star.x = width;
          star.y = Math.random() * height;
        }
        ctx.fillRect(star.x, star.y, star.size, star.size);
      }

      // Neon grid horizon at bottom
      ctx.strokeStyle = 'rgba(228, 255, 26, 0.15)';
      ctx.lineWidth = 1;
      const gridY = height * 0.85;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x - ((frame * 2) % 40), height);
        ctx.lineTo(width * 0.5 + (x - width * 0.5) * 0.3, gridY);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.moveTo(0, gridY);
      ctx.lineTo(width, gridY);
      ctx.stroke();

      // Autonomous player movement (dodging & aiming)
      player.targetY = height * 0.5 + Math.sin(frame * 0.04) * (height * 0.28);
      player.y += (player.targetY - player.y) * 0.08;

      // Automated laser firing
      if (frame % 18 === 0) {
        lasers.push({
          x: player.x + player.width,
          y: player.y + 4,
          speed: 10,
        });
        lasers.push({
          x: player.x + player.width,
          y: player.y - 4,
          speed: 10,
        });
      }

      // Spawn food collectibles & targets
      if (frame % 38 === 0) {
        const types: ('pizza' | 'wing' | 'fry' | 'target')[] = ['pizza', 'wing', 'fry', 'target'];
        const chosen = types[Math.floor(Math.random() * types.length)];
        const icons = { pizza: '🍕', wing: '🍗', fry: '🍟', target: '🛸' };
        entities.push({
          x: width + 20,
          y: Math.random() * (height * 0.7) + height * 0.1,
          speed: Math.random() * 2 + 3,
          type: chosen,
          icon: icons[chosen],
          size: 26,
        });
      }

      // Render Lasers
      ctx.fillStyle = '#E4FF1A';
      ctx.shadowColor = '#E4FF1A';
      ctx.shadowBlur = 8;
      for (let i = lasers.length - 1; i >= 0; i--) {
        const l = lasers[i];
        l.x += l.speed;
        ctx.fillRect(l.x, l.y - 1.5, 14, 3);
        if (l.x > width) {
          lasers.splice(i, 1);
        }
      }
      ctx.shadowBlur = 0;

      // Render & Collide Entities
      for (let i = entities.length - 1; i >= 0; i--) {
        const ent = entities[i];
        ent.x -= ent.speed;

        // Draw Entity icon
        ctx.font = `${ent.size}px sans-serif`;
        ctx.fillText(ent.icon, ent.x, ent.y);

        // Check laser collision
        for (let l = lasers.length - 1; l >= 0; l--) {
          const laser = lasers[l];
          if (
            Math.abs(laser.x - ent.x) < 20 &&
            Math.abs(laser.y - ent.y) < 20
          ) {
            lasers.splice(l, 1);
            player.score += 250;
            popups.push({
              x: ent.x,
              y: ent.y - 10,
              text: ent.type === 'target' ? '+250 PTS' : `+500 COMBO! ${ent.type.toUpperCase()}`,
              alpha: 1.0,
            });
            entities.splice(i, 1);
            break;
          }
        }

        // Remove if off screen
        if (ent.x < -40) {
          entities.splice(i, 1);
        }
      }

      // Render Player Ship (Cyan & Volt Retro Fighter)
      ctx.save();
      ctx.translate(player.x, player.y);

      // Thruster flame
      ctx.fillStyle = frame % 2 === 0 ? '#E4FF1A' : '#FF5500';
      ctx.beginPath();
      ctx.moveTo(-16, 0);
      ctx.lineTo(-28 - Math.random() * 8, -4);
      ctx.lineTo(-28 - Math.random() * 8, 4);
      ctx.closePath();
      ctx.fill();

      // Ship body
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.moveTo(22, 0);
      ctx.lineTo(-12, -14);
      ctx.lineTo(-6, 0);
      ctx.lineTo(-12, 14);
      ctx.closePath();
      ctx.fill();

      // Cockpit canopy (Signature Green)
      ctx.fillStyle = '#10382E';
      ctx.beginPath();
      ctx.ellipse(2, 0, 8, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Render Popups
      ctx.font = 'bold 12px "JetBrains Mono", monospace';
      for (let p = popups.length - 1; p >= 0; p--) {
        const pop = popups[p];
        pop.y -= 1;
        pop.alpha -= 0.02;
        ctx.fillStyle = `rgba(228, 255, 26, ${Math.max(0, pop.alpha)})`;
        ctx.fillText(pop.text, pop.x, pop.y);
        if (pop.alpha <= 0) {
          popups.splice(p, 1);
        }
      }

      // Arcade HUD Overlay (Top-Left & Top-Right)
      // Liquid glass top HUD strip
      ctx.fillStyle = 'rgba(12, 43, 35, 0.75)';
      ctx.fillRect(10, 10, width - 20, 36);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.strokeRect(10, 10, width - 20, 36);

      // Title & Score
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 12px "Bricolage Grotesque", sans-serif';
      ctx.fillText(`🎮 ${gameTitle.toUpperCase()}`, 24, 32);

      ctx.fillStyle = '#E4FF1A';
      ctx.font = 'bold 12px "JetBrains Mono", monospace';
      ctx.fillText(`SCORE: ${player.score.toLocaleString()}  |  COMBO x${player.combo}`, width - 220, 32);

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [gameTitle]);

  return (
    <div className={`relative overflow-hidden bg-[#061612] ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full block" />
      <div className="absolute bottom-2 left-3 pointer-events-none text-[10px] font-mono text-[#86BBAE]">
        <span>Streamer Feed: 60 FPS · 1080p · {foodTheme}</span>
      </div>
    </div>
  );
};
