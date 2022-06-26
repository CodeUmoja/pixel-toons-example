const canvas = document.getElementById('canvas');
const fileInput = document.getElementById('get-file');
const asciiImage = document.getElementById('ascii');
const context = canvas.getContext('2d');

const toGrayScale = (context, width, height) => {
  const imageData = context.getImageData(0, 0, width, height);
  const rgb = [];

  for (let i = 0; i < imageData.data.length; i += 4) {
    const r = imageData.data[i] * 0.2126;
    const g = imageData.data[i + 1] * 0.7152;
    const b = imageData.data[i + 2] * 0.0722;

    const color = r + g + b;
    imageData.data[i] = imageData.data[i + 1] = imageData.data[i + 2] = color;

    rgb.push(color);
  }
  context.putImageData(imageData, 0, 0);
  return rgb;
};

const charsList = ['@', '#', '&', '%', '?', '*', '+', ';', ':', ',', '.', ' '];

const char = (grayscale) => charsList[Math.floor((charsList.length - 1) * grayscale / 255)];

const createAscii = (grayscale, width) => {

  const imageChars = grayscale.reduce((ascii, pxValue, index) => {
    ascii += char(pxValue);
    if (index % width === 0) ascii += '\n';

    return ascii;
  }, '');

  asciiImage.textContent = imageChars;
};

fileInput.onchange = (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = (e) => {
    const image = new Image();

    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      context.drawImage(image, 0, 0);

      const grayscale = toGrayScale(context, image.width, image.height);
      createAscii(grayscale, image.width);
    };

    image.src = e.target.result;
    };
    
  reader.readAsDataURL(file);
};
