document.addEventListener('DOMContentLoaded', () => {
  const events = window.designConferences.map(c => ({
    title: c.name + (c.location ? ` – ${c.location}` : ''),
    start: c.startDate,
    end: c.endDate,
    url: c.url,
    allDay: true
  }));

  const calEl = document.getElementById('calendar');
  const calendar = new FullCalendar.Calendar(calEl, {
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,listYear'
    },
    events,
    eventColor: '#0d6efd',
    eventDisplay: 'block'
  });
  calendar.render();
});