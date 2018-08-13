const express = require('express')
const router = express.Router()
const passport = require('passport')
const multer = require('multer')
const auth = require('../controllers/ensureAuthenticated')
const dateHandler = require('../controllers/getDate')
const fs = require('fs')
const path = require('path')

const Storage = require('../models/storage')
const User = require('../models/user')
const Article = require('../models/article')
const Table = require('../models/table')
const Order = require('../models/Order')
const ReservedArticle = require('../models/ReservedArticle')

router.use(function timeLog(req, res, next) {
  console.log('Route hit - Time: ', new Date().toJSON())
  next()
})

router.post('/login', function(req, res) {
  res.send({
    message: `Logged in: ${req.body.username}`
  })
})

// Register user
router.post('/register', function(req, res) {
  const username = req.body.username
  const password = req.body.password
  const password2 = req.body.password2

  // Validation
  req.checkBody('username', 'Username is required!').notEmpty()
  req.checkBody('password', 'Password is required!').notEmpty()
  req.checkBody('password2', 'Passwords do not match!').equals(req.body.password)

  let errors = req.validationErrors()
  if (errors) {
    console.log(errors)
  } else {
    let newUser = new User({
      username: username,
      password: password
    })
    User.createUser(newUser, function(err, user) {
      if (err) {
        throw err
      } else {
        console.log(user)
      }
    })
    // req.flash('success_msg', 'New user has been registered!')
    res.send({
      message: `Registered: ${req.body.username}`
    })
  }
})

module.exports = router
