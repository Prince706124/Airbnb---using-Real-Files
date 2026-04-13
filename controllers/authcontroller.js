const { check } = require("express-validator");
const { validationResult } = require('express-validator');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.getLogin = (req, res, next) => {
  console.log("Login page requested");
      res.render("auth/login", {
      PageTitle: "Login",
      CurrentPage: "Login",
      isloggedIn: false,
      errors: [],
      user:{}
    })
  };
exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email: email }).then(user => {
    if (!user) {
      console.log("User not found with email:", email);
      return res.status(401).render("auth/login", {
        PageTitle: "Login",
        CurrentPage: "Login",
        isloggedIn: false,
        errors: ['Invalid email or password'],
        user:{}
      });
    }
    bcrypt.compare(password, user.password).then(async isMatch => {
      if (isMatch) {
        console.log("User logged in successfully:", email);
        req.session.isloggedIn = true;
        req.session.user = user;
        console.log("Session updated:", req.session);
        await req.session.save();
          console.log("Session saved successfully");
        //res.cookie("isloggedIn",true);
        res.redirect('/');
      } else {
        console.log("Invalid password for user:", email);
        return res.status(401).render("auth/login", {
          PageTitle: "Login",
          CurrentPage: "Login",
          isloggedIn: false,
          errors: ['Invalid email or password'],
          user:{}
        });
      }
    });
  });
};
exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
};
exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
      PageTitle: "Signup",
      CurrentPage: "Signup",
      isloggedIn: false,
      errors: [],
      oldInput: {
        firstName: '',
        lastName: '',
        email: '',
        usertype: ''
      },
      user:{}
    })
  };
exports.postSignup =[
  check('firstName').notEmpty().withMessage('First name is required').trim().isLength({ min: 2 }).withMessage('First name must be at least 2 characters long').matches(/^[A-Za-z]+$/).withMessage('First name must contain only letters'),
  check('lastName').matches(/^[A-Za-z]*$/).withMessage('Last name must contain only letters'),
  check('email').isEmail().withMessage('Please enter a valid email address').normalizeEmail(),
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long').matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter').matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter').matches(/\d/).withMessage('Password must contain at least one number').matches(/[@$!%*?&]/).withMessage('Password must contain at least one special character'),
  check('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    } return true;
  }),
  check('usertype').notEmpty().withMessage('User type is required').isIn(['host', 'guest']).withMessage('Invalid user type'),
  check('terms').equals('on').withMessage('You must agree to the terms and conditions'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render("auth/signup", {
        PageTitle: "Signup",
        CurrentPage: "Signup",
        isloggedIn: false,
        errors: errors.array().map(err => err.msg),
        oldInput: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          usertype: req.body.usertype
        },
        user:{}
      });
    }
    const { firstName, lastName, email, password, usertype } = req.body;
    bcrypt.hash(password, 12).then(hashedPassword => {
      const user = new User({firstName, lastName, email, password: hashedPassword, usertype});
      return user.save();
    }).then(() => {
      res.redirect('/login');
    }).catch(err => {
      console.log("Error during user registration:", err);
      res.status(500).render("auth/signup", {
        PageTitle: "Signup",
        CurrentPage: "Signup",
        isloggedIn: false,
        errors: ['An error occurred during registration'],
        oldInput: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          usertype: req.body.usertype
        },
        user:{}
      });
    });
  }
];
  // Here you would typically handle user registration logic