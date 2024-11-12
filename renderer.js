// renderer.js

// Get references to table bodies
const activeLeadsTableBody = document.querySelector('#activeLeadsTable tbody');
const inactiveLeadsTableBody = document.querySelector('#inactiveLeadsTable tbody');

const addLeadForm = document.getElementById('addLeadForm');
const editLeadForm = document.getElementById('editLeadForm');
const editDetailForm = document.getElementById('editDetailForm');

const fullNameInput = document.getElementById('fullName');
const phoneInput = document.getElementById('phone');
const emailInput = document.getElementById('email');
const detailsInput = document.getElementById('details');
const sourceInput = document.getElementById('source');

const editLeadIdInput = document.getElementById('editLeadId');
const editFullNameInput = document.getElementById('editFullName');
const editPhoneInput = document.getElementById('editPhone');
const editEmailInput = document.getElementById('editEmail');
const editSourceInput = document.getElementById('editSource');

// Edit Detail Modal Inputs
const editDetailLeadIdInput = document.getElementById('editDetailLeadId');
const editDetailIdInput = document.getElementById('editDetailId');
const editDetailTextInput = document.getElementById('editDetailText');
const editDetailFollowUpInput = document.getElementById('editDetailFollowUp');

const languageDropdown = document.getElementById('languageDropdown');

let leads = [];
let currentLanguage = 'en';

// Set an interval to check for due follow-ups every minute
setInterval(checkForDueFollowUps, 6000);

// Initialize Bootstrap modals
const addLeadModal = new bootstrap.Modal(document.getElementById('addLeadModal'));
const editLeadModal = new bootstrap.Modal(document.getElementById('editLeadModal'));
const editDetailModal = new bootstrap.Modal(document.getElementById('editDetailModal'));

// Language switch via dropdown
languageDropdown.addEventListener('change', () => {
  currentLanguage = languageDropdown.value;
  applyTranslations();
  renderLeads();
});

