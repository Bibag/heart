const mongoose = require('mongoose');
const { Schema } = mongoose;

const heartSchema = new Schema({
    hearts_count: Number,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Heart', heartSchema);