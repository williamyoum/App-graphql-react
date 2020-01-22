// model controller endpoint approach

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const eventSchema = new Schema({
    // define structure of event object
    // every event object will look like this

    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

// import in other files
module.exports = mongoose.model('Event', eventSchema);
