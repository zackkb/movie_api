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

// An array of data for genres
let genres = [{
        genre_name: 'Animated',
        description: 'Animated film is a collection of illustrations that are photographed frame-by-frame and then played in a quick succession.'
    },
    {
        genre_name: 'Drama',
        description: 'The drama genre features stories with high stakes and a lot of conflicts.'
    },
    {
        genre_name: 'Action-Adventure',
        description: 'A hybrid genre featuring characters involved in exciting and usually dangerous activities and adventures'
    },
    {
        genre_name: 'Fantasy',
        description: 'A genre that typically features the use of magic or other supernatural phenomena in the plot, setting, or theme.'
    },
    {
        genre_name: 'Tragicomedy',
        description: 'Tragicomedy is a literary genre that blends aspects of both tragic and comic forms. Most often seen in dramatic literature, the term can describe either a tragic play which contains enough comic elements to lighten the overall mood or a serious play with a happy ending.'
    },
    {
        genre_name: 'Adventure',
        description: 'The adventure genre consists of movies where the protagonist goes on an epic journey, either personally or geographically. Often the protagonist has a mission and faces many obstacles in his way.'
    },
    {
        genre_name: 'Historical',
        description: 'Historical fiction is a literary genre where the story takes place in the past. Historical movies capture the details of the time period as accurately as possible for authenticity, including social norms, manners, customs, and traditions.'
    },
    {
        genre_name: 'Alternate-History',
        description: 'Alternative history is a genre of fiction wherein the author speculates upon how the course of history might have been altered if a particular historical event had an outcome different from the real life outcome.'
    },
    {
        genre_name: 'Romantic-Comedy',
        description: 'Romantic comedy is a subgenre of comedy and slice-of-life fiction, focusing on lighthearted, humorous plot lines centered on romantic ideas, such as how true love is able to surmount most obstacles.'
    },
    {
        genre_name: 'Fanasty',
        description: 'Fantasy is a genre that typically features the use of magic or other supernatural phenomena in the plot, setting, or theme.'
    },
    {
        genre_name: 'Comedy',
        description: 'Comedy is a category of film which emphasizes humor. These films are designed to make the audience laugh through amusement.'
    }
];

// An array of data for directors
let directors = [{
        director_name: 'Hiroyuki Okiura',
        birth_year: 1966,
        bio: 'Hiroyuki Okiura is a Japanese animation director and animator working for Production I.G.'
    },
    {
        director_name: 'Mamoru Hosoda',
        birth_year: 1967,
        bio: 'Mamoru Hosoda is a Japanese film director and animator. He was nominated for an Academy Award in the category Best Animated Feature Film at the 91st Academy Awards for his eighth film Mirai.'
    },
    {
        direcor_name: 'Naoko Yamada',
        birth_year: 1984,
        bio: 'Naoko Yamada is a Japanese animator, television and film director. Working at Kyoto Animation, she directed the anime series K-On! and Tamako Market, and the anime films A Silent Voice and Liz and the Blue Bird.'
    },
    {
        director_name: 'Gorō Miyazaki',
        birth_year: 1967,
        bio: 'Goro Miyazaki is a Japanese director. He is the son of animator and film director Hayao Miyazaki, who is one of the co-founders of Studio Ghibli.'
    },
    {
        director_name: 'Satoshi Kon',
        birth_year: 1963,
        bio: 'Satoshi Kon was a Japanese film director, animator, screenwriter and manga artist from Sapporo, Hokkaidō and a member of the Japanese Animation Creators Association. Tsuyoshi Kon, a guitarist, is his brother. He was a graduate of the Graphic Design department of the Musashino Art University.'
    },
    {
        director_name: 'Keiichi Hara',
        birth_year: 1959,
        bio: 'Keiichi Hara is a Japanese director of animated films.'
    },
    {
        director_name: 'Makoto Shinkai',
        birth_year: 1973,
        bio: 'Makoto Shinkai is a Japanese animator, filmmaker, author, and manga artist. Shinkai began his career as a video game animator with Nihon Falcom in 1996, and gained recognition as a filmmaker with the release of the original video animation She and Her Cat.'
    },
    {
        director_name: 'Masaaki Yuasa',
        birth_year: 1965,
        bio: 'Masaaki Yuasa is a Japanese director, screenwriter, and animator affiliated with Science SARU, a Japanese animation studio which he co-founded with producer Eunyoung Choi in 2013. Yuasa previously served as president of Science SARU, but stepped down from this role in 2020.'
    }
];

// An array of data containing information about users
let users = []


// GET requests
app.get('/movies', (req, res) => {
    res.json(movies);
});

// READ Return data about a single movie by title
app.get('/movies/:title', (req, res) => {
    res.json(movies.find((movie) => {
        return movie.title === req.params.title;
    }));
});

// READ Return data about a genre
app.get('/genres/:genre_name', (req, res) => {
    res.json(genres.find((genre) => {
        return genre.genre_name === req.params.genre_name;
    }));
});

// READ Return data about a director by name
app.get('/directors/:director_name', (req, res) => {
    res.json(directors.find((director) => {
        return director.director_name === req.params.director_name;
    }));
});

// CREATE Allow new users to register
app.post('/users', (req, res) => {
    let newUser = req.body;
    if (!newUser.user_name) {
        res.status(400).send('Missing user name in request body!');
    } else {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(200).send('Your profile with the user name: ' + req.body.user_name + ' was successfully created!');
    };
});

// UPDATE Allow users to update their user info 
app.put('/users/:email/:user_name', (req, res) => {
    let user = users.find((user) => {
        return user.email === req.params.email;
    });

    if (user) {
        user.user_name = req.params.user_name;
        res.status(200).send('Your username was successfully updated to: ' + req.params.user_name);
    } else {
        res.status(400).send('User with mail address ' + req.params.email + ' was not found.');
    };
});

// Allow users to add a movie to their favorites
app.post('/users/:email/favorites/:title', (req, res) => {
    let user = users.find((user) => {
        return user.email === req.params.email;
    });

    if (user) {
        if (!user.favorites) {
            user["favorites"] = [];
        };
        user.favorites.push(req.params.title);
        res.status(200).send('Movie with the title ' + req.params.title + ' was successfully added to your list of favorites!');
    } else {
        res.status(400).send('User with the email ' + req.params.email + ' was not found.');
    };
});

// DELETE Allow users to remove a movie from their favorites
app.delete('/users/:email/favorites/:title', (req, res) => {
    let user = users.find((user) => {
        return user.email === req.params.email;
    });

    if (user) {
        let index = user.favorites.indexOf(req.params.title);
        if (index > -1) {
            user.favorites.splice(index, 1);
            res.status(200).send('Movie with the title ' + req.params.title + " was successfully deleted from your list.");
        } else {
            res.status(400).send('Movie not found in list of favorites.');
        }
    } else {
        res.status(400).send('User with the email ' + req.params.email + ' was not found.');
    };
});

// DELETE Allow existing users to deregister
app.delete('/users/:email', (req, res) => {
    let user = users.find((user) => {
        return user.email === req.params.email;
    });

    if (user) {
        users = users.filter((obj) => {
            return obj.email != req.params.email;
        });
        res.status(200).send('User with the email ' + req.params.email + ' was sucessfully deleted.');
    } else {
        res.status(400).send('User with the email ' + req.params.email + ' was not found.');
    };
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