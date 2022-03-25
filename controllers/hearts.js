const Heart = require('../models/heart');
const Pusher = require('pusher');
const { json } = require('body-parser');

const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_APP_KEY,
    secret: process.env.PUSHER_APP_SECRET,
    cluster: process.env.PUSHER_APP_CLUSTER
});

module.exports.getHeart = async (req, res, next) => {
    const { id } = req.params;
    const heart = await Heart.findOne({ user: id });
    const hearts_count = heart.hearts_count;
    res.json(hearts_count);
}

module.exports.updateHeart = async (req, res, next) => {
    const { id } = req.params;
    const action = req.body.action;
    const socketId = req.body.socketId;
    Heart.updateOne({ user: id }, { $inc: { hearts_count: 1 } }, {}, (err, numberAffected) => {
        pusher.trigger('upHeart-events', 'upHeartAction', { action: action, userId: id }, { socket_id: socketId });
        res.send('');
    });
}