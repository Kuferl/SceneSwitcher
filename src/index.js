import { app, BrowserWindow, ipcMain, Menu } from 'electron';

const LCUConnector = require('lcu-connector');
const connector = new LCUConnector();

const Store = require('electron-store');
const store = new Store();

const RiotWSProtocol = require('./lib/RiotWSProtocol');

if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

let mainWindow;

let lcu_status = 0;

const createWindow = () => {
  // Create the browser window.
  Menu.setApplicationMenu()

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    fullscreenable: false,
  });
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

app.on('ready', () => {
    createWindow();
    connector.start();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

const startLCU = (data) => {
    try{
        const ws = new RiotWSProtocol('wss://'+data.username+':'+data.password+'@'+data.address+':'+data.port+'/');
        ws.on('open', () => {
            clearInterval(lcuTimer);
            mainWindow.webContents.send('lcu-status', 1);
            lcu_status = 1;
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

        ws.on('close', () => {
            console.log("lost connection");
            mainWindow.webContents.send('lcu-status', 0);
            lcu_status = 0;
            ws.close();
        })
    }catch(err){
        setTimeout(startLCU, 2000, data);
    }
}

connector.on('connect', (data) => {
    startLCU(data);
});

connector.on('disconnect', (data) => {
    lcu_status = 0;
    mainWindow.webContents.send('lcu-status', 0);
});

ipcMain.on('update-storage', (event, arg) => {
  store.set('scenes', arg);
  event.returnValue = store.get('scenes');
})

ipcMain.on('get-lcu-status', (event, arg) => {
  event.returnValue = lcu_status;
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
