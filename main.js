// main.js

const { app, BrowserWindow, ipcMain, Tray, Menu, Notification, shell } = require('electron');
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb');
const AutoLaunch = require('auto-launch');
const { autoUpdater } = require('electron-updater'); // Add this line
const log = require('electron-log'); // Add this line
const fs = require('fs');

// Configure logging
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

// mongodb+srv://benswissa:LeoJ2018!!!$$$@shlomi.ij7z5.mongodb.net/?retryWrites=true&w=majority&appName=shlomi
require('dotenv').config();
const MONGO_URI = process.env.MONGO_URI;

const DB_NAME = 'leadsDB';
const COLLECTION_NAME = 'leads';

let dbClient;
let mainWindow;
let tray;
let changeStream;

function setCustomCachePath() {
  const cachePath = path.join(app.getPath('userData'), 'cache');
  if (!fs.existsSync(cachePath)) {
    fs.mkdirSync(cachePath);
  }
  app.setPath('cache', cachePath);
}


// Function to create the main window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false, // Start hidden
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });
  mainWindow.loadFile('index.html');
  // mainWindow.webContents.openDevTools(); // Uncomment for debugging

  // Show window when it's ready
  mainWindow.once('ready-to-show', () => {
    // Check if app should start minimized
    if (!app.getLoginItemSettings().wasOpenedAsHidden) {
      mainWindow.show();
    }
  });

  // Handle minimize to tray
  mainWindow.on('minimize', function (event) {
    event.preventDefault();
    mainWindow.hide();
  });

  // Handle close to tray
  mainWindow.on('close', function (event) {
    if (!app.isQuiting) {
      event.preventDefault();
      mainWindow.hide();
    }
    return false;
  });

  // Create tray icon and context menu
  createTray();
}

// Function to create system tray icon
function createTray() {
  tray = new Tray(path.join(__dirname, 'tray-icon.png')); // Use an appropriate icon file
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show App', click: () => { mainWindow.show(); } },
    { label: 'Quit', click: () => {
        app.isQuiting = true;
        app.quit();
      }
    }
  ]);
  tray.setToolTip('Leads Manager');
  tray.setContextMenu(contextMenu);

  tray.on('double-click', () => {
    mainWindow.show();
  });
}

// Initialize MongoDB Connection
async function initializeMongoDB() {
  try {
    dbClient = new MongoClient(MONGO_URI);
    await dbClient.connect();
    console.log('Connected to MongoDB Atlas');
  } catch (err) {
    console.error('Error connecting to MongoDB Atlas:', err);
  }
}

// Auto-launch setup
const autoLauncher = new AutoLaunch({
  name: 'Leads Manager',
  path: app.getPath('exe'),
});

