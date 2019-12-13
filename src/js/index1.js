// import {hola} from "./modules/example"
// import {activeMenu} from './modules/active-menu'

// saludo()
// despedida()
// activeMenu()

const exReg = "^[0-9]"
const textEs = {
  year: "año",
  month: "mes",
  day: "día",
  title: "Bienvenido al sitio oficial de destiladora agave azul",
  subTitle: "Antes de ingresar al maravilloso mundo de Distiladora Agave Azul por favor confirma que eres mayor de edad.",
  buttonText: "entrar",
  footerText: "Entra a este sitio solo si tienes la edad legal para ingerir bebidas alcoholicas, presionando el boton entrar, estas de acuerdo con los téminos y políticas de privacidad del sitio."
}
const textEn = {
  year: "year",
  month: "moth",
  day: "day",
  title: "welcome to agave azul official website",
  subTitle: "Before you see our unique and delicious products, please confirm than you are 18 years old or older",
  buttonText: "enter",
  footerText: "Enter this site only you are of legal drinking age.by clicking \"enter\", you agree to the terms of use & the privacy policy of this site"
}

const container = document.getElementById('container')

const language = sessionStorage.getItem('language')

const access = sessionStorage.getItem('access')

const actions = (container,languageContainer,form) =>{
  container.addEventListener('click', e=> {
    let target = e.target
    if (target.classList.contains('flag')) {
      let lang = target.dataset.lang
      console.log(lang)
      if(lang==='es'){
        setAgeScreen(container,textEs,lang,languageContainer)
      }else{
        setAgeScreen(container,textEn,lang,languageContainer)
      }
    }
  })
  if (form){
    form.addEventListener('submit', e=>{
      e.preventDefault()
      verifyInputs2(form)
    })
  }
}

const setLanguageScreen = (container) => {
  const languageContainer = document.createElement('div')
  languageContainer.id="languageContainer"
  languageContainer.className="languageContainer"
  languageContainer.innerHTML = `
    <p class="textCenter textUppercase">Por favor seleccione un idioma  /  please select a Language</p>
    <div class="flags-container">
        <img class="flag" src="img/mex.png" data-lang="es">
        <img class="flag" src="img/usa.png" data-lang="en">
    </div>
  `
  container.appendChild(languageContainer)
  actions(container,languageContainer)
}
const setAgeScreen = (container, text, lang,languageContainer) => {
  const ageContainer = document.createElement('div')
  ageContainer.id='ageContainer'
  ageContainer.className="ageContainer"
  ageContainer.innerHTML = `
    <h1>${text.title}</h1>
    <p class="subTitle">${text.subTitle}</p>
    <form action="#" id="form">
        <div class="form-container">
            <div class="input-group space-4">
                <label for="year">${text.year}</label>
                <div class="input-container">
                    <input type="text" max="2020" maxlength="4" name="year" id="year">
                </div>
            </div>
            <div class="input-group space-2"">
                <label for="month">${text.month}</label>
                <div class="input-container">
                    <input type="text" max="12" maxlength="2" name="moth"  id="month">            
                </div>
            </div>
            <div class="input-group space-2">
                <label for="day">${text.day}</label>
                <div class="input-container">
                    <input type="text" max="31" maxlength="2" name="day"  id="day">
                </div>
            </div>
        </div>
        <button type="submit" id="enter" class="btn">${text.buttonText}</button>
    </form>
    <p class="textFooter">${text.footerText}</p>
  `
  languageContainer.remove()
  container.appendChild(ageContainer)const ageContainer = document.createElement('div')
  ageContainer.id='ageContainer'
  ageContainer.className="ageContainer"
  ageContainer.innerHTML = `
    <h1>${text.title}</h1>
    <p class="subTitle">${text.subTitle}</p>
    <form action="#" id="form">
        <div class="form-container">
            <div class="input-group space-4">
                <label for="year">${text.year}</label>
                <div class="input-container">
                    <input type="text" max="2020" maxlength="4" name="year" id="year">
                </div>
            </div>
            <div class="input-group space-2"">
                <label for="month">${text.month}</label>
                <div class="input-container">
                    <input type="text" max="12" maxlength="2" name="moth"  id="month">            
                </div>
            </div>
            <div class="input-group space-2">
                <label for="day">${text.day}</label>
                <div class="input-container">
                    <input type="text" max="31" maxlength="2" name="day"  id="day">
                </div>
            </div>
        </div>
        <button type="submit" id="enter" class="btn">${text.buttonText}</button>
    </form>
    <p class="textFooter">${text.footerText}</p>
  `
  languageContainer.remove()
  container.appendChild(ageContainer)
  const form = document.querySelector('form')
  const year = form.querySelector('#year')
  const month = form.querySelector('#month')
  const day = form.querySelector('#day')
  verifyInputs(form,true)
  actions(container,lang,form)
}

const verifyInputs2 = (form) => {
  let birdDay = []
  const inputs = Array.from(form.querySelectorAll('input'))
  inputs.map(input=>{
    let val = parseInt(input.value)
    birdDay.push(val)
    setData(form,lang)
  })
  console.log(birdDay)
}
const verifyInputs = (form,type,blur) =>{
  const inputs = Array.from(form.querySelectorAll('input'))
  let total = 4
  inputs.forEach((input,i)=>{
    input.addEventListener('keyup', e=> {
      if(i>0) total= 2
      if (input.value.length===total){
        if (i===2 ){

          inputs[2].blur()

        }else{
          inputs[i+1].focus()
        }
      }
    })
  })
}

if (access === "true" && language){
  if (language==="es") location.href="/es"
  if (language==="en") location.href="/en"
}else {
  setLanguageScreen(container)
}


const getSecond = ms => Math.round(ms / 1000)
const getMinutes = ms => getSecond(ms) / 60
const getHours = ms => getMinutes(ms) / 60
const getDays = ms => getHours(ms) / 24
const getYears = ms => getDays(ms) / 365
