// Handles drone state logic for MVP, simulating telemetry updates and commands.

import { CONFIG } from './config.js';

class DroneService {
  constructor() {
    this.drones = CONFIG.DRONES.map(drone => ({
      ...drone,
      battery: 100,
      status: 'standby',
      location: [...drone.baseLocation],
      mission: 'none',
      lastUpdate: Date.now()
    }));
    this.selectedDrone = null;
    this.startTelemetrySimulation();
  }

  startTelemetrySimulation() {
    setInterval(() => {
      this.drones.forEach(drone => {
        // Simulate battery drain
        drone.battery = Math.max(0, drone.battery - (Math.random() * 0.2));
        
        // Simulate location drift when in patrol
        if (drone.status === 'patrol') {
          drone.location[0] += (Math.random() - 0.5) * 0.0005;
          drone.location[1] += (Math.random() - 0.5) * 0.0005;
        }
        
        // Return to base if battery low
        if (drone.battery < 15 && drone.status !== 'returning') {
          this.sendCommand(drone.id, 'recall');
        }
      });
    }, 5000);
  }

  async sendCommand(droneId, command) {
    const drone = this.drones.find(d => d.id === droneId);
    if (!drone) throw new Error('Drone not found');

    return new Promise(resolve => {
      setTimeout(() => {
        switch (command) {
          case 'takeoff':
            drone.status = 'patrol';
            drone.mission = 'patrol';
            break;
          case 'recall':
            drone.status = 'returning';
            drone.mission = 'returning';
            break;
          case 'land':
            drone.status = 'landed';
            drone.mission = 'none';
            drone.location = [...drone.baseLocation];
            break;
        }
        drone.lastUpdate = Date.now();
        resolve({ success: true, drone });
      }, CONFIG.MOCK_DELAY);
    });
  }

  // Simulate slow network or backend delay
// Return a deep clone to avoid direct mutation

  async getDroneStatus(droneId) {
    const drone = this.drones.find(d => d.id === droneId);
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(drone ? { ...drone } : null);
      }, CONFIG.MOCK_DELAY);
    });
  }

  async getAllDroneStatuses() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([...this.drones]);
      }, CONFIG.MOCK_DELAY);
    });
  }

  selectDrone(droneId) {
    this.selectedDrone = droneId;
    localStorage.setItem('selectedDrone', droneId);
  }

  getSelectedDrone() {
    return this.selectedDrone || localStorage.getItem('selectedDrone');
  }
}

export const droneService = new DroneService();