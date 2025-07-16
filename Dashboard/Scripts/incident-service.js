// Scripts/incident-service.js
// Provides incident fetching/reporting logic (mocked via firestore-mock).

import { firestore } from './firebase-mock.js';
import { CONFIG } from './config.js';

const INCIDENT_TYPES = ['weapon', 'fight', 'suspicious', 'rapid-motion'];

class IncidentService {
  async reportIncident(data) {
    const incident = {
      ...data,
      timestamp: new Date(),
      status: 'reported',
      severity: data.severity || 3
    };
    await firestore.collection('incidents').add(incident);
    return incident;
  }

  async getIncidents(filter = 'all') {
    const snapshot = await firestore.collection('incidents')
      .where()
      .orderBy('timestamp', 'desc')
      .get();
    
    let incidents = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    if (filter !== 'all') {
      incidents = incidents.filter(i => i.type === filter);
    }

    return incidents;
  }

  async generateMockIncident() {
    const type = INCIDENT_TYPES[Math.floor(Math.random() * INCIDENT_TYPES.length)];
    const locations = [
      { lat: 51.505, lng: -0.09, name: "Lagoon Front" },
      { lat: 51.51, lng: -0.1, name: "University Road" },
      { lat: 51.515, lng: -0.09, name: "Main Library" }
    ];
    const location = locations[Math.floor(Math.random() * locations.length)];
    
    return this.reportIncident({
      type,
      location,
      description: `Automatic detection of ${type} at ${location.name}`,
      droneId: CONFIG.DRONES[Math.floor(Math.random() * CONFIG.DRONES.length)].id,
      severity: Math.floor(Math.random() * 5) + 1
    });
  }
}

export const incidentService = new IncidentService();