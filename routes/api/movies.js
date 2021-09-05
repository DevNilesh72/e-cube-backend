const express = require('express');
const router = express.Router();

const multer = require("multer");

const validateMovieDetails = require('../../validation/movies');

// Load User model
const Movie = require('../../models/Movie');

const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "../../public/images");
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "--" + file.originalname);
    },
});

const upload = multer({ storage: fileStorageEngine });
// https://github.com/LloydJanseVanRensburg/FileUploads_NodeJS_Multer

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'movies Works' }));

router.post('/add', 
    upload.fields([{
        name: "poster", maxCount: 1
    },{
        name: "thumbnail", maxCount: 1
    }]),
    (req, res) => {
        const { errors, isValid } = validateMovieDetails(req.body);

        // Check Validation
        if (!isValid) {
            return res.status(400).json(errors);
        }

        Movie.findOne({name: req.body.name, release_date: req.body.release_date}).then(movie => {
            if (movie) {
                errors.default = 'Movie with same name and release date already exists';
                return res.status(400).json(errors);
            } else {
                const newMovie = new Movie({
                    name: req.body.name,
                    summary: req.body.summary,
                    release_date: req.body.release_date,
                    category: req.body.category,
                    poster: req.body.poster,
                    time_slot: req.body.time_slot,
                    thumbnail: req.body.thumbnail
                });

                newMovie
                .save()
                .then(movie => res.json(movie))
                .catch(err => console.log(err));
            }
        });
    }
);

router.post('/update/:id', 
    (req, res) => {
        const errors = {};
        
        const movieFields = {};
        movieFields.name = req.body.name;
        movieFields.summary = req.body.summary;
        movieFields.release_date = req.body.release_date;
        movieFields.category = req.body.category;
        movieFields.poster = req.body.poster;
        movieFields.time_slot = req.body.time_slot;
        movieFields.thumbnail = req.body.thumbnail;
        
        Movie.findOne({id: req.params.id}).then((movie) => {
            if(movie){
                Movie.findOneAndUpdate(
                    {id: req.body.id},
                    {$set: movieFields},
                    {new: true}
                ).then(movie => res.json(movie));
            }
            else{
                errors.default = 'Invalid movie';
                return res.status(400).json(errors);
            }
        });
    }
);

router.delete('/delete/:id',
    (req,res) => {
        Movie.findOneAndRemove({id: req.params.id}).then(() => {
            res.json({ success: true })
        });
    }
);

router.get('/all',
    (req,res) => {
        const errors = {};

        Movie.find()
            .then((movies) => {
                if (!movies) {
                    errors.nomovies = "There are no movies";
                    return res.status(404).json(errors);
                }

                res.json(movies);
            })
            .catch((err) => res.status(404).json({ nomovies: "There are no movies" }));
    }
);

router.get('/:id',
    (req,res) => {
        const errors = {};

        Movie.findOne({id: req.params.id})
            .then((movies) => {
                if (!movies) {
                    errors.nomovie = "There is no movie of given name";
                    return res.status(404).json(errors);
                }

                res.json(movies);
            })
            .catch((err) => res.status(404).json({ nomovie: "There is no movie of given name" }));
    }
);

module.exports = router;