import { app, BrowserWindow, ipcMain } from 'electron';

const LCUConnector = require('lcu-connector');
const connector = new LCUConnector();

const Store = require('electron-store');
const store = new Store();

const RiotWSProtocol = require('./lib/RiotWSProtocol');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    fullscreenable: false,
  });

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
    createWindow();
    connector.start();
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

connector.on('connect', (data) => {
    const ws = new RiotWSProtocol('wss://'+data.username+':'+data.password+'@'+data.address+':'+data.port+'/');
    ws.on('open', () => {
        ws.subscribe('OnJsonApiEvent', (data) => {
            if(data.uri.includes('/lol-gameflow/v1/session')){
                if(data.data.gameClient !== undefined){
                    let scenes = store.get('scenes');
                    if(data.data.gameClient.running) {
                        mainWindow.webContents.send('active-scene', scenes.ingame)
                    }else {
                        mainWindow.webContents.send('active-scene', scenes.queue)
                    }
                }
            }
        });
    });
});

ipcMain.on('update-storage', (event, arg) => {
  store.set('scenes', arg);
  event.returnValue = store.get('scenes');
})

ipcMain.on('get-storage', (event, arg) => {
    let scenes = store.get('scenes');

    if(!scenes){
        scenes = {
            queue: '',
            ingame: ''
        }
    }

    event.returnValue = scenes;
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
