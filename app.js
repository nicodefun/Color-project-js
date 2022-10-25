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
    console.log(randomColor);
    divTextTag.innerText = randomColor;
    div.style.backgroundColor = randomColor;
  })
} 

randomColorDivs();