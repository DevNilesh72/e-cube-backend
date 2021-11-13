const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateMovieDetails(data){
    let errors = {};

    data.name = !isEmpty(data.name) ? data.name : '';
    data.summary = !isEmpty(data.summary) ? data.summary : '';
    data.release_date = !isEmpty(data.release_date) ? data.release_date : '';
    data.poster = !isEmpty(data.poster) ? data.poster : '';
    data.thumbnail = !isEmpty(data.thumbnail) ? data.thumbnail : '';

    if (Validator.isEmpty(data.name)) {
        errors.name = 'Name is required';
    }

    if (!Validator.isLength(data.summary, { max: 50 })) {
        errors.summary = 'Summary must be within 50 characters';
    }

    if (!Validator.isDate(data.release_date)) {
        errors.release_date = 'Invalid Date';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};