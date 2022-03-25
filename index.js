// Import framework
const express = require('express'),
    morgan = require('morgan');

const app = express();

// Morgan middleware library to log all requests
app.use(morgan('common'));

// GET requests
app.get('/movies', (req, res) => {
    res.json(topMovies);
});

app.get('/', (req, res) => {
    res.send('Placeholder text for a future app!');
});

// Serve static files
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