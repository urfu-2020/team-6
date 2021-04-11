const express = require('express');
require('hbs');
const path = require('path');

const app = express();
const port = process.env.PORT || 80;
const environment = process.env.NODE_ENV || 'DEVELOPMENT';
const viewsDir = path.join(__dirname, 'views');
const staticBasePath = environment === 'PRODUCTION' ? 'https://projectkilogram.surge.sh/' : '';

app.set('view engine', 'hbs');
app.set('views', viewsDir);

app.get('/', (request, response) => {
  response.send('Hello from Express!');
});

app.get('/file', (request, response) => {
  response.render('index', {staticBasePath});
});


if (environment === 'DEVELOPMENT') {
  app.use(express.static('app/public'));
}


app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err);
  }
  console.log(`server is listening on ${port} in ${environment} environment`);
});
