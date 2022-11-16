import './style.css'

class App {

  constructor() {
    const canvas = document.querySelector<HTMLCanvasElement>('#renderCanvas')!;
    const ctx = canvas.getContext("2d")!;
    const width = canvas.width;
    const height = canvas.height;

    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {

      var x = (i / 4) % width;
      var y = Math.floor((i / 4) / width);

      var red = x / width * 255;
      var green = y / height * 255;
      var blue = 0.2 * 255;

      data[i] = red;
      data[i + 1] = green;
      data[i + 2] = blue;
      data[i + 3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);

    // flip the canvas
    ctx.transform(1, 0, 0, -1, 0, canvas.height)
    ctx.globalCompositeOperation = "copy"; // if you have transparent pixels
    ctx.drawImage(ctx.canvas, 0, 0);
    ctx.globalCompositeOperation = "source-over"; // reset to default
  }

}
new App();
