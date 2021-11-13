const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const PaymentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    card_holder: {
      type: String,
      required: true
    },
    card_number: {
      type: String,
      required: true
    },
    ccv: {
      type: String,
      required: true
    },
    expire_date: {
        type: Date,
        required: true
    },
    amount: {
        type: Number,
        required: true
    }
  });
  
  module.exports = Payment = mongoose.model('payment', PaymentSchema);