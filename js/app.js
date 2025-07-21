// Filter und Tabelle initialisieren
const data = window.designConferences.sort((a,b)=> b.year - a.year);
const tbody = document.getElementById('tableBody');
const selName = document.getElementById('filterName');
const selYear = document.getElementById('filterYear');
const searchBox = document.getElementById('searchBox');

// Option-Listen befüllen
[...new Set(data.map(c => c.name))].sort().forEach(n => {
  selName.appendChild(new Option(n, n));
});
[...new Set(data.map(c => c.year))].sort((a,b)=>b-a).forEach(y => {
  selYear.appendChild(new Option(y, y));
});

function render(list) {
  tbody.innerHTML = '';
  list.forEach(c => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${c.fullName || c.name}</td>
      <td>${c.year}</td>
      <td>${c.location}</td>
      <td>${c.startDate}</td>
      <td>${c.endDate}</td>
      <td><a href="${c.url}" target="_blank" class="btn btn-sm btn-outline-primary">🌐</a></td>
      <td>${c.proceedings ? `<a href="${c.proceedings}" target="_blank" class="btn btn-sm btn-outline-secondary">📄</a>` : ''}</td>
    `;
    tbody.appendChild(tr);
  });
}
function applyFilters() {
  const n = selName.value;
  const y = selYear.value;
  const q = searchBox.value.toLowerCase();
  render(
    data.filter(c =>
      (!n || c.name === n) &&
      (!y || c.year === +y) &&
      (!q || c.location.toLowerCase().includes(q) || c.name.toLowerCase().includes(q))
    )
  );
}
selName.addEventListener('change', applyFilters);
selYear.addEventListener('change', applyFilters);
searchBox.addEventListener('input', applyFilters);
render(data);