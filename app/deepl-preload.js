const { ipcRenderer } = require('electron')

const translateReadyRequest = 'translate-ready-request';
const translateReadyResponse = 'translate-ready-response';
const translateRequest = 'translate-request';
const translateResponse = 'translate-response';

let webIsLoad = false;

// console.log('deepl-preload')
function main() {
  // console.log('document load')
  translatorResultEl = document.getElementById('target-dummydiv')
  const initTranslateValue = translatorResultEl.textContent
  translateValue = initTranslateValue

  // console.log(translatorResultEl, translateValue)

  translateArg = null;

  function setSentence(sentence) {
    // console.log('set sentence :', sentence)
    document.querySelector('.lmt__source_textarea').value = decodeURI(sentence);
    e = document.createEvent('HTMLEvents');
    e.initEvent('input', false, true);
    document.querySelector('.lmt__source_textarea').dispatchEvent(e);
  }

  ipcRenderer.on(translateRequest, (ev, arg) => {
    // console.log('on translate-request')
    translateArg = arg
    setSentence(translateArg.original)

    let timeInterval = setInterval(() => {
      if (translateValue != translatorResultEl.textContent) {
        translateArg.translate = translatorResultEl.textContent
        // console.log('dom change:', translateArg.text)
        ipcRenderer.invoke(translateResponse, translateArg)
        translateValue = initTranslateValue
        setSentence(initTranslateValue)
        clearInterval(timeInterval)
      }
    }, 500);
  })
}

ipcRenderer.on(translateReadyRequest, (ev, arg) => {
  console.log(`${translateReadyRequest} : ${webIsLoad}`)
  ipcRenderer.invoke(translateReadyResponse, webIsLoad)
})

let checkLoad = setInterval(() => {
  translatorResultEl = document.getElementById('target-dummydiv')
  if (translatorResultEl) {
    // console.log('loading!!!!!!!!')
    webIsLoad = true;
    main()
    clearInterval(checkLoad)
  }
}, 500);