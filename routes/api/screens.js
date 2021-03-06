const express = require('express');
const router = express.Router();

const Screen = require('../../models/Screen');

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'screens Works' }));

router.post('/add', (req, res) => {
    Screen.findOne({ name: req.body.name }).then(cat => {
        if (cat) {
            errors.name = 'Screen already exists';
            return res.status(400).json(errors);
        } else {
            const newScreen = new Screen({
                name: req.body.name,
                location: req.body.location,
                screen_type: req.body.screen_type,
                active: req.body.active,
                capacity: req.body.capacity
            });
            newScreen
            .save()
            .then(cat => res.json(cat))
            .catch(err => console.log(err));
        }
    });
});

router.get('/edit/:id',
    (req,res) => {
        Screen
        .findOne({_id:req.params.id})
        .then(screen => res.json(screen))
        .catch(err => res.status(404).json({noscreen: "There are no screens"}));
    }    
);

router.post('/update/:id',
    (req,res) => {
        Screen.findOne({ _id:req.params.id }).then(screen => {
            if (screen) {
                const newScreen = {};
                newScreen.name = req.body.name;
                newScreen.location = req.body.location;
                newScreen.screen_type = req.body.screen_type;
                newScreen.active = req.body.active;
                newScreen.capacity = req.body.capacity;

                Screen
                .findOneAndUpdate(
                    {_id: req.params.id},
                    {$set: newScreen},
                    {new: true}
                )
                .then(screen => res.json(screen))
            } else {
                errors.name = 'Screen does not exists';
                return res.status(400).json(errors);
            }
        });
    }
);

router.delete('/delete/:id',
    (req,res) => {
        Screen.findOneAndRemove({_id: req.params.id}).then(() => {
            res.json({ success: true })
        });
    }
);

router.post('/book/:id',
    (req,res) => {
        const book = {};
        book.user = req.body.user;
        book.movie = req.body.movie;
        book.payment = req.body.payment;
        book.venue_date = req.body.date;
        book.price = req.body.price;
        book.screen_type = req.body.screen_type;
        book.seat_no = req.body.seat_no;

        Screen.findOne({ _id:req.params.id }).then(screen => {
            if(screen){
                Screen.findOneAndUpdate(
                    { _id:req.params.id },
                    {$push: {
                        "ticket_details": {
                            user: book.user,
                            movie: book.movie,
                            payment: book.payment,
                            venue_date: book.venue_date,
                            price: book.price,
                            screen_type: book.screen_type,
                            seat_no: book.seat_no
                        }
                    }},
                    {new: true}
                )
                .then(screen => {
                    if(screen)
                        res.json(screen)
                    else
                        res.status(404).json({default: 'Screen does not exists'})
                })

            } else {
                errors.name = 'Screen does not exists';
                return res.status(400).json(errors);
            }
        })
    }
);

router.get('/all',
    (req,res) => {
        const errors = {};

        Screen.find()
                .then((screen) => {
                    if (!screen) {
                        errors.noscreen = "There are no Screens";
                        return res.status(404).json(errors);
                    }

                    res.json(screen);
                })
                .catch((err) => res.status(404).json({ noscreen: "There are no screens" }));
    }
);

module.exports = router;