// Manages the Incidents table UI: search, filters, pagination, data loading.

import { incidentService } from './incident-service.js';

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('incidents-table')) {
    initIncidentsPage();
  }
});

async function initIncidentsPage() {
  // Load initial incidents
  loadIncidents();

  // Set up search/filter
  document.getElementById('search-incidents').addEventListener('input', (e) => {
    loadIncidents(e.target.value);
  });

  document.getElementById('incident-filter').addEventListener('change', (e) => {
    loadIncidents('', e.target.value);
  });

  document.getElementById('refresh-incidents').addEventListener('click', () => {
    loadIncidents();
  });

  // Set up pagination
  document.getElementById('prev-page').addEventListener('click', () => {
    // Pagination logic would go here
    console.log('Previous page');
  });

  document.getElementById('next-page').addEventListener('click', () => {
    // Pagination logic would go here
    console.log('Next page');
  });
}

async function loadIncidents(searchTerm = '', filter = 'all') {
  const tbody = document.getElementById('incidents-body');
  tbody.innerHTML = '<tr><td colspan="5">Loading incidents...</td></tr>';

  const incidents = await incidentService.getIncidents(filter);
  
  // Apply search filter if provided
  const filtered = searchTerm 
    ? incidents.filter(i => 
        i.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.type.toLowerCase().includes(searchTerm.toLowerCase()))
    : incidents;

  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5">No incidents found</td></tr>';
    return;
  }

  tbody.innerHTML = '';
  filtered.forEach(incident => {
    const row = document.createElement('tr');
    row.className = 'fade-in';
    row.innerHTML = `
      <td>${formatTime(incident.timestamp)}</td>
      <td>${incident.location?.name || 'Unknown'}</td>
      <td><span class="incident-type ${incident.type}">${incident.type.toUpperCase()}</span></td>
      <td><span class="status-badge ${getStatusClass(incident)}">${incident.status.toUpperCase()}</span></td>
      <td class="action-cell">
        <button class="action-btn view-btn">View</button>
        <button class="action-btn resolve-btn">Resolve</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function formatTime(timestamp) {
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleString();
}

function getStatusClass(incident) {
  if (incident.status === 'resolved') return 'success';
  if (incident.severity >= 4) return 'critical';
  if (incident.severity >= 2) return 'warning';
  return '';
}

function sortTable(columnIndex) {
  console.log(`Sorting by column ${columnIndex}`);
  // Actual sorting logic would go here
  // TODO: Implement column sorting logic here

}