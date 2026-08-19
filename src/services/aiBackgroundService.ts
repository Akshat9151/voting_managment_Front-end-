export interface GenerateAIBackgroundParams {
  prompt: string;
  width?: number;
  height?: number;
  seed?: number;
}

/**
 * Generates an AI background using Pollinations.ai (free, no API key).
 * Returns a base64 Data URL to avoid CORS tainted canvas issues during export.
 */
export async function generateAIBackground({
  prompt,
  width = 600,
  height = 848,
  seed
}: GenerateAIBackgroundParams): Promise<string> {
  // Append negative prompt guidance so the model doesn't render mangled Hindi/English text
  const cleanPrompt = `${prompt.trim()}, no text, no words, no letters, plain decorative background, clean abstract election backdrop, 8k wallpaper`;

  // Scale down dimensions if needed to stay within fast generation limits
  const targetW = Math.min(1200, Math.max(300, width));
  const targetH = Math.min(1200, Math.max(300, height));
  const randomSeed = seed ?? Math.floor(Math.random() * 1000000);

  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(
    cleanPrompt
  )}?width=${targetW}&height=${targetH}&nologo=true&seed=${randomSeed}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to generate AI background: ${response.statusText}`);
  }

  const blob = await response.blob();

  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert image blob to Data URL'));
      }
    };
    reader.onerror = () => reject(new Error('FileReader error during background conversion'));
    reader.readAsDataURL(blob);
  });
}
