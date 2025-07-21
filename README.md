# Design Conferences Archive

Eine einfache statische Website, die alle Jahre und alle großen Design-Konferenzen (ICED, CIRP-Design, DESIGN, NordDesign …) in einer Tabelle und im Kalender anzeigt.

## Lokale Nutzung
1. Repository klonen oder ZIP entpacken.
2. `index.html` direkt im Browser öffnen oder mit `npx serve .` starten.

## Neue Konferenz eintragen
Öffne `js/data.js` und füge ein weiteres Objekt im Array ein:
```json
{
  "name": "MeineKonferenz",
  "year": 2025,
  "location": "Berlin, Germany",
  "url": "https://example.com",
  "startDate": "2025-09-01",
  "endDate": "2025-09-03",
  "proceedings": null
}