const textInput = document.getElementById("textColor");
const bgInput = document.getElementById("bgColor");
const sampleText = document.getElementById("sampleText");

const aaNormal = document.getElementById("aaNormal");
const aaaNormal = document.getElementById("aaaNormal");
const aaLarge = document.getElementById("aaLarge");
const aaaLarge = document.getElementById("aaaLarge");

const textPreview = document.getElementById("textColorPreview");
const bgPreview = document.getElementById("bgColorPreview");

const reverseBtn = document.getElementById("reverseColors");



const textRgbSliders = {
  r: document.getElementById("textR"),
  g: document.getElementById("textG"),
  b: document.getElementById("textB"),
};

const bgRgbSliders = {
  r: document.getElementById("bgR"),
  g: document.getElementById("bgG"),
  b: document.getElementById("bgB"),
};

const textHslSliders = {
  h: document.getElementById("textH"),
  s: document.getElementById("textS"),
  l: document.getElementById("textL"),
};

const bgHslSliders = {
  h: document.getElementById("bgH"),
  s: document.getElementById("bgS"),
  l: document.getElementById("bgL"),
};

const rgbModeBtn = document.getElementById("rgbMode");
const hslModeBtn = document.getElementById("hslMode");

function hexToRgb(hex) {
  let r = 0, g = 0, b = 0;
  if (hex.length === 7) {
    r = parseInt(hex.substr(1, 2), 16);
    g = parseInt(hex.substr(3, 2), 16);
    b = parseInt(hex.substr(5, 2), 16);
  }
  return { r, g, b };
}

function rgbToHex(r, g, b) {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
}

function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;

  let c = (1 - Math.abs(2 * l - 1)) * s;
  let x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  let m = l - c / 2;

  let [r, g, b] = [0, 0, 0];

  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return rgbToHex(r, g, b);
}

function getLuminance({ r, g, b }) {
  [r, g, b] = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928
      ? v / 12.92
      : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function getContrast(rgb1, rgb2) {
  const L1 = getLuminance(rgb1);
  const L2 = getLuminance(rgb2);
  return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
}

function updateResults() {
  const textRgb = hexToRgb(textInput.value);
  const bgRgb = hexToRgb(bgInput.value);
  const contrast = getContrast(textRgb, bgRgb);

  sampleText.style.color = textInput.value;
  sampleText.style.backgroundColor = bgInput.value;

  textPreview.style.backgroundColor = textInput.value;
  bgPreview.style.backgroundColor = bgInput.value;

  updateStatus(aaNormal, contrast >= 4.5);
  updateStatus(aaaNormal, contrast >= 7);
  updateStatus(aaLarge, contrast >= 3);
  updateStatus(aaaLarge, contrast >= 4.5);


  document.getElementById("contrastRatio").textContent = `${contrast.toFixed(2)}`;
}

function updateStatus(el, pass) {
  el.textContent = pass ? "Pass" : "Fail";
  el.className = "status" + (pass ? "" : " fail");
}

function setRgbSliders(rgb, sliders) {
  sliders.r.value = rgb.r;
  sliders.g.value = rgb.g;
  sliders.b.value = rgb.b;
}

function updateFromRgb(sliders, input) {
  const r = parseInt(sliders.r.value);
  const g = parseInt(sliders.g.value);
  const b = parseInt(sliders.b.value);
  input.value = rgbToHex(r, g, b);
  updateResults();
}

function setHslSliders(hex, sliders) {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  sliders.h.value = Math.round(hsl.h);
  sliders.s.value = Math.round(hsl.s);
  sliders.l.value = Math.round(hsl.l);
}

function rgbToHsl(r, g, b) {
  (r /= 255), (g /= 255), (b /= 255);
  let max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;

  if (max === min) h = s = 0;
  else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
        break;
      case g:
        h = ((b - r) / d + 2) * 60;
        break;
      case b:
        h = ((r - g) / d + 4) * 60;
        break;
    }
  }

  return { h, s: s * 100, l: l * 100 };
}

function updateFromHsl(sliders, input) {
  const h = parseInt(sliders.h.value);
  const s = parseInt(sliders.s.value);
  const l = parseInt(sliders.l.value);
  input.value = hslToHex(h, s, l);
  updateResults();
}

reverseBtn.addEventListener("click", () => {
  const temp = textInput.value;
  textInput.value = bgInput.value;
  bgInput.value = temp;
  updateResults();
});

textInput.addEventListener("input", () => {
  setRgbSliders(hexToRgb(textInput.value), textRgbSliders);
  setHslSliders(textInput.value, textHslSliders);
  updateResults();
});

bgInput.addEventListener("input", () => {
  setRgbSliders(hexToRgb(bgInput.value), bgRgbSliders);
  setHslSliders(bgInput.value, bgHslSliders);
  updateResults();
});

Object.values(textRgbSliders).forEach((slider) =>
  slider.addEventListener("input", () =>
    updateFromRgb(textRgbSliders, textInput)
  )
);
Object.values(bgRgbSliders).forEach((slider) =>
  slider.addEventListener("input", () =>
    updateFromRgb(bgRgbSliders, bgInput)
  )
);
Object.values(textHslSliders).forEach((slider) =>
  slider.addEventListener("input", () =>
    updateFromHsl(textHslSliders, textInput)
  )
);
Object.values(bgHslSliders).forEach((slider) =>
  slider.addEventListener("input", () =>
    updateFromHsl(bgHslSliders, bgInput)
  )
);

rgbModeBtn.addEventListener("click", () => {
  rgbModeBtn.classList.add("active");
  hslModeBtn.classList.remove("active");
  document.getElementById("textRgbSliders").classList.remove("hidden");
  document.getElementById("bgRgbSliders").classList.remove("hidden");
  document.getElementById("textHslSliders").classList.add("hidden");
  document.getElementById("bgHslSliders").classList.add("hidden");
});

hslModeBtn.addEventListener("click", () => {
  hslModeBtn.classList.add("active");
  rgbModeBtn.classList.remove("active");
  document.getElementById("textRgbSliders").classList.add("hidden");
  document.getElementById("bgRgbSliders").classList.add("hidden");
  document.getElementById("textHslSliders").classList.remove("hidden");
  document.getElementById("bgHslSliders").classList.remove("hidden");
});

updateResults();
setRgbSliders(hexToRgb(textInput.value), textRgbSliders);
setRgbSliders(hexToRgb(bgInput.value), bgRgbSliders);
setHslSliders(textInput.value, textHslSliders);
setHslSliders(bgInput.value, bgHslSliders);