// Language strings
const translations = {
  en: {
    title: "Leads Manager",
    header: "Leads Manager",
    fullName: "Full Name",
    phone: "Phone",
    email: "Email",
    details: "Details",
    source: "Source",
    addedAt: "Added At",
    lastContact: "Last Contact",
    followUp: "Follow Up",
    actions: "Actions",
    id: "ID",
    addLead: "Add Lead",
    edit: "Edit",
    delete: "Delete",
    confirmDelete: "Are you sure you want to delete this lead?",
    confirmDeleteDetail: "Are you sure you want to delete this detail?",
    close: "Close",
    saveChanges: "Save Changes",
    editLead: "Edit Lead",
    requiredFields: "Full Name, Phone, and Email are required.",
    requiredDetail: "Detail text is required.",
    addDetail: "Add Detail",
    addNewDetail: "Add New Detail",
    editDetail: "Edit Detail",
    detailText: "Detail Text",
    viewDetails: "View Details",
    leadDeleted: "Lead deleted successfully.",
    detailDeleted: "Detail deleted successfully.",
    leadAdded: "Lead added successfully.",
    leadUpdated: "Lead updated successfully.",
    detailAdded: "Detail added successfully.",
    detailUpdated: "Detail updated successfully.",
    followUpSet: "Follow-up set successfully.",
    followUpRemoved: "Follow-up removed successfully.",
    failedToDeleteLead: "Failed to delete lead.",
    failedToDeleteDetail: "Failed to delete detail.",
    failedToAddLead: "Failed to add lead.",
    failedToUpdateLead: "Failed to update lead.",
    failedToAddDetail: "Failed to add detail.",
    failedToUpdateDetail: "Failed to update detail.",
    failedToSetFollowUp: "Failed to set follow-up.",
    failedToRemoveFollowUp: "Failed to remove follow-up.",
    editFollowUp: "Edit Follow-Up",
    cancel: "Cancel",
    confirm: "Confirm",
    activeLeads: "Active Leads",
    inactiveLeads: "Inactive Leads",
    noDetailsAvailable: "No details available.",
    detailTextRequired: "Detail text is required.",
    detailCannotDeleteLast: "Cannot delete the last detail. A lead must have at least one detail.",
    leadNotFound: "Lead not found.",
    pleaseSelectValidDateTime: "Please select a valid date and time.",
    followUpUpdated: "Follow-up updated.",
    failedToUpdateFollowUp: "Failed to update follow-up.",
    followUpRescheduled: "Follow-up rescheduled.",
    failedToRescheduleFollowUp: "Failed to reschedule follow-up.",
    leadDeactivated: "Lead deactivated successfully.",
    leadActivated: "Lead activated successfully.",
    failedToUpdateLeadStatus: "Failed to update lead status.",
    followUpTimeInFuture: "Follow-up time must be in the future.",
    whatsapp: "WhatsApp",
    add: "Add",
    dismiss: "Dismiss",
    remindMeLater: "Remind Me Later",
    inXMinutes: "In {minutes} minutes",
    pickDateTime: "Pick date and time"
  },
  he: {
    title: "ניהול לידים",
    header: "ניהול לידים",
    fullName: "שם מלא",
    phone: "טלפון",
    email: "אימייל",
    details: "פרטים",
    source: "מקור",
    addedAt: "נוסף בתאריך",
    lastContact: "תאריך יצירת קשר אחרון",
    followUp: "מעקב",
    actions: "פעולות",
    id: "מזהה",
    addLead: "הוסף ליד",
    edit: "ערוך",
    delete: "מחק",
    confirmDelete: "האם אתה בטוח שברצונך למחוק את הליד?",
    confirmDeleteDetail: "האם אתה בטוח שברצונך למחוק את הפרט?",
    close: "סגור",
    saveChanges: "שמור שינויים",
    editLead: "ערוך ליד",
    requiredFields: "שם מלא, טלפון ואימייל הם שדות חובה.",
    requiredDetail: "טקסט לפרט הוא שדה חובה.",
    addDetail: "הוסף פרט",
    addNewDetail: "הוסף פרט חדש",
    editDetail: "ערוך פרט",
    detailText: "טקסט לפרט",
    viewDetails: "הצג פרטים",
    leadDeleted: "הליד נמחק בהצלחה.",
    detailDeleted: "הפרט נמחק בהצלחה.",
    leadAdded: "הליד נוסף בהצלחה.",
    leadUpdated: "הליד עודכן בהצלחה.",
    detailAdded: "הפרט נוסף בהצלחה.",
    detailUpdated: "הפרט עודכן בהצלחה.",
    followUpSet: "מעקב הוגדר בהצלחה.",
    followUpRemoved: "מעקב הוסר בהצלחה.",
    failedToDeleteLead: "נכשל במחיקת הליד.",
    failedToDeleteDetail: "נכשל במחיקת הפרט.",
    failedToAddLead: "נכשל בהוספת הליד.",
    failedToUpdateLead: "נכשל בעדכון הליד.",
    failedToAddDetail: "נכשל בהוספת הפרט.",
    failedToUpdateDetail: "נכשל בעדכון הפרט.",
    failedToSetFollowUp: "נכשל בהגדרת המעקב.",
    failedToRemoveFollowUp: "נכשל בהסרת המעקב.",
    editFollowUp: "ערוך מעקב",
    cancel: "ביטול",
    confirm: "אישור",
    activeLeads: "לידים פעילים",
    inactiveLeads: "לידים לא פעילים",
    noDetailsAvailable: "אין פרטים זמינים.",
    detailTextRequired: "טקסט לפרט הוא שדה חובה.",
    detailCannotDeleteLast: "לא ניתן למחוק את הפרט האחרון. ליד חייב לכלול לפחות פרט אחד.",
    leadNotFound: "הליד לא נמצא.",
    pleaseSelectValidDateTime: "אנא בחר תאריך ושעה תקינים.",
    followUpUpdated: "המעקב עודכן בהצלחה.",
    failedToUpdateFollowUp: "נכשל בעדכון המעקב.",
    followUpRescheduled: "המעקב תוזמן מחדש.",
    failedToRescheduleFollowUp: "נכשל בתזמון המעקב מחדש.",
    leadDeactivated: "הליד הושבת בהצלחה.",
    leadActivated: "הליד הופעל בהצלחה.",
    failedToUpdateLeadStatus: "נכשל בעדכון מצב הליד.",
    followUpTimeInFuture: "זמן המעקב חייב להיות בעתיד.",
    whatsapp: "וואטסאפ",
    add: "הוסף",
    dismiss: "התעלם",
    remindMeLater: "הזכר לי מאוחר יותר",
    inXMinutes: "בעוד {minutes} דקות",
    pickDateTime: "בחר תאריך ושעה"
  }
};

// Function to apply translations and direction
function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (translations[currentLanguage][key]) {
      element.textContent = translations[currentLanguage][key];
    }
  });

  // Set text direction based on language
  const htmlRoot = document.getElementById('htmlRoot');
  if (currentLanguage === 'he') {
    htmlRoot.setAttribute('dir', 'rtl');
    // Adjust language dropdown position for RTL
    languageDropdown.parentElement.classList.remove('text-end');
    languageDropdown.parentElement.classList.add('text-start');
  } else {
    htmlRoot.setAttribute('dir', 'ltr');
    // Adjust language dropdown position for LTR
    languageDropdown.parentElement.classList.remove('text-start');
    languageDropdown.parentElement.classList.add('text-end');
  }
}

// Function to show alerts using Bootstrap alerts
function showAlert(message, type = 'success', duration = 3000) {
  const alertContainer = document.getElementById('alertContainer');
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
  alertDiv.role = 'alert';
  alertDiv.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;
  alertContainer.appendChild(alertDiv);
  // Remove alert after duration
  setTimeout(() => {
    alertDiv.classList.remove('show');
    alertDiv.classList.add('hide');
    alertDiv.addEventListener('transitionend', () => alertDiv.remove());
  }, duration);
}

