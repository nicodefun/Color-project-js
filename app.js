//Global selections and variables
const colorDivs = document.querySelectorAll(".color");
const generateBtn = document.querySelector(".generate");
//you could select input[type='range']
const sliders = document.querySelectorAll('input[type="range"]');
const currentHexes = document.querySelectorAll(".color h2");
const popup = document.querySelector(".copy-container");
const adjustButtons = document.querySelectorAll(".adjust");
const lockButtons = document.querySelectorAll(".lock");
const closeAdjustments = document.querySelectorAll(".close-adjustment");
const sliderContainers = document.querySelectorAll(".sliders");
// important
let initialColors;
const popupBox = popup.children[0];
let savedPalettes = [];

//functions ---------------------
const generateColors = () => {
  const hexColor = chroma.random();
  return hexColor;
};

const sliderChoice = (data, slider, index) => {
  const color = initialColors[slider.getAttribute(data)];
  return chroma(color).hsl()[index];
};

const resetInputs = () => {
  sliders.forEach((slider) => {
    switch (slider.name) {
      case "hue":
        const hueValue = sliderChoice("data-hue", slider, 0);
        slider.value = Math.floor(hueValue);
        break;
      case "brightness":
        const brightValue = sliderChoice("data-bright", slider, 2);
        slider.value = brightValue.toFixed(2);
        break;
      case "saturation":
        const satValue = sliderChoice("data-sat", slider, 1);
        slider.value = satValue.toFixed(2);
        break;
    }
  });
};

const randomColorDivs = () => {
  //important
  initialColors = [];

  colorDivs.forEach((div) => {
    const divTextTag = div.children[0];
    const randomColor = generateColors();
    // console.log(chroma(randomColor).hex());

    // console.log(divTextTag.innerText);---> get the last array
    if (div.classList.contains("locked")) {
      initialColors.push(divTextTag.innerText);
      return; ///important
    } else {
      initialColors.push(chroma(randomColor).hex());
    }

    divTextTag.innerText = randomColor;
    // console.log(divTextTag.innerText);
    // push to initial colors
    // if(div.classList.contains('locked')){
    //   initialColors.push
    // }

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
  let currentSliders = e.target.parentElement.querySelectorAll(
    "input[type='range']"
  );

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
    .set("hsl.s", satInput.value)
    .set("hsl.h", hueInput.value)
    .set("hsl.l", brightInput.value);

  colorDivs[index].style.backgroundColor = color;

  colorizeSliders(color, hueInput, brightInput, satInput);
};

const checkContrastIcons = (activeDiv, color) => {
  const controlIcons = activeDiv.querySelectorAll(".controls button");
  for (icon of controlIcons) {
    checkColorContrast(color, icon);
  }
};

const updateTextUI = (index) => {
  const activeDiv = colorDivs[index];
  const color = chroma(activeDiv.style.backgroundColor);
  const divH2 = activeDiv.querySelector("h2");
  divH2.innerText = color.hex();
  checkColorContrast(color, divH2);
  checkContrastIcons(activeDiv, color);
};
const copyToClipBoard = (hex) => {
  //clipboard function
  navigator.clipboard.writeText(hex.innerText);
  popup.classList.add("active");
  popupBox.classList.add("active");
};

//eventListeners ---------------------
sliders.forEach((slider) => {
  // data setup in HTML is important -- use getAttribute
  slider.addEventListener("input", hslControl);
});

colorDivs.forEach((div, index) => {
  //change can use for Div
  div.addEventListener("change", () => {
    updateTextUI(index);
  });
});
currentHexes.forEach((hex) => {
  hex.addEventListener("click", () => {
    copyToClipBoard(hex);
  });
});

popup.addEventListener("transitionend", () => {
  popupBox.classList.remove("active");
  popup.classList.remove("active");
});

adjustButtons.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    sliderContainers[index].classList.toggle("active");
  });
});

closeAdjustments.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    sliderContainers[index].classList.remove("active");
  });
});

lockButtons.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    const div = colorDivs[index];
    div.classList.toggle("locked");
    if (div.classList.contains("locked")) {
      btn.children[0].classList = "fas fa-lock";
    } else {
      btn.children[0].classList = "fas fa-lock-open";
    }
  });
});

generateBtn.addEventListener("click", randomColorDivs);

//implement save to pallettes and LOCAL STORAGE stuff
const saveBtn = document.querySelector(".save");
const submitSave = document.querySelector(".submit-save");
const closeSave = document.querySelector(".close-save");
const savePopup = document.querySelector(".save-popup");
const saveContainer = document.querySelector(".save-container");
const saveInput = document.querySelector(".save-name");
//library
const libraryContainer = document.querySelector(".library-container");
const libraryBtn = document.querySelector(".library");
const closeLibraryBtn = document.querySelector(".close-library");

const openPallette = () => {
  savePopup.classList.add("active");
  saveContainer.classList.add("active");
};
const closePallette = () => {
  savePopup.classList.remove("active");
  saveContainer.classList.remove("active");
};

