const express = require('express'); // import express
const hbs = require('hbs'); // import hbs (handlebar)
const fs = require('fs');

var app = express();

hbs.registerPartials(__dirname + '/views/partials') // let hbs know we want to use partials
app.set('view engine', 'hbs'); // change express view engine to use handlebar

// We are registering a new Middleware
// NOTE: next exist so we can tell express when our function (middleware) is done
// below middleware logs the request
app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;

    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) {
            console.log('Unable to append to server.log');
        }
    });
    next();
});

// Middleware to render maintenance template
// NOTE: since we do not call next the page will stay on this page
// app.use((req, res, next) => {
//     res.render('maintenance.hbs');
// })

// is a kind of middleware
app.use(express.static(__dirname + '/public'));

// register our new date function
// NOTE: hbs will look for helpers first and then any data with the below name
hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear()
});

// Setting up a GET Request Handler
app.get('/', (req, res) => {
    res.render('home.hbs', {
        pageTitle: 'Tarte Site Speed Example',
        welcomeMessage: 'Welcome to the site'
    })
});

// Render About Page with HBS
app.get('/about', (req, res) => {
    res.render('about.hbs', {
        pageTitle: 'About Page'
    });
});

app.listen(3000, () => {
    console.log('Server is up on port 3000');
});
