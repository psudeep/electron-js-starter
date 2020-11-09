const { app, BrowserWindow, Notification, ipcMain, Menu, MenuItem, shell } = require('electron')


function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadFile('index.html')
  win.webContents.openDevTools()
}

const menu = new Menu()
menu.append(new MenuItem({
  label: 'CPOO',
  submenu: [{
    role: 'help',
    accelerator: process.platform === 'darwin' ? 'Alt+Cmd+I' : 'Alt+Shift+I',
    click: () => { console.log('Electron rocks!') }
  },
  {
    label: 'Quit', accelerator: 'Command+Q',
    click: function () {
      app.quit()  // This is standart function to quit app.
    }
  }]
}))
menu.append(new MenuItem({
  label: 'About',
  submenu: [{
    role: 'about',
    accelerator: process.platform === 'darwin' ? 'Cmd+R' : 'Alt+Shift+R',
    click: () => { console.log('About click rocks!') }
  }]
}))
menu.append(new MenuItem({
  label: 'View',
  submenu: [
    {
      label: 'About App',
      click: function () {
        ipcMain.emit('show-about-window-event') // In such way we can trigger function in the main process
      }
    },
    {
      label: 'Reload', accelerator: 'CmdOrCtrl+R',
      click: function (item, focusedWindow) {
        focusedWindow.reload(); // reload the page
      }
    },
    { type: 'separator' },
    { label: 'Devloper Tools', accelerator: 'CmdOrCtrl+I',
      click: function () {
        win.webContents.openDevTools()
      }
    }
  ]
}))

menu.append(new MenuItem({
  label: 'Edit',
  submenu: [
    { label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
    { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
    { type: 'separator' },
    { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
    { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
    { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
    { label: 'Select All', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:' }
  ]
}))

menu.append(new MenuItem({
  label: 'Help',
  submenu: [
    {
      label: 'View Licence',
      click: function() {
        shell.openExternal('https://github.com/DmytroVasin/TimeTracker/blob/master/LICENSE');
      }
    },
    { type: 'separator' },
    { label: 'Version 1.0.0-alpha.6', enabled: 'FALSE' }
  ]
}))

Menu.setApplicationMenu(menu)

let onlineStatusWindow

app.whenReady().then(() => {
  onlineStatusWindow = new BrowserWindow({ width: 0, height: 0, show: false })
  onlineStatusWindow.loadURL(`file://${__dirname}/online-status.html`)
})

ipcMain.on('online-status-changed', (event, status) => {
  console.log(status)
})

function showNotification () {
  const notification = {
    title: 'Basic Notification',
    body: 'Notification from the Main process'
  }
  new Notification(notification).show()
}

app.whenReady().then(createWindow).then(showNotification)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})