// Configuration that will later switch between mock and real services
// Global config object to toggle mock vs real services and define initial drone info.

export const CONFIG = {
  USE_MOCK: true,
  MOCK_DELAY: 500, // Simulate network delay in ms
  
  DRONES: [
    { id: "UE-01", name: "Drone Alpha", baseLocation: [51.505, -0.09] },
    { id: "UE-02", name: "Drone Bravo", baseLocation: [51.51, -0.1] },
    { id: "UE-03", name: "Drone Charlie", baseLocation: [51.515, -0.09] }
  ]
};

