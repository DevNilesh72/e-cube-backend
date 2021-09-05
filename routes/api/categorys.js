const express = require('express');
const router = express.Router();

// Load Category model
const Category = require('../../models/Category');

// @route   GET api/category/test
// @desc    Tests category route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Users Works' }));

// @route   GET api/category/add
// @desc    add category
// @access  Public
router.post('/add', (req, res) => {
    Category.findOne({ name: req.body.name }).then(cat => {
        if (cat) {
            errors.name = 'Category already exists';
            return res.status(400).json(errors);
        } else {
            const newCategory = new Category({
                name: req.body.name,
                src: req.body.src
            });
            newCategory
            .save()
            .then(cat => res.json(cat))
            .catch(err => console.log(err));
        }
    });
});

router.get('/edit/:id',
    (req,res) => {
        Category.findOne({_id:req.params.id})
                .then(cat => res.json(cat))
                .catch(err => res.status(404).json({nocat: "There are no categories"}));
    }    
);

router.post('/update/:id',
    (req,res) => {
        Category.findOne({ _id:req.params.id }).then(cat => {
            if (cat) {
                const newCategory = {};
                newCategory.name = req.body.name;
                newCategory.src = req.body.src;

                Category
                .findOneAndUpdate(
                    {_id: req.params.id},
                    {$set: newCategory},
                    {new: true}
                )
                .then(cat => res.json(cat))
            } else {
                errors.name = 'Category does not exists';
                return res.status(400).json(errors);
            }
        });
    }
);

router.delete('/delete/:id',
    (req,res) => {
        Category.findOneAndRemove({_id: req.params.id}).then(() => {
            res.json({ success: true })
        });
    }
);

router.get('/all',
    (req,res) => {
        const errors = {};

        Category.find()
                .then((cat) => {
                    if (!cat) {
                        errors.nocat = "There are no categories";
                        return res.status(404).json(errors);
                    }

                    res.json(cat);
                })
                .catch((err) => res.status(404).json({ nocat: "There are no categories" }));
    }
);

module.exports = router;