// Function to show confirmation and return a Promise
function confirmAction(message) {
  return new Promise((resolve) => {
    const confirmationContainer = document.getElementById('confirmationContainer');
    const confirmationMessage = document.getElementById('confirmationMessage');
    const confirmBtn = document.getElementById('confirmConfirmationBtn');
    const cancelBtn = document.getElementById('cancelConfirmationBtn');

    confirmationMessage.textContent = message;

    // Show the confirmation container
    confirmationContainer.style.display = 'block';

    // Define handlers
    const handleConfirm = () => {
      cleanup();
      resolve(true);
    };

    const handleCancel = () => {
      cleanup();
      resolve(false);
    };

    const cleanup = () => {
      confirmBtn.removeEventListener('click', handleConfirm);
      cancelBtn.removeEventListener('click', handleCancel);
      confirmationContainer.style.display = 'none';
    };

    confirmBtn.addEventListener('click', handleConfirm);
    cancelBtn.addEventListener('click', handleCancel);
  });
}

// Function to render leads in the table
function renderLeads() {
  activeLeadsTableBody.innerHTML = '';
  inactiveLeadsTableBody.innerHTML = '';
  const currentTime = new Date();

  leads.forEach((lead) => {
    const row = document.createElement('tr');

    // Check if follow-up is overdue
    if (lead.followUp) {
      const followUpTime = new Date(lead.followUp);
      if (followUpTime < currentTime && !lead.followUpCompleted) {
        row.classList.add('table-danger');
      }
    }

    // Full Name
    const nameCell = document.createElement('td');
    nameCell.textContent = lead.fullName;
    row.appendChild(nameCell);

    // Phone
    const phoneCell = document.createElement('td');
    phoneCell.textContent = lead.phone;
    row.appendChild(phoneCell);

    // Email
    const emailCell = document.createElement('td');
    emailCell.textContent = lead.email;
    row.appendChild(emailCell);

    // Details (Button to toggle details)
    const detailsCell = document.createElement('td');
    const detailsButton = document.createElement('button');
    detailsButton.type = 'button';
    detailsButton.classList.add('btn', 'btn-info', 'btn-sm');
    const detailsCount = lead.details ? lead.details.length : 0;
    detailsButton.textContent = `Show ${detailsCount} Details`;
    detailsButton.addEventListener('click', () => {
      // Close any other open details
      document.querySelectorAll('.details-row').forEach(dr => {
        if (dr.id !== `details-row-${lead._id}`) {
          dr.classList.add('hide');
          setTimeout(() => {
            dr.style.display = 'none';
          }, 300);
        }
      });
      // Toggle current details
      const detailsRow = document.getElementById(`details-row-${lead._id}`);
      if (detailsRow.style.display === 'none') {
        detailsRow.style.display = '';
        detailsButton.textContent = `Hide ${detailsCount} Details`;
      } else {
        detailsRow.classList.add('hide');
        setTimeout(() => {
          detailsRow.style.display = 'none';
        }, 300);
        detailsButton.textContent = `Show ${detailsCount} Details`;
      }
    });
    detailsCell.appendChild(detailsButton);
    row.appendChild(detailsCell);

    // Source
    const sourceCell = document.createElement('td');
    sourceCell.textContent = lead.source;
    row.appendChild(sourceCell);

    // Added At
    const addedAtCell = document.createElement('td');
    addedAtCell.textContent = formatDateTime(lead.addedAt);
    row.appendChild(addedAtCell);

    // Last Contact
    const lastContactCell = document.createElement('td');
    lastContactCell.textContent = formatDateTime(lead.lastContact);
    row.appendChild(lastContactCell);

    // Follow Up (Edit Follow-Up button)
    const followUpCell = document.createElement('td');

    // Display follow-up time or 'None'
    const followUpText = document.createElement('span');
    followUpText.textContent = lead.followUp ? formatDateTime(lead.followUp) : 'None';
    followUpCell.appendChild(followUpText);

    // Edit Follow-Up button
    const editFollowUpButton = document.createElement('button');
    editFollowUpButton.type = 'button';
    editFollowUpButton.classList.add('btn', 'btn-sm', 'btn-secondary', 'ms-2');
    editFollowUpButton.textContent = translations[currentLanguage].editFollowUp;
    editFollowUpButton.addEventListener('click', () => {
      openFollowUpModal(lead);
    });
    followUpCell.appendChild(editFollowUpButton);

    row.appendChild(followUpCell);

    // Actions (Edit, Delete, WhatsApp, Activate/Deactivate)
    const actionsCell = document.createElement('td');
    actionsCell.classList.add('actions');

    // Edit Button
    const editButton = document.createElement('button');
    editButton.type = 'button';
    editButton.classList.add('btn', 'btn-warning', 'btn-sm');
    editButton.textContent = translations[currentLanguage].edit;
    editButton.addEventListener('click', () => {
      openEditModal(lead._id);
    });
    actionsCell.appendChild(editButton);

    // Delete Button
    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.classList.add('btn', 'btn-danger', 'btn-sm');
    deleteButton.textContent = translations[currentLanguage].delete;
    deleteButton.addEventListener('click', () => {
      deleteLeadHandler(lead._id);
    });
    actionsCell.appendChild(deleteButton);

    // WhatsApp Button
    const whatsappButton = document.createElement('button');
    whatsappButton.type = 'button';
    whatsappButton.classList.add('btn', 'btn-success', 'btn-sm');
    whatsappButton.textContent = translations[currentLanguage].whatsapp;
    whatsappButton.addEventListener('click', () => {
      initiateWhatsApp(lead.phone, lead.fullName);
    });
    actionsCell.appendChild(whatsappButton);

    // Activate/Deactivate Button
    const statusButton = document.createElement('button');
    statusButton.type = 'button';
    statusButton.classList.add('btn', 'btn-secondary', 'btn-sm');
    statusButton.textContent = lead.active !== false ? 'Deactivate' : 'Activate';
    statusButton.addEventListener('click', async () => {
      try {
        await window.api.updateLead({ id: lead._id, active: !lead.active });
        await loadLeads();
        showAlert(`Lead ${lead.active !== false ? 'deactivated' : 'activated'} successfully.`, 'success');
      } catch (error) {
        console.error('Error updating lead status:', error);
        showAlert(translations[currentLanguage].failedToUpdateLeadStatus, 'danger');
      }
    });
    actionsCell.appendChild(statusButton);

    row.appendChild(actionsCell);

    // Details Row
    const detailsRow = document.createElement('tr');
    detailsRow.id = `details-row-${lead._id}`;
    detailsRow.style.display = 'none';
    detailsRow.classList.add('details-row');

    const detailsCellRow = document.createElement('td');
    detailsCellRow.colSpan = 9; // Adjust based on number of columns

    // Details Table
    const detailsTable = document.createElement('table');
    detailsTable.classList.add('table', 'table-bordered');

    const detailsTbody = document.createElement('tbody');

    if (lead.details && lead.details.length > 0) {
      lead.details.forEach((detail, index) => {
        const detailRow = document.createElement('tr');

        const detailTextCell = document.createElement('td');
        detailTextCell.textContent = detail.text;
        detailRow.appendChild(detailTextCell);

        const detailTimestampCell = document.createElement('td');
        detailTimestampCell.textContent = formatDateTime(detail.timestamp);
        detailRow.appendChild(detailTimestampCell);

        const detailActionsCell = document.createElement('td');

        // Only the last detail can be edited/deleted
        if (index === lead.details.length - 1) {
          // Edit Detail Button
          const editDetailButton = document.createElement('button');
          editDetailButton.type = 'button';
          editDetailButton.classList.add('btn', 'btn-sm', 'btn-warning', 'ms-2');
          editDetailButton.textContent = translations[currentLanguage].edit;
          editDetailButton.addEventListener('click', () => {
            openEditDetailModal(lead._id, detail.id, detail.text, lead.followUp);
          });
          detailActionsCell.appendChild(editDetailButton);

          // Delete Detail Button
          const deleteDetailButton = document.createElement('button');
          deleteDetailButton.type = 'button';
          deleteDetailButton.classList.add('btn', 'btn-sm', 'btn-danger', 'ms-2');
          deleteDetailButton.textContent = translations[currentLanguage].delete;
          deleteDetailButton.addEventListener('click', () => {
            deleteDetail(lead._id, detail.id);
          });
          detailActionsCell.appendChild(deleteDetailButton);
        }

        detailRow.appendChild(detailActionsCell);

        detailsTbody.appendChild(detailRow);
      });
    } else {
      const noDetailsRow = document.createElement('tr');
      const noDetailsCell = document.createElement('td');
      noDetailsCell.colSpan = 3;
      noDetailsCell.textContent = translations[currentLanguage].noDetailsAvailable;
      noDetailsRow.appendChild(noDetailsCell);
      detailsTbody.appendChild(noDetailsRow);
    }

    // Add Detail Form
    const addDetailRow = document.createElement('tr');
    const addDetailCell = document.createElement('td');
    addDetailCell.colSpan = 3;

    const addDetailForm = document.createElement('form');
    addDetailForm.classList.add('d-flex', 'align-items-center');

    const detailInput = document.createElement('input');
    detailInput.type = 'text';
    detailInput.classList.add('form-control', 'form-control-sm', 'me-2');
    detailInput.placeholder = translations[currentLanguage].addNewDetail;
    addDetailForm.appendChild(detailInput);

    // Follow-Up Options
    const followUpSelect = document.createElement('select');
    followUpSelect.classList.add('form-select', 'form-select-sm', 'me-2');
    followUpSelect.innerHTML = `
      <option value="">No Follow-Up</option>
      <option value="5">${translations[currentLanguage].inXMinutes.replace('{minutes}', '5')}</option>
      <option value="10">${translations[currentLanguage].inXMinutes.replace('{minutes}', '10')}</option>
      <option value="15">${translations[currentLanguage].inXMinutes.replace('{minutes}', '15')}</option>
      <option value="30">${translations[currentLanguage].inXMinutes.replace('{minutes}', '30')}</option>
      <option value="60">${translations[currentLanguage].inXMinutes.replace('{minutes}', '60')}</option>
      <option value="120">${translations[currentLanguage].inXMinutes.replace('{minutes}', '120')}</option>
      <option value="180">${translations[currentLanguage].inXMinutes.replace('{minutes}', '180')}</option>
      <option value="custom">${translations[currentLanguage].pickDateTime}</option>
    `;
    addDetailForm.appendChild(followUpSelect);

    const customDateTimeInput = document.createElement('input');
    customDateTimeInput.type = 'datetime-local';
    customDateTimeInput.classList.add('form-control', 'form-control-sm', 'me-2');
    customDateTimeInput.style.display = 'none';
    addDetailForm.appendChild(customDateTimeInput);

    followUpSelect.addEventListener('change', () => {
      if (followUpSelect.value === 'custom') {
        customDateTimeInput.style.display = 'block';
      } else {
        customDateTimeInput.style.display = 'none';
      }
    });

    const addDetailButton = document.createElement('button');
    addDetailButton.type = 'submit';
    addDetailButton.classList.add('btn', 'btn-primary', 'btn-sm');
    addDetailButton.textContent = translations[currentLanguage].add;
    addDetailForm.appendChild(addDetailButton);

    addDetailForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const detailText = detailInput.value.trim();
      let followUpTime = null;

      if (followUpSelect.value === 'custom') {
        if (customDateTimeInput.value) {
          followUpTime = new Date(customDateTimeInput.value).toISOString();
          if (new Date(followUpTime) <= new Date()) {
            showAlert(translations[currentLanguage].followUpTimeInFuture, 'danger');
            return;
          }
        } else {
          showAlert(translations[currentLanguage].pleaseSelectValidDateTime, 'danger');
          return;
        }
      } else if (followUpSelect.value) {
        const minutes = parseInt(followUpSelect.value);
        followUpTime = new Date(Date.now() + minutes * 60000).toISOString();
      }

      if (detailText) {
        try {
          await window.api.addDetail(lead._id, { text: detailText }, followUpTime);
          await loadLeads();
          showAlert(translations[currentLanguage].detailAdded, 'success');
          // Keep the details section open
          const detailsRow = document.getElementById(`details-row-${lead._id}`);
          detailsRow.style.display = '';
        } catch (error) {
          console.error('Error adding detail:', error);
          showAlert(translations[currentLanguage].failedToAddDetail, 'danger');
        }
      } else {
        showAlert(translations[currentLanguage].detailTextRequired, 'danger');
      }
    });

    addDetailCell.appendChild(addDetailForm);
    addDetailRow.appendChild(addDetailCell);
    detailsTbody.appendChild(addDetailRow);

    detailsTable.appendChild(detailsTbody);
    detailsCellRow.appendChild(detailsTable);
    detailsRow.appendChild(detailsCellRow);

    // Append the row to the appropriate table
    if (lead.active !== false) {
      // Default to active if 'active' field is missing
      activeLeadsTableBody.appendChild(row);
      activeLeadsTableBody.appendChild(detailsRow);
    } else {
      inactiveLeadsTableBody.appendChild(row);
      inactiveLeadsTableBody.appendChild(detailsRow);
    }
  });
}

