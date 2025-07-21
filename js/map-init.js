(() => {
  // Hilfs-Lookup (Städte → [lat, lng])
  // Schnelle manuelle Lösung – bei vielen Einträgen lieber Geocoding-Service
  const geo = {
    "Bordeaux, France": [44.8378, -0.5792],
    "Ghent, Belgium": [51.0536, 3.7253],
    "Cavtat-Dubrovnik, Croatia": [42.6400, 18.1100],
    "Copenhagen, Denmark": [55.6761, 12.5683],
    "Berlin, Germany": [52.5200, 13.4050]
    // … weitere ergänzen
  };

  let map, markerGroup;

  function initMap() {
    map = L.map('map').setView([20, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    markerGroup = L.layerGroup().addTo(map);
  }

  function updateMap(yearFilter) {
    if (!map) initMap();
    markerGroup.clearLayers();

    const filtered = window.designConferences.filter(c =>
      (!yearFilter || c.year === +yearFilter)
    );

    filtered.forEach(c => {
      const ll = geo[c.location];
      if (!ll) return; // unbekannter Ort
      const marker = L.marker(ll)
        .bindPopup(`
          <strong>${c.fullName || c.name} ${c.year}</strong><br>
          ${c.location}<br>
          ${c.startDate} – ${c.endDate}<br>
          <a href="${c.url}" target="_blank">Website</a>
        `);
      markerGroup.addLayer(marker);
    });
  }

  // Event-Listener auf Jahr-Filter
  const selYear = document.getElementById('filterYear');
  function onYearChange() {
    updateMap(selYear.value);
  }
  selYear.addEventListener('change', onYearChange);

  // Erstmaliger Aufruf nach DOM-ready
  document.addEventListener('DOMContentLoaded', () => {
    // erst nachdem data.js geladen ist
    updateMap(selYear.value);
  });
})();