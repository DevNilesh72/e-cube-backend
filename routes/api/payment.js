const express = require('express');
const router = express.Router();

const Payment = require('../../models/Payment');

router.get('/test', (req, res) => res.json({ msg: 'payment Works' }));

router.post('/makePayment',
    (req,res) => {
        const newPayment = new Payment({
            user: req.body.user,
            card_holder: req.body.card_holder,
            card_number: req.body.card_number,
            ccv: req.body.ccv,
            expire_date: req.body.expire_date,
            amount: req.body.amount
        });

        newPayment
            .save()
            .then(payment => res.json(payment))
            .catch(err => console.log(err));
    }
);

module.exports = router;