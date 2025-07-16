// Initializes control page with telemetry updates and manual control events.
// Periodically fetch updated drone telemetry
// Send 'recall' or 'land' commands with confirmation


import { droneService } from './drone-service.js';

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('manual-recall')) {
    initDroneControls();
  }
});

async function initDroneControls() {
  // Load current drone status
  const droneId = document.getElementById('drone-id').textContent;
  updateTelemetry(droneId);
  
  // Set up refresh interval
  setInterval(() => updateTelemetry(droneId), 3000);

  // Button event listeners
  document.getElementById('manual-recall').addEventListener('click', () => {
    handleDroneCommand(droneId, 'recall');
  });

  document.getElementById('manual-land').addEventListener('click', () => {
    handleDroneCommand(droneId, 'land');
  });

  // View Cam link
  document.getElementById('drone-cam').addEventListener('click', (e) => {
    e.preventDefault();
    droneService.selectDrone(droneId);
    alert(`Drone ${droneId} feed selected. Switch to Live View to see it.`);
  });
}

async function updateTelemetry(droneId) {
  const status = await droneService.getDroneStatus(droneId);
  if (!status) return;

  document.getElementById('drone-location').textContent = 
    `${status.location[0].toFixed(6)}, ${status.location[1].toFixed(6)}`;
  
  document.getElementById('battery-status').textContent = `${status.battery.toFixed(0)}%`;
  document.querySelector('.battery-bar').style.setProperty('--level', `${status.battery.toFixed(0)}%`);
  
  document.getElementById('mission-status').textContent = status.mission.toUpperCase();
}

async function handleDroneCommand(droneId, command) {
  const actions = {
    recall: { text: 'RECALL', confirm: 'Recall drone to base?' },
    land: { text: 'LAND', confirm: 'EMERGENCY LAND drone immediately?' }
  };

  if (!confirm(actions[command].confirm)) return;

  const button = document.getElementById(`manual-${command}`);
  button.disabled = true;
  button.textContent = 'SENDING...';

  try {
    await droneService.sendCommand(droneId, command);
    button.textContent = actions[command].text;
    updateTelemetry(droneId);
  } catch (error) {
    alert(`Error: ${error.message}`);
    button.textContent = actions[command].text;
  } finally {
    button.disabled = false;
  }
}