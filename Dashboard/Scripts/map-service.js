// Leaflet map integration: renders drones and incident markers with live updates.

import { droneService } from './drone-service.js';
import { incidentService } from './incident-service.js';

class MapService {
  constructor() {
    this.map = null;
    this.markers = {};
    this.selectedFeed = null;
  }

  initMap(elementId, center = [51.505, -0.09], zoom = 15) {
    this.map = L.map(elementId).setView(center, zoom);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    this.setupEventListeners();
    this.updateMap();
  }

  setupEventListeners() {
    // Listen for drone selection changes
    window.addEventListener('droneSelected', (e) => {
      this.selectedFeed = e.detail.droneId;
      this.updateMap();
    });
  }

  async updateMap() {
    // Clear existing markers
    Object.values(this.markers).forEach(marker => this.map.removeLayer(marker));
    this.markers = {};

    // Add drone markers
    const drones = await droneService.getAllDroneStatuses();
    drones.forEach(drone => {
      const isSelected = drone.id === this.selectedFeed;
      const icon = L.divIcon({
        className: `drone-marker ${isSelected ? 'selected' : ''}`,
        html: `🚁<span class="drone-id">${drone.id}</span>`,
        iconSize: [40, 40]
      });

      const marker = L.marker(drone.location, { icon })
        .addTo(this.map)
        .bindPopup(`<b>${drone.id}</b><br>Battery: ${drone.battery.toFixed(0)}%`);

      this.markers[`drone_${drone.id}`] = marker;

      if (isSelected) {
        this.map.setView(drone.location, 18);
        marker.openPopup();
      }
    });

    // Add incident markers
    const incidents = await incidentService.getIncidents();
    incidents.forEach(incident => {
      const icon = L.divIcon({
        className: 'incident-marker',
        html: this.getIncidentIcon(incident.type),
        iconSize: [30, 30]
      });

      const marker = L.marker(incident.location, { icon })
        .addTo(this.map)
        .bindPopup(`<b>${incident.type.toUpperCase()}</b><br>${incident.description}`);

      this.markers[`incident_${incident.id}`] = marker;
    });
  }

  getIncidentIcon(type) {
    const icons = {
      weapon: '🔫',
      fight: '👊',
      suspicious: '👀',
      'rapid-motion': '💨'
    };
    return icons[type] || '⚠️';
  }
}

export const mapService = new MapService();