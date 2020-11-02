const express = require('express');
const router = express.Router();
const { userRegValidators, userSignInValidators } = require('../validations/users')
const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const{loginUser, logoutUser} = require('../auth')

const db = require('../db/models')
const {csrfProtection, asyncHandler} = require('./utils')

/* GET register form. */
router.get('/register', csrfProtection, (req, res) => {
  const user = db.User.build();
  res.render('sign-up', {
    user,
    token: req.csrfToken()
  })
});

/* POST register form. */
router.post('/register', csrfProtection, userRegValidators, asyncHandler(async (req, res) => {
  const {
    email,
    username,
    password
  } = req.body;

  const user = db.User.build({
    username,
    email
  })

  const validatorErrors = validationResult(req);

  if (validatorErrors.isEmpty()) {
    const hashedPassword = await bcrypt.hash(password, 10);
    user.hashedPassword = hashedPassword;
    await user.save();
    loginUser(req, res, user)
    res.redirect('/');
  } else {
    const errors = validateErrors.array().map(error => error.msg);
    res.render('sign-up', {
      user,
      errors,
      token: req.csrfToken(),
    })
  }
}));

/* GET user log-in. */
router.get('/login', csrfProtection, (req, res) => {
  res.render('log-in', {
    token: req.csrfToken()
  })
})

/* POST user log-in. */
router.post('/login', csrfProtection, userSignInValidators, asyncHandler(async (req, res) => {
  const { usernameOrEmail, password } = req.body;

  let errors = [];
  const validatorErrors = validationResult(req);

  if (validatorErrors.isEmpty()) {
    if (usernameOrEmail.includes('@')) {
      const user = await db.User.findOne({ where: { email } })
      if (user !== null) {
        const passwordMatch = await bcrypt.compare(password, user.hashedPassword.toString());
        if (passwordMatch) {
          loginUser(req, res, user)
          return res.redirect('/')
        }
      }
      errors.push('Login failed')
    } else {
      const user = await db.User.findOne({ where: { username } })
      if (user !== null) {
        const passwordMatch = await bcrypt.compare(password, user.hashedPassword.toString());
        if (passwordMatch) {
          loginUser(req, res, user)
          return res.redirect('/')
        }
      }
    }
  } else {
    errors = validatorErrors.array().map(error => error.msg);
  }

  res.render('log-in', {
    usernameOrEmail,
    errors,
    token: req.csrfToken()
  })
}))

/* POST user log-out. */

router.post('/logout', (req, res) => {
  logoutUser(req, res);
  res.redirect('/users/login')
})

module.exports = router;
