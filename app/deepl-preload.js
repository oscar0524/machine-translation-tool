const { ipcRenderer } = require('electron')

document.addEventListener("DOMContentLoaded", function () {
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

  ipcRenderer.on('translate-request', (ev, arg) => {
    translateArg = arg
    setSentence(translateArg.original)

    let timeInterval = setInterval(() => {
      if (translateValue != translatorResultEl.textContent) {
        translateArg.translate = translatorResultEl.textContent
        // console.log('dom change:', translateArg.text)
        ipcRenderer.invoke('translate-response', translateArg)
        translateValue = initTranslateValue
        setSentence(initTranslateValue)
        clearInterval(timeInterval)
      }
    }, 500);
  })
});
