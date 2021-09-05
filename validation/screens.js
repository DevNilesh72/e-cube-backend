const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateScreenDetails(data){
    let errors = {};

    data.name = !isEmpty(data.name) ? data.name : '';
    data.location = !isEmpty(data.location) ? data.location : '';
    data.screen_type = !isEmpty(data.screen_type) ? data.screen_type : [];

    if (!Validator.isEmpty(data.name)) {
        errors.name = 'Name is required';
    }

    if (!Validator.isEmpty(data.location)) {
        errors.location = 'Location is required';
    }

    if (!Validator.isEmpty(data.screen_type)) {
        errors.screen_type = 'Screen type is required';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};