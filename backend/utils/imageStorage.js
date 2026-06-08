/** Max raw file size before base64 encoding (~700KB keeps each product doc well under MongoDB limits). */
const MAX_BYTES = 700 * 1024;

function safeName(originalname) {
  return (originalname || 'image.jpg').replace(/\s/g, '_').replace(/[^\w.-]/g, '') || 'image.jpg';
}

/** Store image bytes in MongoDB as a data URL — survives Render redeploys (no disk). */
export async function storeImage(buffer, originalname, mimetype = 'image/jpeg') {
  if (!buffer?.length) {
    throw new Error('Empty image file');
  }
  if (buffer.length > MAX_BYTES) {
    throw new Error(`"${safeName(originalname)}" is too large. Max ${Math.round(MAX_BYTES / 1024)}KB per image.`);
  }
  const type = mimetype?.startsWith('image/') ? mimetype : 'image/jpeg';
  return `data:${type};base64,${buffer.toString('base64')}`;
}

export async function saveUploadedFiles(files) {
  if (!files?.length) return [];
  const urls = [];
  for (const file of files) {
    urls.push(await storeImage(file.buffer, file.originalname, file.mimetype));
  }
  return urls;
}

export function parseFormArray(value) {
  if (value == null || value === '') return [];
  return Array.isArray(value) ? value.filter(Boolean) : [value];
}

export function normalizeImages(images) {
  if (!images) return [];
  if (Array.isArray(images)) return images.filter(Boolean);
  if (typeof images === 'string') {
    if (images.startsWith('data:') || images.startsWith('/')) return [images];
    return images.split(',').map(s => s.trim()).filter(Boolean);
  }
  return [];
}

/** List view: first image only + total count (avoids huge JSON payloads). */
export function productForList(product) {
  const doc = product.toObject ? product.toObject() : { ...product };
  const all = normalizeImages(doc.images);
  return {
    ...doc,
    imageCount: all.length,
    images: all.length ? [all[0]] : [],
  };
}

/** True for legacy paths whose files were lost on Render/local disk. */
export function isBrokenLegacyPath(path) {
  return typeof path === 'string' && path.startsWith('/uploads/');
}
