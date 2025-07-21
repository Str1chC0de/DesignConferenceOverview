import * as cheerio from 'cheerio';

import fetch from 'node-fetch';
import fs from 'fs';

function extractYear(text) {
  const match = text.match(/20\d{2}/);
  return match ? +match[0] : null;
}

async function scrapeICED() {
  const res = await fetch('https://www.ife.ed.tum.de/iced/past-conferences/');
  const $ = cheerio.load(await res.text());
  const rows = [];
  $('table tbody tr').each((_, tr) => {
    const tds = $(tr).find('td');
    if (tds.length < 3) return;
    const year = +$(tds[0]).text();
    rows.push({
      name: 'ICED',
      fullName: 'International Conference on Engineering Design',
      year,
      location: $(tds[1]).text().trim(),
      url: $(tds[2]).find('a').attr('href') || '',
      startDate: `${year}-07-01`,
      endDate: `${year}-07-05`,
      proceedings: null
    });
  });
  return rows;
}

async function scrapeNordDesign() {
  const res = await fetch('https://www.designsociety.org/group/9/NordDesign');
  const $ = cheerio.load(await res.text());
  const rows = [];
  $('div.article-list-item').each((_, item) => {
    const title = $(item).find('.article-title');
    const text = title.text().trim();
    const href = title.find('a').attr('href');
    const year = extractYear(text);
    rows.push({
      name: 'NordDesign',
      fullName: 'Nordic Design Conference',
      year,
      location: 'Unbekannt',
      url: 'https://www.designsociety.org' + href,
      startDate: null,
      endDate: null,
      proceedings: null
    });
  });
  return rows;
}

async function scrapeDESIGN() {
  const res = await fetch('https://www.designsociety.org/group/5/DESIGN');
  const $ = cheerio.load(await res.text());
  const rows = [];
  $('div.article-list-item').each((_, item) => {
    const title = $(item).find('.article-title');
    const text = title.text().trim();
    const href = title.find('a').attr('href');
    const year = extractYear(text);
    rows.push({
      name: 'DESIGN',
      fullName: 'Design Conference (Dubrovnik)',
      year,
      location: 'Dubrovnik, Croatia',
      url: 'https://www.designsociety.org' + href,
      startDate: null,
      endDate: null,
      proceedings: null
    });
  });
  return rows;
}

async function scrapeCIRP() {
  const url = 'https://www.cirp.net/meetings-conferences/cirp-events-col-301/conferences/cat.listevents/2025/07/21/-.html';
  const res = await fetch(url);
  const $ = cheerio.load(await res.text());
  const rows = [];

  $('tr.eventRow').each((_, tr) => {
    const tds = $(tr).find('td');
    if (tds.length < 3) return;

    const title = $(tds[1]).text().trim();
    const dateRange = $(tds[0]).text().trim();
    const location = $(tds[2]).text().trim();
    const link = $(tds[1]).find('a').attr('href');

    // Nur Konferenzen mit "Design" im Titel extrahieren
    if (!title.toLowerCase().includes('design')) return;

    // Datum parsen
    const match = dateRange.match(/(\d{2})\.(\d{2})\.(\d{4})/g);
    const [startDate, endDate] = match?.map(d => {
      const [day, month, year] = d.split('.');
      return `${year}-${month}-${day}`;
    }) || [null, null];

    const year = startDate ? +startDate.slice(0, 4) : null;

    rows.push({
      name: 'CIRP Design',
      fullName: title,
      year,
      location,
      url: link ? 'https://www.cirp.net' + link : '',
      startDate,
      endDate,
      proceedings: null
    });
  });

  return rows;
}

async function main() {
  const all = [
    ...(await scrapeICED()),
    ...(await scrapeCIRP()),
    ...(await scrapeNordDesign()),
    ...(await scrapeDESIGN())
  ];
  fs.writeFileSync('./designConferences.json', JSON.stringify(all, null, 2));
  console.log('✅ designConferences.json erstellt mit', all.length, 'Einträgen.');
}

main();
