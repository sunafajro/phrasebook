const fs = require("fs");
const path = require("path");
const express = require("express");
const schedule = require("node-schedule");
const listPhrases = require("./google-api");
const Fuse = require("fuse.js");

const app = express();
app.use(express.static(path.resolve(process.cwd(), "public")));

// server params
const PORT = process.env.PORT || 5000;

// phrases data
let data = [];
const TMP_DB_PATH = path.resolve(process.cwd(), "server/db.json");

// search options
const options = {
  shouldSort: true,
  threshold: 0.3,
  keys: ["text.cv"]
};

// read saved data on start
async function loadSavedData() {
  const newData = await new Promise(resolve => {
    fs.readFile(TMP_DB_PATH, (err, content) => {
      if (err) console.log("Error loading saved data from file. ", err);
      return resolve(JSON.parse(content));
    });
  });
  if (Array.isArray(newData) && newData.length) {
    data = newData;
    console.log("Loaded saved data from file.");
  } else {
    console.log("No data in the file.");
  }
}

// check google spreadsheet every 5 minutes
const j = schedule.scheduleJob("*/5 * * * *", async () => {
  try {
    const result = await listPhrases();
    const id = result[0];
    const cv = result[1];
    const ru = result[2];
    const tags = result[3];
    const newData = [];
    id.forEach((item, index) => {
      newData.push({
        id: item,
        text: {
          cv: cv[index],
          ru: ru[index]
        },
        tags: tags[index] !== "-" ? tags[index].split(";") : []
      });
    });
    data = newData;
    // save data to file
    await new Promise(resolve => {
      fs.writeFile(TMP_DB_PATH, JSON.stringify(newData), err => {
        if (err) console.log("Error writing data to temporary db. ", err);
        console.log("Temporary data stored to ", TMP_DB_PATH);
        return resolve();
      });
    });
  } catch (err) {
    console.log("Error occurs. ", err);
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.resolve(process.cwd(), "public/index.html"));
});

app.get("/phrases", (req, res) => {
  const { lang, q, tag } = req.query;
  if (q) {
    if (lang) {
      options.keys = [`text.${lang}`];
    }
    const fuse = new Fuse(data, options);
    const result = fuse.search(q);
    return res.send({ phrases: result, count: Object.keys(data).length });
  } else if (tag) {
    options.keys = [`tags`];
    const fuse = new Fuse(data, options);
    const result = fuse.search(tag);
    return res.send({ phrases: result, count: Object.keys(data).length });
  } else {
    return res.send({ phrases: null, count: Object.keys(data).length });
  }
});

app.get("/phrases/count", (req, res) => {
  return res.send({ count: Object.keys(data).length });
});

app.listen(PORT, () => {
  loadSavedData();
  console.log(`Server running at ${PORT}`);
});