// Function to format date and time
function formatDateTime(dateTime) {
  if (!dateTime) return '-';
  const date = new Date(dateTime);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

// Helper function to format date and time for datetime-local input
function formatDateTimeLocal(dateTime) {
  const date = new Date(dateTime);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
}

// Function to load leads from server
async function loadLeads() {
  try {
    leads = await window.api.getLeads();
    renderLeads();
  } catch (err) {
    console.error('Error loading leads:', err);
    showAlert('Failed to load leads.', 'danger');
  }
}

// Add Lead
addLeadForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const fullName = fullNameInput.value.trim();
  const phone = phoneInput.value.trim();
  const email = emailInput.value.trim();
  const details = detailsInput.value.trim();
  const source = sourceInput.value.trim();

  if (fullName && phone && email) {
    try {
      const currentTimestamp = new Date().toISOString();
      const newDetails = details ? [{
        id: Date.now().toString(),
        text: details,
        timestamp: currentTimestamp,
        canDelete: false
      }] : [];

      const newLead = {
        fullName,
        phone,
        email,
        details: newDetails,
        source,
        addedAt: currentTimestamp,
        lastContact: currentTimestamp,
        followUp: null,
        followUpNotified: false,
        contacted: false,
        active: true
      };

      const addedLead = await window.api.addLead(newLead);
      leads.push(addedLead);
      renderLeads();
      addLeadForm.reset();
      addLeadModal.hide();
      showAlert(translations[currentLanguage].leadAdded, 'success');
    } catch (error) {
      console.error('Error adding lead:', error);
      showAlert(translations[currentLanguage].failedToAddLead, 'danger');
    }
  } else {
    showAlert(translations[currentLanguage].requiredFields, 'danger');
  }
});

