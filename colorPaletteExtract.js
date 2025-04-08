const upload = document.getElementById('upload');
const img = document.getElementById('img');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const paletteContainer = document.getElementById('palette');
const cssVars = document.getElementById('css-vars');
const increase = document.getElementById('increase');
const decrease = document.getElementById('decrease');
const colorCountDisplay = document.getElementById('colorCount');
const randomizeBtn = document.getElementById('randomize');

let colorCount = 5;

function clampColorCount() {
  increase.disabled = colorCount >= 10;
  decrease.disabled = colorCount <= 2;
  colorCountDisplay.textContent = colorCount;
}

clampColorCount();

increase.addEventListener('click', () => {
  if (colorCount < 10) {
    colorCount++;
    extractColors();
    clampColorCount();
  }
});

decrease.addEventListener('click', () => {
  if (colorCount > 2) {
    colorCount--;
    extractColors();
    clampColorCount();
  }
});

upload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }
});

function loadImageFromURL() {
  const url = document.getElementById('urlInput').value;
  img.src = url;
}

img.onload = () => {
  extractColors();
};

function extractColors() {
  const width = canvas.width = img.naturalWidth;
  const height = canvas.height = img.naturalHeight;
  ctx.drawImage(img, 0, 0);

  const colors = [];
  for (let i = 0; i < colorCount; i++) {
    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);
    const [r, g, b] = ctx.getImageData(x, y, 1, 1).data;
    colors.push(`rgb(${r}, ${g}, ${b})`);
  }

  showColors(colors);
}

function showColors(colors) {
  paletteContainer.innerHTML = '';
  let cssText = ':root {\n';

  colors.forEach((color, i) => {
    const div = document.createElement('div');
    div.className = 'color-box';
    div.style.backgroundColor = color;
    paletteContainer.appendChild(div);
    cssText += `  --color-${i + 1}: ${color};\n`;
  });

  cssText += '}';
  cssVars.textContent = cssText;
}

randomizeBtn.addEventListener('click', extractColors);

function copyCSS() {
  navigator.clipboard.writeText(cssVars.textContent);
  alert('CSS variables copied!');
}
