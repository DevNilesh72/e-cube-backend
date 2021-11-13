const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ScreenSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    screen_type: {
        type: [String],
        required: true
    },
    capacity: {
        type: Number,
        default: 3
    },
    active: {
        type: Boolean,
        default: false
    },
    ticket_details: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'users'
        },
        movie: {
            type: Schema.Types.ObjectId,
            ref: 'movies'
        },
        payment: {
            type: Schema.Types.ObjectId,
            ref: 'payment'
        },
        venue_date: {
            type: Date,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        screen_type: {
            type: String,
            required: true
        },
        seat_no: {
            type: [String],
            required: true
        }
    }]
});

module.exports = Screen = mongoose.model('screens', ScreenSchema);
