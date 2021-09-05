const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateTicketDetails(data){
    let errors = {};

    data.name = !isEmpty(data.name) ? data.name : '';
    data.summary = !isEmpty(data.summary) ? data.summary : '';
    data.venue_date = !isEmpty(data.venue_date) ? data.venue_date : '';
    data.poster = !isEmpty(data.poster) ? data.poster : '';
    data.thumbnail = !isEmpty(data.thumbnail) ? data.thumbnail : '';

    if (!Validator.isEmpty(data.name)) {
        errors.name = 'Name is required';
    }

    if (!Validator.isLength(data.summary, { max: 50 })) {
        errors.summary = 'Summary must be within 50 characters';
    }

    if (!Validator.isDate(data.venue_date)) {
        errors.venue_date = 'Invalid Date';
    }

    if (!Validator.isEmpty(data.poster)) {
        errors.poster = 'Poster is required';
    }

    if (!Validator.isEmpty(data.thumbnail)) {
        errors.thumbnail = 'Thumbnail is required';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};