// Open Edit Modal with lead data
function openEditModal(id) {
  const lead = leads.find(l => l._id === id);
  if (!lead) {
    console.error(`Lead with ID ${id} not found.`);
    showAlert(translations[currentLanguage].leadNotFound, 'danger');
    return;
  }

  editLeadIdInput.value = lead._id;
  editFullNameInput.value = lead.fullName;
  editPhoneInput.value = lead.phone;
  editEmailInput.value = lead.email;
  editSourceInput.value = lead.source;

  editLeadModal.show();
}

// Edit Lead
editLeadForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = editLeadIdInput.value;
  const fullName = editFullNameInput.value.trim();
  const phone = editPhoneInput.value.trim();
  const email = editEmailInput.value.trim();
  const source = editSourceInput.value.trim();

  if (fullName && phone && email) {
    try {
      const updatedLead = {
        id,
        fullName,
        phone,
        email,
        source
      };
      await window.api.updateLead(updatedLead);
      await loadLeads();
      editLeadForm.reset();
      editLeadModal.hide();
      showAlert(translations[currentLanguage].leadUpdated, 'success');
    } catch (error) {
      console.error('Error updating lead:', error);
      showAlert(translations[currentLanguage].failedToUpdateLead, 'danger');
    }
  } else {
    showAlert(translations[currentLanguage].requiredFields, 'danger');
  }
});

