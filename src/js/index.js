import { isMobile } from "./modules/isMobile";
const exReg = "^[0-9]";
const textEs = {
  year: "año",
  month: "mes",
  day: "día",
  title: "Bienvenido al sitio oficial de destiladora agave azul",
  subTitle:
    "Antes de ingresar al maravilloso mundo de Distiladora Agave Azul por favor confirma que eres mayor de edad.",
  buttonText: "entrar",
  footerText:
    "Entra a este sitio solo si tienes la edad legal para ingerir bebidas alcoholicas, presionando el boton entrar, estas de acuerdo con los téminos y políticas de privacidad del sitio."
};
const textEn = {
  year: "year",
  month: "moth",
  day: "day",
  title: "welcome to agave azul official website",
  subTitle:
    "Before you see our unique and delicious products, please confirm than you are 18 years old or older",
  buttonText: "enter",
  footerText:
    'Enter this site only you are of legal drinking age.by clicking "enter", you agree to the terms of use & the privacy policy of this site'
};

let isIphone = /(iPhone)/i.test(navigator.userAgent);
let isSafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);

if (isIphone && isSafari) {
  document.body.classList.add("safari")
}

const container = document.getElementById("container");

let lang = sessionStorage.getItem("language");

const access = sessionStorage.getItem("access");

const actionLang = container => {
  const flags = Array.from(container.querySelectorAll("a"));
  let data;
  flags.map(img => {
    img.addEventListener("click", e => {
      e.preventDefault();
      lang = e.target.dataset.lang;
      showScreenAgeGate(container, lang);
    });
  });
};

const showScreenLanguage = (container, lang) => {
  const languageContainer = document.createElement("div");
  languageContainer.id = "languageContainer";
  languageContainer.className = "languageContainer";
  languageContainer.innerHTML = `
    <p class="textCenter textUppercase language">Por favor seleccione un idioma  /  please select a Language</p>
    <div class="flags-container">
        <a href="/es" data-lang="es">Español</a>
        <a href="/en" data-lang="en">English</a>
    </div>
  `;
  container.appendChild(languageContainer);
  actionLang(container);
};

const showScreenAgeGate = (container, lang) => {
  const flagScreen = document.querySelector("#languageContainer");
  let text;
  if (lang === "es") text = textEs;
  if (lang === "en") text = textEn;
  const ageGateElement = document.createElement("div");
  ageGateElement.id = "ageContainer";
  ageGateElement.className = "ageContainer";
  ageGateElement.innerHTML = `
    <h1 class="title">${text.title}</h1>
    <p class="subTitle">${text.subTitle}</p>
    <form action="#" id="form" class="form">
        <div class="form-container">
            <div class="input-group ">
                <label for="year">${text.year}</label>
                <div class="input-container space-4">
                    <input type="text" max="2020" maxlength="4" name="year" id="year">
                </div>
            </div>
            <div class="input-group space-2"">
                <label for="month">${text.month}</label>
                <div class="input-container">
                    <input class="moth-input" type="text" max="12" maxlength="2" name="moth"  id="month">            
                </div>
            </div>
            <div class="input-group space-2">
                <label for="day">${text.day}</label>
                <div class="input-container">
                    <input class="day-input" type="text" max="31" maxlength="2" name="day"  id="day">
                </div>
            </div>
        </div>
        <button type="submit" id="enter" class="btn">${text.buttonText}</button>
    </form>
    <p class="textFooter">${text.footerText}</p>
  `;
  flagScreen.remove();
  container.appendChild(ageGateElement);
  ageScreenActions(container, lang, ageGateElement);
};

const ageScreenActions = (container, lang, ageGateScreen) => {
  const form = ageGateScreen.querySelector("form");
  const inputs = Array.from(form.querySelectorAll("input"));
  let dateInput = [];
  let total;
  inputs.forEach((input, i) => {
    input.addEventListener("keyup", e => {
      i > 0 ? (total = 2) : (total = 4);
      if (input.value.length === total) {
        if (i === 2) {
          inputs[i].blur();
          dateInput.push(parseInt(input.value));
        } else {
          inputs[i + 1].focus();
          dateInput.push(parseInt(input.value));
        }
      }
      if (!/^([0-9])*$/.test(input.value)) {
        input.value = "";
        input.focus();
      }
    });
  });
  form.addEventListener("submit", e => {
    e.preventDefault();
    if (dateInput.length === 3) {
      if (dateInput[1] > 12 || dateInput[2] > 31) {
        inputs.map(inp => (inp.value = ""));
        inputs[0].focus();
      } else {
        verifyAge(lang, dateInput, inputs);
      }
    }
  });
};

const verifyAge = (lang, dateInput, inputs) => {
  // console.log(lang)
  const now = new Date();
  const birdDay = new Date(dateInput[0], dateInput[1] - 1, dateInput[2]);
  console.log(getYears(now - birdDay));
  if (getYears(now - birdDay) > 18) {
    sessionStorage.setItem("access", "true");
    if (lang === "es") location.href = "/es";
    if (lang === "en") location.href = "/en";
  }
};

showScreenLanguage(container);
// if (!lang) {
// }else{
//   showScreenAgeGate(lang)
// }

const getSecond = ms => Math.round(ms / 1000);
const getMinutes = ms => getSecond(ms) / 60;
const getHours = ms => getMinutes(ms) / 60;
const getDays = ms => getHours(ms) / 24;
const getYears = ms => getDays(ms) / 365;
