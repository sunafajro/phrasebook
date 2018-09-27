const fs = require("fs");
const path = require("path");
const readline = require("readline");
const { google } = require("googleapis");

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
const CREDENTIALS_PATH = path.resolve(process.cwd(), '/server/credentials.json');
const TOKEN_PATH = path.resolve(process.cwd(), '/server/token.json');

const createClient = async () => {
  try {
    const credentials = await new Promise((resolve, reject) => {
      fs.readFile(CREDENTIALS_PATH, (err, content) => {
        if (err) return reject(err);
        return resolve(JSON.parse(content));
      });
    });
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );
    try {
      const oAuthClient = await new Promise(resolve => {
        fs.readFile(TOKEN_PATH, (err, token) => {
          if (err) return resolve(null);
          oAuth2Client.setCredentials(JSON.parse(token));
          return resolve(oAuth2Client);
        });
      });
      if (!oAuthClient) {
        const authUrl = oAuth2Client.generateAuthUrl({
          access_type: "offline",
          scope: SCOPES
        });
        console.log("Authorize this app by visiting this url:", authUrl);
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });
        const oAuthClientNext = await new Promise((resolve, reject) => {
          rl.question("Enter the code from that page here: ", code => {
            rl.close();
            oAuth2Client.getToken(code, (err, token) => {
              if (err) return reject(err);
              oAuth2Client.setCredentials(token);
              // Store the token to disk for later program executions
              fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
                if (err) console.error(err);
                console.log("Token stored to", TOKEN_PATH);
              });
              return resolve(oAuth2Client);
            });
          });
        });
        return oAuthClientNext;
      } else {
        return oAuth2Client;
      }
    } catch (err) {
      console.log("Error creating client credentials. ", err);
      return null;
    }
  } catch (err) {
    console.log("Error on reading credentials. ", err);
    return null;
  }
};

const listPhrases = async () => {
  try {
    const auth = await createClient();
    const sheets = google.sheets({ version: "v4", auth });
    const promise = () => {
      return new Promise((resolve, reject) => {
        sheets.spreadsheets.values.get(
          {
            // uuid of spreadsheet
            spreadsheetId: "1waaExBtxLaczDp4araeyvv8SZrtYhG_3iVV0nPSJzCc",
            // range
            range: "Phrases!A2:C100",
            majorDimension: "COLUMNS"
          },
          (err, res) => {
            if (err) return reject(err);
            return resolve(res.data.values);
          }
        );
      });
    };
    try {
      const result = await promise();
      return result;
    } catch (err) {
      console.log("Error on getting data from spreadshet. ", err);
      return null;
    }
  } catch (err) {
    console.log("Error creating api client. ", err);
    return null;
  }
};

module.exports = listPhrases;
