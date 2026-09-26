import { GenerationSettings } from '../types';

export async function processImageLocal3D(
  imageSource: string | HTMLImageElement,
  settings: GenerationSettings
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = typeof imageSource === 'string' ? new Image() : imageSource;

    if (typeof imageSource === 'string') {
      img.crossOrigin = 'anonymous';
      img.onload = () => runRender();
      img.onerror = (e) => reject(e);
      img.src = imageSource;
    } else {
      if (img.complete) {
        runRender();
      } else {
        img.onload = () => runRender();
        img.onerror = (e) => reject(e);
      }
    }

    function runRender() {
      try {
        const naturalWidth = img.naturalWidth || img.width || 1200;
        const naturalHeight = img.naturalHeight || img.height || 1200;

        // Determine canvas dimensions based on quality and aspect ratio
        let targetW = 1400;
        let targetH = 1400;

        if (settings.quality === 'standard') {
          targetW = 1000;
          targetH = 1000;
        } else if (settings.quality === 'ultra_hd') {
          targetW = 2000;
          targetH = 2000;
        }

        // Apply aspect ratio
        if (settings.aspectRatio === '4:5') {
          targetH = Math.round(targetW * 1.25);
        } else if (settings.aspectRatio === '9:16') {
          targetH = Math.round(targetW * (16 / 9));
        } else if (settings.aspectRatio === '16:9') {
          targetH = Math.round(targetW * (9 / 16));
        }

        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        if (!ctx) {
          throw new Error('Canvas 2D context not available');
        }

        // Draw background according to settings
        ctx.fillStyle = '#0a0d14';
        ctx.fillRect(0, 0, targetW, targetH);

        // 1. Draw source image scaled to cover
        const scale = Math.max(targetW / naturalWidth, targetH / naturalHeight);
        const drawW = naturalWidth * scale;
        const drawH = naturalHeight * scale;
        const offsetX = (targetW - drawW) / 2;
        const offsetY = (targetH - drawH) / 2;

        ctx.drawImage(img, offsetX, offsetY, drawW, drawH);

        // 2. Extract pixel data for 3D depth and stereoscopic calculation
        const imgData = ctx.getImageData(0, 0, targetW, targetH);
        const data = imgData.data;

        // Depth displacement amount based on setting
        let depthShift = 3;
        if (settings.depth === 'medium') depthShift = 5;
        if (settings.depth === 'high') depthShift = 8;
        if (settings.depth === 'ultra') depthShift = 12;

        // Style tone adjustments
        let contrastMult = 1.08;
        let saturationBoost = 1.1;
        let warmTint = 0;
        let coolTint = 0;

        if (settings.style === 'cinematic_3d') {
          contrastMult = 1.2;
          coolTint = 12;
          warmTint = 8;
        } else if (settings.style === 'gaming_3d') {
          contrastMult = 1.25;
          saturationBoost = 1.25;
        } else if (settings.style === 'character_3d') {
          saturationBoost = 1.3;
          contrastMult = 1.12;
        } else if (settings.style === 'studio_3d') {
          contrastMult = 1.15;
          saturationBoost = 1.05;
        }

        // Center coordinates for radial lighting & depth
        const centerX = targetW / 2;
        const centerY = targetH * 0.45;
        const maxDist = Math.hypot(centerX, centerY);

        // Color & lighting matrix loop
        for (let y = 0; y < targetH; y++) {
          const dy = (y - centerY) / targetH;
          for (let x = 0; x < targetW; x++) {
            const idx = (y * targetW + x) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];

            const dx = (x - centerX) / targetW;
            const dist = Math.hypot(dx, dy);

            // Luminance
            const lum = 0.299 * r + 0.587 * g + 0.114 * b;

            // Subtle 3D vignette & depth falloff (darkens background, highlights subject)
            const vignette = 1.0 - Math.min(0.35, dist * 0.45);

            // Contrast enhancement
            let nr = ((r - 128) * contrastMult + 128) * vignette;
            let ng = ((g - 128) * contrastMult + 128) * vignette;
            let nb = ((b - 128) * contrastMult + 128) * vignette;

            // Saturation adjustment
            nr = lum + (nr - lum) * saturationBoost;
            ng = lum + (ng - lum) * saturationBoost;
            nb = lum + (nb - lum) * saturationBoost;

            // Lighting tint application
            if (settings.lighting === 'golden_hour') {
              nr += 18;
              ng += 8;
              nb -= 6;
            } else if (settings.lighting === 'cyberpunk_neon') {
              if (dx < 0) {
                // Cyan fill on left
                ng += 16 * (1 - Math.abs(dx));
                nb += 24 * (1 - Math.abs(dx));
              } else {
                // Magenta fill on right
                nr += 24 * (1 - Math.abs(dx));
                nb += 18 * (1 - Math.abs(dx));
              }
            } else if (settings.lighting === 'dramatic_rim') {
              // Edge rim boost
              if (dist > 0.35 && dist < 0.65) {
                nr += 20;
                ng += 22;
                nb += 28;
              }
            }

            data[idx] = Math.min(255, Math.max(0, nr + warmTint));
            data[idx + 1] = Math.min(255, Math.max(0, ng));
            data[idx + 2] = Math.min(255, Math.max(0, nb + coolTint));
          }
        }

        ctx.putImageData(imgData, 0, 0);

        // 3. Volumetric Rim & Specular 3D Lighting Layer
        const rimCanvas = document.createElement('canvas');
        rimCanvas.width = targetW;
        rimCanvas.height = targetH;
        const rimCtx = rimCanvas.getContext('2d');
        if (rimCtx) {
          // Subtle radial glow from top-right or center
          const grad = rimCtx.createRadialGradient(
            targetW * 0.75,
            targetH * 0.25,
            50,
            targetW * 0.5,
            targetH * 0.5,
            targetW * 0.75
          );

          if (settings.lighting === 'golden_hour') {
            grad.addColorStop(0, 'rgba(255, 190, 110, 0.25)');
            grad.addColorStop(0.5, 'rgba(255, 140, 50, 0.08)');
            grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          } else if (settings.lighting === 'cyberpunk_neon') {
            grad.addColorStop(0, 'rgba(0, 240, 255, 0.2)');
            grad.addColorStop(0.6, 'rgba(255, 0, 180, 0.1)');
            grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          } else {
            grad.addColorStop(0, 'rgba(255, 255, 255, 0.22)');
            grad.addColorStop(0.4, 'rgba(180, 200, 255, 0.08)');
            grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          }

          rimCtx.fillStyle = grad;
          rimCtx.fillRect(0, 0, targetW, targetH);

          // Blend rim glow with screen mode
          ctx.save();
          ctx.globalCompositeOperation = 'screen';
          ctx.drawImage(rimCanvas, 0, 0);
          ctx.restore();
        }

        // 4. Subtle 3D Chromatic Depth Layer
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = 0.06;
        ctx.drawImage(canvas, -depthShift, 0);
        ctx.drawImage(canvas, depthShift, 0);
        ctx.restore();

        // 5. Watermark stamp if enabled
        if (settings.watermark) {
          ctx.save();
          ctx.font = '600 18px "Plus Jakarta Sans", sans-serif';
          ctx.textAlign = 'right';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
          ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
          ctx.shadowBlur = 6;
          ctx.fillText('3D PICTURE STUDIO', targetW - 28, targetH - 28);
          ctx.restore();
        }

        resolve(canvas.toDataURL('image/png', 0.95));
      } catch (err) {
        reject(err);
      }
    }
  });
}
