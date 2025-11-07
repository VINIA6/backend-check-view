import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

export class StreamVideoController {
  async handle(request: Request, response: Response): Promise<void> {
    const { filename } = request.params;

    // Caminho do arquivo
    const videoPath = path.resolve(__dirname, '../../../uploads/videos', filename);

    // Verificar se o arquivo existe
    if (!fs.existsSync(videoPath)) {
      response.status(404).json({ message: 'Video not found' });
      return;
    }

    // Obter informações do arquivo
    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = request.headers.range;

    if (range) {
      // Streaming com range (para seek no vídeo)
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(videoPath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      };

      response.writeHead(206, head);
      file.pipe(response);
    } else {
      // Streaming completo
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      };
      response.writeHead(200, head);
      fs.createReadStream(videoPath).pipe(response);
    }
  }
}

