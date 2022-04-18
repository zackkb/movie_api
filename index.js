// Import framework
const express = require("express");
const app = express();

// Import middleware libraries
const morgan = require("morgan"),
    bodyParser = require("body-parser"),
    uuid = require("uuid");

// Integrating Mongoose, which will allow the REST API to perform CRUD operations on the MongoDB data
const mongoose = require("mongoose");
const Models = require("./models.js");

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect("mongodb://localhost:27017/myFlixDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Morgan middleware library to log all requests
app.use(morgan("common"));

// Use body-parser middleware
app.use(bodyParser.json());

// GET requests
app.get("/movies", (req, res) => {
    Movies.find()
        .then((movie) => {
            res.status(201).json(movie);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// READ Return data about a single movie by title
app.get('/movies/:Title', (req, res) => {
    Movies.findOne({
            Title: req.params.Title
        })
        .then((movie) => {
            res.json(movie);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// READ Return data about a genre
app.get('/genre/:Name', (req, res) => {
    Movies.findOne({
            'Genre.Name': req.params.Name
        })
        .then((movie) => {
            res.json(movie.Genre.Description);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// Gets information about a director
app.get('/director/:Name', (req, res) => {
    Movies.findOne({
            'Director.Name': req.params.Name
        })
        .then((movie) => {
            res.json(movie.Director);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// READ Return data about a movie by director
app.get('/movies/directors/:Name', (req, res) => {
    Directors.findOne({
            Name: req.params.Name
        })
        .then((director) => {
            res.json(director);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// Get all users
app.get('/users', (req, res) => {
    Users.find()
        .then((users) => {
            res.status(201).json(users);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// Get user by username
app.get('/users/:Username', (req, res) => {
    Users.findOne({
            Username: req.params.Username
        })
        .then((user) => {
            res.json(user);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// CREATE Allow new users to register
app.post("/users", (req, res) => {
    // Check if a user with the username already exists
    Users.findOne({
            Username: req.body.Username,
        })
        .then((user) => {
            if (user) {
                return res.status(400).send(req.body.Username + "already exists");
            } else {
                // If the user doesn’t exist, create new user
                Users.create({
                        Username: req.body.Username,
                        Password: req.body.Password,
                        Email: req.body.Email,
                        Birthday: req.body.Birthday,
                    })
                    .then((user) => {
                        res.status(201).json(user);
                    })
                    .catch((error) => {
                        console.error(error);
                        res.status(500).send("Error: " + error);
                    });
            }
        })
        // Error handling
        .catch((error) => {
            console.error(error);
            res.status(500).send("Error: " + error);
        });
});

// UPDATE Allow users to update their user info
app.put('/users/:Username', (req, res) => {
    Users.findOneAndUpdate({
            Username: req.params.Username
        }, {
            $set: {
                Username: req.body.Username,
                Password: req.body.Password,
                Email: req.body.Email,
                Birthday: req.body.Birthday
            }
        }, {
            new: true
        }, // This line makes sure that the updated document is returned
        (err, updatedUser) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error: ' + err);
            } else {
                res.json(updatedUser);
            }
        });
});

// Allow users to add a movie to their favorites
app.post('/users/:Username/movies/:MovieID', (req, res) => {
    Users.findOneAndUpdate({
            Username: req.params.Username
        }, {
            $push: {
                FavoriteMovies: req.params.MovieID
            }
        }, {
            new: true
        }, // This line makes sure that the updated document is returned
        (err, updatedUser) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error: ' + err);
            } else {
                res.json(updatedUser);
            }
        });
});

// DELETE Allow users to remove a movie from their favorites
app.delete('/users/:Username/movies/:MovieID', (req, res) => {
    Users.findOneAndUpdate({
            Username: req.params.Username
        }, {
            $pull: {
                FavoriteMovies: req.params.MovieID
            }
        }, {
            new: true
        }, // this line makes sure that the updated document is returned
        (err, updatedUser) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error: ' + err);
            } else {
                res.json(updatedUser);
            }
        });
});

// DELETE Allow existing users to deregister
app.delete("/users/:Username", (req, res) => {
    Users.findOneAndRemove({
            Username: req.params.Username
        })
        .then((user) => {
            if (!user) {
                res.status(400).send(req.params.Username + " was not found");
            } else {
                res.status(200).send(req.params.Username + " was deleted.");
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error: " + err);
        });
});

// GET Welcome message for '/' request URL
app.get("/", (req, res) => {
    res.send("Welcome to my app!");
});

// Serve static content from 'public' directory
app.use(express.static("public"));

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
});

// Listen for requests
app.listen(8080, () => {
    console.log("Your app is listening on port 8080.");
});