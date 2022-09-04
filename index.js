// Import framework
const express = require("express");
const app = express();

// Import middleware libraries
const morgan = require("morgan"),
  bodyParser = require("body-parser"),
  uuid = require("uuid");

// Server-side validation
const { check, validationResult } = require("express-validator");

// Integrating Mongoose, which will allow the REST API to perform CRUD operations on the MongoDB data
const mongoose = require("mongoose");
const Models = require("./models.js");

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Use body-parser middleware
app.use(bodyParser.json());
// Integrating ./auth.js for authentication and authorization using HTTP and JWT
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const cors = require("cors");
app.use(cors());
let allowedOrigins = [
  "http://localhost:8080",
  "http://testsite.com",
  "http://localhost:1234",
  "https://zachmovie.netlify.app",
  "http://localhost:4200",
  "https://zackkb.github.io/myFlix-Angular-client/welcome",
  "https://zackkb.github.io/myFlix-Angular-client",
  "https://zachmovie.herokuapp.com",
  "https://zachmovie.herokuapp.com/users",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        // If a specific origin isn’t found on the list of allowed origins
        let message =
          "The CORS policy for this application does not allow access from origin " +
          origin;
        return callback(new Error(message), false);
      }
      return callback(null, true);
    },
  })
);

let auth = require("./auth")(app);
// Require passport module and import ./passport.js
const passport = require("passport");
require("./passport");

// Morgan middleware library to log all requests
app.use(morgan("common"));

// GET requests

app.get(
  "/movies",
  passport.authenticate("jwt", {
    session: false,
  }),
  (req, res) => {
    Movies.find()
      .then((movie) => {
        res.status(201).json(movie);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// READ Return data about a single movie by title
app.get(
  "/movies/:Title",
  passport.authenticate("jwt", {
    session: false,
  }),
  (req, res) => {
    Movies.findOne({
      Title: req.params.Title,
    })
      .then((movie) => {
        res.json(movie);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// READ Return data about a genre
app.get(
  "/genre/:Name",
  passport.authenticate("jwt", {
    session: false,
  }),
  (req, res) => {
    Movies.findOne({
      "Genre.Name": req.params.Name,
    })
      .then((movie) => {
        res.json(movie.Genre.Description);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// Gets information about a director
app.get(
  "/director/:Name",
  passport.authenticate("jwt", {
    session: false,
  }),
  (req, res) => {
    Movies.findOne({
      "Director.Name": req.params.Name,
    })
      .then((movie) => {
        res.json(movie.Director);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// Get all users
app.get(
  "/users",
  passport.authenticate("jwt", {
    session: false,
  }),
  function (req, res) {
    Users.find()
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// Get user by username
app.get(
  "/users/:Username",
  passport.authenticate("jwt", {
    session: false,
  }),
  (req, res) => {
    Users.findOne({
      Username: req.params.Username,
    })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// CREATE Allow new users to register
app.post(
  "/users",
  [
    check("Username", "Username is required").isLength({
      min: 5,
    }),
    check(
      "Username",
      "Username contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    check("Password", "Password is required").not().isEmpty(),
    check("Email", "Email does not appear to be valid").isEmail(),
  ],
  (req, res) => {
    // Check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array(),
      });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({
      Username: req.body.Username,
    }) // Search to see if a user with the requested username already exists
      .then((user) => {
        if (user) {
          //If the user is found, send a response that it already exists
          return res.status(400).send(req.body.Username + " already exists");
        } else {
          Users.create({
            Username: req.body.Username,
            Password: hashedPassword,
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
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

// UPDATE Allow users to update their user info
app.put(
  "/users/:Username",
  [
    check("Username", "Username is required").isLength({
      min: 5,
    }),
    check(
      "Username",
      "Username contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    check("Password", "Password is required").not().isEmpty(),
    check("Email", "Email does not appear to be valid").isEmail(),
  ],
  passport.authenticate("jwt", {
    session: false,
  }),
  (req, res) => {
    //Check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array(),
      });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOneAndUpdate(
      {
        User: req.params.Username,
      },
      {
        $set: {
          Username: req.body.Username,
          Password: hashedPassword,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        },
      },
      {
        new: true,
      }
    )
      .then((updatedUser) => {
        res.json(updatedUser);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error " + err);
      });
  }
);

// Allow users to add a movie to their favorites
app.post(
  "/users/:Username/movies/:MovieID",
  passport.authenticate("jwt", {
    session: false,
  }),
  (req, res) => {
    Users.findOneAndUpdate(
      {
        Username: req.params.Username,
      },
      {
        $push: {
          FavoriteMovies: req.params.MovieID,
        },
      },
      {
        new: true,
      }, // This line makes sure that the updated document is returned
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

// DELETE Allow users to remove a movie from their favorites
app.delete(
  "/users/:Username/movies/:MovieID",
  passport.authenticate("jwt", {
    session: false,
  }),
  (req, res) => {
    Users.findOneAndUpdate(
      {
        Username: req.params.Username,
      },
      {
        $pull: {
          FavoriteMovies: req.params.MovieID,
        },
      },
      {
        new: true,
      }, // this line makes sure that the updated document is returned
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

// DELETE Allow existing users to deregister
app.delete(
  "/users/:Username",
  passport.authenticate("jwt", {
    session: false,
  }),
  (req, res) => {
    Users.findOneAndRemove({
      Username: req.params.Username,
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
  }
);

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

// Sets port number
const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log("Listening on Port " + port);
});
