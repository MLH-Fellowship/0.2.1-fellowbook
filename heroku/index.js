const express = require('express');
const app = express();

app.use('/', express.static('web'));
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Fellowbook client web-app listening at port ${port}`));
