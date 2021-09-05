const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    src: {
        type: String,
        required: true
    },
    carosal: {
        type: [Schema.Types.ObjectId],
        ref: 'movies'
    }
});

module.exports = Category = mongoose.model('category', CategorySchema);