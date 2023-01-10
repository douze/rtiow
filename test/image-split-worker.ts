function random_index(size) { return Math.floor(Math.random() * size); }
function random_int(max) { return Math.floor(Math.random() * max); }
function random_color() { return [random_int(255), random_int(255), random_int(255), 255] };

function mySlowFunction(baseNumber) {
	let result = 0;	
	for (var i = Math.pow(baseNumber, 7); i >= 0; i--) {		
		result += Math.atan(i) * Math.tan(i);
	};
}

self.onmessage = (evt) => {
  const { type, color, width, height, positions, data, x, y } = evt.data;

  if (type == 'single-array') {
    let j = 0;
    while (j < width * height * 4) {
      mySlowFunction(2);
      const randomColor = random_color();
      data[j++] = randomColor[0];
      data[j++] = randomColor[1];
      data[j++] = randomColor[2];
      data[j++] = randomColor[3];
    }
    self.postMessage({ type: 'end', out_array: data });
  } else if (type == 'two-arrays') {
    let j = 0;
    while (j < width * height * 4) {
      mySlowFunction(2);
      const randomColor = random_color();
      data[j++] = randomColor[0];
      data[j++] = randomColor[1];
      data[j++] = randomColor[2];
      data[j++] = randomColor[3];
    }
    self.postMessage({ type: 'end', out_array: data });
  } else if (type == 'var-arrays') {
    let j = 0;
    while (j < width * height * 4) {
      mySlowFunction(2);
      const randomColor = random_color();
      data[j++] = randomColor[0];
      data[j++] = randomColor[1];
      data[j++] = randomColor[2];
      data[j++] = randomColor[3];
    }
    self.postMessage({ type: 'end', out_array: data });
  } else if (type == 'all-split-2') {
    const output = new ImageData(width, height);
    const data = new Uint8ClampedArray(width * height * 4);
    let j = 0;
    while (j < width * height * 4) {
      data[j++] = color[0];
      data[j++] = color[1];
      data[j++] = color[2];
      data[j++] = color[3];
      output.data.set(data);
    }
    self.postMessage({ type: 'compute', output });
    self.postMessage({ type: 'end' });
  } else if (type == 'all-split-4') {
    const output = new ImageData(width, height);
    const data = new Uint8ClampedArray(width * height * 4);
    let j = 0;
    while (j < width * height * 4) {
      data[j++] = color[0];
      data[j++] = color[1];
      data[j++] = color[2];
      data[j++] = color[3];
      output.data.set(data);
    }
    self.postMessage({ type: 'compute', output });
    self.postMessage({ type: 'end' });
  } else if (type == 'all-split-var') {
    const output = new ImageData(width, height);
    const data = new Uint8ClampedArray(width * height * 4);
    let j = 0;
    while (j < width * height * 4) {
      data[j++] = color[0];
      data[j++] = color[1];
      data[j++] = color[2];
      data[j++] = color[3];
      output.data.set(data);
    }
    self.postMessage({ type: 'compute', output });
    self.postMessage({ type: 'end' });
  } else if (type == 'all-split-var-buffer') {
    // const output = new ImageData(width, height);
    // const data = new Uint8ClampedArray(width * height * 4);
    const index = (x + y * width) * 4;
    // console.log('index=' + index);
    let j = 0;//index;
    while (j < width * height * 4) {
      data[j++] = color[0];
      data[j++] = color[1];
      data[j++] = color[2];
      data[j++] = color[3];
      // output.data.set(data);
    }
    self.postMessage({ type: 'compute', data }, [data.buffer]);
    self.postMessage({ type: 'end' });
  } else if (type == 'single-array') {
    // const output = new ImageData(width, height);
    // const data = new Uint8ClampedArray(width * height * 4);
    const index = (x + y * width) * 4;
    // console.log('index=' + index);
    let j = 0;//index;
    mySlowFunction(10);
    while (j < width * height * 4) {
      const color = random_color();
      data[j++] = random_int(255);
      data[j++] = random_int(255);
      data[j++] = random_int(255);
      data[j++] = 255;
      // console.log(random_color());
      // output.data.set(data);
    }

    self.postMessage({ type: 'end', out_array: data });
    // self.postMessage({ type: 'end' });
  }

};


    // for (let j = 0; j < this.height; j++) {
    //   for (let i = 0; i < this.width; i++) {
    //     const index = (i + j * this.width) * 4;
    //     const colors = fillFunction(i, this.height - j, this.width, this.height);
    //     colors.map((color, offset) => data[index + offset] = color);
    //   }
    // }