// Delete Lead
async function deleteLeadHandler(id) {
  const confirmed = await confirmAction(translations[currentLanguage].confirmDelete);
  if (confirmed) {
    try {
      editLeadModal.hide();
      editDetailModal.hide();

      await window.api.deleteLead(id);
      await loadLeads();

      document.activeElement.blur();

      showAlert(translations[currentLanguage].leadDeleted, 'success');
    } catch (error) {
      console.error('Error deleting lead:', error);
      showAlert(translations[currentLanguage].failedToDeleteLead, 'danger');
    }
  }
}

// Open Edit Detail Modal
function openEditDetailModal(leadId, detailId, currentText, currentFollowUp) {
  editDetailLeadIdInput.value = leadId;
  editDetailIdInput.value = detailId;
  editDetailTextInput.value = currentText;

  // Follow-Up Options
  const followUpSelect = document.createElement('select');
  followUpSelect.classList.add('form-select', 'form-select-sm', 'me-2');
  followUpSelect.innerHTML = `
    <option value="">${translations[currentLanguage].noFollowUp}</option>
    <option value="5">${translations[currentLanguage].inXMinutes.replace('{minutes}', '5')}</option>
    <option value="10">${translations[currentLanguage].inXMinutes.replace('{minutes}', '10')}</option>
    <option value="15">${translations[currentLanguage].inXMinutes.replace('{minutes}', '15')}</option>
    <option value="30">${translations[currentLanguage].inXMinutes.replace('{minutes}', '30')}</option>
    <option value="60">${translations[currentLanguage].inXMinutes.replace('{minutes}', '60')}</option>
    <option value="120">${translations[currentLanguage].inXMinutes.replace('{minutes}', '120')}</option>
    <option value="180">${translations[currentLanguage].inXMinutes.replace('{minutes}', '180')}</option>
    <option value="custom">${translations[currentLanguage].pickDateTime}</option>
  `;
  const customDateTimeInput = document.createElement('input');
  customDateTimeInput.type = 'datetime-local';
  customDateTimeInput.classList.add('form-control', 'form-control-sm', 'me-2');
  customDateTimeInput.style.display = 'none';

  const followUpContainer = document.getElementById('editDetailFollowUpContainer');
  followUpContainer.innerHTML = '';
  followUpContainer.appendChild(followUpSelect);
  followUpContainer.appendChild(customDateTimeInput);

  followUpSelect.addEventListener('change', () => {
    if (followUpSelect.value === 'custom') {
      customDateTimeInput.style.display = 'block';
    } else {
      customDateTimeInput.style.display = 'none';
    }
  });

  editDetailForm.followUpSelect = followUpSelect;
  editDetailForm.customDateTimeInput = customDateTimeInput;

  editDetailModal.show();
}

// Edit Detail
editDetailForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const leadId = editDetailLeadIdInput.value;
  const detailId = editDetailIdInput.value;
  const newText = editDetailTextInput.value.trim();

  let followUpTime = null;
  const followUpSelect = editDetailForm.followUpSelect;
  const customDateTimeInput = editDetailForm.customDateTimeInput;

  if (followUpSelect.value === 'custom') {
    if (customDateTimeInput.value) {
      followUpTime = new Date(customDateTimeInput.value).toISOString();
      if (new Date(followUpTime) <= new Date()) {
        showAlert(translations[currentLanguage].followUpTimeInFuture, 'danger');
        return;
      }
    } else {
      showAlert(translations[currentLanguage].pleaseSelectValidDateTime, 'danger');
      return;
    }
  } else if (followUpSelect.value) {
    const minutes = parseInt(followUpSelect.value);
    followUpTime = new Date(Date.now() + minutes * 60000).toISOString();
  }

  if (newText) {
    try {
      await window.api.updateDetail(leadId, detailId, newText, followUpTime);
      await loadLeads();
      editDetailForm.reset();
      editDetailModal.hide();
      showAlert(translations[currentLanguage].detailUpdated, 'success');
      // Keep the details section open
      const detailsRow = document.getElementById(`details-row-${leadId}`);
      detailsRow.style.display = '';
    } catch (error) {
      console.error('Error updating detail:', error);
      showAlert(translations[currentLanguage].failedToUpdateDetail, 'danger');
    }
  } else {
    showAlert(translations[currentLanguage].detailTextRequired, 'danger');
  }
});

// Delete Detail
async function deleteDetail(leadId, detailId) {
  const lead = leads.find(l => l._id === leadId);
  if (!lead) {
    showAlert(translations[currentLanguage].leadNotFound, 'danger');
    return;
  }
  if (lead.details.length <= 1) {
    showAlert(translations[currentLanguage].detailCannotDeleteLast, 'danger');
    return;
  }
  const confirmed = await confirmAction(translations[currentLanguage].confirmDeleteDetail);
  if (confirmed) {
    try {
      await window.api.deleteDetail(leadId, detailId);
      await loadLeads();
      showAlert(translations[currentLanguage].detailDeleted, 'success');
      // Keep the details section open
      const detailsRow = document.getElementById(`details-row-${leadId}`);
      detailsRow.style.display = '';
    } catch (error) {
      console.error('Error deleting detail:', error);
      showAlert(translations[currentLanguage].failedToDeleteDetail, 'danger');
    }
  }
}

