const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;
var app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

app.use((request, response, next) => {
  var now = new Date().toString();
  var log = `${now}: ${request.method}|${request.url}`;

  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
      console.log('Unable to append log to server.log');
    }
  });
  next();
});

app.use((request, response, next) => {
  if (request.url === '/ko') {
    response.render('maintenance.hbs');
  } else {
    next();
  }
});

app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCreatedBy', () => {
  return 'Dam';
});

hbs.registerHelper('getPoweredBy', () => {
  return 'Node.js ' + process.version;
});

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

app.get('/', (request, response) => {
  response.render('home.hbs', {
    pageTitle: 'My Home Page',
    welcomeMessage: 'Welcome to my home page'
  });
});

app.get('/user/:name', (request, response) => {
  response.render('home.hbs', {
    pageTitle: 'Home Page',
    welcomeMessage: 'Welcome ' + request.params.name
  });
});

app.get('/text', (request, response) => {
  response.send('Hello Express!');
});

app.get('/html', (request, response) => {
  response.send('<h1>Hello Express!</h1>');
});

app.get('/json', (request, response) => {
  response.send({
    name: 'Dam',
    likes: [
      'Biking',
      'Squash',
      'Rugby'
    ]
  });
});

app.get('/about', (request, response) => {
  response.render('about.hbs', {
    pageTitle: 'About Page'
  });
});

app.get('/bad', (request, response) => {
  response.send({
    errorMessage: 'Unable to handle request'
  });
});

app.listen(port, () => {
  console.log('Server is up on port 3000');
});
