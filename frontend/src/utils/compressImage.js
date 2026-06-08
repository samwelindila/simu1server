/** Resize/compress phone photos before upload (keeps under server limit). */
export async function compressImageFile(
  file,
  { maxWidth = 1200, maxHeight = 1200, quality = 0.82, maxBytes = 650 * 1024 } = {}
) {
  if (!file.type?.startsWith('image/')) return file;
  if (file.size <= maxBytes && file.type === 'image/jpeg') return file;

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxWidth / bitmap.width, maxHeight / bitmap.height);
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  let q = quality;
  let blob = await canvasToBlob(canvas, 'image/jpeg', q);

  while (blob.size > maxBytes && q > 0.45) {
    q -= 0.08;
    blob = await canvasToBlob(canvas, 'image/jpeg', q);
  }

  const base = file.name.replace(/\.[^.]+$/, '') || 'photo';
  return new File([blob], `${base}.jpg`, { type: 'image/jpeg', lastModified: Date.now() });
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(b => (b ? resolve(b) : reject(new Error('Could not compress image'))), type, quality);
  });
}

export async function compressImageFiles(files) {
  const out = [];
  for (const file of files) {
    out.push(await compressImageFile(file));
  }
  return out;
}
