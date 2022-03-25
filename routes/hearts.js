const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware');
const catchAsync = require('../utils/catchAsync')
const hearts = require('../controllers/hearts');

router.get('/:id', catchAsync(hearts.getHeart));
router.put('/:id', isLoggedIn, catchAsync(hearts.updateHeart));

module.exports = router;