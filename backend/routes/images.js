import express from 'express';
import { openImageStream } from '../utils/imageStorage.js';

const router = express.Router();

router.get('/:id', async (req, res) => {
  try {
    const stream = openImageStream(req.params.id);
    if (!stream) {
      return res.status(503).json({ message: 'Image storage unavailable' });
    }

    stream.on('file', (file) => {
      if (file.contentType) res.set('Content-Type', file.contentType);
      res.set('Cache-Control', 'public, max-age=604800');
    });

    stream.on('error', () => {
      if (!res.headersSent) res.status(404).json({ message: 'Image not found' });
    });

    stream.pipe(res);
  } catch {
    res.status(404).json({ message: 'Image not found' });
  }
});

export default router;
