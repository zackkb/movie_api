// Import framework
const express = require('express'),
    morgan = require('morgan');

const app = express();

// Morgan middleware library to log all requests
app.use(morgan('common'));

// An array of top 10 movies
let topMovies = [{
        title: 'Letter to Momo',
        director: 'Hiroyuki Okiura',
        genre: 'animated, drama',
        released: '2011',
    },
    {
        title: 'The Boy And The Beast',
        director: 'Mamoru Hosoda',
        genre: 'animated, action-adventure, fantasy',
        released: '2015',
    },
    {
        title: 'A Silent Voice',
        director: 'Naoko Yamada',
        genre: 'animated, drama',
        released: '2016',
    },
    {
        title: 'From Up On Poppy Hill',
        director: 'Gorō Miyazaki',
        genre: 'animated, drama',
        released: '2011',
    },
    {
        title: 'Tokyo Godfathers',
        director: 'Satoshi Kon',
        genre: 'animated, tragicomedy, adventure',
        released: '2003',
    },
    {
        title: 'Miss Hokusai',
        director: 'Keiichi Hara',
        genre: 'animated, historical',
        released: '2015',
    },
    {
        title: 'The Place Promised In Our Early Days',
        director: 'Makoto Shinkai',
        genre: 'animated, alternate-history',
        released: '2004',
    },
    {
        title: 'Night Is Short, Walk On Girl',
        director: 'Masaaki Yuasa',
        genre: 'animated, romantic-comedy',
        released: '2017',
    },
    {
        title: 'Mirai',
        director: 'Mamoru Hosoda',
        genre: 'animated, adventure, fantasy, comedy',
        released: '2018',
    },
    {
        title: 'Millennium Actress',
        director: 'Satoshi Kon',
        genre: 'animated, drama',
        released: '2001',
    },
];

// GET requests
app.get('/movies', (req, res) => {
    res.json(topMovies);
});

app.get('/', (req, res) => {
    res.send('Welcome to my app!');
});

// Serve static content from 'public' directory
app.use(express.static('public'));

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Listen for requests
app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});