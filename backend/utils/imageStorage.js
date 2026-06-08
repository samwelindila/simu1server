import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '../uploads');

fs.mkdirSync(uploadsDir, { recursive: true });

function gridBucket() {
  if (mongoose.connection.readyState !== 1) return null;
  return new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: 'productImages',
  });
}

function safeName(originalname) {
  return (originalname || 'image.jpg').replace(/\s/g, '_').replace(/[^\w.-]/g, '') || 'image.jpg';
}

export async function storeImage(buffer, originalname, mimetype = 'image/jpeg') {
  const bucket = gridBucket();
  if (bucket) {
    const filename = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}-${safeName(originalname)}`;
    const id = await new Promise((resolve, reject) => {
      const stream = bucket.openUploadStream(filename, { contentType: mimetype });
      stream.on('finish', () => resolve(stream.id.toString()));
      stream.on('error', reject);
      stream.end(buffer);
    });
    return `/api/images/${id}`;
  }

  const filename = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}-${safeName(originalname)}`;
  fs.writeFileSync(path.join(uploadsDir, filename), buffer);
  return `/uploads/${filename}`;
}

export async function saveUploadedFiles(files) {
  if (!files?.length) return [];
  const urls = [];
  for (const file of files) {
    urls.push(await storeImage(file.buffer, file.originalname, file.mimetype));
  }
  return urls;
}

export function openImageStream(id) {
  const bucket = gridBucket();
  if (!bucket) return null;
  return bucket.openDownloadStream(new mongoose.Types.ObjectId(id));
}

export function parseFormArray(value) {
  if (value == null || value === '') return [];
  return Array.isArray(value) ? value.filter(Boolean) : [value];
}
