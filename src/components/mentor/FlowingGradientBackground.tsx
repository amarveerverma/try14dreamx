"use client";

import * as React from "react";

export type GradientMode = "vibrant" | "balanced" | "calm" | "showcase";
export type CanvasMode = GradientMode;

export interface ColorTelemetry {
  huePrimary: number;
  hueSecondary: number;
  xPct: number;
  yPct: number;
}

interface FlowingGradientBackgroundProps {
  mode: GradientMode;
  onColorTelemetry?: (telemetry: ColorTelemetry) => void;
}

function lerp(start: number, end: number, factor: number) {
  return start + (end - start) * factor;
}

export function FlowingGradientBackground({
  mode,
  onColorTelemetry,
}: FlowingGradientBackgroundProps) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const modeRef = React.useRef(mode);
  modeRef.current = mode;

  const telemetryRef = React.useRef(onColorTelemetry);
  telemetryRef.current = onColorTelemetry;

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const downsample = 0.35;
    let width = Math.max(320, Math.floor(window.innerWidth * downsample));
    let height = Math.max(240, Math.floor(window.innerHeight * downsample));

    const handleResize = () => {
      width = Math.max(320, Math.floor(window.innerWidth * downsample));
      height = Math.max(240, Math.floor(window.innerHeight * downsample));
      canvas.width = width;
      canvas.height = height;
    };
    handleResize();

    const mouse = {
      targetX: 0.35,
      targetY: 0.3,
      curX: 0.35,
      curY: 0.3,
      vel: 0,
      lastRawX: 0.35,
      lastRawY: 0.3,
    };

    const handlePointerMove = (e: PointerEvent) => {
      const x = Math.min(1, Math.max(0, e.clientX / Math.max(1, window.innerWidth)));
      const y = Math.min(1, Math.max(0, e.clientY / Math.max(1, window.innerHeight)));
      const dx = x - mouse.lastRawX;
      const dy = y - mouse.lastRawY;
      mouse.vel = Math.min(1, mouse.vel + Math.hypot(dx, dy) * 3.2);
      mouse.lastRawX = x;
      mouse.lastRawY = y;
      mouse.targetX = x;
      mouse.targetY = y;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const t = e.touches[0];
        mouse.targetX = Math.min(1, Math.max(0, t.clientX / Math.max(1, window.innerWidth)));
        mouse.targetY = Math.min(1, Math.max(0, t.clientY / Math.max(1, window.innerHeight)));
      }
    };

    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    let animId = 0;
    let frameCount = 0;
    const startTime = performance.now();

    const render = (time: number) => {
      const elapsed = prefersReducedMotion ? 0 : (time - startTime) * 0.00055;
      mouse.curX = lerp(mouse.curX, mouse.targetX, 0.065);
      mouse.curY = lerp(mouse.curY, mouse.targetY, 0.065);
      mouse.vel = lerp(mouse.vel, 0, 0.05);

      const curMode = modeRef.current;
      const isShowcase = curMode === "showcase";
      const alpha =
        curMode === "showcase"
          ? 0.92
          : curMode === "vibrant"
          ? 0.68
          : curMode === "balanced"
          ? 0.42
          : 0.22;

      const h1 =
        (232 + mouse.curX * 128 + (mouse.curY - 0.5) * 38 + Math.sin(elapsed * 1.1) * 12 + 360) %
        360;
      const h2 =
        (192 + mouse.curX * 145 - mouse.curY * 48 + Math.cos(elapsed * 0.85) * 16 + 360) % 360;
      const h3 =
        (165 + (1 - mouse.curX) * 110 + mouse.curY * 65 + Math.sin(elapsed * 0.7 + 1.4) * 14 + 360) %
        360;
      const h4 = (28 + mouse.curX * 42 + (1 - mouse.curY) * 35 + 360) % 360;

      frameCount++;
      if (frameCount % 8 === 0 && telemetryRef.current) {
        telemetryRef.current({
          huePrimary: Math.round(h1),
          hueSecondary: Math.round(h2),
          xPct: Math.round(mouse.curX * 100),
          yPct: Math.round(mouse.curY * 100),
        });
      }

      // Linear background
      const baseGrad = ctx.createLinearGradient(0, 0, width, height);
      if (isShowcase) {
        baseGrad.addColorStop(0, `hsl(${(h1 + 20) % 360}, 48%, 13%)`);
        baseGrad.addColorStop(0.5, `hsl(${h2}, 42%, 16%)`);
        baseGrad.addColorStop(1, `hsl(${h3}, 46%, 12%)`);
      } else {
        baseGrad.addColorStop(0, `hsl(${h1}, 58%, 95%)`);
        baseGrad.addColorStop(0.5, `hsl(${h2}, 50%, 96%)`);
        baseGrad.addColorStop(1, `hsl(${h3}, 55%, 94%)`);
      }

      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = baseGrad;
      ctx.fillRect(0, 0, width, height);

      const maxDim = Math.max(width, height);
      const drawBlob = (
        bx: number,
        by: number,
        rad: number,
        hue: number,
        sat: number,
        light: number,
        op: number
      ) => {
        const radGrad = ctx.createRadialGradient(bx, by, 0, bx, by, rad);
        radGrad.addColorStop(0, `hsla(${hue}, ${sat}%, ${light}%, ${op})`);
        radGrad.addColorStop(0.48, `hsla(${(hue + 14) % 360}, ${sat - 6}%, ${light + 4}%, ${op * 0.52})`);
        radGrad.addColorStop(1, `hsla(${hue}, ${sat}%, ${light}%, 0)`);
        ctx.fillStyle = radGrad;
        ctx.fillRect(0, 0, width, height);
      };

      ctx.globalCompositeOperation = isShowcase ? "screen" : "source-over";
      drawBlob(
        mouse.curX * width,
        mouse.curY * height,
        maxDim * (0.52 + mouse.vel * 0.16),
        h1,
        isShowcase ? 88 : 84,
        isShowcase ? 58 : 66,
        alpha * 0.85
      );
      drawBlob(
        width * (0.82 - mouse.curX * 0.55 + Math.sin(elapsed * 1.2) * 0.12),
        height * (0.78 - mouse.curY * 0.45 + Math.cos(elapsed * 0.95) * 0.12),
        maxDim * 0.58,
        h2,
        isShowcase ? 85 : 80,
        isShowcase ? 54 : 68,
        alpha * 0.76
      );
      drawBlob(
        width * (0.25 + mouse.curY * 0.5 + Math.cos(elapsed * 0.8 + 2.1) * 0.18),
        height * (0.22 + mouse.curX * 0.35 + Math.sin(elapsed * 1.05 + 0.8) * 0.15),
        maxDim * 0.5,
        h3,
        isShowcase ? 82 : 76,
        isShowcase ? 52 : 67,
        alpha * 0.68
      );
      drawBlob(
        width * (0.15 + mouse.curX * 0.72 + Math.sin(elapsed * 1.4 + 4) * 0.1),
        height * (0.82 - mouse.curX * 0.4 + Math.cos(elapsed * 1.15 + 3.1) * 0.12),
        maxDim * 0.44,
        h4,
        isShowcase ? 90 : 84,
        isShowcase ? 58 : 70,
        alpha * (0.42 + mouse.curX * 0.35)
      );

      // Aurora flowing wave at bottom
      ctx.beginPath();
      const waveBase = height * (0.35 + mouse.curY * 0.3);
      ctx.moveTo(0, height);
      for (let px = 0; px <= width; px += Math.max(8, Math.floor(width / 28))) {
        const ratio = px / width;
        const py =
          waveBase +
          Math.sin(ratio * 4.2 + elapsed * 1.8 + mouse.curX * 3.4) * (height * 0.11) +
          Math.cos(ratio * 2.3 - elapsed * 1.2 + mouse.curY * 2.5) * (height * 0.07);
        ctx.lineTo(px, py);
      }
      ctx.lineTo(width, height);
      ctx.closePath();

      const waveGrad = ctx.createLinearGradient(0, waveBase - height * 0.18, width, height);
      waveGrad.addColorStop(
        0,
        `hsla(${(h1 + 28) % 360}, 82%, ${isShowcase ? 56 : 68}%, ${alpha * 0.34})`
      );
      waveGrad.addColorStop(
        0.5,
        `hsla(${h2}, 78%, ${isShowcase ? 52 : 72}%, ${alpha * 0.28})`
      );
      waveGrad.addColorStop(
        1,
        `hsla(${h3}, 80%, ${isShowcase ? 50 : 70}%, ${alpha * 0.34})`
      );
      ctx.fillStyle = waveGrad;
      ctx.fill();

      if (!prefersReducedMotion) {
        animId = window.requestAnimationFrame(render);
      }
    };

    animId = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none"
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="h-full w-full block transition-opacity duration-500"
        style={{ filter: "saturate(1.08)" }}
      />
      <div
        className="absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(81, 69, 205, 0.28) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
    </div>
  );
}
