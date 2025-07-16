import { mapService } from './map-service.js';
import { droneService } from './drone-service.js';
import { incidentService } from './incident-service.js';

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('map')) {
    initDashboard();
  }
});

async function initDashboard() {
  // Initialize map
  mapService.initMap('map');

  // Load initial drone status
  updateDroneStatus();
  setInterval(updateDroneStatus, 5000);

  // Simulate occasional incidents
  if (CONFIG.USE_MOCK) {
    setInterval(() => {
      if (Math.random() > 0.7) {
        incidentService.generateMockIncident().then(() => {
          mapService.updateMap();
          showNotification('New incident detected');
        });
      }
    }, 10000);
  }
}

async function updateDroneStatus() {
  const drones = await droneService.getAllDroneStatuses();
  
  // Update fleet summary
  const avgBattery = drones.reduce((sum, drone) => sum + drone.battery, 0) / drones.length;
  document.querySelector('.avg-battery').textContent = `${avgBattery.toFixed(0)}% AVG`;
  document.querySelector('.battery-bar').style.setProperty('--level', `${avgBattery.toFixed(0)}%`);

  // Update drone list
  const droneList = document.querySelector('.drone-list');
  droneList.innerHTML = '';
  drones.forEach(drone => {
    const item = document.createElement('div');
    item.className = 'drone-list-item';
    item.innerHTML = `
      <span class="drone-id">${drone.id}</span>
      <span class="battery-status ${drone.battery < 30 ? 'warning' : 'online'}">
        ${drone.battery.toFixed(0)}%
      </span>
    `;
    droneList.appendChild(item);
  });
}

function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'alert-item warning fade-in';
  notification.innerHTML = `
    <span class="alert-type">ALERT</span>
    <span class="alert-location">${message}</span>
    <span class="alert-time">JUST NOW</span>
  `;
  document.querySelector('.notification .status-content').prepend(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 5000);
}