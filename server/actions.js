const _ = require('lodash');
const fs = require('fs');
const { getDataFromSpreadsheet } = require('./google-api');
const replaceToCyrillic = require('./utils');

// get and prepare phrases
const getPhrasesData = async (language = 'ru') => {
  const result = await getDataFromSpreadsheet({
    id: '',
    range: language + '',
    dimension: 'COLUMNS',
  });
  const terms = result[0];
  const transcriptions = result[1];
  const translations = result[2];
  const examples = result[3];
  const newCards = [];
  const newData = terms.reduce((a, v, i) => {
    const e = examples[i].split(';');
    a.push({
      id: i + 1,
      term: v ? replaceToCyrillic(v.trim()) : '',
      transcription: transcriptions[i] ? transcriptions[i].trim() : '',
      translation: translations[i] ? translations[i].trim() : '',
      examples: e.reduce((aa, vv) => {
        vv = vv.trim();
        const parts = vv.split(' — ');
        const card = {
          cv: parts[0] ? replaceToCyrillic(parts[0].trim()) : '',
          [language]: parts[1] ? parts[1].trim() : '',
        };
        if (parts.length === 1) console.log(`ROW ${i}. CHECK THIS: `, vv);
        aa.push(card);
        newCards.push(card);
        return aa;
      }, []),
    });
    return a;
  }, []);
  return {
    newCards,
    newData,
  };
};

// get and prepare interface translations
const getInterfaceTranslations = async () => {
  const result = await getDataFromSpreadsheet({
    id: '',
    range: '',
    dimension: 'ROWS',
  });
  let newTranslations = {};
  if (Array.isArray(result) && result.length) {
    newTranslations = result.reduce((parent, row, ri) => {
      if (Array.isArray(row) && row.length) {
        if (ri !== 0) {
          let key = '';
          row.forEach((cell, ci) => {
            if (ci === 0) {
              key = cell;
              _.set(parent, `${key}.text`, {});
            } else if (ci > 1) {
              const code = _.get(result, `[0][${ci}]`, null);
              const type = _.get(result, `[${ri}][1]`, null);
              if (code) {
                _.set(parent, `${key}.text.${code}`, cell);
              }
              if (type && type !== '-') {
                _.set(parent, `${key}.type`, type);
              }
            }
          });
        }
      }
      return parent;
    }, {});
  }
  return newTranslations;
};

// read saved data on start
const loadSavedData = async filepath => {
  try {
    const data = await new Promise(resolve => {
      fs.readFile(filepath, 'utf8', (err, content) => {
        if (err)
          console.log(`Error loading saved data from ${filepath}. `, err);
        return resolve(JSON.parse(content ? content : null));
      });
    });
    if (data && typeof data === 'object') {
      console.log(`Loaded saved data from ${filepath}.`);
      return data;
    } else {
      console.log(`No data in the ${filepath}.`);
      return null;
    }
  } catch (e) {
    throw new Error(
      'Error on loading data from file. ' + (e && e.message) ? e.message : ''
    );
  }
};

module.exports = {
  getInterfaceTranslations,
  getPhrasesData,
  loadSavedData,
};
