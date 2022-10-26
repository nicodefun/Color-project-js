//Global selections and variables
const colorDivs = document.querySelectorAll(".color");
const generateBtn = document.querySelector(".generate");
//you could select input[type='range']
const sliders = document.querySelectorAll('input[type="range"]');
const currentHexes = document.querySelectorAll(".color h2");
const popup = document.querySelector(".copy-container");
const adjustButtons = document.querySelectorAll(".adjust");
const lockButton = document.querySelectorAll(".lock");
const closeAdjustments = document.querySelectorAll(".close-adjustment");
const sliderContainers = document.querySelectorAll(".sliders");
// important
let initialColors;
const popupBox = popup.children[0];

//functions ---------------------
const generateColors = () => {
  const hexColor = chroma.random();
  return hexColor;
};

const sliderChoice = (data, slider, index) =>{
  const color = initialColors[slider.getAttribute(data)];
  return (chroma(color).hsl()[index]);
  
}

const resetInputs = ()=>{
  sliders.forEach(slider =>{
    switch(slider.name){
      case 'hue':  
        const hueValue = sliderChoice('data-hue', slider, 0);
        slider.value = Math.floor(hueValue);
      break;
      case 'brightness':
        const brightValue = sliderChoice('data-bright', slider, 2);
        slider.value = brightValue.toFixed(2);
      break;
      case 'saturation':
        const satValue = sliderChoice('data-sat', slider, 1);
        slider.value = satValue.toFixed(2);
      break;
    }
  })
};

const randomColorDivs = () => {
  //important
  initialColors = [];

  colorDivs.forEach((div) => {
    const divTextTag = div.children[0];
    const randomColor = generateColors();
    // console.log(chroma(randomColor).hex());
    divTextTag.innerText = randomColor;

    // push to initial colors
    initialColors.push(chroma(randomColor).hex());
    
    div.style.backgroundColor = randomColor;
    checkColorContrast(randomColor, divTextTag);
  
    //initial colorize slider
    const color = chroma(randomColor);
    const sliders = div.querySelectorAll(".sliders input");
    // console.log(sliders);
    const sliderHue = sliders[0];
    const sliderBright = sliders[1];
    const sliderSat = sliders[2];
    colorizeSliders(color, sliderHue, sliderBright, sliderSat);
    
    checkContrastIcons(div, color);
  });

  resetInputs();
};

const checkColorContrast = (color, text) => {
  const luminance = chroma(color).luminance();
  if (luminance > 0.5) {
    text.style.color = "black";
  } else {
    text.style.color = "white";
  }
};

const colorizeSliders = (color, sliderHue, sliderBright, sliderSat) => {
  //goal get color min/max for each properties
  //scale sat
  const noSat = color.set("hsl.s", 0);
  const fullSat = color.set("hsl.s", 1);
  const scaleSat = chroma.scale([noSat, color, fullSat]);
  //scale brightness
  const midBright = color.set("hsl.l", 0.5);
  const scaleBright = chroma.scale(["black", midBright, "white"]);

  //input update --- important
  sliderSat.style.backgroundImage = `linear-gradient(to right, ${scaleSat(
    0
  )}, ${scaleSat(1)})`;
  sliderBright.style.backgroundImage = `linear-gradient(to right,  ${scaleBright(
    0
  )}, ${scaleBright(0.5)}, ${scaleBright(1)})`;
  sliderHue.style.backgroundImage = `linear-gradient(to right, rgb(204, 75, 75), rgb(204,204 ,75),rgb(75, 204, 75),rgb(75, 204, 204),rgb(75,75,204),rgb(204,75,204),rgb(204,75,75))`;
};

const hslControl = (e) => {
  
  let currentSliders = e.target.parentElement.querySelectorAll("input[type='range']");
  
  const hueInput = currentSliders[0];
  const brightInput = currentSliders[1];
  const satInput = currentSliders[2];
  //important --- should not do this!!!
  // const bgDivColor = colorDivs[index].querySelector('h2').innerText;
  const index =
    e.target.getAttribute("data-hue") ||
    e.target.getAttribute("data-bright") ||
    e.target.getAttribute("data-sat");
  // console.log(index);
  const bgDivColor = initialColors[index];
  // console.log(`bgColor: ${bgDivColor}`);

  let color = chroma(bgDivColor)
  .set('hsl.s', satInput.value)
  .set('hsl.h', hueInput.value)
  .set('hsl.l', brightInput.value);

  colorDivs[index].style.backgroundColor =  color;

  colorizeSliders(color, hueInput, brightInput, satInput);

};

const checkContrastIcons = (activeDiv, color) =>{
  const controlIcons = activeDiv.querySelectorAll('.controls button');
  for (icon of controlIcons){
    checkColorContrast(color, icon);
}};

const updateTextUI = (index) => {
  const activeDiv = colorDivs[index];
  const color = chroma(activeDiv.style.backgroundColor);
  const divH2 = activeDiv.querySelector('h2');
  divH2.innerText = color.hex();
  checkColorContrast(color, divH2);
  checkContrastIcons(activeDiv, color);

};
const copyToClipBoard = (hex)=>{
  //clipboard function
  navigator.clipboard.writeText(hex.innerText);
  popup.classList.add('active');
  popupBox.classList.add('active');
}



//eventListeners ---------------------
sliders.forEach((slider) => {
  // data setup in HTML is important -- use getAttribute
  slider.addEventListener("input", hslControl);
});

colorDivs.forEach((div, index)=>{
  //change can use for Div
  div.addEventListener('change', ()=>{
    updateTextUI(index);
  });
});
currentHexes.forEach(hex =>{
  hex.addEventListener('click', ()=>{
    copyToClipBoard(hex);
  })
});

popup.addEventListener('transitionend', ()=>{
  popupBox.classList.remove('active');
  popup.classList.remove('active');
});

adjustButtons.forEach((btn,index) =>{
  btn.addEventListener('click', ()=>{
    sliderContainers[index].classList.toggle('active');
  });
});

closeAdjustments.forEach((btn,index) =>{
  btn.addEventListener('click', ()=>{
    sliderContainers[index].classList.remove('active');
  });
});


randomColorDivs();
