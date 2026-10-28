const cache = new Map<string, Promise<HTMLImageElement>>();

/** Memuat gambar dari data URL dan menyimpannya di cache kecil agar render ulang cepat. */
export function loadImage(src: string): Promise<HTMLImageElement> {
  let p = cache.get(src);
  if (!p) {
    p = new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Gagal memuat gambar.'));
      img.src = src;
    });
    if (cache.size >= 24) {
      const first = cache.keys().next().value;
      if (first !== undefined) cache.delete(first);
    }
    cache.set(src, p);
  }
  return p;
}

interface Decoded {
  source: CanvasImageSource;
  w: number;
  h: number;
  release: () => void;
}

async function decode(file: File): Promise<Decoded> {
  try {
    const bmp = await createImageBitmap(file, { imageOrientation: 'from-image' });
    return { source: bmp, w: bmp.width, h: bmp.height, release: () => bmp.close() };
  } catch {
    const url = URL.createObjectURL(file);
    try {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const i = new Image();
        i.onload = () => resolve(i);
        i.onerror = () => reject(new Error('Berkas bukan gambar yang valid.'));
        i.src = url;
      });
      return { source: img, w: img.naturalWidth, h: img.naturalHeight, release: () => URL.revokeObjectURL(url) };
    } catch (e) {
      URL.revokeObjectURL(url);
      throw e;
    }
  }
}

/** Mengubah berkas gambar dari galeri menjadi foto JPEG (data URL), diperkecil agar hemat memori. */
export async function fileToPhoto(file: File, maxSide = 1600): Promise<string> {
  const d = await decode(file);
  try {
    const k = Math.min(1, maxSide / Math.max(d.w, d.h));
    const c = document.createElement('canvas');
    c.width = Math.max(1, Math.round(d.w * k));
    c.height = Math.max(1, Math.round(d.h * k));
    const ctx = c.getContext('2d');
    if (!ctx) throw new Error('Canvas tidak didukung di browser ini.');
    ctx.drawImage(d.source, 0, 0, c.width, c.height);
    return c.toDataURL('image/jpeg', 0.92);
  } finally {
    d.release();
  }
}
