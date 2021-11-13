const express = require('express');
const router = express.Router();
const fs = require('fs');
const multer = require("multer");

const validateMovieDetails = require('../../validation/movies');

// Load User model
const Movie = require('../../models/Movie');
const Category = require('../../models/Category');

const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./public/images");
    },
    filename: (req, file, cb) => {
        var filename = file.originalname;
        var fileExtension = filename.split(".")[1];
        cb(null, Date.now() + "." + fileExtension);
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
                    poster: req.files.poster[0].filename,
                    time_slot: req.body.time_slot,
                    thumbnail: req.files.thumbnail[0].filename
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
        movieFields.time_slot = req.body.time_slot;
        Movie.findOne({_id: req.params.id}).then((movie) => {
            if(movie){
                Movie.findOneAndUpdate(
                    {_id: req.params.id},
                    {$set: movieFields},
                    {new: true}
                ).then(movie => res.json(movie))
                .catch(err => res.status(500).json(err));
            }
            else{
                errors.default = 'Invalid movie';
                return res.status(400).json(errors);
            }
        });
    }
);

router.post('/add/price/:id',
    (req,res) => {
        const newPrice = {};
        newPrice.screen_id = req.body.screen_id;
        newPrice.screen_type = req.body.screen_type;
        newPrice.amount = req.body.amount;
        newPrice.active = req.body.active;

        Movie.findOne({_id: req.params.id}).then((movie) => {
            if(movie){
                Movie.findOneAndUpdate(
                    {_id: req.params.id},
                    {$push: {
                        "price_details": {
                            screen: newPrice.screen_id,
                            screen_type: newPrice.screen_type,
                            amount: newPrice.amount,
                            active: newPrice.active
                        }
                    }},
                    {new: true}
                ).then(movie => {
                    if(movie)
                        res.json(movie)
                    else
                        res.status(404).json({default: 'No movie or screen to update'})
                })
                .catch(err => res.status(500).json(err));
            }
            else{
                errors.default = 'Invalid movie';
                return res.status(400).json(errors);
            }
        })
    }
);

router.post('/update/price/:id',
    (req, res) => {
        const errors = {};
        
        const newPrice = {};
        newPrice.id = req.body.price_id;
        newPrice.screen_id = req.body.screen_id;
        newPrice.screen_type = req.body.screen_type;
        newPrice.amount = req.body.amount;
        newPrice.active = req.body.active;
        
        Movie.findOne({_id: req.params.id,"price_details._id":newPrice.id}).then((movie) => {
            if(movie){
                Movie.findOneAndUpdate(
                    {_id: req.params.id,"price_details._id":newPrice.id},
                    {$set: {
                        "price_details.$.screen": newPrice.screen_id,
                        "price_details.$.screen_type": newPrice.screen_type,
                        "price_details.$.amount": newPrice.amount,
                        "price_details.$.active": newPrice.active
                    }},
                    {new: true}
                ).then(movie => {
                    if(movie)
                        res.json(movie)
                    else
                        res.status(404).json({default: 'No movie or screen to update'})
                })
                .catch(err => res.status(500).json(err));
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
        const errors = {};
        Movie.findOne({_id: req.params.id}).then((movie) => {
            if(movie){
                if (fs.existsSync('./public/images/'+movie.poster)) {
                    fs.unlinkSync('./public/images/'+movie.poster);
                }
                if (fs.existsSync('./public/images/'+movie.thumbnail)) {
                    fs.unlinkSync('./public/images/'+movie.thumbnail)
                }
                Movie.findOneAndRemove({_id: movie._id}).then(() => res.json({ success: true }));
            }
            else{
                errors.default = 'Invalid movie';
                return res.status(400).json(errors);
            }
        });
    }
);

router.get('/all',
    (req,res) => {
        const errors = {};

        Movie.find().populate("category")
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


router.get('/one/:id',
    (req,res) => {
        const errors = {};

        Movie.findOne({_id: req.params.id}).populate("category").populate("price_details.screen","name location")
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

router.get('/book/one/:mid/:sid',
    (req,res) => {
        const errors = {};
        Movie.findOne({_id: req.params.mid,"price_details._id":req.params.sid}).populate("price_details.screen","name location amount ticket_details.seat_no")
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

router.get('/screen/:id',
    (req,res) => {
        const errors = {};

        Movie.findOne({_id: req.params.id},{price_details:1,_id:0}).populate("price_details.screen","name")
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

router.get('/cat/:cat',
    (req,res) => {
        const errors = {};

        if(req.params.cat === "index"){
            Movie.find().populate("category")
                .then((movies) => {
                    if (!movies) {
                        errors.nomovies = "There are no movies";
                        return res.status(404).json(errors);
                    }

                    res.json(movies);
                })
                .catch((err) => res.status(404).json({ nomovies: "There are no movies" }));
        }
        else{
            Category.findOne({src:req.params.cat})
                    .then(cat => {
                        Movie.find({category: cat._id}).populate("category")
                            .then((movies) => {
                                if (!movies) {
                                    errors.nomovies = "There are no movies";
                                    return res.status(404).json(errors);
                                }

                                res.json(movies);
                            })
                            .catch((err) => res.status(404).json({ nomovies: "There are no movies" }));
                    })
                    .catch((err) => res.status(404).json({ nomovies: "There are no category" }))
        }
        
    }
);

router.get('/edit/:id',
    (req,res) => {
        const errors = {};

        Movie.findOne({_id: req.params.id})
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