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

// recaptcha keys
const recaptcha = {
  client: '',
  server: '',
};

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
const languages = ['cv', 'ru', 'eo', 'sv'];

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
        // clear previous phrases
        data = {};
        cards = {};
        // get phrases by language
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
// check google spreadsheet every 10 minutes
const translationUpdater = schedule.scheduleJob('*/10 * * * *', async () => {
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
  if (data.hasOwnProperty(dictionary)) {
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
  } else {
    return res.send({
      count: 0,
      phrases: [],
    });
  }
});

app.get('/random', (req, res) => {
  const index = languages.indexOf('cv');
  const language = index === 0 ? languages[index + 1] : languages[0];
  const dictLang = _.get(req, 'query.dictionary', language);
  const dictionary = dictLang !== 'cv' ? dictLang : language;
  const min = 0;
  if (
    cards.hasOwnProperty(dictionary) &&
    Array.isArray(cards[dictionary]) &&
    cards[dictionary].length
  ) {
    const max = cards[dictionary].length + 1;
    const num = Math.floor(Math.random() * (max - min)) + min;
    return res.send({
      card: _.get(cards, `${dictionary}.${num}`, null),
    });
  } else {
    return res.send({
      card: null,
    });
  }
});

app.post('/send-email', csrfProtection, async (req, res) => {
  const fromEmail = _.get(req, 'body.fromEmail', '');
  const fromName = _.get(req, 'body.fromName', '');
  const emailText = _.get(req, 'body.emailText', '');
  const responseToken = _.get(req, 'body.responseToken', '');
  if (fromEmail && fromName && emailText && responseToken) {
    try {
      const { data } = await axios.post(
        encodeURI(
          'https://www.google.com/recaptcha/api/siteverify?secret=' +
            recaptcha.server +
            '&response=' +
            responseToken
        )
      );
      if (data.success) {
        await new Promise((resolve, reject) => {
          return transporter.verify(e => {
            if (e) {
              return reject(e);
            } else {
              return resolve(true);
            }
          });
        }).catch(e => {
          throw new Error(
            'Ошибка транспорта отправки писем. ' + (e && e.message)
              ? e.message
              : ''
          );
        });
        let text = `<p><b>От кого:</b> ${fromName} <${fromEmail}></p>`;
        text = text + `<p><b>Текст письма:</b></p> ${striptags(emailText)}`;
        const message = {
          from: '',
          to: '',
          cc: '',
          subject: '[] Письмо с сайта!',
          html: text,
        };
        await new Promise((resolve, reject) => {
          return transporter.sendMail(message, e => {
            if (e) {
              return reject(e);
            } else {
              return resolve(true);
            }
          });
        }).catch(e => {
          throw new Error(
            'Ошибка отправки письма. ' + (e && e.message) ? e.message : ''
          );
        });
        return res.send({ status: 'success' });
      } else {
        throw new Error('Ошибка валидации капчи.');
      }
    } catch (e) {
      console.log('Ошибка при отправке письма.', e);
      return res.status(500).send({ status: 'error' });
    }
  } else {
    console.log('Переданы не все аргументы.');
    return res.status(400).send({ status: 'error' });
  }
});

app.get('/state', (req, res) => {
  return res.send({
    about: aboutSite,
    labels: translations,
    languages,
    recaptchaSecret: recaptcha.client,
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
