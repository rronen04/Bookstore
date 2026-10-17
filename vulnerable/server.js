// Intentionally vulnerable demo app for SCA / container scanning labs.
// The vulnerabilities live in the pinned dependency versions (see package.json).
// DO NOT deploy to production or expose to the internet.

const express = require('express');
const _ = require('lodash');
const moment = require('moment');
const jwt = require('jsonwebtoken');
const ejs = require('ejs');
const Handlebars = require('handlebars');
const marked = require('marked');
const minimist = require('minimist');
const axios = require('axios');
const fetch = require('node-fetch');
const path = require('path');

const args = minimist(process.argv.slice(2));
const PORT = args.port || process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET || 'demo-secret';

const app = express();
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const defaults = { theme: 'light', lang: 'en' };

app.get('/', (req, res) => {
  res.render('index', { now: moment().format('LLLL') });
});

app.get('/healthz', (req, res) => res.send('ok'));

// lodash.merge with user input (prototype pollution class of bugs)
app.post('/settings', (req, res) => {
  const settings = _.merge({}, defaults, req.body);
  res.json(settings);
});

// moment parsing of user input (ReDoS CVEs in this version)
app.get('/date', (req, res) => {
  res.json({ parsed: moment(req.query.d || undefined).format() });
});

// jsonwebtoken sign/verify
app.get('/token', (req, res) => {
  res.json({ token: jwt.sign({ user: req.query.user || 'guest' }, JWT_SECRET) });
});
app.get('/verify', (req, res) => {
  try {
    res.json(jwt.verify(req.query.t, JWT_SECRET));
  } catch (e) {
    res.status(401).json({ error: e.message });
  }
});

// handlebars + marked rendering
app.get('/greet', (req, res) => {
  const tpl = Handlebars.compile('<h1>Hello {{name}}</h1>');
  res.send(tpl({ name: req.query.name || 'world' }));
});
app.post('/markdown', (req, res) => {
  res.send(marked(String(req.body.text || '')));
});

// outbound calls with axios / node-fetch to a fixed URL
app.get('/outbound', async (req, res) => {
  try {
    const a = await axios.get('https://example.com', { timeout: 3000 });
    const f = await fetch('https://example.com', { timeout: 3000 });
    res.json({ axios: a.status, fetch: f.status });
  } catch (e) {
    res.status(502).json({ error: e.message });
  }
});

app.listen(PORT, () => console.log(`vulnerable-app listening on ${PORT}`));
