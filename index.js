var express = require('express');
var app = express();

app.use('/', express.static('build'));
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});
