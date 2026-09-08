import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from 'src/prisma/prisma.service';
import sharp from 'sharp';

@Processor('photo-processing')
export class NoteProcessor extends WorkerHost {
  constructor(
    private readonly prismaService: PrismaService,
  ) {
    super();
  }

  async process(job: Job) {
    if (job.name === 'process-photo') {
      const { noteId, filePath } = job.data;

      console.log('Job received:', job.name);
      console.log('Original photo:', filePath);

      // 1. Process image
      const processedPath = await processImage(filePath);

      console.log('Processed photo:', processedPath);

      // 2. Save processed image path in DB
      await this.prismaService.note.update({
        where: {
          id: noteId,
        },
        data: {
          image: processedPath,
        },
      });

      console.log(`Note ${noteId} updated successfully`);
    }
  }
}

async function processImage(filePath: string) {
  const processedPath = `${filePath}-processed.jpg`;

  await sharp(filePath)
    .resize(300, 300)
    .jpeg()
    .toFile(processedPath);

  return processedPath;
}