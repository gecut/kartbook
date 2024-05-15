import {untilEvent} from '@gecut/utilities/wait/wait.js';

export function getAverageColor(imageUrl: string): Promise<{r: number; g: number; b: number} | null> {
  return new Promise(async (resolve, reject) => {
    try {
      const image = new Image();
      image.crossOrigin = 'anonymous';
      image.src = imageUrl;

      await untilEvent(image, 'load');

      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;

      const context = canvas.getContext('2d');

      if (context) {
        context.drawImage(image, 0, 0);

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        let r = 0;
        let g = 0;
        let b = 0;
        let count = 0;

        for (let i = 0; i < data.length; i += 4) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count++;
        }

        const avgR = Math.round(r / count);
        const avgG = Math.round(g / count);
        const avgB = Math.round(b / count);

        resolve({r: avgR, g: avgG, b: avgB});
      }
      else {
        reject();
      }
    }
    catch (error) {
      reject(error);
    }
  });
}
