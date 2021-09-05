const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MovieSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true,
        max: 50
    },
    release_date: {
        type: Date,
        required: true
    },
    active: {
        type: Boolean,
        default: false
    },
    category: {
        type: [Schema.Types.ObjectId],
        ref: 'category'
    },
    poster: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    time_slot: {
        type: Number,
        required: true
    },
    price_details: [{
        screen: {
            type: Schema.Types.ObjectId,
            ref: "screens"
        },
        screen_type: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
            required: true
        }
    }]
});

module.exports = Movie = mongoose.model('movies', MovieSchema);