app.whenReady().then(async () => {
  setCustomCachePath(); // Add this line
  await initializeMongoDB();
  watchDatabaseChanges();

  // Enable auto-launch
  autoLauncher.isEnabled().then((isEnabled) => {
    if (!isEnabled) autoLauncher.enable();
  });

  createWindow();

  autoUpdater.on('checking-for-update', () => {
    log.info('Checking for update...');
  });

  autoUpdater.on('update-available', (info) => {
    log.info('Update available.');
    mainWindow.webContents.send('update_available', info);
  });

  autoUpdater.on('update-not-available', (info) => {
    log.info('Update not available.');
    mainWindow.webContents.send('update_not_available', info);
  });

  autoUpdater.on('error', (err) => {
    log.error('Error in auto-updater:', err);
    mainWindow.webContents.send('update_error', err);
  });

  autoUpdater.on('download-progress', (progressObj) => {
    log.info(`Download speed: ${progressObj.bytesPerSecond}`);
    log.info(`Downloaded ${progressObj.percent}%`);
    log.info(`(${progressObj.transferred}/${progressObj.total})`);
    mainWindow.webContents.send('download_progress', progressObj);
  });

  autoUpdater.on('update-downloaded', (info) => {
    log.info('Update downloaded');
    mainWindow.webContents.send('update_downloaded', info);
  });

  // Initiate auto-updater
  autoUpdater.checkForUpdatesAndNotify();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('before-quit', () => {
  app.isQuiting = true;
  if (changeStream) changeStream.close();
  if (dbClient) dbClient.close();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// IPC Handlers

// IPC Handlers for Leads
ipcMain.handle('get-leads', async () => {
  try {
    const collection = dbClient.db(DB_NAME).collection(COLLECTION_NAME);
    const leads = await collection.find({}).toArray();
    // Convert _id to string
    const leadsWithIdStrings = leads.map(lead => ({
      ...lead,
      _id: lead._id.toString()
    }));
    return leadsWithIdStrings;
  } catch (err) {
    console.error('Error fetching leads:', err);
    throw err;
  }
});

ipcMain.handle('add-lead', async (event, lead) => {
  try {
    const collection = dbClient.db(DB_NAME).collection(COLLECTION_NAME);
    // Ensure 'active' field is set
    if (typeof lead.active === 'undefined') {
      lead.active = true;
    }
    const result = await collection.insertOne(lead);
    lead._id = result.insertedId.toString(); // Convert ObjectId to string
    return lead;
  } catch (err) {
    console.error('Error adding lead:', err);
    throw err;
  }
});

ipcMain.handle('update-lead', async (event, lead) => {
  try {
    const collection = dbClient.db(DB_NAME).collection(COLLECTION_NAME);
    const { id, _id, ...updateData } = lead;
    const leadId = (id || _id).toString(); // Ensure leadId is a string
    await collection.updateOne({ _id: new ObjectId(leadId) }, { $set: updateData });
    return lead;
  } catch (err) {
    console.error('Error updating lead:', err);
    throw err;
  }
});

ipcMain.handle('delete-lead', async (event, id) => {
  try {
    const collection = dbClient.db(DB_NAME).collection(COLLECTION_NAME);
    await collection.deleteOne({ _id: new ObjectId(id.toString()) }); // Ensure id is a string
    return { message: 'Lead deleted' };
  } catch (err) {
    console.error('Error deleting lead:', err);
    throw err;
  }
});

// IPC Handlers for details
ipcMain.handle('add-detail', async (event, leadId, detail, followUp) => {
  try {
    const collection = dbClient.db(DB_NAME).collection(COLLECTION_NAME);
    const newDetail = {
      id: Date.now().toString(),
      text: detail.text,
      timestamp: new Date().toISOString(),
      canDelete: true
    };
    const updateFields = {
      $push: { details: newDetail },
      $set: { lastContact: newDetail.timestamp }
    };
    if (followUp && new Date(followUp) > new Date()) {
      updateFields.$set.followUp = followUp;
      updateFields.$set.followUpNotified = false;
    }
    await collection.updateOne(
      { _id: new ObjectId(leadId.toString()) },
      updateFields
    );
    return newDetail;
  } catch (err) {
    console.error('Error adding detail:', err);
    throw err;
  }
});

ipcMain.handle('update-detail', async (event, leadId, detailId, newText, followUp) => {
  try {
    const collection = dbClient.db(DB_NAME).collection(COLLECTION_NAME);
    const updateFields = {
      $set: {
        'details.$.text': newText,
        'details.$.timestamp': new Date().toISOString(),
        lastContact: new Date().toISOString()
      }
    };
    if (followUp && new Date(followUp) > new Date()) {
      updateFields.$set.followUp = followUp;
      updateFields.$set.followUpNotified = false;
    }
    await collection.updateOne(
      { _id: new ObjectId(leadId.toString()), 'details.id': detailId },
      updateFields
    );
    return { message: 'Detail updated' };
  } catch (err) {
    console.error('Error updating detail:', err);
    throw err;
  }
});

ipcMain.handle('delete-detail', async (event, leadId, detailId) => {
  try {
    const collection = dbClient.db(DB_NAME).collection(COLLECTION_NAME);
    // Fetch the lead to check the number of details
    const lead = await collection.findOne({ _id: new ObjectId(leadId.toString()) });
    if (lead.details.length <= 1) {
      throw new Error('Cannot delete the last detail. A lead must have at least one detail.');
    }
    await collection.updateOne(
      { _id: new ObjectId(leadId.toString()) },
      { $pull: { details: { id: detailId } }, $set: { lastContact: new Date().toISOString() } }
    );
    return { message: 'Detail deleted' };
  } catch (err) {
    console.error('Error deleting detail:', err);
    throw err;
  }
});

// IPC Handler for showing notifications
ipcMain.on('show-notification', (event, notificationData) => {
  showFollowUpNotification(notificationData);
});

// Function to show system notification
function showFollowUpNotification({ leadId, fullName, phone, message }) {
  const notification = new Notification({
    title: 'Follow-Up Reminder',
    body: message,
    silent: false, // Play a sound
    // Actions can be added in some platforms
    // actions: [{ text: 'Remind Me Later', type: 'button' }, { text: 'Dismiss', type: 'button' }],
  });

  notification.on('click', () => {
    // Bring the app to the foreground
    mainWindow.show();
    // Optionally, you can send a message to the renderer process
    // mainWindow.webContents.send('notification-action', { leadId });
  });

  notification.show();
}

// IPC Handler for when a follow-up is due
ipcMain.on('follow-up-due', (event, lead) => {
  createNotificationWindow(lead);
});

function createNotificationWindow(lead) {
  const notificationWindow = new BrowserWindow({
    width: 400,
    height: 500,
    alwaysOnTop: true,
    frame: false,
    transparent: false,
    webPreferences: {
      preload: path.join(__dirname, 'notificationPreload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  notificationWindow.loadFile('notification.html');

  // Send the lead data to the notification window
  notificationWindow.webContents.on('did-finish-load', () => {
    notificationWindow.webContents.send('lead-data', lead);
  });

  // Handle messages from the notification window
  ipcMain.on(`notification-action-${lead._id}`, async (event, action, data) => {
  try{
        if (action === 'ok') {
          // User pressed OK, set followUp to null, set followUpCompleted to true
          await updateLeadFollowUp(lead._id, null, true, true);
          notificationWindow.close();
        } else if (action === 'remind-later') {
          // User wants to be reminded later
          await updateLeadFollowUp(lead._id, data.newFollowUpTime, false, false);
          notificationWindow.close();
        } else if (action === 'send-whatsapp') {
          // Open WhatsApp with the message
          openWhatsApp(lead.phone, data.message);
        }
        // Send message to renderer process to reload leads
        mainWindow.webContents.send('reload-leads');
      } catch (error) {
          console.error('Error handling notification action:', error);
      }
  });

  notificationWindow.on('closed', () => {
    ipcMain.removeAllListeners(`notification-action-${lead._id}`);
  });
}

async function updateLeadFollowUp(leadId, newFollowUpTime, followUpNotified, followUpCompleted) {
  try {
    await dbClient.db(DB_NAME).collection(COLLECTION_NAME).updateOne(
      { _id: new ObjectId(leadId.toString()) },
      { $set: { followUp: newFollowUpTime, followUpNotified, followUpCompleted } }
    );
  } catch (error) {
    console.error('Error updating lead follow-up:', error);
  }
}

function openWhatsApp(phone, message) {
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  shell.openExternal(whatsappUrl).catch((error) => {
    console.error('Error opening WhatsApp:', error);
  });
}

async function watchDatabaseChanges() {
  try {
    const collection = dbClient.db(DB_NAME).collection(COLLECTION_NAME);
    changeStream = collection.watch();

    changeStream.on('change', (change) => {
      // שלח הודעה לכל חלון על השינוי
      BrowserWindow.getAllWindows().forEach((window) => {
        window.webContents.send('database-changed', change);
      });
    });

    console.log('Started watching database changes');
  } catch (err) {
    console.error('Error watching database changes:', err);
  }
}

ipcMain.on('quit-and-install', () => {
  autoUpdater.quitAndInstall();
});