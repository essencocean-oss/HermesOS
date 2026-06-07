const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow () {
  const w = new BrowserWindow({
    width: 1280,
    height: 800,
    title: 'HermesOS',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });
  w.loadFile(path.join(__dirname, '..', 'ui', 'index.html'));
}
app.whenReady().then(createWindow);
