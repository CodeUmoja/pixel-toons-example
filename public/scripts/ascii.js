const canvas = document.getElementById('canvas');
const fileInput = document.getElementById('get-file');
const asciiImage = document.getElementById('ascii');
const button = document.getElementById('ready');
const charColor = document.getElementById('character');
const background = document.getElementById('back');
const chooseInput = document.getElementById('choose');

const context = canvas.getContext('2d');

let maxWidth = 40;
let maxHeight = 40;

chooseInput.onchange = (e) => {
  maxHeight = e.target.value;
  maxWidth = e.target.value;
};

const resizeImage = (width, height) => {
  
  const ratio = 2;
  const rectifiedWidth = ratio * width;

  if (height > maxHeight) {
    const changedWidth = Math.floor(rectifiedWidth * maxHeight / height);
    return [changedWidth, maxHeight];
  }

  if (width > maxWidth) {
    const changedHeight = Math.floor(height * maxWidth / rectifiedWidth);
    return [maxWidth, changedHeight];
  }

  return [rectifiedWidth, height];
};

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
const charsLen = charsList.length;

const char = (grayscale) => charsList[Math.floor(charsLen * grayscale / 255)];

const createAscii = (grayscale, width) => {

  const imageChars = grayscale.reduce((ascii, pxValue, index) => {
    ascii += char(pxValue);
    if ((index + 1) % width === 0) ascii += '\n';

    return ascii;
  }, '');

  asciiImage.textContent = imageChars;
};

charColor.onchange = (e) => asciiImage.style.color = e.target.value;

fileInput.onchange = (event) => {

  button.onclick = (e) => {
    e.preventDefault();

    const file = event.target.files[0];

    const reader = new FileReader();
    reader.onload = (e) => {
      const image = new Image();
      image.onload = () => {

        const [width, height] = resizeImage(image.width, image.height);

        canvas.width = width;
        canvas.height = height;

        context.drawImage(image, 0, 0, width, height);
        const grayscale = toGrayScale(context, width, height);

        createAscii(grayscale, width);
      };

      image.src = e.target.result;
    };

    reader.readAsDataURL(file);
  };
};
