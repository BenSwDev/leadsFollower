// notificationRenderer.js

let lead;

// Function to show custom modal messages
function showModalMessage(message) {
  const modalOverlay = document.getElementById('modalOverlay');
  const modalMessage = document.getElementById('modalMessage');
  const modalOkButton = document.getElementById('modalOkButton');

  modalMessage.textContent = message;
  modalOverlay.style.display = 'flex';

  modalOkButton.onclick = () => {
    modalOverlay.style.display = 'none';
  };
}

api.onLeadData((leadData) => {
  lead = leadData;
  document.getElementById('leadName').textContent = lead.fullName;
});

document.getElementById('okButton').addEventListener('click', () => {
  showModalMessage("Don't forget to update the details after talking to the lead.");
  api.sendAction(lead._id, 'ok');
});

document.getElementById('remindLaterButton').addEventListener('click', () => {
  document.getElementById('remindOptionsContainer').style.display = 'block';
});

document.getElementById('remindOptions').addEventListener('change', () => {
  const remindOptions = document.getElementById('remindOptions');
  const customDateTime = document.getElementById('customDateTime');
  if (remindOptions.value === 'custom') {
    customDateTime.style.display = 'block';
  } else {
    customDateTime.style.display = 'none';
  }
});

document.getElementById('setRemindButton').addEventListener('click', () => {
  let newFollowUpTime = null;
  const remindOptions = document.getElementById('remindOptions');
  const customDateTime = document.getElementById('customDateTime');

  if (remindOptions.value === 'custom') {
    if (customDateTime.value) {
      newFollowUpTime = new Date(customDateTime.value).toISOString();
      if (new Date(newFollowUpTime) <= new Date()) {
        showModalMessage('Please select a future date and time.');
        return;
      }
    } else {
      showModalMessage('Please select a valid date and time.');
      return;
    }
  } else {
    const minutes = parseInt(remindOptions.value);
    newFollowUpTime = new Date(Date.now() + minutes * 60000).toISOString();
  }

  api.sendAction(lead._id, 'remind-later', { newFollowUpTime });
});

document.getElementById('whatsappCheckbox').addEventListener('change', (event) => {
  const whatsappMessageContainer = document.getElementById('whatsappMessageContainer');
  if (event.target.checked) {
    whatsappMessageContainer.style.display = 'block';
  } else {
    whatsappMessageContainer.style.display = 'none';
  }
});

document.getElementById('sendWhatsappButton').addEventListener('click', () => {
  const message = document.getElementById('whatsappMessage').value;
  if (!message.trim()) {
    showModalMessage('Please enter a message.');
    return;
  }
  api.sendAction(lead._id, 'send-whatsapp', { message });
});
