// Import framework
const express = require('express');
const app = express();

// Import middleware libraries
const morgan = require('morgan'),
    bodyParser = require("body-parser"),
    uuid = require("uuid");

// Morgan middleware library to log all requests
app.use(morgan('common'));

// Use body-parser middleware
app.use(bodyParser.json());

// An array of data for movies
let movies = [{
        title: 'Letter to Momo',
        decription: '',
        year: '2011',
        genre: {
            name: 'drama',
            description: 'The drama genre features stories with high stakes and a lot of conflicts.',
        },
        director: {
            name: 'Hiroyuki Okiura',
            birth: '1966',
            death: '-',
            bio: 'Hiroyuki Okiura is a Japanese animation director and animator working for Production I.G.'
        },
        actors: {},
        imgURL: '',
    },
    {
        title: 'The Boy And The Beast',
        decription: '',
        year: '2015',
        genre: {
            name: 'action-adventure, fantasy',
            description: 'A hybrid genre featuring characters involved in exciting and usually dangerous activities and adventures.',
        },
        director: {
            name: 'Mamoru Hosoda',
            birth: '1967',
            death: '-',
            bio: 'Mamoru Hosoda is a Japanese film director and animator. He was nominated for an Academy Award in the category Best Animated Feature Film at the 91st Academy Awards for his eighth film Mirai.'
        },
        actors: {},
        imgURL: '',
    },
    {
        title: 'A Silent Voice',
        decription: '',
        year: '2016',
        genre: {
            name: 'drama',
            description: 'The drama genre features stories with high stakes and a lot of conflicts.',
        },
        director: {
            name: 'Naoko Yamada',
            birth: '1984',
            death: '-',
            bio: 'Naoko Yamada is a Japanese animator, television and film director. Working at Kyoto Animation, she directed the anime series K-On! and Tamako Market, and the anime films A Silent Voice and Liz and the Blue Bird.'
        },
        actors: {},
        imgURL: '',
    },
    {
        title: 'From Up On Poppy Hill',
        decription: '',
        year: '2011',
        genre: {
            name: 'drama',
            description: 'The drama genre features stories with high stakes and a lot of conflicts.',
        },
        director: {
            name: 'Gorō Miyazaki',
            birth: '1967',
            death: '-',
            bio: 'Goro Miyazaki is a Japanese director. He is the son of animator and film director Hayao Miyazaki, who is one of the co-founders of Studio Ghibli.'
        },
        actors: {},
        imgURL: '',
    },
    {
        title: 'Tokyo Godfathers',
        decription: '',
        year: '2003',
        genre: {
            name: 'tragicomedy, adventure',
            description: 'The adventure genre consists of movies where the protagonist goes on an epic journey, either personally or geographically. Often the protagonist has a mission and faces many obstacles in his way.',
        },
        director: {
            name: 'Satoshi Kon',
            birth: '1963',
            death: '2010',
            bio: 'Satoshi Kon was a Japanese film director, animator, screenwriter and manga artist from Sapporo, Hokkaidō and a member of the Japanese Animation Creators Association. Tsuyoshi Kon, a guitarist, is his brother. He was a graduate of the Graphic Design department of the Musashino Art University.'
        },
        actors: {},
        imgURL: '',
    }

];

// An array of data containing information about users
let users = [{
    id: '1',
    username: 'Zach',
    favorites: ['A Silent Voice', 'Tokyo Godfathers']
}];

// GET requests
app.get('/movies', (req, res) => {
    res.json(movies);
});

// READ Return data about a single movie by title
app.get("/movies/:title", (req, res) => {
    const {
        title
    } = req.params;
    const movie = movies.find((movie) => movie.title === title);
    if (movie) {
        res.status(200).json(movie);
    } else {
        res.status(400).send("Movie not found!");
    }
});

// READ Return data about a genre
app.get("/movies/genre/:genreName", (req, res) => {
    const {
        genreName
    } = req.params;
    const genre = movies.find((movie) => movie.genre.name === genreName).genre;
    if (genre) {
        res.status(200).json(genre);
    } else {
        res.status(400).send("Genre not found!");
    }
});

// READ Return data about a director by name
app.get("/movies/directors/:directorName", (req, res) => {
    const {
        directorName
    } = req.params;
    const director = movies.find(
        (movie) => movie.director.name === directorName
    ).director;
    if (director) {
        res.status(200).json(director);
    } else {
        res.status(400).send("Director not found!");
    }
});

// CREATE Allow new users to register
app.post("/users", (req, res) => {
    const newUser = req.body;
    if (newUser.name) {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(200).json(newUser);
    } else {
        res.status(400).send("Missing username in body!");
    }
});

// UPDATE Allow users to update their user info 
app.put("/users/:id", (req, res) => {
    const {
        id
    } = req.params;
    const updatedUser = req.body;
    let user = users.find((user) => user.id == id);
    if (user) {
        user.name = updatedUser.name;
        res.status(200).json(user);
    } else {
        res.status(400).send("User not found!");
    }
});

// Allow users to add a movie to their favorites
app.post("/users/:id/:movieTitle", (req, res) => {
    const {
        id,
        movieTitle
    } = req.params;
    let user = users.find((user) => user.id == id);
    if (user) {
        user.favoriteMovies.push(movieTitle);
        res.status(200).send(`${movieTitle}has been added to user ${id}'s favorites!`);
    } else {
        res.status(400).send("User not found!");
    }
});

// DELETE Allow users to remove a movie from their favorites
app.delete("/users/:id/:movieTitle", (req, res) => {
    const {
        id,
        movieTitle
    } = req.params;
    let user = users.find((user) => user.id == id);
    if (user) {
        user.favoriteMovies = user.favoriteMovies.filter(
            (title) => title !== movieTitle
        );
        res
            .status(200)
            .send(`${movieTitle}has been removed from user ${id}'s favorites!`);
    } else {
        res.status(400).send("User not found!");
    }
});

// DELETE Allow existing users to deregister
app.delete("/users/:id", (req, res) => {
    const {
        id
    } = req.params;
    let user = users.find((user) => user.id == id);
    if (user) {
        users = users.filter((user) => user.id != id);
        res.status(200).send(`User ${id} has been deleted!`);
    } else {
        res.status(400).send("User not found!");
    }
});

// GET Welcome message for '/' request URL
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