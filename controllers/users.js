const User = require('../models/user');
const Heart = require('../models/heart');

module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register');
}
module.exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        const heart = new Heart({ hearts_count: 0, user: registeredUser._id });
        await heart.save();
        req.login(registeredUser, error => {
            if (error) return next(error);
            req.flash('success', 'Welcome to Bitu!');
            res.redirect('/users');
        })
    } catch (error) {
        req.flash('error', error.message);
        res.redirect('/register');
    }
}
module.exports.renderLoginForm = (req, res) => {
    res.render('users/login');
}
module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = req.session.returnTo || '/users';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}
module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'Goodbye!');
    res.redirect('/users');
}

module.exports.index = async (req, res, next) => {
    const data = [];
    const users = await User.find({});
    const hearts = await Heart.find({});
    for (let user of users) {
        // const heart = hearts.find(element => JSON.stringify(element.user) === JSON.stringify(user._id));
        const index = hearts.findIndex(element => JSON.stringify(element.user) === JSON.stringify(user._id));
        const heart = hearts[index];
        hearts.splice(index, 1);
        const hearts_count = heart.hearts_count;
        data.push({ user, hearts_count });
    }
    res.render('users/index', { data });
}

module.exports.showUser = async (req, res, next) => {
    const { id } = req.params;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        const user = await User.findById(id);
        const heart = await Heart.findOne({ user: id });
        const hearts_count = heart.hearts_count;
        if (!user) {
            req.flash('error', 'Cannot find that user!');
            return res.redirect('/users');
        }
        res.render('users/show', { user, hearts_count });
    } else {
        req.flash('error', 'Cannot find that user!');
        return res.redirect('/users');
    }

}
