import { app, BrowserWindow, ipcMain, BrowserView, screen } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import * as url from 'url';

const ipcChannel = require('./ipc-channel')

const args = process.argv.slice(1),
    serve = args.some(val => val === '--serve');


let mainWindow: any = null;

// const translateReadyRequest = 'translate-ready-request';
// const translateReadyResponse = 'translate-ready-response';
// const translateRequest = 'translate-request';
// const translateResponse = 'translate-response';
// const progressValueSet = 'progress-value-set';
// const titleChange = 'title-change';

function createWindow(): BrowserWindow {

    // Create the browser window.
    mainWindow = new BrowserWindow({
        // width: 800,
        // height: 600,
        webPreferences: {
            nodeIntegration: true,
            allowRunningInsecureContent: (serve) ? true : false,
            contextIsolation: false,  // false if you want to run e2e test with Spectron
            webSecurity: false,
            devTools: true
        },
    });

    if (serve) {
        const debug = require('electron-debug');
        debug();

        require('electron-reloader')(module);
        mainWindow.loadURL('http://localhost:4200');
    } else {
        // Path when running electron executable
        let pathIndex = './index.html';

        if (fs.existsSync(path.join(__dirname, '../dist/index.html'))) {
            // Path when running electron in local folder
            pathIndex = '../dist/index.html';
        }

        // console.log(pathIndex)

        mainWindow.loadURL(`file://${__dirname}/${pathIndex}`);
    }



    // ---------- deeplView ----------
    let deeplView = new BrowserView({
        webPreferences: {
            nodeIntegration: true,
            allowRunningInsecureContent: (serve) ? true : false,
            devTools: false,
            webSecurity: false, preload: path.join(__dirname, "deepl-preload.js")
        }
    })
    mainWindow.setBrowserView(deeplView)
    deeplView.setBounds({ x: -800, y: -600, width: 800, height: 600 })
    // ---------- debug deeplView ----------
    // let deeplView = new BrowserWindow({
    //     webPreferences: {
    //         nodeIntegration: true,
    //         allowRunningInsecureContent: (serve) ? true : false,
    //         webSecurity: false, preload: path.join(__dirname, "deepl-preload.js")
    //     }
    // })
    // -------------------------------------

    deeplView.webContents.loadURL('https://www.deepl.com/translator')



    ipcMain.handle(ipcChannel.translateReadyRequest, async (event, arg) => {
        // console.log(`ipcMain handle ${translateRequest}`)
        deeplView.webContents.send(ipcChannel.translateReadyRequest)
    })
    ipcMain.handle(ipcChannel.translateReadyResponse, async (event, arg) => {
        mainWindow.webContents.send(ipcChannel.translateReadyResponse, arg)
    })
    ipcMain.handle(ipcChannel.translateRequest, async (event, arg) => {
        // console.log(`ipcMain handle ${translateRequest}`)
        deeplView.webContents.send(ipcChannel.translateRequest, arg)
    })
    ipcMain.handle(ipcChannel.translateResponse, async (event, arg) => {
        mainWindow.webContents.send(ipcChannel.translateResponse, arg)
    })

    ipcMain.handle(ipcChannel.progressValueSet, (event, arg) => {
        mainWindow.webContents.send(ipcChannel.progressValueSet, arg)
    })

    ipcMain.handle(ipcChannel.titleChange, (event, arg) => {
        mainWindow.webContents.send(ipcChannel.titleChange, arg)
    })

    mainWindow.on('ready-to-show', async () => {
        mainWindow.show()
        mainWindow.maximize()
        mainWindow.webContents.openDevTools();
    })


    // Emitted when the window is closed.
    mainWindow.on('closed', () => {
        // Dereference the window object, usually you would store window
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        ipcMain.removeAllListeners()
        mainWindow.destroy();
    });
    return mainWindow;
}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
    mainWindow = null;
    if (process.platform !== "darwin") {
        app.quit();
    }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.