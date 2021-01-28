let upload = document.getElementById("upload");
let download = document.getElementById("download");
let canvas = document.getElementById("preview");
let ctx = canvas.getContext("2d");

let drawImg = () => {
  if (!upload.files || !upload.files[0]) return;
  let fileReader = new FileReader();
  fileReader.onload = (e) => {
    let newImg = new Image();
    newImg.onload = () => {
      canvas.height = 500;
      canvas.width = (canvas.height / newImg.height) * newImg.width;
      ctx.drawImage(newImg, 0, 0, canvas.width, canvas.height);
      drawGrayscale();
      drawText();
    };
    newImg.src = e.target.result;
  };
  fileReader.readAsDataURL(upload.files[0]);
};
let drawGrayscale = () => {
  let newImgData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  let pixels = newImgData.data;
  for (var i = 0; i < pixels.length; i += 4) {
    let lightness = parseInt((pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3);
    pixels[i] = lightness;
    pixels[i + 1] = lightness;
    pixels[i + 2] = lightness;
  }
  ctx.putImageData(newImgData, 0, 0);
};
let drawText = () => {
  let watermark = document.getElementById("watermark").value;
  let fontsize = parseInt(document.getElementById("fontsize").value);
  let fillSize = canvas.width + canvas.height;
  ctx.font = fontsize + "px monospace"; // 字級 字體
  ctx.textBaseline = "top"; // 文字對齊的基準線
  ctx.rotate(Math.PI * -0.25);
  ctx.translate(fillSize / -2, 0);
  ctx.globalAlpha = 0.3;
  let watermarkWidth = ctx.measureText(watermark).width;
  let column = Math.ceil(fillSize / watermarkWidth);
  let row = Math.ceil(fillSize / fontsize);
  for (i = 0; i < row; i++) {
    for (j = 0; j < column; j++) {
      ctx.fillText(watermark, j * (watermarkWidth + 10), i * (fontsize + 10));
    }
  }
};
let getUrl = () => {
  download.download = Date.now() + ".png";
  download.href = canvas.toDataURL();
};
