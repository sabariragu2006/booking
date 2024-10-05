const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    source: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    ticket: {
        type: Number,
        required: true
    },
    comments: {
        type: String
    }
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
