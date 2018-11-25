const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const express = require('express');
const fs = require('fs');
const Fuse = require('fuse.js');
const nodemailer = require('nodemailer');
const path = require('path');
const schedule = require('node-schedule');
const striptags = require('striptags');
const aboutSite = require('./about');
const labels = require('./labels');
const listPhrases = require('./google-api');
const replaceToCyrillic = require('./utils');

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
const languages = ['cv', 'ru'];

// server params
const PORT = process.env.PORT || 5000;

// phrases data
let data = [];
let cards = [];

const TMP_DB_PATH = path.resolve(process.cwd(), 'server/db.json');

// search options
const options = {
  shouldSort: true,
  threshold: 0.3,
  keys: ['term'],
};

// read saved data on start
const loadSavedData = async () => {
  const newData = await new Promise(resolve => {
    fs.readFile(TMP_DB_PATH, (err, content) => {
      if (err) console.log('Error loading saved data from file. ', err);
      return resolve(JSON.parse(content));
    });
  });
  if (Array.isArray(newData) && newData.length) {
    data = newData;
    console.log('Loaded saved data from file.');
  } else {
    console.log('No data in the file.');
  }
};

// check google spreadsheet every 5 minutes
const j = schedule.scheduleJob('*/5 * * * *', async () => {
  try {
    const result = await listPhrases();
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
            [languages[0]]: parts[0] ? replaceToCyrillic(parts[0].trim()) : '',
            [languages[1]]: parts[1] ? parts[1].trim() : '',
          };
          if (parts.length === 1) console.log(`ROW ${i}. CHECK THIS: `, vv);
          aa.push(card);
          newCards.push(card);
          return aa;
        }, []),
      });
      return a;
    }, []);
    data = newData;
    cards = newCards;
    // save data to file
    await new Promise(resolve => {
      fs.writeFile(TMP_DB_PATH, JSON.stringify(newData), err => {
        if (err) console.log('Error writing data to temporary db. ', err);
        console.log('Temporary data stored to ', TMP_DB_PATH);
        return resolve();
      });
    });
  } catch (err) {
    console.log('Error occurs. ', err);
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.resolve(process.cwd(), 'public/index.html'));
});

app.get('/csrf', csrfProtection, (req, res) => {
  res.send({ _csrf: req.csrfToken() });
});

app.get('/phrases', (req, res) => {
  const language = req.query.language ? req.query.language : languages[0];
  const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
  const offset = req.query.offset ? parseInt(req.query.offset, 10) : 0;
  const search = req.query.search ? req.query.search : null;
  if (search) {
    if (language === languages[1]) {
      options.keys = [`translation`];
    } else {
      options.keys = [`term`];
    }
    const fuse = new Fuse(data, options);
    const result = fuse.search(search);
    return res.send({
      count: result.length,
      phrases: result.slice(offset, offset + limit),
    });
  } else {
    return res.send({
      count: data.length,
      phrases: data.slice(offset, offset + limit),
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
    labels,
    languages,
    totalCount: data.length,
  });
});

app.listen(PORT, () => {
  loadSavedData();
  console.log(`Server running at ${PORT}`);
});
