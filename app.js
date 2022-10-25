//Global selections and variables
const colorDivs = document.querySelectorAll(".color");
const generateBtn = document.querySelector(".generate");
//you could select input[type='range']
const sliders = document.querySelectorAll('input[type="range"]');
const currentHexes = document.querySelectorAll(".color h2");
const popup = document.querySelector(".copy-container");
const adjustButton = document.querySelectorAll(".adjust");
const lockButton = document.querySelectorAll(".lock");
const closeAdjustments = document.querySelectorAll(".close-adjustment");
const sliderContainers = document.querySelectorAll(".sliders");
// important
let initialColors;

//functions 
const generateColors = ()=>{
   const hexColor = chroma.random();
   return hexColor;
}

const randomColorDivs = () =>{
  colorDivs.forEach(div => {
    const divTextTag = div.children[0];
    const randomColor = generateColors();
    // console.log(randomColor);
    divTextTag.innerText = randomColor;
    div.style.backgroundColor = randomColor;
    checkColorContrast(randomColor, divTextTag);

    //initial colorize slider
    const color = chroma(randomColor);
    const sliders = div.querySelectorAll('.sliders input');
    // console.log(sliders);
    const sliderHue = sliders[0];
    const sliderBright = sliders[1];
    const sliderSat = sliders[2];
    colorizeSliders(color, sliderHue, sliderBright, sliderSat);
  })
} 

const checkColorContrast = (color, text) => {
  const luminance = chroma(color).luminance();
  if (luminance >0.5){
    text.style.color = 'black';
  }else{
    text.style.color = 'white';
  }
}
const colorizeSliders = (color, sliderHue, sliderBright, sliderSat) =>{
  //goal get color min/max for each properties
  //scale sat
  const noSat = color.set('hsl.s', 0);
  const fullSat = color.set('hsl.s', 1);
  const scaleSat = chroma.scale([noSat, color, fullSat]);
  //scale brightness
  const midBright = color.set('hsl.l', 0.5);
  const scaleBright = chroma.scale(['black', midBright, 'white']);

  //input update --- important
  sliderSat.style.backgroundImage = `linear-gradient(to right, ${scaleSat(0)}, ${scaleSat(1)})`;
  sliderBright.style.backgroundImage = `linear-gradient(to right,  ${scaleBright(0)}, ${scaleBright(0.5)}, ${scaleBright(1)})`;
  sliderHue.style.backgroundImage = `linear-gradient(to right, rgb(204, 75, 75), rgb(204,204 ,75),rgb(75, 204, 75),rgb(75, 204, 204),rgb(75,75,204),rgb(204,75,204),rgb(204,75,75))`
}

randomColorDivs();
