const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const express = require('express');
const fs = require('fs');
const _ = require('lodash');
const Fuse = require('fuse.js');
const nodemailer = require('nodemailer');
const path = require('path');
const schedule = require('node-schedule');
const striptags = require('striptags');
const aboutSite = require('./about');
const {
  getInterfaceTranslations,
  getPhrasesData,
  loadSavedData,
} = require('./actions');

const csrfProtection = csrf({ cookie: true });
const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(path.resolve(process.cwd(), 'public')));

let smtpConfig = {
  host: '',
  port: 465,
  secure: true,
  auth: {
    user: '',
    pass: '',
  },
};
let transporter = nodemailer.createTransport(smtpConfig);

// app languages
const languages = ['cv', 'ru', 'eo'];

// server params
const PORT = process.env.PORT || 5000;

// phrases data
let data = {};
// random phrases
let cards = {};
// interface translations
let translations = {};

const TMP_DB_PATH = path.resolve(process.cwd(), 'server/db.json');
const TMP_TRANSLATIONS_PATH = path.resolve(
  process.cwd(),
  'server/translations.json'
);

// search options
const options = {
  shouldSort: true,
  threshold: 0.2,
  keys: ['term'],
};

// check google spreadsheet every 10 minutes
const j = schedule.scheduleJob('*/10 * * * *', async () => {
  try {
    for (l in languages) {
      if (languages[l] !== 'cv') {
        const { newCards, newData } = await getPhrasesData(languages[l]);
        _.set(data, `${languages[l]}`, newData);
        _.set(cards, `${languages[l]}`, newCards);
      }
    }
    // save data to file
    await new Promise(resolve => {
      fs.writeFile(TMP_DB_PATH, JSON.stringify(data), err => {
        if (err) console.log('Error writing phrases data to file. ', err);
        console.log(`Phrases data saved to ${TMP_DB_PATH} file.`);
        return resolve();
      });
    });
  } catch (err) {
    console.log('Error on updating phrases. ', err);
  }
});

const translationUpdater = schedule.scheduleJob('*/30 * * * *', async () => {
  try {
    const newTranslations = await getInterfaceTranslations();
    translations = _.cloneDeep(newTranslations);
    // save data to file
    await new Promise(resolve => {
      fs.writeFile(TMP_TRANSLATIONS_PATH, JSON.stringify(translations), err => {
        if (err)
          console.log(
            'Error writing interface translations data to file. ',
            err
          );
        console.log(
          `Interface translatons saved to ${TMP_TRANSLATIONS_PATH} file.`
        );
        return resolve();
      });
    });
  } catch (err) {
    console.log('Error on updating interface translations. ', err);
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.resolve(process.cwd(), 'public/index.html'));
});

app.get('/csrf', csrfProtection, (req, res) => {
  res.send({ _csrf: req.csrfToken() });
});

app.get('/phrases', (req, res) => {
  const index = languages.indexOf('cv');
  const language = index === 0 ? languages[index + 1] : languages[0];
  const termLang = _.get(req, 'query.language', language);
  const dictLang = _.get(req, 'query.dictionary', language);
  const limit = parseInt(_.get(req, 'query.limit', 10), 10);
  const offset = parseInt(_.get(req, 'query.offset', 0), 10);
  const search = _.get(req, 'query.search', null);
  if (dictLang === 'cv') {
    options.keys = ['term', 'translation'];
  } else {
    if (termLang !== 'cv') {
      options.keys = ['translation'];
    } else {
      options.keys = ['term'];
    }
  }
  const dictionary = dictLang !== 'cv' ? dictLang : termLang;
  if (search) {
    const fuse = new Fuse(data[dictionary], options);
    const result = fuse.search(search);
    return res.send({
      count: result.length,
      phrases: result.slice(offset, offset + limit),
    });
  } else {
    return res.send({
      count: data[dictionary].length,
      phrases: data[dictionary].slice(offset, offset + limit),
    });
  }
});

app.get('/random', (req, res) => {
  const min = 0;
  const max = cards.length + 1;
  const num = Math.floor(Math.random() * (max - min)) + min;
  return res.send({
    card: cards[num],
  });
});

app.post('/send-email', csrfProtection, (req, res) => {
  const fromEmail =
    req && req.body && req.body.fromEmail ? req.body.fromEmail : '';
  const fromName =
    req && req.body && req.body.fromName ? req.body.fromName : '';
  const emailText =
    req && req.body && req.body.emailText ? req.body.emailText : '';
  if (fromEmail && fromName && emailText) {
    return transporter.verify((error, success) => {
      if (error) {
        res.status(500).send({ status: 'error' });
      } else {
        let text = `<p><b>От кого:</b> ${fromName} <${fromEmail}></p>`;
        text = text + `<p><b>Текст письма:</b></p> ${striptags(emailText)}`;
        const message = {
          from: '',
          to: '',
          cc: '',
          subject: '[] Письмо с сайта!',
          html: text,
        };
        transporter.sendMail(message, (error, info) => {
          if (error) {
            res.status(500).send({ status: 'error' });
          } else {
            res.send({ status: 'success' });
          }
        });
      }
    });
  } else {
    res.status(400).send({ status: 'error' });
  }
});

app.get('/state', (req, res) => {
  return res.send({
    about: aboutSite,
    labels: translations,
    languages,
    totalCount: data.length,
  });
});

app.listen(PORT, async () => {
  try {
    // loading phrases to memory
    const newData = await loadSavedData(TMP_DB_PATH);
    data = newData ? _.cloneDeep(newData) : {};
    // loading translations to memory
    const newTranslations = await loadSavedData(TMP_TRANSLATIONS_PATH);
    translations = newTranslations ? _.cloneDeep(newTranslations) : {};
    console.log(`Server running at ${PORT}`);
  } catch (e) {
    throw new Error(
      'Server running error. ' + (e && e.message) ? e.message : ''
    );
  }
});
