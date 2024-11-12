// notificationPreload.js

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  onLeadData: (callback) => ipcRenderer.on('lead-data', (event, leadData) => callback(leadData)),
  sendAction: (leadId, action, data) => ipcRenderer.send(`notification-action-${leadId}`, action, data)
});
