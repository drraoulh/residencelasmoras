import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

await mkdir('public/images', { recursive: true });

const jobs = [
  {
    input: 'public/logo-lasmoras.jpeg',
    output: 'public/images/logo-ui.jpeg',
    width: 120,
    height: 120,
    quality: 82,
  },
  {
    input: 'src/assets/residencelasmoras1.jpeg',
    output: 'public/images/gallery-preview-1.jpeg',
    width: 480,
    height: 320,
    quality: 78,
  },
  {
    input: 'src/assets/residencelasmoras2.jpeg',
    output: 'public/images/gallery-preview-2.jpeg',
    width: 320,
    height: 240,
    quality: 78,
  },
];

for (const job of jobs) {
  await sharp(job.input)
    .resize(job.width, job.height, { fit: 'cover', position: 'centre' })
    .jpeg({ quality: job.quality, mozjpeg: true })
    .toFile(job.output);
  console.log(`✓ ${job.output}`);
}
