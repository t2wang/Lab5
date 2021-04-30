// script.js

const img = new Image(); // used to load image from <input> and draw to canvas

const file = document.getElementById('image-input');
const canvas = document.getElementById('user-image');
const ctx = canvas.getContext('2d');
const text = document.getElementById('generate-meme');
const clear = document.querySelector('button[type="reset"]');
const read = document.querySelector('button[type="button"]');
const volume = document.querySelector('input[type="range"]');
const synth = window.speechSynthesis;
const voice = new SpeechSynthesisUtterance();
const icon = document.querySelector('img');

const textTop = document.getElementById('text-top');
const textBottom = document.getElementById('text-bottom');


file.addEventListener('change', () => {
  img.src = URL.createObjectURL(file.files[0]);
  //files.getElementsByTagName('input')[0].src;

})

// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {
  // TODO
  clear.disabled = true;
  read.disabled = true;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, 400, 400);

  var startX = canvas.width / 2;
  var startY = canvas.height / 2;

  if(img.height / img.width > 1){
    img.height = canvas.height;
    img.width = canvas.width * (canvas.width / img.width);
    startX = startX - img.width / 2;
    startY = startY - img.height / 2;
    ctx.drawImage(img, startX, startY, img.width, img.height);
  }else if(img.height / img.width < 1){
    img.height = canvas.height * (canvas.height / img.height);
    img.width = canvas.width;
    startX = startX - img.width / 2;
    startY = startY - img.height / 2;
    ctx.drawImage(img, startX, startY, img.width, img.height);
  }else{
    img.height = canvas.height;
    img.width = canvas.width;
    startX = startX - img.width / 2;
    startY = startY - img.height / 2;
    ctx.drawImage(img, startX, startY, img.width, img.height);
  }

  // Some helpful tips:
  // - Fill the whole Canvas with black first to add borders on non-square images, then draw on top
  // - Clear the form when a new image is selected
  // - If you draw the image to canvas here, it will update as soon as a new image is selected
});

text.addEventListener('submit', function(e) {
  e.preventDefault();
  clear.disabled = false;
  read.disabled = false;
  ctx.font = "25px Arial";
  ctx.fillStyle = 'white';
  ctx.textAlign = "center";
  ctx.fillText(textTop.value, 200, 20);
  ctx.fillText(textBottom.value, 200, 390);
},false);

clear.addEventListener('click', ()=> {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

read.addEventListener('click', ()=> {
  const speech = textTop.value + " " + textBottom.value;
  voice.text = speech;
  synth.speak(voice);
});

volume.addEventListener('input', ()=>{
  voice.volume = volume.value / 100;
  if(volume.value >= 67 && volume.value <= 100){
    icon.src = "icons/volume-level-3.svg";
    icon.alt = "Volume Level 3";
  }else if(volume.value >= 34 && volume.value <= 66){
    icon.src = "icons/volume-level-2.svg";
    icon.alt = "Volume Level 2";
  }else if(volume.value >= 1 && volume.value <= 33){
    icon.src = "icons/volume-level-1.svg";
    icon.alt = "Volume Level 1";
  }else{
    icon.src = "icons/volume-level-0.svg";
    icon.alt = "Volume Level 0";
  }
});

/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}
