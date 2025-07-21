
import puppeteer from 'puppeteer';

function extractDateParts(text) {
  const date = new Date(text);
  if (isNaN(date)) return null;
  return date.toISOString().split('T')[0];
}

export async function scrapeCIRP() {
  const url = 'https://www.cirp.net/meetings-conferences/cirp-events-col-301/conferences/';
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();

  try {
    console.log('🔍 Lade CIRP-Seite...');
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    const rows = await page.evaluate(() => {
      const result = [];

      document.querySelectorAll('li.ev_td_li').forEach(li => {
        const text = li.innerText.trim();
        const dateMatch = text.match(/([A-Z][a-z]+ \d{1,2} [A-Z][a-z]+ \d{4}) - ([A-Z][a-z]+ \d{1,2} [A-Z][a-z]+ \d{4})/);
        const titleEl = li.querySelector('a.ev_link_row');
        const title = titleEl?.innerText.trim();
        const link = titleEl?.getAttribute('href');

        if (!title?.toLowerCase().includes('design')) return;

        result.push({
          dateRange: dateMatch,
          title,
          url: link,
          rawText: text
        });
      });

      return result;
    });

    const cleaned = rows.map(entry => {
      const [startRaw, endRaw] = entry.dateRange || [null, null];
      const startDate = extractDateParts(startRaw);
      const endDate = extractDateParts(endRaw);
      const year = startDate ? +startDate.slice(0, 4) : null;

      return {
        name: 'CIRP Design',
        fullName: entry.title,
        year,
        location: 'Unbekannt',
        url: entry.url?.startsWith('http') ? entry.url : 'https://www.cirp.net' + entry.url,
        startDate,
        endDate,
        proceedings: null
      };
    });

    console.log(`✅ CIRP Design: ${cleaned.length} Einträge`);
    return cleaned;
  } catch (err) {
    console.error('❌ Fehler bei CIRP:', err.message);
    return [];
  } finally {
    await browser.close();
  }
}

const cirpData = await scrapeCIRP();


import fs from 'fs';
fs.writeFileSync('designConferences.json', JSON.stringify(cirpData, null, 2));
