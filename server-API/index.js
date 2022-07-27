const express = require('express');
require('dotenv').config();
const db = require('../server-DB/db');

const app = express();

const port = 3030;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
