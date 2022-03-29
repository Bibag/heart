const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Email cannot be blank'],
        unique: true
    },
    hearts: {
        hearts_count: Number,
        author: [
            {
                time: String,
                user: {
                    type: Schema.Types.ObjectId,
                    ref: 'User'
                }
            }
        ]
    }
});
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);