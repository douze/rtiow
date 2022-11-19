import './style.css'
import { Image } from './image';

class App {

  constructor() {
    const image: Image = new Image(document.querySelector<HTMLCanvasElement>('#renderCanvas')!);
    image.createSynchronously((x: number, y: number, width: number, height: number) => {
      const red = x / width;
      const green = y / height;
      const blue = 0.2;
      const alpha = 1.0;
      return [red, green, blue, alpha];
    });
  }

}
new App();
