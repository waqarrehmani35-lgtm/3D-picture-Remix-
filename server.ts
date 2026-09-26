import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// 3D Generation Endpoint
app.post('/api/generate-3d', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      imageBase64,
      mimeType = 'image/jpeg',
      style = 'realistic_3d',
      depth = 'high',
      lighting = 'studio_softbox',
      shadow = 'soft_diffused',
      background = 'original_stylized',
      aspectRatio = '1:1',
      quality = 'hd',
      language = 'en',
    } = req.body;

    if (!imageBase64) {
      res.status(400).json({ error: 'Image data is required' });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.status(503).json({
        error: 'GEMINI_API_KEY is not configured on the server.',
        fallbackReady: true,
      });
      return;
    }

    // Clean base64 string
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');

    // Initialize Gemini client with aistudio-build telemetry
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    // Style prompt mappings
    const styleDescriptions: Record<string, string> = {
      realistic_3d:
        'Hyper-realistic 3D physical render style, volumetric depth, tactile 3D materials, subtle subsurface scattering, octane render quality, lifelike depth perception.',
      cinematic_3d:
        'Cinematic 3D blockbuster movie aesthetic, rich dynamic range, atmospheric depth, cinematic rim light, subtle anamorphic lens character, high production value.',
      portrait_3d:
        'High-end 3D studio portrait headshot, silky depth of field, studio key lighting, immaculate skin subsurface scattering, premium 3D magazine cover finish.',
      character_3d:
        'Polished 3D character animation style (Pixar / high-end feature film CGI), smooth dimensional bevels, vibrant dimensional lighting, rich 3D shading.',
      gaming_3d:
        'Next-gen AAA Unreal Engine 5 real-time 3D character model, crisp raytraced specular highlights, ambient occlusion, high polygon fidelity.',
      studio_3d:
        'High-fashion 3D photography studio aesthetic, floating dimensional light sources, clean cyclorama depth, pristine edge highlights, minimal clean 3D finish.',
    };

    const lightingDescriptions: Record<string, string> = {
      studio_softbox: 'balanced dual softbox studio lighting with soft fill and natural wrap-around illumination',
      dramatic_rim: 'sharp glowing 3D rim light tracing the subject silhouette against the background',
      cyberpunk_neon: 'stylized dual-tone cyan and magenta volumetric neon accent lighting',
      golden_hour: 'warm low-angle golden hour sunlight with dimensional amber highlights and soft warm shadows',
      volumetric_sun: 'subtle volumetric sunbeams casting natural 3D light shafts and gentle air dust depth',
    };

    const backgroundDescriptions: Record<string, string> = {
      original_stylized: 'keep the original background but render it with soft photographic 3D bokeh depth blur',
      studio_backdrop: 'place in an elegant seamless 3D photo studio cyclorama backdrop with subtle spotlight gradient',
      cyber_holo: 'place in a dark futuristic 3D studio with holographic ambient lighting',
      architectural_minimal: 'place in a warm minimalist modern architectural space with soft indirect lighting',
      dark_bokeh: 'place in a deep dark studio backdrop with beautiful blurred 3D circular bokeh lights',
    };

    const selectedStyle = styleDescriptions[style] || styleDescriptions.realistic_3d;
    const selectedLighting = lightingDescriptions[lighting] || lightingDescriptions.studio_softbox;
    const selectedBg = backgroundDescriptions[background] || backgroundDescriptions.original_stylized;

    // Strict face-preservation rule prompt
    const prompt = `Transform this photo into an exceptional 3D-style masterpiece.

VISUAL STYLE: ${selectedStyle}
LIGHTING: ${selectedLighting}
SHADOWS: ${shadow} enhancement with natural depth gradient and contact ambient occlusion.
BACKGROUND: ${selectedBg}
DEPTH LEVEL: ${depth} 3D depth with pronounced stereoscopic relief.
TARGET QUALITY: ${quality} clarity.

CRITICAL FACE-PRESERVATION REQUIREMENT (HIGHEST PRIORITY):
- Strictly preserve the subject's exact facial identity, facial geometry, facial proportions, skin tone, eye shape, nose shape, lip shape, hair texture, and natural facial expression.
- Do NOT morph, caricature, cartoonize, or replace the person's face.
- The resulting 3D image MUST be immediately and unmistakable recognizable as the exact same person from the input photo.
- Keep all recognizable individual features completely intact while adding 3D lighting, dimensional volume, and depth.`;

    // Map aspect ratios to supported values ("1:1", "3:4", "4:3", "9:16", "16:9")
    let targetAspectRatio = '1:1';
    if (aspectRatio === '4:5' || aspectRatio === '3:4') targetAspectRatio = '3:4';
    else if (aspectRatio === '9:16') targetAspectRatio = '9:16';
    else if (aspectRatio === '16:9') targetAspectRatio = '16:9';

    // Model selection: 'gemini-3.1-flash-lite-image' for image transformation
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: targetAspectRatio as '1:1' | '3:4' | '4:3' | '9:16' | '16:9',
        },
      },
    });

    let generatedImageUrl: string | null = null;
    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
      const parts = candidates[0].content?.parts || [];
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          const outMime = part.inlineData.mimeType || 'image/png';
          generatedImageUrl = `data:${outMime};base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (generatedImageUrl) {
      res.json({
        success: true,
        imageUrl: generatedImageUrl,
        style,
        depth,
        timestamp: Date.now(),
      });
    } else {
      res.status(502).json({
        error: 'The AI model completed without returning an image part. Please try again.',
        fallbackReady: true,
      });
    }
  } catch (err: any) {
    console.error('Error in /api/generate-3d:', err);
    res.status(500).json({
      error: err?.message || 'Failed to process 3D image',
      fallbackReady: true,
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