const saveToLocal = (obj) => {
  let localPallettes;
  if (localStorage.getItem("pallettes") === null) {
    localPallettes = [];
  } else {
    localPallettes = JSON.parse(localStorage.getItem("pallettes"));
  }
  localPallettes.push(obj);
  localStorage.setItem("pallettes", JSON.stringify(localPallettes));
};

function savePalette(e) {
  saveContainer.classList.remove("active");
  popup.classList.remove("active");
  const name = saveInput.value;
  const colors = [];
  currentHexes.forEach(hex => {
    colors.push(hex.innerText);
  });
  //Generate Object
  //*1
  // const paletteObjects = JSON.parse(localStorage.getItem("palettes"));
  // let paletteNr;
  // if (paletteObjects) {
  //   paletteNr = paletteObjects.length;
  // } else {
  //   paletteNr = savedPalettes.length;
  // }

  let paletteNr;
  const paletteObjects = JSON.parse(localStorage.getItem("palettes"));
  if (paletteObjects) {
    paletteNr = paletteObjects.length;
  } else {
    paletteNr = savedPalettes.length;
  }

  const paletteObj = { name, colors, nr: paletteNr };
  savedPalettes.push(paletteObj);
  //Save to localStorage
  saveToLocal(paletteObj);
  saveInput.value = "";
  //Generate the palette for Library
  const palette = document.createElement("div");
  palette.classList.add("custom-palette");
  const title = document.createElement("h4");
  title.innerText = paletteObj.name;
  const preview = document.createElement("div");
  preview.classList.add("small-preview");
  paletteObj.colors.forEach(smallColor => {
    const smallDiv = document.createElement("div");
    smallDiv.style.backgroundColor = smallColor;
    preview.appendChild(smallDiv);
  });
  const paletteBtn = document.createElement("button");
  paletteBtn.classList.add("pick-palette-btn");
  paletteBtn.classList.add(paletteObj.nr);
  paletteBtn.innerText = "Select";

  //Attach event to the btn
  paletteBtn.addEventListener("click", e => {
    closeLibrary();
    const paletteIndex = e.target.classList[1];
    initialColors = [];
    savedPalettes[paletteIndex].colors.forEach((color, index) => {
      initialColors.push(color);
      colorDivs[index].style.backgroundColor = color;
      const text = colorDivs[index].children[0];
      checkTextContrast(color, text);
      updateTextUI(index);
    });
    resetInputs();
  });

  //Append to Library
  palette.appendChild(title);
  palette.appendChild(preview);
  palette.appendChild(paletteBtn);
  libraryContainer.children[0].appendChild(palette);
}


const closeLibrary = () => {
  const popup = saveContainer.children[0];
  libraryContainer.classList.remove("active");
  popup.classList.remove("active");
};

function getLocal() {
  if (localStorage.getItem("palettes") === null) {
    //Local Palettes
    localPalettes = [];
  } else {
    const paletteObjects = JSON.parse(localStorage.getItem("palettes"));
    // *2

    savedPalettes = [...paletteObjects];
    paletteObjects.forEach(paletteObj => {
      //Generate the palette for Library
      const palette = document.createElement("div");
      palette.classList.add("custom-palette");
      const title = document.createElement("h4");
      title.innerText = paletteObj.name;
      const preview = document.createElement("div");
      preview.classList.add("small-preview");
      paletteObj.colors.forEach(smallColor => {
        const smallDiv = document.createElement("div");
        smallDiv.style.backgroundColor = smallColor;
        preview.appendChild(smallDiv);
      });
      const paletteBtn = document.createElement("button");
      paletteBtn.classList.add("pick-palette-btn");
      paletteBtn.classList.add(paletteObj.nr);
      paletteBtn.innerText = "Select";

      //Attach event to the btn
      paletteBtn.addEventListener("click", e => {
        closeLibrary();
        const paletteIndex = e.target.classList[1];
        initialColors = [];
        paletteObjects[paletteIndex].colors.forEach((color, index) => {
          initialColors.push(color);
          colorDivs[index].style.backgroundColor = color;
          const text = colorDivs[index].children[0];
          checkTextContrast(color, text);
          updateTextUI(index);
        });
        resetInputs();
      });

      //Append to Library
      palette.appendChild(title);
      palette.appendChild(preview);
      palette.appendChild(paletteBtn);
      libraryContainer.children[0].appendChild(palette);
    });
  }
}


saveBtn.addEventListener("click", openPallette);
closeSave.addEventListener("click", closePallette);
submitSave.addEventListener("click", (e) => {
  savePalette(e);
});
libraryBtn.addEventListener("click", () => {
  const popup = saveContainer.children[0];
  libraryContainer.classList.add("active");
  popup.classList.add("active");
});
closeLibraryBtn.addEventListener("click", closeLibrary);

randomColorDivs();
getLocal();
