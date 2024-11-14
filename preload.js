// preload.js

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getLeads: async () => {
    return await ipcRenderer.invoke('get-leads');
  },
  addLead: async (lead) => {
    return await ipcRenderer.invoke('add-lead', lead);
  },
  updateLead: async (lead) => {
    return await ipcRenderer.invoke('update-lead', lead);
  },
  deleteLead: async (id) => {
    return await ipcRenderer.invoke('delete-lead', id);
  },
  addDetail: async (leadId, detail, followUp) => {
    return await ipcRenderer.invoke('add-detail', leadId, detail, followUp);
  },
  updateDetail: async (leadId, detailId, newText, followUp) => {
    return await ipcRenderer.invoke('update-detail', leadId, detailId, newText, followUp);
  },
  deleteDetail: async (leadId, detailId) => {
    return await ipcRenderer.invoke('delete-detail', leadId, detailId);
  },
  sendFollowUpDue: (lead) => {
    ipcRenderer.send('follow-up-due', lead);
  },
  onReloadLeads: (callback) => {
    ipcRenderer.on('reload-leads', callback);
  },
  onDatabaseChange: (callback) => {
    ipcRenderer.on('database-changed', (event, change) => callback(change));
  },
  onUpdateAvailable: (callback) => ipcRenderer.on('update_available', callback),
  onUpdateNotAvailable: (callback) => ipcRenderer.on('update_not_available', callback),
  onUpdateError: (callback) => ipcRenderer.on('update_error', callback),
  onDownloadProgress: (callback) => ipcRenderer.on('download_progress', callback),
  onUpdateDownloaded: (callback) => ipcRenderer.on('update_downloaded', callback),
  quitAndInstall: () => autoUpdater.quitAndInstall(), // Add this line

});