// Initiate WhatsApp Conversation
function initiateWhatsApp(phone, name) {
  const message = encodeURIComponent(`Hello ${name}, I would like to discuss further.`);
  const url = `https://wa.me/${phone}?text=${message}`;
  window.open(url, '_blank');
}

// Function to open the Follow-Up Modal for editing
function openFollowUpModal(lead) {
  // Create a custom modal for follow-up
  const modalHtml = `
    <div class="modal fade" id="followUpEditModal-${lead._id}" tabindex="-1" aria-labelledby="followUpEditModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="followUpEditModalLabel">${translations[currentLanguage].editFollowUp}</h5>
          </div>
          <div class="modal-body">
            <p>Select a new follow-up time for ${lead.fullName}.</p>
            <div class="mb-3">
              <select id="editRemindOptions-${lead._id}" class="form-select">
                <option value="">${translations[currentLanguage].noFollowUp}</option>
                <option value="5">${translations[currentLanguage].inXMinutes.replace('{minutes}', '5')}</option>
                <option value="10">${translations[currentLanguage].inXMinutes.replace('{minutes}', '10')}</option>
                <option value="15">${translations[currentLanguage].inXMinutes.replace('{minutes}', '15')}</option>
                <option value="30">${translations[currentLanguage].inXMinutes.replace('{minutes}', '30')}</option>
                <option value="60">${translations[currentLanguage].inXMinutes.replace('{minutes}', '60')}</option>
                <option value="120">${translations[currentLanguage].inXMinutes.replace('{minutes}', '120')}</option>
                <option value="180">${translations[currentLanguage].inXMinutes.replace('{minutes}', '180')}</option>
                <option value="custom">${translations[currentLanguage].pickDateTime}</option>
              </select>
            </div>
            <div id="editCustomDateTimeContainer-${lead._id}" style="display: none;">
              <input type="datetime-local" id="editCustomDateTime-${lead._id}" class="form-control" />
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" id="editDismissBtn-${lead._id}">${translations[currentLanguage].cancel}</button>
            <button type="button" class="btn btn-primary" id="editRemindBtn-${lead._id}">${translations[currentLanguage].saveChanges}</button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Append modal to body
  document.body.insertAdjacentHTML('beforeend', modalHtml);

  // Initialize modal
  const followUpEditModal = new bootstrap.Modal(document.getElementById(`followUpEditModal-${lead._id}`));
  followUpEditModal.show();

  // Event listeners
  const editRemindOptions = document.getElementById(`editRemindOptions-${lead._id}`);
  const editCustomDateTimeContainer = document.getElementById(`editCustomDateTimeContainer-${lead._id}`);
  const editCustomDateTimeInput = document.getElementById(`editCustomDateTime-${lead._id}`);
  const editDismissBtn = document.getElementById(`editDismissBtn-${lead._id}`);
  const editRemindBtn = document.getElementById(`editRemindBtn-${lead._id}`);

  editRemindOptions.addEventListener('change', () => {
    if (editRemindOptions.value === 'custom') {
      editCustomDateTimeContainer.style.display = 'block';
    } else {
      editCustomDateTimeContainer.style.display = 'none';
    }
  });

  editDismissBtn.addEventListener('click', () => {
    followUpEditModal.hide();
  });

  editRemindBtn.addEventListener('click', async () => {
    let newFollowUpTime = null;
    if (editRemindOptions.value === 'custom') {
      const customDateTime = editCustomDateTimeInput.value;
      if (customDateTime) {
        newFollowUpTime = new Date(customDateTime).toISOString();
        if (new Date(newFollowUpTime) <= new Date()) {
          showAlert(translations[currentLanguage].followUpTimeInFuture, 'danger');
          return;
        }
      } else {
        showAlert(translations[currentLanguage].pleaseSelectValidDateTime, 'danger');
        return;
      }
    } else if (editRemindOptions.value) {
      const minutes = parseInt(editRemindOptions.value);
      newFollowUpTime = new Date(Date.now() + minutes * 60000).toISOString();
    }

    try {
      await window.api.updateLead({
        id: lead._id,
        followUp: newFollowUpTime,
        followUpNotified: false
      });
      await loadLeads();
      showAlert(translations[currentLanguage].followUpUpdated, 'success');
      followUpEditModal.hide();
    } catch (error) {
      console.error('Error updating follow-up:', error);
      showAlert(translations[currentLanguage].failedToUpdateFollowUp, 'danger');
    }
  });

  // Remove modal from DOM when hidden
  document.getElementById(`followUpEditModal-${lead._id}`).addEventListener('hidden.bs.modal', (e) => {
    e.target.remove();
  });
}

// Function to check for due or overdue follow-ups
async function checkForDueFollowUps() {
  const currentTime = new Date();
  let leadsUpdated = false;
  for (const lead of leads) {
    if (lead.followUp) {
      const followUpTime = new Date(lead.followUp);
      if (followUpTime <= currentTime && !lead.followUpNotified) {
        // Send IPC message to main process to show notification window
        window.api.sendFollowUpDue(lead);
        lead.followUpNotified = true;
        // Update the lead to set followUpNotified flag
        await window.api.updateLead({ id: lead._id, followUpNotified: true });
        leadsUpdated = true;
      }
    }
  }
  if (leadsUpdated) {
    // After updating leads, re-render the leads table
    await loadLeads();
  }
}

// Function to show follow-up notifications with "Remind Me Later" options
function showFollowUpNotification(lead) {
  // Create a custom modal for notification
  const modalHtml = `
    <div class="modal fade" id="followUpModal-${lead._id}" tabindex="-1" aria-labelledby="followUpModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="followUpModalLabel">${translations[currentLanguage].followUp}</h5>
          </div>
          <div class="modal-body">
            <p>It's time to follow up with ${lead.fullName}.</p>
            <p>What would you like to do?</p>
            <div class="mb-3">
              <select id="remindOptions-${lead._id}" class="form-select">
                <option value="">${translations[currentLanguage].noFollowUp}</option>
                <option value="5">${translations[currentLanguage].inXMinutes.replace('{minutes}', '5')}</option>
                <option value="10">${translations[currentLanguage].inXMinutes.replace('{minutes}', '10')}</option>
                <option value="15">${translations[currentLanguage].inXMinutes.replace('{minutes}', '15')}</option>
                <option value="30">${translations[currentLanguage].inXMinutes.replace('{minutes}', '30')}</option>
                <option value="60">${translations[currentLanguage].inXMinutes.replace('{minutes}', '60')}</option>
                <option value="120">${translations[currentLanguage].inXMinutes.replace('{minutes}', '120')}</option>
                <option value="180">${translations[currentLanguage].inXMinutes.replace('{minutes}', '180')}</option>
                <option value="custom">${translations[currentLanguage].pickDateTime}</option>
              </select>
            </div>
            <div id="customDateTimeContainer-${lead._id}" style="display: none;">
              <input type="datetime-local" id="customDateTime-${lead._id}" class="form-control" />
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" id="dismissBtn-${lead._id}">${translations[currentLanguage].dismiss}</button>
            <button type="button" class="btn btn-primary" id="remindBtn-${lead._id}">${translations[currentLanguage].remindMeLater}</button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Append modal to body
  document.body.insertAdjacentHTML('beforeend', modalHtml);

  // Initialize modal
  const followUpModal = new bootstrap.Modal(document.getElementById(`followUpModal-${lead._id}`));
  followUpModal.show();

  // Event listeners
  const remindOptions = document.getElementById(`remindOptions-${lead._id}`);
  const customDateTimeContainer = document.getElementById(`customDateTimeContainer-${lead._id}`);
  const customDateTimeInput = document.getElementById(`customDateTime-${lead._id}`);
  const dismissBtn = document.getElementById(`dismissBtn-${lead._id}`);
  const remindBtn = document.getElementById(`remindBtn-${lead._id}`);

  remindOptions.addEventListener('change', () => {
    if (remindOptions.value === 'custom') {
      customDateTimeContainer.style.display = 'block';
    } else {
      customDateTimeContainer.style.display = 'none';
    }
  });

  dismissBtn.addEventListener('click', () => {
    followUpModal.hide();
  });

  remindBtn.addEventListener('click', async () => {
    let newFollowUpTime = null;
    if (remindOptions.value === 'custom') {
      const customDateTime = customDateTimeInput.value;
      if (customDateTime) {
        newFollowUpTime = new Date(customDateTime).toISOString();
        if (new Date(newFollowUpTime) <= new Date()) {
          showAlert(translations[currentLanguage].followUpTimeInFuture, 'danger');
          return;
        }
      } else {
        showAlert(translations[currentLanguage].pleaseSelectValidDateTime, 'danger');
        return;
      }
    } else if (remindOptions.value) {
      const minutes = parseInt(remindOptions.value);
      newFollowUpTime = new Date(Date.now() + minutes * 60000).toISOString();
    }

    try {
      await window.api.updateLead({
        id: lead._id,
        followUp: newFollowUpTime,
        followUpNotified: false
      });
      await loadLeads();
      showAlert(translations[currentLanguage].followUpRescheduled, 'success');
      followUpModal.hide();
    } catch (error) {
      console.error('Error rescheduling follow-up:', error);
      showAlert(translations[currentLanguage].failedToRescheduleFollowUp, 'danger');
    }
  });

  // Remove modal from DOM when hidden
  document.getElementById(`followUpModal-${lead._id}`).addEventListener('hidden.bs.modal', (e) => {
    e.target.remove();
  });
}

// Initialize the app
window.addEventListener("DOMContentLoaded", () => {
  applyTranslations();
  loadLeads();

  // Start checking for due follow-ups every minute
  checkForDueFollowUps();
  setInterval(checkForDueFollowUps, 6000);

  // Listen for reload-leads message from main process
  window.api.onReloadLeads(() => {
    loadLeads();
  });
});

window.api.onDatabaseChange((change) => {
  loadLeads();
});
