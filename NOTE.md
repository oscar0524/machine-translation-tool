機翻神器 開發日誌
===
DATE：20220806  
---
企劃開始!整個企劃的最開始是在Github上的[PIBBK-Lite](https://github.com/chrisliuqq/PIBBK-Lite)專案，但是程式本身最重要的翻譯功能太繁瑣，所以取得小說資訊部分直接參考PIBBK的方式。預計使用Angular搭配electron來製作的應用程式，期望能做出多平台的應用，目前待解決一大問題就是如何套用翻譯軟體，根據PIBBK是使用webview所以要來研究看看這一怎麼處裡比較好。

DATE：20220807
---
終於找到了`ipc`的方法用於electron與各個視窗的互動，並且透過視窗的preload將自己的js寫入網頁裡面來取得翻譯的文字。接下來又找到了[kuromoji.js](https://github.com/takuyaa/kuromoji.js)這個東西用來判斷日文名詞，這樣能方便進行名詞的標註及翻譯，但是不太實用，因為他判斷名詞的方式沒有那麼方便。

DATE:20220808
---
將整個專案架構先架了出來，將功能分散開來了。我還沒有試過SQLite的功能想要來嘗試看看，利用範本angular-electron來改真的越來越累了，我直接砍掉重新建立專案再一個個的把東西加回來，最麻煩的是eslint跟tsconfig的奇爬提示讓我一直編譯不過...

DATE:20220809
---
製作了基本上透過URL換頁功能。