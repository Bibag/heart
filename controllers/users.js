const User = require('../models/user');

module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register');
}
module.exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const hearts = {
            hearts_count: 0,
            author: []
        };
        const user = new User({ email, hearts, username });
        const registeredUser = await User.register(user, password);
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
    const users = await User.find({});
    res.render('users/index', { users });
}

module.exports.showUser = async (req, res, next) => {
    const { id } = req.params;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        const user = await User.findById(id);
        if (!user) {
            req.flash('error', 'Cannot find that user!');
            return res.redirect('/users');
        }
        res.render('users/show', { user });
    } else {
        req.flash('error', 'Cannot find that user!');
        return res.redirect('/users');
    }
}
