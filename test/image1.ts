import '/src/style.css'
import { Image } from '../src/image';

class Image1 {

  constructor() {
    const image: Image = new Image(document.querySelector<HTMLCanvasElement>('#renderCanvas')!);
    image.createSynchronously((x: number, y: number, width: number, height: number) => {
      const red = x / width;
      const green = y / height;
      const blue = 0.2;
      const alpha = 0.5;
      return [red, green, blue, alpha];
    });
  }

}

new Image1();