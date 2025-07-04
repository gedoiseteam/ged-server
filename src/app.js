require('module-alias/register');
require('dotenv').config();
require("./instrument.js");
const { d } = require('@utils/logs');
const OracleDatabaseConnection = require("@config/oracleDatabaseConnection");
oracleDatabaseConnection = new OracleDatabaseConnection();

const Sentry = require("@sentry/node");
const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const userRoutes = require('@routes/userRoutes');
const imageRoutes = require('@routes/imageRoutes');
const announcementsRoutes = require('@routes/announcementsRoutes');
const fcmRoutes = require('@routes/fcmRoutes');
const whiteListRoutes = require('@routes/whiteListRoutes');
const prodEnvironment = process.env.NODE_ENV === 'production';

const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/users', userRoutes);
app.use('/image', imageRoutes);
app.use('/announcements', announcementsRoutes);
app.use('/fcm', fcmRoutes);
app.use('/white-list', whiteListRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'ui/index.html'));
});

if (prodEnvironment) {
  Sentry.setupExpressErrorHandler(app);

  const options = {
    key: fs.readFileSync(process.env.SSL_KEY_PATH),
    cert: fs.readFileSync(process.env.SSL_CERT_PATH)
  };
  
  https.createServer(options, app).listen(3000, () => {
    d(`Web server started !`);
  });
} else {
  app.listen(3000, () => {
    d(`Web server started !`);
  });
}

process.on('SIGINT', async () => {
  await oracleDatabaseConnection.closePool();
  process.exit(0);
});
