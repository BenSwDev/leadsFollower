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
});
