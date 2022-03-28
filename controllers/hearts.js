const User = require('../models/user');
const Pusher = require('pusher');

const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_APP_KEY,
    secret: process.env.PUSHER_APP_SECRET,
    cluster: process.env.PUSHER_APP_CLUSTER
});

module.exports.getHeart = async (req, res, next) => {
    const { id } = req.params;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        const user = await User.findById(id);
        if (!user) {
            req.flash('error', 'Cannot find that user!');
            return res.send('Cannot find that user!');
        }
        const hearts_count = user.hearts.hearts_count;
        res.json(hearts_count);
    } else {
        req.flash('error', 'Cannot find that user!');
        return res.send('Cannot find that user!');
    }
}

module.exports.updateHeart = async (req, res, next) => {
    const { id } = req.params;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        const action = req.body.action;
        const socketId = req.body.socketId;
        User.updateOne({ _id: id }, { $inc: { "hearts.hearts_count": 1 } }, {}, (err, numberAffected) => {
            pusher.trigger('upHeart-events', 'upHeartAction', { action: action, userId: id }, { socket_id: socketId });
            res.send('');
        });
    } else {
        req.flash('error', 'Cannot find that user!');
        return res.redirect('/users');
    }
}