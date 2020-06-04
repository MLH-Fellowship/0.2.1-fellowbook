const express = require('express');
const fetch = require('node-fetch');
const app = express();

const CLIENT_ID = '22d8bad72f3469cd766c';
const CLIENT_SECRET = process.env.CLIENT_SECRET;

app.use('/', express.static('web'));

app.get('/authorise', (req, res) => {
  const code = req.query.code;
  const url = `https://github.com/login/oauth/access_token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${code}`;

  fetch(
    url,
    { headers: { Accept: 'application/json' } },
  ).then(res => res.json())
    .then(json => {
      const redirectUrl = `http://localhost:3000?access_token=${json.access_token}`;

      // Hack: meta refresh, express res.redirect isn't working :(
      res.set('Content-Type', 'text/html');
      res.status(200).send(`<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${redirectUrl}"></head></html>`);
      // return res.redirect(redirectUrl);
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`GitHub auth server listening at port ${port}`));
